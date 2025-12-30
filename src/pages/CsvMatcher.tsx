import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Download, Loader2, CheckCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { supabase } from "@/integrations/supabase/client";

interface PlantData {
  common_name: string;
  scientific_name: string;
  category: string;
  parts_used: string;
  medicinal_properties: string;
  common_uses: string;
  precautions: string;
  description: string;
}

const CsvMatcher = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(true);
  const [csvPlants, setCsvPlants] = useState<PlantData[]>([]);
  const [dbPlants, setDbPlants] = useState<string[]>([]);
  const [matchedPlants, setMatchedPlants] = useState<PlantData[]>([]);
  const [unmatchedCsv, setUnmatchedCsv] = useState<string[]>([]);
  const [unmatchedDb, setUnmatchedDb] = useState<string[]>([]);

  useEffect(() => {
    const loadData = async () => {
      setIsLoading(true);
      try {
        // Fetch CSV file
        const csvResponse = await fetch('/medicinal_plants_library.csv');
        const csvText = await csvResponse.text();
        const parsedCsv = parseCSV(csvText);
        setCsvPlants(parsedCsv);

        // Fetch database plants
        const { data, error } = await supabase
          .from('medicinal_plants')
          .select('common_name');
        
        if (error) throw error;
        
        const dbNames = data.map(p => p.common_name.toLowerCase().trim());
        setDbPlants(dbNames);

        // Match plants
        const matched: PlantData[] = [];
        const csvUnmatched: string[] = [];
        
        parsedCsv.forEach(plant => {
          const csvName = plant.common_name.toLowerCase().trim();
          // Check for exact match or partial match
          const isMatch = dbNames.some(dbName => {
            return dbName === csvName || 
                   dbName.includes(csvName) || 
                   csvName.includes(dbName) ||
                   normalizeForComparison(dbName) === normalizeForComparison(csvName);
          });
          
          if (isMatch) {
            matched.push(plant);
          } else {
            csvUnmatched.push(plant.common_name);
          }
        });

        setMatchedPlants(matched);
        setUnmatchedCsv(csvUnmatched);

        // Find DB plants not in CSV
        const csvNames = parsedCsv.map(p => normalizeForComparison(p.common_name));
        const dbUnmatched = data
          .filter(p => !csvNames.some(csvName => 
            csvName === normalizeForComparison(p.common_name) ||
            csvName.includes(normalizeForComparison(p.common_name)) ||
            normalizeForComparison(p.common_name).includes(csvName)
          ))
          .map(p => p.common_name);
        setUnmatchedDb(dbUnmatched);

      } catch (error) {
        console.error('Error loading data:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadData();
  }, []);

  const normalizeForComparison = (name: string): string => {
    return name.toLowerCase()
      .replace(/[''`]/g, '')
      .replace(/\s+/g, ' ')
      .trim();
  };

  const parseCSV = (csvText: string): PlantData[] => {
    const lines = csvText.split('\n');
    const headers = lines[0].split(',');
    const plants: PlantData[] = [];

    for (let i = 1; i < lines.length; i++) {
      const line = lines[i].trim();
      if (!line) continue;

      // Handle CSV with quoted fields
      const values: string[] = [];
      let current = '';
      let inQuotes = false;

      for (let j = 0; j < line.length; j++) {
        const char = line[j];
        if (char === '"') {
          inQuotes = !inQuotes;
        } else if (char === ',' && !inQuotes) {
          values.push(current.trim());
          current = '';
        } else {
          current += char;
        }
      }
      values.push(current.trim());

      if (values.length >= 8) {
        plants.push({
          common_name: values[0],
          scientific_name: values[1],
          category: values[2],
          parts_used: values[3],
          medicinal_properties: values[4],
          common_uses: values[5],
          precautions: values[6],
          description: values[7],
        });
      }
    }

    return plants;
  };

  const generateCSV = (plants: PlantData[]): string => {
    const headers = 'common_name,scientific_name,category,parts_used,medicinal_properties,common_uses,precautions,description';
    const rows = plants.map(plant => {
      const escapeField = (field: string) => {
        if (field.includes(',') || field.includes('"')) {
          return `"${field.replace(/"/g, '""')}"`;
        }
        return field;
      };
      return [
        escapeField(plant.common_name),
        escapeField(plant.scientific_name),
        escapeField(plant.category),
        escapeField(plant.parts_used),
        escapeField(plant.medicinal_properties),
        escapeField(plant.common_uses),
        escapeField(plant.precautions),
        escapeField(plant.description),
      ].join(',');
    });

    return [headers, ...rows].join('\n');
  };

  const downloadCSV = () => {
    const csvContent = generateCSV(matchedPlants);
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', 'matched_medicinal_plants.csv');
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="min-h-screen botanical-pattern py-8 px-4">
      <div className="max-w-4xl mx-auto">
        <Button
          variant="ghost"
          onClick={() => navigate('/')}
          className="mb-6"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Home
        </Button>

        <div className="text-center mb-8">
          <h1 className="text-4xl md:text-5xl font-serif font-bold mb-3">
            CSV Matcher Tool
          </h1>
          <p className="text-muted-foreground text-lg">
            Compare CSV file with database and generate filtered CSV
          </p>
        </div>

        {isLoading ? (
          <Card className="p-12 text-center">
            <Loader2 className="w-12 h-12 mx-auto animate-spin text-primary mb-4" />
            <p className="text-muted-foreground">Analyzing data...</p>
          </Card>
        ) : (
          <div className="space-y-6">
            {/* Summary Card */}
            <Card className="p-6 bg-gradient-card border-botanical-green/20">
              <h2 className="text-xl font-semibold mb-4">Analysis Summary</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="text-center p-4 bg-background/50 rounded-lg">
                  <p className="text-3xl font-bold text-primary">{csvPlants.length}</p>
                  <p className="text-sm text-muted-foreground">Plants in CSV</p>
                </div>
                <div className="text-center p-4 bg-background/50 rounded-lg">
                  <p className="text-3xl font-bold text-primary">{dbPlants.length}</p>
                  <p className="text-sm text-muted-foreground">Plants in Database</p>
                </div>
                <div className="text-center p-4 bg-background/50 rounded-lg">
                  <p className="text-3xl font-bold text-green-600">{matchedPlants.length}</p>
                  <p className="text-sm text-muted-foreground">Matched Plants</p>
                </div>
              </div>
            </Card>

            {/* Download Button */}
            <Card className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-semibold flex items-center gap-2">
                    <CheckCircle className="w-5 h-5 text-green-600" />
                    Matched Plants CSV Ready
                  </h3>
                  <p className="text-sm text-muted-foreground mt-1">
                    {matchedPlants.length} plants that exist in both CSV and database
                  </p>
                </div>
                <Button onClick={downloadCSV} className="bg-gradient-botanical hover:opacity-90">
                  <Download className="w-4 h-4 mr-2" />
                  Download CSV
                </Button>
              </div>
            </Card>

            {/* Matched Plants List */}
            <Card className="p-6">
              <h3 className="font-semibold mb-4 text-green-600">
                ✓ Matched Plants ({matchedPlants.length})
              </h3>
              <div className="flex flex-wrap gap-2 max-h-48 overflow-y-auto">
                {matchedPlants.map((plant, idx) => (
                  <span key={idx} className="px-2 py-1 bg-green-100 text-green-800 rounded text-sm">
                    {plant.common_name}
                  </span>
                ))}
              </div>
            </Card>

            {/* Unmatched from CSV */}
            {unmatchedCsv.length > 0 && (
              <Card className="p-6">
                <h3 className="font-semibold mb-4 text-orange-600">
                  ⚠ In CSV but not in Database ({unmatchedCsv.length})
                </h3>
                <div className="flex flex-wrap gap-2 max-h-48 overflow-y-auto">
                  {unmatchedCsv.map((name, idx) => (
                    <span key={idx} className="px-2 py-1 bg-orange-100 text-orange-800 rounded text-sm">
                      {name}
                    </span>
                  ))}
                </div>
              </Card>
            )}

            {/* Unmatched from DB */}
            {unmatchedDb.length > 0 && (
              <Card className="p-6">
                <h3 className="font-semibold mb-4 text-blue-600">
                  ℹ In Database but not in CSV ({unmatchedDb.length})
                </h3>
                <div className="flex flex-wrap gap-2 max-h-48 overflow-y-auto">
                  {unmatchedDb.map((name, idx) => (
                    <span key={idx} className="px-2 py-1 bg-blue-100 text-blue-800 rounded text-sm">
                      {name}
                    </span>
                  ))}
                </div>
              </Card>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default CsvMatcher;
