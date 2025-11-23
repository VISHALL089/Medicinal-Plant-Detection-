import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    console.log('Plant classification request received');
    
    const { imageData } = await req.json();
    
    if (!imageData) {
      throw new Error('No image data provided');
    }

    const LOVABLE_API_KEY = Deno.env.get('LOVABLE_API_KEY');
    if (!LOVABLE_API_KEY) {
      throw new Error('LOVABLE_API_KEY not configured');
    }

    console.log('Calling Lovable AI for plant classification...');

    // Call Lovable AI with vision model
    const aiResponse = await fetch('https://ai.gateway.lovable.dev/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${LOVABLE_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'google/gemini-2.5-flash',
        messages: [
          {
            role: 'system',
            content: `You are a botanical expert specializing in identifying medicinal plants from leaf images. 
            
Your task:
1. Analyze the leaf image provided
2. Identify the most likely medicinal plant species
3. Return ONLY the common name of the plant (e.g., "Tulsi", "Neem", "Aloe Vera")
4. If you cannot identify it confidently, respond with "Unknown"
5. Do not provide explanations, just the plant name

Focus on these characteristics:
- Leaf shape, size, and arrangement
- Leaf edges (smooth, serrated, lobed)
- Leaf texture and surface
- Venation patterns
- Color and any distinctive markings

Common medicinal plants to consider: Tulsi, Neem, Aloe Vera, Turmeric, Ginger, Ashwagandha, Brahmi, Peppermint, Chamomile, Lavender, and other medicinal plants in the database.`
          },
          {
            role: 'user',
            content: [
              {
                type: 'text',
                text: 'Identify this medicinal plant leaf. Respond with only the common plant name.'
              },
              {
                type: 'image_url',
                image_url: {
                  url: imageData
                }
              }
            ]
          }
        ],
        temperature: 0.3,
        max_tokens: 50
      }),
    });

    if (!aiResponse.ok) {
      const errorText = await aiResponse.text();
      console.error('AI API error:', aiResponse.status, errorText);
      
      if (aiResponse.status === 429) {
        return new Response(
          JSON.stringify({ error: 'Rate limit exceeded. Please try again later.' }),
          { status: 429, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }
      
      if (aiResponse.status === 402) {
        return new Response(
          JSON.stringify({ error: 'AI credits exhausted. Please add credits to continue.' }),
          { status: 402, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }
      
      throw new Error(`AI API error: ${errorText}`);
    }

    const aiData = await aiResponse.json();
    const identifiedPlant = aiData.choices[0].message.content.trim();
    
    console.log('AI identified plant:', identifiedPlant);

    // Query database for plant information
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseKey);

    // Try to find the plant in database using fuzzy matching
    const { data: plants, error: dbError } = await supabase
      .from('medicinal_plants')
      .select('*')
      .ilike('common_name', `%${identifiedPlant}%`)
      .limit(1);

    if (dbError) {
      console.error('Database error:', dbError);
      throw dbError;
    }

    if (!plants || plants.length === 0) {
      console.log('Plant not found in database, searching by keywords...');
      
      // Try searching by image keywords
      const { data: keywordPlants } = await supabase
        .from('medicinal_plants')
        .select('*')
        .contains('image_keywords', [identifiedPlant.toLowerCase()]);
      
      if (keywordPlants && keywordPlants.length > 0) {
        console.log('Found plant by keyword match');
        return new Response(
          JSON.stringify({
            plant: keywordPlants[0],
            confidence: 0.75,
            identified_name: identifiedPlant
          }),
          { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }

      // No match found
      return new Response(
        JSON.stringify({
          plant: null,
          confidence: 0,
          identified_name: identifiedPlant,
          message: 'Plant identified but not found in our medicinal plants database. This may not be a medicinal plant we have catalogued.'
        }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    console.log('Plant found in database:', plants[0].common_name);

    return new Response(
      JSON.stringify({
        plant: plants[0],
        confidence: 0.85,
        identified_name: identifiedPlant
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('Error in classify-plant function:', error);
    return new Response(
      JSON.stringify({ 
        error: error instanceof Error ? error.message : 'Unknown error occurred',
        details: 'Failed to classify plant image'
      }),
      { 
        status: 500, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    );
  }
});