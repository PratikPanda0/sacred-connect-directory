import { useState, useEffect } from 'react';
import { useNavigate, useSearchParams, Link } from 'react-router-dom';
import { useAuth } from '@/lib/auth-context';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { Card, CardContent } from '@/components/ui/card';
import { Layout } from '@/components/layout/Layout';
import { toast } from 'sonner';
import { z } from 'zod';
import { Globe, Mail, Lock, User, ArrowRight, Loader2 } from 'lucide-react';

const signInSchema = z.object({
  email: z.string().trim().email('Please enter a valid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
});

const signUpSchema = signInSchema.extend({
  name: z.string().trim().min(2, 'Name must be at least 2 characters').max(100, 'Name is too long'),
  agreeDiksa: z.literal(true, {
    errorMap: () => ({ message: 'You must accept Srila Prabhupada as your diksa guru' }),
  }),
  agreeBooks: z.literal(true, {
    errorMap: () => ({ message: 'You must agree to follow pre-1978 books' }),
  }),
  agreeGuidelines: z.literal(true, {
    errorMap: () => ({ message: 'You must agree to the community guidelines' }),
  }),
});

const Auth = () => {
  const [searchParams] = useSearchParams();
  const [isSignUp, setIsSignUp] = useState(searchParams.get('mode') === 'signup');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [agreeDiksa, setAgreeDiksa] = useState(false);
  const [agreeBooks, setAgreeBooks] = useState(false);
  const [agreeGuidelines, setAgreeGuidelines] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const { signIn, signUp, user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (user) {
      navigate('/');
    }
  }, [user, navigate]);

  useEffect(() => {
    setIsSignUp(searchParams.get('mode') === 'signup');
  }, [searchParams]);

  const validateForm = () => {
    const schema = isSignUp ? signUpSchema : signInSchema;
    const data = isSignUp 
      ? { email, password, name, agreeDiksa, agreeBooks, agreeGuidelines } 
      : { email, password };
    
    const result = schema.safeParse(data);
    
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
    
    if (!validateForm()) {
      return;
    }

    setLoading(true);

    try {
      if (isSignUp) {
        const { error } = await signUp(email, password, name);
        if (error) {
          if (error.message.includes('already registered')) {
            toast.error('This email is already registered. Please sign in instead.');
          } else {
            toast.error(error.message);
          }
        } else {
          toast.success('Account created successfully! Welcome to the community.');
          navigate('/profile');
        }
      } else {
        const { error } = await signIn(email, password);
        if (error) {
          if (error.message.includes('Invalid login')) {
            toast.error('Invalid email or password. Please try again.');
          } else {
            toast.error(error.message);
          }
        } else {
          toast.success('Welcome back!');
          navigate('/');
        }
      }
    } catch (error) {
      toast.error('An unexpected error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Layout>
      <div className="min-h-[calc(100vh-12rem)] flex items-center justify-center py-12 px-4">
        <div className="w-full max-w-md animate-scale-in">
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary text-primary-foreground mb-4">
              <Globe className="h-8 w-8" />
            </div>
            <h1 className="font-serif text-3xl font-semibold text-foreground">
              {isSignUp ? 'Join the Community' : 'Welcome Back'}
            </h1>
            <p className="text-muted-foreground mt-2">
              {isSignUp
                ? 'Create your profile and connect with devotees worldwide'
                : 'Sign in to access your profile and the directory'}
            </p>
          </div>

          <Card className="elevated-card">
            <CardContent className="pt-6">
              <form onSubmit={handleSubmit} className="space-y-4">
                {isSignUp && (
                  <div className="space-y-2">
                    <Label htmlFor="name" className="text-foreground">
                      Full Name
                    </Label>
                    <div className="relative">
                      <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      <Input
                        id="name"
                        type="text"
                        placeholder="Your full name"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        className="pl-10"
                      />
                    </div>
                    {errors.name && (
                      <p className="text-sm text-destructive">{errors.name}</p>
                    )}
                  </div>
                )}

                <div className="space-y-2">
                  <Label htmlFor="email" className="text-foreground">
                    Email
                  </Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="email"
                      type="email"
                      placeholder="your@email.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                  {errors.email && (
                    <p className="text-sm text-destructive">{errors.email}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="password" className="text-foreground">
                    Password
                  </Label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="password"
                      type="password"
                      placeholder="••••••••"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                  {errors.password && (
                    <p className="text-sm text-destructive">{errors.password}</p>
                  )}
                </div>

                {/* Agreement Checkboxes for Sign Up */}
                {isSignUp && (
                  <div className="space-y-4 pt-4 border-t border-border">
                    <p className="text-sm font-medium text-foreground">
                      To join this community, you must agree to the following:
                    </p>
                    
                    <div className="space-y-3">
                      <div className="flex items-start space-x-3">
                        <Checkbox
                          id="agreeDiksa"
                          checked={agreeDiksa}
                          onCheckedChange={(checked) => setAgreeDiksa(checked === true)}
                          className="mt-0.5"
                        />
                        <div className="grid gap-1.5 leading-none">
                          <label
                            htmlFor="agreeDiksa"
                            className="text-sm font-medium leading-relaxed cursor-pointer"
                          >
                            I accept His Divine Grace A.C. Bhaktivedanta Swami Prabhupada as my diksa guru
                          </label>
                          {errors.agreeDiksa && (
                            <p className="text-sm text-destructive">{errors.agreeDiksa}</p>
                          )}
                        </div>
                      </div>

                      <div className="flex items-start space-x-3">
                        <Checkbox
                          id="agreeBooks"
                          checked={agreeBooks}
                          onCheckedChange={(checked) => setAgreeBooks(checked === true)}
                          className="mt-0.5"
                        />
                        <div className="grid gap-1.5 leading-none">
                          <label
                            htmlFor="agreeBooks"
                            className="text-sm font-medium leading-relaxed cursor-pointer"
                          >
                            I follow the teachings from original, pre-1978 books only
                          </label>
                          {errors.agreeBooks && (
                            <p className="text-sm text-destructive">{errors.agreeBooks}</p>
                          )}
                        </div>
                      </div>

                      <div className="flex items-start space-x-3">
                        <Checkbox
                          id="agreeGuidelines"
                          checked={agreeGuidelines}
                          onCheckedChange={(checked) => setAgreeGuidelines(checked === true)}
                          className="mt-0.5"
                        />
                        <div className="grid gap-1.5 leading-none">
                          <label
                            htmlFor="agreeGuidelines"
                            className="text-sm font-medium leading-relaxed cursor-pointer"
                          >
                            I agree to the{' '}
                            <Link
                              to="/guidelines"
                              className="text-primary hover:underline"
                              target="_blank"
                            >
                              community guidelines
                            </Link>
                          </label>
                          {errors.agreeGuidelines && (
                            <p className="text-sm text-destructive">{errors.agreeGuidelines}</p>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                <Button
                  type="submit"
                  className="w-full"
                  size="lg"
                  disabled={loading}
                >
                  {loading ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <>
                      {isSignUp ? 'Create Account' : 'Sign In'}
                      <ArrowRight className="h-4 w-4 ml-1" />
                    </>
                  )}
                </Button>
              </form>

              <div className="mt-6 text-center">
                <p className="text-sm text-muted-foreground">
                  {isSignUp ? 'Already have an account?' : "Don't have an account?"}{' '}
                  <button
                    type="button"
                    onClick={() => setIsSignUp(!isSignUp)}
                    className="text-primary hover:underline font-medium"
                  >
                    {isSignUp ? 'Sign in' : 'Sign up'}
                  </button>
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </Layout>
  );
};

export default Auth;
