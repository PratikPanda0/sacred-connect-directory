import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Globe, Users, Mail } from "lucide-react";

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      {/* Simple Hero */}
      <section className="py-20 px-4">
        <div className="container mx-auto max-w-3xl text-center">
          <h1 className="text-4xl md:text-5xl font-display font-semibold text-foreground mb-6">
            Global Devotee Directory
          </h1>
          <p className="text-lg text-muted-foreground mb-8 max-w-xl mx-auto">
            Find and connect with devotees around the world. Browse by country and city to discover communities, home programs, and spiritual connections.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button asChild size="lg" className="gap-2">
              <Link to="/directory">
                <Globe className="h-5 w-5" />
                Browse Directory
              </Link>
            </Button>
            <Button asChild variant="outline" size="lg" className="gap-2">
              <Link to="/auth">
                <Users className="h-5 w-5" />
                Add Your Listing
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Simple Features */}
      <section className="py-16 px-4 bg-muted/30">
        <div className="container mx-auto max-w-4xl">
          <div className="grid md:grid-cols-3 gap-8 text-center">
            <div className="p-6">
              <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
                <Globe className="h-6 w-6 text-primary" />
              </div>
              <h3 className="font-semibold mb-2">Search by Location</h3>
              <p className="text-sm text-muted-foreground">
                Select a country to see all cities and towns with devotee contacts
              </p>
            </div>
            <div className="p-6">
              <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
                <Mail className="h-6 w-6 text-primary" />
              </div>
              <h3 className="font-semibold mb-2">Direct Contact</h3>
              <p className="text-sm text-muted-foreground">
                Get email, phone, or website links to connect directly
              </p>
            </div>
            <div className="p-6">
              <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
                <Users className="h-6 w-6 text-primary" />
              </div>
              <h3 className="font-semibold mb-2">Join the Network</h3>
              <p className="text-sm text-muted-foreground">
                Add your own listing to help others find your community
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 px-4 text-center text-sm text-muted-foreground border-t">
        <p>All glories to His Divine Grace A.C. Bhaktivedanta Swami Prabhupada</p>
      </footer>
    </div>
  );
};

export default Index;
