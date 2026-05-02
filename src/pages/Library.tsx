import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Search, Leaf, Filter, Download } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

interface PlantData {
  id: string;
  common_name: string;
  scientific_name: string;
  category: string;
  parts_used: string[];
  medicinal_properties: string[];
  common_uses: string[];
  precautions: string;
  description: string;
}

const splitCsvLine = (line: string) => {
  const values: string[] = [];
  let current = "";
  let inQuotes = false;

  for (let i = 0; i < line.length; i++) {
    const char = line[i];
    const nextChar = line[i + 1];

    if (char === '"' && nextChar === '"') {
      current += '"';
      i++;
    } else if (char === '"') {
      inQuotes = !inQuotes;
    } else if (char === "," && !inQuotes) {
      values.push(current.trim());
      current = "";
    } else {
      current += char;
    }
  }

  values.push(current.trim());
  return values;
};

const parseList = (value: string) =>
  value
    .split(",")
    .map((item) => item.trim())
    .filter(Boolean);

const loadPlantsFromCsv = async (): Promise<PlantData[]> => {
  const response = await fetch("/medicinal_plants_library.csv");

  if (!response.ok) {
    throw new Error("Local plant library CSV could not be loaded.");
  }

  const csvText = await response.text();
  const rows = csvText.split(/\r?\n/).filter((line) => line.trim());
  const headers = splitCsvLine(rows[0]);

  return rows.slice(1).map((row, index) => {
    const values = splitCsvLine(row);
    const record = headers.reduce<Record<string, string>>((acc, header, valueIndex) => {
      acc[header] = values[valueIndex] || "";
      return acc;
    }, {});

    return {
      id: `csv-${index}-${record.common_name.toLowerCase().replace(/[^a-z0-9]+/g, "-")}`,
      common_name: record.common_name,
      scientific_name: record.scientific_name,
      category: record.category,
      parts_used: parseList(record.parts_used),
      medicinal_properties: parseList(record.medicinal_properties),
      common_uses: parseList(record.common_uses),
      precautions: record.precautions,
      description: record.description,
    };
  });
};

const Library = () => {
  const [plants, setPlants] = useState<PlantData[]>([]);
  const [filteredPlants, setFilteredPlants] = useState<PlantData[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("All");
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    fetchPlants();
  }, []);

  useEffect(() => {
    filterPlants();
  }, [searchQuery, selectedCategory, plants]);

  const fetchPlants = async () => {
    try {
      const { data, error } = await supabase
        .from('medicinal_plants')
        .select('*')
        .order('common_name');

      if (error) throw error;

      if (data?.length) {
        setPlants(data);
        return;
      }

      const csvPlants = await loadPlantsFromCsv();
      setPlants(csvPlants);
    } catch (error: any) {
      try {
        const csvPlants = await loadPlantsFromCsv();
        setPlants(csvPlants);
      } catch (fallbackError: any) {
        toast({
          title: "Error loading plants",
          description: fallbackError.message || error.message,
          variant: "destructive",
        });
      }
    } finally {
      setIsLoading(false);
    }
  };

  const filterPlants = () => {
    let filtered = plants;

    if (searchQuery) {
      filtered = filtered.filter(plant =>
        plant.common_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        plant.scientific_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        plant.medicinal_properties.some(prop => 
          prop.toLowerCase().includes(searchQuery.toLowerCase())
        )
      );
    }

    if (selectedCategory !== "All") {
      filtered = filtered.filter(plant => plant.category === selectedCategory);
    }

    setFilteredPlants(filtered);
  };

  const categories = ["All", ...Array.from(new Set(plants.map(p => p.category)))];

  const handlePlantClick = (plant: PlantData) => {
    navigate('/result', { state: { plant, confidence: 1.0 } });
  };

  return (
    <div className="min-h-screen botanical-pattern py-8 px-4">
      <div className="max-w-7xl mx-auto">
        <Button
          variant="ghost"
          onClick={() => navigate('/')}
          className="mb-6"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Home
        </Button>

        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-botanical-cream border border-botanical-green/20 mb-4">
            <Leaf className="w-4 h-4 text-botanical-green" />
            <span className="text-sm font-medium text-botanical-green">
              {filteredPlants.length} Medicinal Plants
            </span>
          </div>
          <h1 className="text-4xl md:text-5xl font-serif font-bold mb-3">
            Plant Library
          </h1>
          <p className="text-muted-foreground text-lg mb-4">
            Browse our comprehensive database of medicinal plants
          </p>
          <Button variant="outline" asChild>
            <a href="/medicinal_plants_library.csv" download>
              <Download className="w-4 h-4 mr-2" />
              Download CSV
            </a>
          </Button>
        </div>

        {/* Search and Filter */}
        <Card className="p-6 mb-8 bg-card/80 backdrop-blur">
          <div className="space-y-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
              <Input
                placeholder="Search by plant name or medicinal property..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>

            <div className="flex items-center gap-2 overflow-x-auto pb-2">
              <Filter className="w-4 h-4 text-muted-foreground flex-shrink-0" />
              {categories.map((category) => (
                <Button
                  key={category}
                  variant={selectedCategory === category ? "default" : "outline"}
                  size="sm"
                  onClick={() => setSelectedCategory(category)}
                  className={selectedCategory === category ? "bg-gradient-botanical" : ""}
                >
                  {category}
                </Button>
              ))}
            </div>
          </div>
        </Card>

        {/* Plants Grid */}
        {isLoading ? (
          <div className="text-center py-12">
            <div className="inline-block w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin" />
            <p className="mt-4 text-muted-foreground">Loading plants...</p>
          </div>
        ) : filteredPlants.length === 0 ? (
          <Card className="p-12 text-center bg-card/50">
            <Leaf className="w-16 h-16 mx-auto mb-4 text-muted-foreground" />
            <h3 className="text-xl font-semibold mb-2">No plants found</h3>
            <p className="text-muted-foreground">
              Try adjusting your search or filter criteria
            </p>
          </Card>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredPlants.map((plant) => (
              <Card
                key={plant.id}
                onClick={() => handlePlantClick(plant)}
                className="p-6 cursor-pointer hover:shadow-elevated transition-all duration-300 group bg-gradient-card border-botanical-green/20"
              >
                <div className="mb-4">
                  <Badge variant="outline" className="mb-3 bg-primary/10 text-primary border-primary/20">
                    {plant.category}
                  </Badge>
                  <h3 className="text-xl font-serif font-bold mb-1 group-hover:text-primary transition-colors">
                    {plant.common_name}
                  </h3>
                  <p className="text-sm text-muted-foreground italic">
                    {plant.scientific_name}
                  </p>
                </div>

                <p className="text-sm text-muted-foreground mb-4 line-clamp-3">
                  {plant.description}
                </p>

                <div className="space-y-3">
                  <div>
                    <p className="text-xs font-semibold text-muted-foreground mb-2">
                      Key Properties:
                    </p>
                    <div className="flex flex-wrap gap-1">
                      {plant.medicinal_properties.slice(0, 3).map((prop, index) => (
                        <Badge key={index} variant="secondary" className="text-xs">
                          {prop}
                        </Badge>
                      ))}
                      {plant.medicinal_properties.length > 3 && (
                        <Badge variant="secondary" className="text-xs">
                          +{plant.medicinal_properties.length - 3}
                        </Badge>
                      )}
                    </div>
                  </div>

                  <Button
                    variant="ghost"
                    size="sm"
                    className="w-full group-hover:bg-primary/10 group-hover:text-primary"
                  >
                    View Details
                  </Button>
                </div>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Library;