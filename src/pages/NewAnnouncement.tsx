import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Layout } from '@/components/layout/Layout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useAuth } from '@/lib/auth-context';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { z } from 'zod';
import { Send, Loader2, ArrowLeft, Info } from 'lucide-react';
import { Link } from 'react-router-dom';

const announcementSchema = z.object({
  title: z.string().trim().min(5, 'Title must be at least 5 characters').max(100),
  content: z.string().trim().min(20, 'Content must be at least 20 characters').max(2000),
  category: z.string().min(1, 'Please select a category'),
});

const categories = [
  { value: 'collaboration', label: 'Project Collaboration' },
  { value: 'relocation', label: 'Relocation Interest' },
  { value: 'visiting', label: 'Visiting Request' },
  { value: 'project', label: 'Project Update' },
  { value: 'other', label: 'Other' },
];

const NewAnnouncement = () => {
  const { user, isMember, loading: authLoading } = useAuth();
  const navigate = useNavigate();

  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [category, setCategory] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (!authLoading && !user) {
      navigate('/auth');
    }
  }, [user, authLoading, navigate]);

  const validateForm = () => {
    const result = announcementSchema.safeParse({ title, content, category });
    
    if (!result.success) {
      const fieldErrors: Record<string, string> = {};
      result.error.errors.forEach((err) => {
        if (err.path[0]) {
          fieldErrors[err.path[0] as string] = err.message;
        }
      });
      setErrors(fieldErrors);
      return false;
    }
    
    setErrors({});
    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!user) return;
    if (!validateForm()) {
      toast.error('Please fix the errors before submitting.');
      return;
    }

    setSubmitting(true);

    const { error } = await supabase.from('announcements').insert({
      user_id: user.id,
      title: title.trim(),
      content: content.trim(),
      category,
      status: 'pending',
    });

    if (error) {
      console.error('Error creating announcement:', error);
      toast.error('Failed to submit announcement. Please try again.');
    } else {
      toast.success('Announcement submitted for review!');
      navigate('/announcements');
    }

    setSubmitting(false);
  };

  if (authLoading) {
    return (
      <Layout>
        <div className="flex items-center justify-center min-h-[60vh]">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="container px-4 md:px-8 py-8 md:py-12">
        <div className="max-w-2xl mx-auto">
          <Button variant="ghost" asChild className="mb-6">
            <Link to="/announcements">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Announcements
            </Link>
          </Button>

          <div className="mb-8">
            <h1 className="font-serif text-3xl md:text-4xl font-semibold text-foreground mb-2">
              Post an Announcement
            </h1>
            <p className="text-muted-foreground">
              Share updates, collaboration opportunities, or requests with the community.
            </p>
          </div>

          <Card className="elevated-card mb-6">
            <CardContent className="pt-6">
              <div className="flex items-start gap-3 p-4 rounded-lg bg-sage-light/50 border border-primary/20">
                <Info className="h-5 w-5 text-primary shrink-0 mt-0.5" />
                <div className="text-sm text-muted-foreground">
                  <p className="font-medium text-foreground mb-1">Review Process</p>
                  <p>
                    All announcements are reviewed by admins before being published. This typically
                    takes 24-48 hours.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <form onSubmit={handleSubmit}>
            <Card className="elevated-card">
              <CardHeader>
                <CardTitle>Announcement Details</CardTitle>
                <CardDescription>
                  Fill in the details of your announcement
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="category">Category *</Label>
                  <Select value={category} onValueChange={setCategory}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select a category" />
                    </SelectTrigger>
                    <SelectContent>
                      {categories.map((cat) => (
                        <SelectItem key={cat.value} value={cat.value}>
                          {cat.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {errors.category && (
                    <p className="text-sm text-destructive">{errors.category}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="title">Title *</Label>
                  <Input
                    id="title"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="A clear, descriptive title"
                  />
                  {errors.title && <p className="text-sm text-destructive">{errors.title}</p>}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="content">Content *</Label>
                  <Textarea
                    id="content"
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                    placeholder="Provide details about your announcement, what you're looking for, or how others can get involved..."
                    rows={8}
                  />
                  <div className="flex justify-between text-sm text-muted-foreground">
                    <span>{errors.content && <span className="text-destructive">{errors.content}</span>}</span>
                    <span>{content.length}/2000</span>
                  </div>
                </div>

                <Button type="submit" size="lg" className="w-full" disabled={submitting}>
                  {submitting ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <>
                      <Send className="h-4 w-4 mr-2" />
                      Submit for Review
                    </>
                  )}
                </Button>
              </CardContent>
            </Card>
          </form>
        </div>
      </div>
    </Layout>
  );
};

export default NewAnnouncement;
