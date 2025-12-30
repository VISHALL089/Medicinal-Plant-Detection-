import { useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { Upload as UploadIcon, Leaf, Loader2, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

const Upload = () => {
  const [isDragging, setIsDragging] = useState(false);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  }, []);

  const processImage = async (file: File) => {
    if (!file.type.startsWith('image/')) {
      toast({
        title: "Invalid file type",
        description: "Please upload an image file (JPG, PNG, etc.)",
        variant: "destructive",
      });
      return;
    }

    if (file.size > 20 * 1024 * 1024) {
      toast({
        title: "File too large",
        description: "Please upload an image smaller than 20MB",
        variant: "destructive",
      });
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      setSelectedImage(e.target?.result as string);
    };
    reader.readAsDataURL(file);
  };

  const handleDrop = useCallback(async (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);

    const file = e.dataTransfer.files[0];
    if (file) {
      await processImage(file);
    }
  }, []);

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      await processImage(file);
    }
  };

  const handleAnalyze = async () => {
    if (!selectedImage) return;

    setIsAnalyzing(true);

    try {
      const { data, error } = await supabase.functions.invoke('classify-plant', {
        body: { imageData: selectedImage }
      });

      if (error) throw error;

      if (data.plant) {
        navigate('/result', { state: { plant: data.plant, confidence: data.confidence } });
      } else {
        toast({
          title: "Plant not identified",
          description: data.message || "Unable to identify this plant. Please try another image.",
          variant: "destructive",
        });
      }
    } catch (error: any) {
      console.error('Classification error:', error);
      toast({
        title: "Analysis failed",
        description: error.message || "Failed to analyze the image. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsAnalyzing(false);
    }
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
            Upload Leaf Image
          </h1>
          <p className="text-muted-foreground text-lg">
            Take a clear photo of a medicinal plant leaf for identification
          </p>
        </div>

        <Card className="p-8 bg-gradient-card border-botanical-green/20 shadow-card">
          {!selectedImage ? (
            <div
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
              className={`
                border-2 border-dashed rounded-2xl p-12 text-center transition-all
                ${isDragging 
                  ? 'border-primary bg-primary/5 scale-[1.02]' 
                  : 'border-border hover:border-primary/50 hover:bg-muted/50'
                }
              `}
            >
              <div className="flex flex-col items-center space-y-4">
                <div className="w-20 h-20 rounded-full bg-gradient-botanical flex items-center justify-center">
                  <UploadIcon className="w-10 h-10 text-white" />
                </div>
                
                <div className="space-y-2">
                  <p className="text-xl font-semibold">
                    Drag & drop your leaf image here
                  </p>
                  <p className="text-muted-foreground">
                    or click to browse from your device
                  </p>
                  <p className="text-sm text-muted-foreground">
                    Supports JPG, PNG (max 20MB)
                  </p>
                </div>

                <input
                  type="file"
                  accept="image/*"
                  onChange={handleFileSelect}
                  className="hidden"
                  id="file-upload"
                />
                <label htmlFor="file-upload">
                  <Button variant="outline" className="cursor-pointer" asChild>
                    <span>Choose File</span>
                  </Button>
                </label>
              </div>
            </div>
          ) : (
            <div className="space-y-6">
              <div className="relative rounded-xl overflow-hidden shadow-botanical">
                <img
                  src={selectedImage}
                  alt="Selected leaf"
                  className="w-full h-auto max-h-96 object-contain bg-muted"
                />
              </div>

              <div className="flex gap-4">
                <Button
                  variant="outline"
                  onClick={() => setSelectedImage(null)}
                  disabled={isAnalyzing}
                  className="flex-1"
                >
                  Choose Different Image
                </Button>
                <Button
                  onClick={handleAnalyze}
                  disabled={isAnalyzing}
                  className="flex-1 bg-gradient-botanical hover:opacity-90"
                >
                  {isAnalyzing ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Analyzing...
                    </>
                  ) : (
                    <>
                      <Leaf className="w-4 h-4 mr-2" />
                      Identify Plant
                    </>
                  )}
                </Button>
              </div>
            </div>
          )}
        </Card>

        <div className="mt-8 p-6 bg-card/50 rounded-xl border border-border">
          <h3 className="font-semibold mb-3 flex items-center gap-2">
            <Leaf className="w-5 h-5 text-primary" />
            Tips for Best Results
          </h3>
          <ul className="space-y-2 text-sm text-muted-foreground">
            <li>• Take photos in good natural lighting</li>
            <li>• Ensure the leaf is in focus and clearly visible</li>
            <li>• Capture the entire leaf including edges and veins</li>
            <li>• Use a plain background if possible</li>
            <li>• Include leaf surface texture and any distinctive markings</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default Upload;