import { Layout } from '@/components/layout/Layout';
import { Heart, Users, Globe, BookOpen } from 'lucide-react';

const About = () => {
  return (
    <Layout>
      {/* Hero Section */}
      <section className="relative py-16 md:py-24 gradient-subtle border-b border-border/50">
        <div className="container px-4 md:px-8">
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="font-serif text-4xl md:text-5xl font-semibold text-foreground mb-6">
              About Sacred Connect
            </h1>
            <p className="text-lg text-muted-foreground leading-relaxed">
              A global community platform connecting devotees from around the world, 
              fostering spiritual growth, and building meaningful connections through 
              shared devotion and service.
            </p>
          </div>
        </div>
      </section>

      {/* Mission Section */}
      <section className="py-16 md:py-20">
        <div className="container px-4 md:px-8">
          <div className="max-w-4xl mx-auto">
            <div className="grid md:grid-cols-2 gap-12 items-center">
              <div>
                <h2 className="font-serif text-3xl font-semibold text-foreground mb-4">
                  Our Mission
                </h2>
                <p className="text-muted-foreground leading-relaxed mb-4">
                  Sacred Connect was created to unite devotees across geographical boundaries, 
                  enabling them to find, connect with, and support one another in their 
                  spiritual journeys.
                </p>
                <p className="text-muted-foreground leading-relaxed">
                  We believe in the power of community and the importance of maintaining 
                  connections with fellow practitioners, no matter where in the world they may be.
                </p>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="p-6 rounded-xl bg-card border border-border/50 text-center">
                  <Heart className="h-8 w-8 text-primary mx-auto mb-3" />
                  <h3 className="font-medium text-foreground">Devotion</h3>
                </div>
                <div className="p-6 rounded-xl bg-card border border-border/50 text-center">
                  <Users className="h-8 w-8 text-primary mx-auto mb-3" />
                  <h3 className="font-medium text-foreground">Community</h3>
                </div>
                <div className="p-6 rounded-xl bg-card border border-border/50 text-center">
                  <Globe className="h-8 w-8 text-primary mx-auto mb-3" />
                  <h3 className="font-medium text-foreground">Global</h3>
                </div>
                <div className="p-6 rounded-xl bg-card border border-border/50 text-center">
                  <BookOpen className="h-8 w-8 text-primary mx-auto mb-3" />
                  <h3 className="font-medium text-foreground">Learning</h3>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="py-16 md:py-20 bg-muted/30">
        <div className="container px-4 md:px-8">
          <div className="max-w-4xl mx-auto">
            <h2 className="font-serif text-3xl font-semibold text-foreground mb-8 text-center">
              Our Values
            </h2>
            <div className="grid md:grid-cols-3 gap-8">
              <div className="text-center">
                <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl">🙏</span>
                </div>
                <h3 className="font-serif text-xl font-medium text-foreground mb-2">
                  Spiritual Growth
                </h3>
                <p className="text-muted-foreground text-sm">
                  Supporting each devotee's journey towards deeper spiritual understanding.
                </p>
              </div>
              <div className="text-center">
                <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl">🤝</span>
                </div>
                <h3 className="font-serif text-xl font-medium text-foreground mb-2">
                  Service
                </h3>
                <p className="text-muted-foreground text-sm">
                  Encouraging selfless service to the community and to one another.
                </p>
              </div>
              <div className="text-center">
                <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl">🌍</span>
                </div>
                <h3 className="font-serif text-xl font-medium text-foreground mb-2">
                  Unity
                </h3>
                <p className="text-muted-foreground text-sm">
                  Bringing together devotees from diverse backgrounds in shared purpose.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default About;
