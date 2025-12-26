import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Layout } from '@/components/layout/Layout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { CountrySelector } from '@/components/directory/CountrySelector';
import { useAuth } from '@/lib/auth-context';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { z } from 'zod';
import { Save, Loader2, User, MapPin, Mail, Phone, Globe, Link as LinkIcon } from 'lucide-react';

const profileSchema = z.object({
  name: z.string().trim().min(2, 'Name is required').max(100),
  country: z.string().min(1, 'Country is required'),
  city: z.string().trim().min(1, 'City is required').max(100),
  email: z.string().email('Invalid email').optional().or(z.literal('')),
  phone: z.string().max(20).optional().or(z.literal('')),
  mission_description: z.string().max(1000).optional().or(z.literal('')),
  website: z.string().url('Invalid URL').optional().or(z.literal('')),
  linkedin: z.string().url('Invalid URL').optional().or(z.literal('')),
  facebook: z.string().url('Invalid URL').optional().or(z.literal('')),
  instagram: z.string().url('Invalid URL').optional().or(z.literal('')),
});

const Profile = () => {
  const { user, loading: authLoading } = useAuth();
  const navigate = useNavigate();
  
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [hasProfile, setHasProfile] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const [formData, setFormData] = useState({
    name: '',
    country: '',
    city: '',
    email: '',
    phone: '',
    mission_description: '',
    is_public: true,
    website: '',
    linkedin: '',
    facebook: '',
    instagram: '',
  });

  useEffect(() => {
    if (!authLoading && !user) {
      navigate('/auth');
    }
  }, [user, authLoading, navigate]);

  useEffect(() => {
    if (user) {
      fetchProfile();
    }
  }, [user]);

  const fetchProfile = async () => {
    if (!user) return;

    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('user_id', user.id)
      .maybeSingle();

    if (error) {
      console.error('Error fetching profile:', error);
    } else if (data) {
      setHasProfile(true);
      const socialLinks = data.social_links as Record<string, string> | null;
      setFormData({
        name: data.name || '',
        country: data.country || '',
        city: data.city || '',
        email: data.email || '',
        phone: data.phone || '',
        mission_description: data.mission_description || '',
        is_public: data.is_public ?? true,
        website: socialLinks?.website || '',
        linkedin: socialLinks?.linkedin || '',
        facebook: socialLinks?.facebook || '',
        instagram: socialLinks?.instagram || '',
      });
    } else {
      // Pre-fill name from auth metadata
      const userName = user.user_metadata?.name || '';
      setFormData((prev) => ({ ...prev, name: userName }));
    }
    setLoading(false);
  };

  const handleChange = (field: string, value: string | boolean) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[field];
        return newErrors;
      });
    }
  };

  const validateForm = () => {
    const result = profileSchema.safeParse(formData);
    
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
      toast.error('Please fix the errors before saving.');
      return;
    }

    setSaving(true);

    const socialLinks = {
      website: formData.website || null,
      linkedin: formData.linkedin || null,
      facebook: formData.facebook || null,
      instagram: formData.instagram || null,
    };

    const profileData = {
      user_id: user.id,
      name: formData.name.trim(),
      country: formData.country,
      city: formData.city.trim(),
      email: formData.email || null,
      phone: formData.phone || null,
      mission_description: formData.mission_description || null,
      is_public: formData.is_public,
      social_links: socialLinks,
    };

    let error;

    if (hasProfile) {
      const { error: updateError } = await supabase
        .from('profiles')
        .update(profileData)
        .eq('user_id', user.id);
      error = updateError;
    } else {
      const { error: insertError } = await supabase
        .from('profiles')
        .insert(profileData);
      error = insertError;
    }

    if (error) {
      console.error('Error saving profile:', error);
      toast.error('Failed to save profile. Please try again.');
    } else {
      setHasProfile(true);
      toast.success('Profile saved successfully!');
    }

    setSaving(false);
  };

  if (authLoading || loading) {
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
          <div className="mb-8">
            <h1 className="font-serif text-3xl md:text-4xl font-semibold text-foreground mb-2">
              {hasProfile ? 'Edit Your Profile' : 'Create Your Profile'}
            </h1>
            <p className="text-muted-foreground">
              {hasProfile
                ? 'Update your information to keep your profile current.'
                : 'Set up your profile to appear in the directory.'}
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Basic Info */}
            <Card className="elevated-card">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <User className="h-5 w-5 text-primary" />
                  Basic Information
                </CardTitle>
                <CardDescription>
                  Your name and location for the directory
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Full Name *</Label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) => handleChange('name', e.target.value)}
                    placeholder="Your full name"
                  />
                  {errors.name && <p className="text-sm text-destructive">{errors.name}</p>}
                </div>

                <div className="grid sm:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Country *</Label>
                    <CountrySelector
                      value={formData.country}
                      onChange={(value) => handleChange('country', value)}
                      placeholder="Select country"
                    />
                    {errors.country && <p className="text-sm text-destructive">{errors.country}</p>}
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="city">City *</Label>
                    <Input
                      id="city"
                      value={formData.city}
                      onChange={(e) => handleChange('city', e.target.value)}
                      placeholder="Your city"
                    />
                    {errors.city && <p className="text-sm text-destructive">{errors.city}</p>}
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Contact Info */}
            <Card className="elevated-card">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Mail className="h-5 w-5 text-primary" />
                  Contact Information
                </CardTitle>
                <CardDescription>
                  Optional contact details visible to other members
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid sm:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email"
                      type="email"
                      value={formData.email}
                      onChange={(e) => handleChange('email', e.target.value)}
                      placeholder="contact@example.com"
                    />
                    {errors.email && <p className="text-sm text-destructive">{errors.email}</p>}
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="phone">Phone</Label>
                    <Input
                      id="phone"
                      value={formData.phone}
                      onChange={(e) => handleChange('phone', e.target.value)}
                      placeholder="+1 234 567 8900"
                    />
                    {errors.phone && <p className="text-sm text-destructive">{errors.phone}</p>}
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Social Links */}
            <Card className="elevated-card">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <LinkIcon className="h-5 w-5 text-primary" />
                  Social Links
                </CardTitle>
                <CardDescription>
                  Add your website and social media profiles
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="website">Website</Label>
                  <Input
                    id="website"
                    value={formData.website}
                    onChange={(e) => handleChange('website', e.target.value)}
                    placeholder="https://yourwebsite.com"
                  />
                  {errors.website && <p className="text-sm text-destructive">{errors.website}</p>}
                </div>
                <div className="grid sm:grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="linkedin">LinkedIn</Label>
                    <Input
                      id="linkedin"
                      value={formData.linkedin}
                      onChange={(e) => handleChange('linkedin', e.target.value)}
                      placeholder="https://linkedin.com/in/..."
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="facebook">Facebook</Label>
                    <Input
                      id="facebook"
                      value={formData.facebook}
                      onChange={(e) => handleChange('facebook', e.target.value)}
                      placeholder="https://facebook.com/..."
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="instagram">Instagram</Label>
                    <Input
                      id="instagram"
                      value={formData.instagram}
                      onChange={(e) => handleChange('instagram', e.target.value)}
                      placeholder="https://instagram.com/..."
                    />
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Mission */}
            <Card className="elevated-card">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Globe className="h-5 w-5 text-primary" />
                  Your Mission
                </CardTitle>
                <CardDescription>
                  Describe your spiritual work, projects, or mission
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <Textarea
                  value={formData.mission_description}
                  onChange={(e) => handleChange('mission_description', e.target.value)}
                  placeholder="Share what you're working on, your spiritual practice, or how you'd like to connect with others..."
                  rows={5}
                />
                <p className="text-sm text-muted-foreground">
                  {formData.mission_description.length}/1000 characters
                </p>
              </CardContent>
            </Card>

            {/* Privacy */}
            <Card className="elevated-card">
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="is_public" className="text-base font-medium">
                      Public Profile
                    </Label>
                    <p className="text-sm text-muted-foreground">
                      Make your profile visible in the directory
                    </p>
                  </div>
                  <Switch
                    id="is_public"
                    checked={formData.is_public}
                    onCheckedChange={(checked) => handleChange('is_public', checked)}
                  />
                </div>
              </CardContent>
            </Card>

            <Button type="submit" size="lg" className="w-full" disabled={saving}>
              {saving ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <>
                  <Save className="h-4 w-4 mr-2" />
                  {hasProfile ? 'Save Changes' : 'Create Profile'}
                </>
              )}
            </Button>
          </form>
        </div>
      </div>
    </Layout>
  );
};

export default Profile;
