import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Layout } from '@/components/layout/Layout';
import { Globe, Users, Megaphone, Shield, ArrowRight, Sparkles } from 'lucide-react';
import { useAuth } from '@/lib/auth-context';

const Index = () => {
  const { user, hasProfile } = useAuth();
  const features = [
    {
      icon: Globe,
      title: 'Global Directory',
      description: 'Connect with verified members across countries and cities worldwide.',
    },
    {
      icon: Users,
      title: 'Trusted Community',
      description: 'Every profile is verified to ensure a safe and authentic network.',
    },
    {
      icon: Megaphone,
      title: 'Share Announcements',
      description: 'Post about collaborations, relocations, and spiritual projects.',
    },
    {
      icon: Shield,
      title: 'Privacy First',
      description: 'Control what information you share. Your data stays protected.',
    },
  ];

  return (
    <Layout>
      {/* Hero Section */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 gradient-hero opacity-95" />
        <div className="absolute inset-0 bg-[url('data:image/svg+xml,%3Csvg%20width%3D%2260%22%20height%3D%2260%22%20viewBox%3D%220%200%2060%2060%22%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%3E%3Cg%20fill%3D%22none%22%20fill-rule%3D%22evenodd%22%3E%3Cg%20fill%3D%22%23ffffff%22%20fill-opacity%3D%220.05%22%3E%3Cpath%20d%3D%22M36%2034v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6%2034v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6%204V0H4v4H0v2h4v4h2V6h4V4H6z%22%2F%3E%3C%2Fg%3E%3C%2Fg%3E%3C%2Fsvg%3E')] opacity-30" />
        
        <div className="container relative px-4 md:px-8 py-24 md:py-32">
          <div className="max-w-3xl mx-auto text-center">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary-foreground/10 border border-primary-foreground/20 mb-6 animate-fade-in">
              <Sparkles className="h-4 w-4 text-gold-glow" />
              <span className="text-sm text-primary-foreground/90">Connecting Souls Worldwide</span>
            </div>
            
            <h1 className="font-serif text-4xl md:text-6xl lg:text-7xl font-bold text-primary-foreground mb-6 animate-slide-up" style={{ animationDelay: '0.1s' }}>
              Spiritual Networking
              <span className="block mt-2 text-gold-glow">Directory</span>
            </h1>
            
            <p className="text-lg md:text-xl text-primary-foreground/80 mb-10 max-w-2xl mx-auto leading-relaxed animate-slide-up" style={{ animationDelay: '0.2s' }}>
              A trusted global community where verified members connect, share their missions, and collaborate on spiritual projects across the world.
            </p>
            
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 animate-slide-up" style={{ animationDelay: '0.3s' }}>
              <Button variant="hero" size="xl" asChild>
                <Link to="/directory">
                  Explore Directory
                  <ArrowRight className="h-5 w-5 ml-1" />
                </Link>
              </Button>
              <Button variant="ghost" size="lg" className="text-primary-foreground hover:bg-primary-foreground/10" asChild>
                <Link to="/auth?mode=signup">Join the Community</Link>
              </Button>
            </div>
          </div>
        </div>
        
        <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-background to-transparent" />
      </section>

      {/* Features Section */}
      <section className="py-20 md:py-28">
        <div className="container px-4 md:px-8">
          <div className="text-center mb-16">
            <h2 className="font-serif text-3xl md:text-4xl font-semibold text-foreground mb-4">
              Built for Connection
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Everything you need to find and connect with like-minded individuals around the globe.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((feature, index) => (
              <div
                key={feature.title}
                className="elevated-card p-6 text-center group animate-slide-up"
                style={{ animationDelay: `${0.1 * index}s` }}
              >
                <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-sage-light text-primary mb-4 group-hover:scale-110 transition-transform duration-300">
                  <feature.icon className="h-7 w-7" />
                </div>
                <h3 className="font-serif text-xl font-semibold text-foreground mb-2">
                  {feature.title}
                </h3>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 md:py-28 gradient-subtle">
        <div className="container px-4 md:px-8">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="font-serif text-3xl md:text-4xl font-semibold text-foreground mb-4">
              Ready to Connect?
            </h2>
            <p className="text-muted-foreground mb-8 max-w-xl mx-auto">
              Join our growing community of spiritual practitioners, healers, and seekers from around the world.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              {!hasProfile && (
                <Button variant="default" size="lg" asChild>
                  <Link to={user ? "/profile" : "/auth?mode=signup"}>
                    Create Your Profile
                    <ArrowRight className="h-4 w-4 ml-1" />
                  </Link>
                </Button>
              )}
              <Button variant="outline" size="lg" asChild>
                <Link to="/announcements">View Announcements</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default Index;
