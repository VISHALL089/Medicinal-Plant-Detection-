import { useState } from "react";
import { Link } from "react-router-dom";
import { Upload, BookOpen, Leaf, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

const Index = () => {
  return (
    <div className="min-h-screen botanical-pattern">
      {/* Hero Section */}
      <section className="relative py-20 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="text-center space-y-6 mb-16">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-botanical-cream border border-botanical-green/20">
              <span className="text-sm font-medium text-botanical-green">AI-Powered Plant Identification</span>
            </div>
            
            <h1 className="text-5xl md:text-7xl font-serif font-bold text-foreground">
              Medicinal Plant
              <span className="block text-primary">Detector</span>
            </h1>
            
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Upload a leaf image to instantly identify medicinal plants and discover their healing properties, uses, and botanical information.
            </p>
          </div>

          {/* Action Cards */}
          <div className="grid md:grid-cols-2 gap-6 max-w-4xl mx-auto">
            <Link to="/upload">
              <Card className="p-8 hover:shadow-elevated transition-all duration-300 cursor-pointer group bg-gradient-card border-botanical-green/20">
                <div className="flex flex-col items-center text-center space-y-4">
                  <div className="w-16 h-16 rounded-2xl bg-gradient-botanical flex items-center justify-center group-hover:scale-110 transition-transform">
                    <Upload className="w-8 h-8 text-white" />
                  </div>
                  <div>
                    <h3 className="text-2xl font-serif font-bold mb-2">Identify Plant</h3>
                    <p className="text-muted-foreground">
                      Upload a leaf photo for instant AI-powered identification
                    </p>
                  </div>
                  <Button className="w-full bg-gradient-botanical hover:opacity-90">
                    Start Identifying
                  </Button>
                </div>
              </Card>
            </Link>

            <Link to="/library">
              <Card className="p-8 hover:shadow-elevated transition-all duration-300 cursor-pointer group bg-gradient-card border-botanical-green/20">
                <div className="flex flex-col items-center text-center space-y-4">
                  <div className="w-16 h-16 rounded-2xl bg-botanical-earth flex items-center justify-center group-hover:scale-110 transition-transform">
                    <BookOpen className="w-8 h-8 text-white" />
                  </div>
                  <div>
                    <h3 className="text-2xl font-serif font-bold mb-2">Plant Library</h3>
                    <p className="text-muted-foreground">
                      Browse 100+ medicinal plants with detailed information
                    </p>
                  </div>
                  <Button variant="outline" className="w-full border-botanical-earth text-botanical-earth hover:bg-botanical-earth hover:text-white">
                    Explore Library
                  </Button>
                </div>
              </Card>
            </Link>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 px-4 bg-card/50">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-serif font-bold text-center mb-12">
            Discover Nature's Medicine
          </h2>
          
          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center space-y-3">
              <div className="w-12 h-12 mx-auto rounded-xl bg-primary/10 flex items-center justify-center">
                <Sparkles className="w-6 h-6 text-primary" />
              </div>
              <h3 className="font-serif font-bold text-xl">AI Recognition</h3>
              <p className="text-muted-foreground">
                Advanced ML model trained on medicinal plant characteristics
              </p>
            </div>

            <div className="text-center space-y-3">
              <div className="w-12 h-12 mx-auto rounded-xl bg-primary/10 flex items-center justify-center">
                <BookOpen className="w-6 h-6 text-primary" />
              </div>
              <h3 className="font-serif font-bold text-xl">Comprehensive Data</h3>
              <p className="text-muted-foreground">
                100+ plants with medicinal properties, uses, and precautions
              </p>
            </div>

            <div className="text-center space-y-3">
              <div className="w-12 h-12 mx-auto rounded-xl bg-primary/10 flex items-center justify-center">
                <Leaf className="w-6 h-6 text-primary" />
              </div>
              <h3 className="font-serif font-bold text-xl">Scientific Details</h3>
              <p className="text-muted-foreground">
                Botanical names, parts used, and evidence-based information
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Index;