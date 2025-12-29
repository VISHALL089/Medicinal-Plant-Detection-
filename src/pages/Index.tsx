import { Link } from "react-router-dom";
import { Upload, BookOpen, Leaf, Sparkles, ArrowRight, Zap, Shield, Database } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useAuth } from "@/hooks/useAuth";

const Index = () => {
  const { user } = useAuth();

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative py-20 md:py-32 px-4 overflow-hidden">
        {/* Decorative backgrounds */}
        <div className="absolute inset-0 botanical-pattern" />
        <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-primary/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
        <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-botanical-leaf/5 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2" />
        
        <div className="max-w-6xl mx-auto relative">
          <div className="text-center space-y-8 mb-16">
            {/* Badge */}
            <div className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-primary/10 border border-primary/20 animate-fade-in">
              <Sparkles className="w-4 h-4 text-primary" />
              <span className="text-sm font-semibold text-primary">AI-Powered Plant Recognition</span>
            </div>
            
            {/* Heading */}
            <h1 className="text-5xl md:text-7xl lg:text-8xl font-serif font-bold text-foreground leading-tight">
              Discover the
              <span className="block bg-gradient-to-r from-primary to-botanical-leaf bg-clip-text text-transparent">
                Healing Power
              </span>
              of Plants
            </h1>
            
            {/* Subtitle */}
            <p className="text-xl md:text-2xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
              Upload a leaf image to instantly identify medicinal plants and unlock their 
              <span className="text-foreground font-medium"> ancient healing secrets</span>.
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
              <Link to="/upload">
                <Button size="lg" className="h-14 px-8 bg-gradient-botanical hover:opacity-90 text-lg font-semibold shadow-botanical">
                  Start Identifying
                  <ArrowRight className="ml-2 w-5 h-5" />
                </Button>
              </Link>
              <Link to="/library">
                <Button size="lg" variant="outline" className="h-14 px-8 text-lg font-semibold border-2">
                  Browse Library
                </Button>
              </Link>
            </div>

            {/* Stats */}
            <div className="flex items-center justify-center gap-8 md:gap-12 pt-8">
              <div className="text-center">
                <p className="text-3xl md:text-4xl font-bold text-foreground">106+</p>
                <p className="text-sm text-muted-foreground">Medicinal Plants</p>
              </div>
              <div className="w-px h-12 bg-border" />
              <div className="text-center">
                <p className="text-3xl md:text-4xl font-bold text-foreground">AI</p>
                <p className="text-sm text-muted-foreground">Powered</p>
              </div>
              <div className="w-px h-12 bg-border" />
              <div className="text-center">
                <p className="text-3xl md:text-4xl font-bold text-foreground">Free</p>
                <p className="text-sm text-muted-foreground">To Use</p>
              </div>
            </div>
          </div>

          {/* Action Cards */}
          <div className="grid md:grid-cols-2 gap-6 max-w-4xl mx-auto">
            <Link to="/upload" className="group">
              <Card className="p-8 h-full hover:shadow-elevated transition-all duration-500 cursor-pointer bg-card border-2 border-transparent hover:border-primary/20 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-botanical opacity-10 rounded-full blur-2xl group-hover:opacity-20 transition-opacity" />
                <div className="flex flex-col items-center text-center space-y-5 relative">
                  <div className="w-20 h-20 rounded-2xl bg-gradient-botanical flex items-center justify-center group-hover:scale-110 group-hover:rotate-3 transition-all duration-300 shadow-botanical">
                    <Upload className="w-10 h-10 text-primary-foreground" />
                  </div>
                  <div>
                    <h3 className="text-2xl font-serif font-bold mb-3 text-foreground">Identify Plant</h3>
                    <p className="text-muted-foreground leading-relaxed">
                      Upload a leaf photo and let our AI identify the medicinal plant instantly
                    </p>
                  </div>
                  <Button className="w-full h-12 bg-gradient-botanical hover:opacity-90 font-semibold">
                    Start Identifying
                    <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </Button>
                </div>
              </Card>
            </Link>

            <Link to="/library" className="group">
              <Card className="p-8 h-full hover:shadow-elevated transition-all duration-500 cursor-pointer bg-card border-2 border-transparent hover:border-botanical-earth/20 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-32 h-32 bg-botanical-earth opacity-10 rounded-full blur-2xl group-hover:opacity-20 transition-opacity" />
                <div className="flex flex-col items-center text-center space-y-5 relative">
                  <div className="w-20 h-20 rounded-2xl bg-botanical-earth flex items-center justify-center group-hover:scale-110 group-hover:-rotate-3 transition-all duration-300">
                    <BookOpen className="w-10 h-10 text-primary-foreground" />
                  </div>
                  <div>
                    <h3 className="text-2xl font-serif font-bold mb-3 text-foreground">Plant Library</h3>
                    <p className="text-muted-foreground leading-relaxed">
                      Explore our comprehensive database of 100+ medicinal plants
                    </p>
                  </div>
                  <Button variant="outline" className="w-full h-12 border-2 border-botanical-earth text-botanical-earth hover:bg-botanical-earth hover:text-primary-foreground font-semibold">
                    Explore Library
                    <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </Button>
                </div>
              </Card>
            </Link>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-24 px-4 bg-muted/30 relative">
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-primary/[0.02] to-transparent" />
        <div className="max-w-6xl mx-auto relative">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-serif font-bold text-foreground mb-4">
              Nature's Medicine at Your Fingertips
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Harness the power of AI to explore the world of medicinal plants
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            <Card className="p-8 text-center space-y-4 bg-card hover:shadow-card transition-shadow border-0 shadow-sm">
              <div className="w-16 h-16 mx-auto rounded-2xl bg-primary/10 flex items-center justify-center">
                <Zap className="w-8 h-8 text-primary" />
              </div>
              <h3 className="font-serif font-bold text-xl text-foreground">Instant Recognition</h3>
              <p className="text-muted-foreground leading-relaxed">
                Advanced AI model trained on thousands of medicinal plant images for accurate identification
              </p>
            </Card>

            <Card className="p-8 text-center space-y-4 bg-card hover:shadow-card transition-shadow border-0 shadow-sm">
              <div className="w-16 h-16 mx-auto rounded-2xl bg-primary/10 flex items-center justify-center">
                <Database className="w-8 h-8 text-primary" />
              </div>
              <h3 className="font-serif font-bold text-xl text-foreground">Rich Database</h3>
              <p className="text-muted-foreground leading-relaxed">
                Comprehensive information on medicinal properties, uses, and botanical details
              </p>
            </Card>

            <Card className="p-8 text-center space-y-4 bg-card hover:shadow-card transition-shadow border-0 shadow-sm">
              <div className="w-16 h-16 mx-auto rounded-2xl bg-primary/10 flex items-center justify-center">
                <Shield className="w-8 h-8 text-primary" />
              </div>
              <h3 className="font-serif font-bold text-xl text-foreground">Trusted Information</h3>
              <p className="text-muted-foreground leading-relaxed">
                Evidence-based data sourced from botanical and herbal medicine references
              </p>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 px-4 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-botanical opacity-5" />
        <div className="max-w-4xl mx-auto text-center relative">
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-gradient-botanical mb-8">
            <Leaf className="w-10 h-10 text-primary-foreground" />
          </div>
          <h2 className="text-4xl md:text-5xl font-serif font-bold text-foreground mb-6">
            Ready to Discover?
          </h2>
          <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
            Upload your first leaf image and let our AI guide you through the fascinating world of medicinal plants.
          </p>
          <Link to="/upload">
            <Button size="lg" className="h-14 px-10 bg-gradient-botanical hover:opacity-90 text-lg font-semibold shadow-botanical">
              Start Your Journey
              <ArrowRight className="ml-2 w-5 h-5" />
            </Button>
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 px-4 border-t border-border">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-gradient-botanical flex items-center justify-center">
              <Leaf className="w-4 h-4 text-primary-foreground" />
            </div>
            <span className="font-serif font-bold text-foreground">PlantMed</span>
          </div>
          <p className="text-sm text-muted-foreground">
            © 2024 PlantMed. Discover nature's healing power.
          </p>
        </div>
      </footer>
    </div>
  );
};

export default Index;
