import { useLocation, useNavigate } from "react-router-dom";
import { ArrowLeft, Leaf, Info, Download } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";

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

const Result = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { plant, confidence } = location.state as { plant: PlantData; confidence: number };

  if (!plant) {
    navigate('/upload');
    return null;
  }

  const confidencePercentage = Math.round(confidence * 100);

  return (
    <div className="min-h-screen botanical-pattern py-8 px-4">
      <div className="max-w-4xl mx-auto">
        <Button
          variant="ghost"
          onClick={() => navigate('/upload')}
          className="mb-6"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Try Another Plant
        </Button>

        {/* Confidence Badge */}
        <div className="text-center mb-6">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-botanical-cream border border-botanical-green/20">
            <Leaf className="w-4 h-4 text-botanical-green" />
            <span className="text-sm font-medium text-botanical-green">
              {confidencePercentage}% Match Confidence
            </span>
          </div>
        </div>

        {/* Main Plant Card */}
        <Card className="p-8 mb-6 bg-gradient-card border-botanical-green/20 shadow-elevated">
          <div className="text-center mb-6">
            <h1 className="text-4xl md:text-5xl font-serif font-bold text-foreground mb-2">
              {plant.common_name}
            </h1>
            <p className="text-xl text-muted-foreground italic">
              {plant.scientific_name}
            </p>
          </div>

          <div className="flex flex-wrap gap-2 justify-center mb-6">
            <Badge variant="outline" className="bg-primary/10 text-primary border-primary/20">
              {plant.category}
            </Badge>
            {plant.parts_used.slice(0, 3).map((part, index) => (
              <Badge key={index} variant="secondary">
                {part}
              </Badge>
            ))}
          </div>

          <p className="text-center text-lg text-muted-foreground mb-8 leading-relaxed">
            {plant.description}
          </p>

          {/* Medicinal Properties */}
          <div className="mb-6">
            <h3 className="text-xl font-serif font-bold mb-3 flex items-center gap-2">
              <Leaf className="w-5 h-5 text-primary" />
              Medicinal Properties
            </h3>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
              {plant.medicinal_properties.map((property, index) => (
                <div
                  key={index}
                  className="px-4 py-2 rounded-lg bg-botanical-cream border border-botanical-green/20 text-sm font-medium text-center"
                >
                  {property}
                </div>
              ))}
            </div>
          </div>

          {/* Common Uses */}
          <div className="mb-6">
            <h3 className="text-xl font-serif font-bold mb-3">Common Uses</h3>
            <div className="space-y-2">
              {plant.common_uses.map((use, index) => (
                <div key={index} className="flex items-start gap-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-primary mt-2 flex-shrink-0" />
                  <p className="text-muted-foreground">{use}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Parts Used */}
          <div className="mb-6">
            <h3 className="text-xl font-serif font-bold mb-3">Parts Used</h3>
            <div className="flex flex-wrap gap-2">
              {plant.parts_used.map((part, index) => (
                <Badge key={index} variant="outline" className="bg-secondary">
                  {part}
                </Badge>
              ))}
            </div>
          </div>

        </Card>

        {/* Disclaimer */}
        <Alert>
          <Info className="w-4 h-4" />
          <AlertDescription>
            This information is for educational purposes only. Always consult with a qualified healthcare practitioner before using any medicinal plants.
          </AlertDescription>
        </Alert>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 mt-6">
          <Button
            variant="outline"
            onClick={() => navigate('/upload')}
            className="flex-1"
          >
            Identify Another Plant
          </Button>
          <Button
            onClick={() => navigate('/library')}
            className="flex-1 bg-gradient-botanical hover:opacity-90"
          >
            Browse Plant Library
          </Button>
          <Button
            variant="outline"
            asChild
            className="flex-1"
          >
            <a href="/medicinal_plants_library.csv" download>
              <Download className="w-4 h-4 mr-2" />
              Download CSV
            </a>
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Result;