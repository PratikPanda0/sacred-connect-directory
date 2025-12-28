import { Layout } from '@/components/layout/Layout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { CheckCircle, XCircle, BookOpen, Heart, Users, Shield } from 'lucide-react';

const Guidelines = () => {
  return (
    <Layout>
      {/* Hero Section */}
      <section className="relative py-16 md:py-24 gradient-subtle border-b border-border/50">
        <div className="container px-4 md:px-8">
          <div className="max-w-3xl mx-auto text-center">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary/10 mb-6">
              <Shield className="h-8 w-8 text-primary" />
            </div>
            <h1 className="font-serif text-4xl md:text-5xl font-semibold text-foreground mb-6">
              Community Guidelines
            </h1>
            <p className="text-lg text-muted-foreground leading-relaxed">
              Sacred Connect is a directory for devotees who accept His Divine Grace 
              A.C. Bhaktivedanta Swami Prabhupada as their diksa guru and follow the 
              teachings from the original, pre-1978 books.
            </p>
          </div>
        </div>
      </section>

      {/* Core Requirements */}
      <section className="py-16 md:py-20">
        <div className="container px-4 md:px-8">
          <div className="max-w-4xl mx-auto">
            <h2 className="font-serif text-3xl font-semibold text-foreground mb-8 text-center">
              Core Requirements for Membership
            </h2>
            
            <div className="grid md:grid-cols-2 gap-6 mb-12">
              <Card className="elevated-card border-primary/20">
                <CardHeader>
                  <CardTitle className="flex items-center gap-3 text-lg">
                    <Heart className="h-5 w-5 text-primary" />
                    Srila Prabhupada as Diksa Guru
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">
                    Members must accept His Divine Grace A.C. Bhaktivedanta Swami Prabhupada 
                    as their initiating spiritual master (diksa guru). This is a non-negotiable 
                    requirement for participation in this community.
                  </p>
                </CardContent>
              </Card>

              <Card className="elevated-card border-primary/20">
                <CardHeader>
                  <CardTitle className="flex items-center gap-3 text-lg">
                    <BookOpen className="h-5 w-5 text-primary" />
                    Original Pre-1978 Books
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">
                    Members follow the teachings as presented in Srila Prabhupada's original, 
                    unedited books published before 1978. These pristine editions preserve 
                    his divine instructions exactly as he intended.
                  </p>
                </CardContent>
              </Card>
            </div>

            {/* This Community IS For */}
            <Card className="elevated-card mb-6">
              <CardHeader>
                <CardTitle className="flex items-center gap-3 text-xl text-primary">
                  <CheckCircle className="h-6 w-6" />
                  This Community IS For
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-3">
                  <li className="flex items-start gap-3">
                    <CheckCircle className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
                    <span className="text-muted-foreground">
                      Devotees who accept Srila Prabhupada as their diksa guru
                    </span>
                  </li>
                  <li className="flex items-start gap-3">
                    <CheckCircle className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
                    <span className="text-muted-foreground">
                      Those who study and follow the original, pre-1978 books
                    </span>
                  </li>
                  <li className="flex items-start gap-3">
                    <CheckCircle className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
                    <span className="text-muted-foreground">
                      Practitioners seeking to connect with like-minded devotees worldwide
                    </span>
                  </li>
                  <li className="flex items-start gap-3">
                    <CheckCircle className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
                    <span className="text-muted-foreground">
                      Those wishing to collaborate on projects aligned with Srila Prabhupada's mission
                    </span>
                  </li>
                  <li className="flex items-start gap-3">
                    <CheckCircle className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
                    <span className="text-muted-foreground">
                      Devotees relocating who want to find community in their new location
                    </span>
                  </li>
                </ul>
              </CardContent>
            </Card>

            {/* This Community is NOT For */}
            <Card className="elevated-card border-destructive/20">
              <CardHeader>
                <CardTitle className="flex items-center gap-3 text-xl text-destructive">
                  <XCircle className="h-6 w-6" />
                  This Community is NOT For
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-3">
                  <li className="flex items-start gap-3">
                    <XCircle className="h-5 w-5 text-destructive mt-0.5 flex-shrink-0" />
                    <span className="text-muted-foreground">
                      Those who do not accept Srila Prabhupada as diksa guru
                    </span>
                  </li>
                  <li className="flex items-start gap-3">
                    <XCircle className="h-5 w-5 text-destructive mt-0.5 flex-shrink-0" />
                    <span className="text-muted-foreground">
                      Those who promote edited or post-1978 versions of Srila Prabhupada's books
                    </span>
                  </li>
                  <li className="flex items-start gap-3">
                    <XCircle className="h-5 w-5 text-destructive mt-0.5 flex-shrink-0" />
                    <span className="text-muted-foreground">
                      Anyone seeking to gather information for purposes contrary to the community's mission
                    </span>
                  </li>
                  <li className="flex items-start gap-3">
                    <XCircle className="h-5 w-5 text-destructive mt-0.5 flex-shrink-0" />
                    <span className="text-muted-foreground">
                      Those who wish to cause division or controversy within the community
                    </span>
                  </li>
                </ul>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Expected Behavior */}
      <section className="py-16 md:py-20 bg-muted/30">
        <div className="container px-4 md:px-8">
          <div className="max-w-4xl mx-auto">
            <h2 className="font-serif text-3xl font-semibold text-foreground mb-8 text-center">
              Expected Behavior
            </h2>
            
            <div className="grid md:grid-cols-3 gap-6">
              <div className="text-center p-6">
                <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
                  <Users className="h-6 w-6 text-primary" />
                </div>
                <h3 className="font-medium text-foreground mb-2">Respect</h3>
                <p className="text-sm text-muted-foreground">
                  Treat all community members with respect and Vaishnava etiquette
                </p>
              </div>
              <div className="text-center p-6">
                <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
                  <Heart className="h-6 w-6 text-primary" />
                </div>
                <h3 className="font-medium text-foreground mb-2">Service</h3>
                <p className="text-sm text-muted-foreground">
                  Approach connections with a spirit of service and cooperation
                </p>
              </div>
              <div className="text-center p-6">
                <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
                  <Shield className="h-6 w-6 text-primary" />
                </div>
                <h3 className="font-medium text-foreground mb-2">Privacy</h3>
                <p className="text-sm text-muted-foreground">
                  Respect the privacy of other members and their shared information
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Admin Review Notice */}
      <section className="py-12 md:py-16">
        <div className="container px-4 md:px-8">
          <div className="max-w-2xl mx-auto text-center">
            <p className="text-muted-foreground">
              Announcements and certain activities may be reviewed by administrators to ensure 
              alignment with these guidelines. We reserve the right to remove content or 
              members who violate these principles.
            </p>
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default Guidelines;
