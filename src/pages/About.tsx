import { Layout } from '@/components/layout/Layout';
import { Heart, Users, Globe, BookOpen, CheckCircle, XCircle, Shield } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';

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
              A global directory connecting devotees who accept His Divine Grace 
              A.C. Bhaktivedanta Swami Prabhupada as their diksa guru and follow 
              the teachings from his original, pre-1978 books.
            </p>
          </div>
        </div>
      </section>

      {/* Who Is This For Section */}
      <section className="py-16 md:py-20 bg-muted/30">
        <div className="container px-4 md:px-8">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-12">
              <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-primary/10 mb-4">
                <Shield className="h-6 w-6 text-primary" />
              </div>
              <h2 className="font-serif text-3xl font-semibold text-foreground mb-4">
                Who Is This Community For?
              </h2>
              <p className="text-muted-foreground max-w-2xl mx-auto">
                Sacred Connect serves a specific community of devotees united by two 
                fundamental principles.
              </p>
            </div>

            <div className="grid md:grid-cols-2 gap-8 mb-12">
              {/* Core Requirement 1 */}
              <div className="p-6 rounded-xl bg-card border border-primary/20">
                <div className="flex items-center gap-3 mb-4">
                  <Heart className="h-6 w-6 text-primary" />
                  <h3 className="font-serif text-xl font-medium text-foreground">
                    Srila Prabhupada as Diksa Guru
                  </h3>
                </div>
                <p className="text-muted-foreground">
                  Members accept His Divine Grace A.C. Bhaktivedanta Swami Prabhupada 
                  as their initiating spiritual master. This is the foundation of our community.
                </p>
              </div>

              {/* Core Requirement 2 */}
              <div className="p-6 rounded-xl bg-card border border-primary/20">
                <div className="flex items-center gap-3 mb-4">
                  <BookOpen className="h-6 w-6 text-primary" />
                  <h3 className="font-serif text-xl font-medium text-foreground">
                    Original Pre-1978 Books
                  </h3>
                </div>
                <p className="text-muted-foreground">
                  Members follow the teachings as presented in Srila Prabhupada's original, 
                  unedited books published before 1978.
                </p>
              </div>
            </div>

            {/* IS For / NOT For Grid */}
            <div className="grid md:grid-cols-2 gap-6">
              <div className="p-6 rounded-xl bg-card border border-border/50">
                <h4 className="flex items-center gap-2 font-medium text-foreground mb-4">
                  <CheckCircle className="h-5 w-5 text-primary" />
                  This Community IS For
                </h4>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li className="flex items-start gap-2">
                    <CheckCircle className="h-4 w-4 text-primary mt-0.5 flex-shrink-0" />
                    Devotees accepting Srila Prabhupada as diksa guru
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="h-4 w-4 text-primary mt-0.5 flex-shrink-0" />
                    Followers of the original, pre-1978 books
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="h-4 w-4 text-primary mt-0.5 flex-shrink-0" />
                    Those seeking like-minded devotees worldwide
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="h-4 w-4 text-primary mt-0.5 flex-shrink-0" />
                    Collaborators on mission-aligned projects
                  </li>
                </ul>
              </div>

              <div className="p-6 rounded-xl bg-card border border-destructive/20">
                <h4 className="flex items-center gap-2 font-medium text-foreground mb-4">
                  <XCircle className="h-5 w-5 text-destructive" />
                  This Community is NOT For
                </h4>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li className="flex items-start gap-2">
                    <XCircle className="h-4 w-4 text-destructive mt-0.5 flex-shrink-0" />
                    Those who do not accept Prabhupada as diksa guru
                  </li>
                  <li className="flex items-start gap-2">
                    <XCircle className="h-4 w-4 text-destructive mt-0.5 flex-shrink-0" />
                    Promoters of edited/post-1978 book versions
                  </li>
                  <li className="flex items-start gap-2">
                    <XCircle className="h-4 w-4 text-destructive mt-0.5 flex-shrink-0" />
                    Those seeking to cause division
                  </li>
                  <li className="flex items-start gap-2">
                    <XCircle className="h-4 w-4 text-destructive mt-0.5 flex-shrink-0" />
                    Information gatherers with contrary purposes
                  </li>
                </ul>
              </div>
            </div>

            <div className="text-center mt-8">
              <Button variant="outline" asChild>
                <Link to="/guidelines">Read Full Community Guidelines</Link>
              </Button>
            </div>
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
