import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Layout } from '@/components/layout/Layout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useAuth } from '@/lib/auth-context';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import {
  Shield,
  Users,
  Megaphone,
  Check,
  X,
  Loader2,
  Trash2,
  Calendar,
  MapPin,
} from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';

interface Profile {
  id: string;
  user_id: string;
  name: string;
  city: string;
  country: string;
  email: string | null;
  is_public: boolean;
  created_at: string;
}

interface Announcement {
  id: string;
  user_id: string;
  title: string;
  content: string;
  category: string;
  status: string;
  created_at: string;
  profiles?: {
    name: string;
  };
}

const Admin = () => {
  const { user, isAdmin, loading: authLoading } = useAuth();
  const navigate = useNavigate();

  const [members, setMembers] = useState<Profile[]>([]);
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);
  const [loading, setLoading] = useState(true);
  const [processingId, setProcessingId] = useState<string | null>(null);

  useEffect(() => {
    if (!authLoading) {
      if (!user) {
        navigate('/auth');
      } else if (!isAdmin) {
        toast.error('Access denied. Admin privileges required.');
        navigate('/');
      }
    }
  }, [user, isAdmin, authLoading, navigate]);

  useEffect(() => {
    if (isAdmin) {
      fetchData();
    }
  }, [isAdmin]);

  const fetchData = async () => {
    setLoading(true);

    // Fetch all members
    const { data: membersData } = await supabase
      .from('profiles')
      .select('*')
      .order('created_at', { ascending: false });

    // Fetch all announcements
    const { data: announcementsData } = await supabase
      .from('announcements')
      .select('*')
      .order('created_at', { ascending: false });

    // Fetch profiles for announcements
    const userIds = announcementsData?.map(a => a.user_id) || [];
    const { data: profilesData } = await supabase
      .from('profiles')
      .select('user_id, name')
      .in('user_id', userIds);
    
    const profilesMap = new Map(profilesData?.map(p => [p.user_id, { name: p.name }]) || []);
    
    const announcementsWithProfiles = (announcementsData || []).map(a => ({
      ...a,
      profiles: profilesMap.get(a.user_id),
    }));

    setMembers(membersData || []);
    setAnnouncements(announcementsWithProfiles);
    setLoading(false);
  };

  const handleAnnouncementAction = async (id: string, status: 'approved' | 'rejected') => {
    setProcessingId(id);

    const { error } = await supabase
      .from('announcements')
      .update({ status })
      .eq('id', id);

    if (error) {
      toast.error('Failed to update announcement.');
    } else {
      toast.success(`Announcement ${status === 'approved' ? 'approved' : 'rejected'}.`);
      fetchData();
    }

    setProcessingId(null);
  };

  const handleDeleteMember = async (id: string) => {
    if (!confirm('Are you sure you want to delete this member profile?')) return;

    setProcessingId(id);

    const { error } = await supabase.from('profiles').delete().eq('id', id);

    if (error) {
      toast.error('Failed to delete member.');
    } else {
      toast.success('Member deleted successfully.');
      fetchData();
    }

    setProcessingId(null);
  };

  const handleDeleteAnnouncement = async (id: string) => {
    if (!confirm('Are you sure you want to delete this announcement?')) return;

    setProcessingId(id);

    const { error } = await supabase.from('announcements').delete().eq('id', id);

    if (error) {
      toast.error('Failed to delete announcement.');
    } else {
      toast.success('Announcement deleted.');
      fetchData();
    }

    setProcessingId(null);
  };

  const pendingAnnouncements = announcements.filter((a) => a.status === 'pending');

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
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <Shield className="h-8 w-8 text-primary" />
            <h1 className="font-serif text-3xl md:text-4xl font-semibold text-foreground">
              Admin Dashboard
            </h1>
          </div>
          <p className="text-muted-foreground">
            Manage members and moderate announcements
          </p>
        </div>

        {/* Stats */}
        <div className="grid sm:grid-cols-3 gap-4 mb-8">
          <Card className="glass-card">
            <CardContent className="pt-6">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-primary/10">
                  <Users className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <p className="text-2xl font-semibold">{members.length}</p>
                  <p className="text-sm text-muted-foreground">Total Members</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card className="glass-card">
            <CardContent className="pt-6">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-gold/20">
                  <Megaphone className="h-5 w-5 text-gold" />
                </div>
                <div>
                  <p className="text-2xl font-semibold">{pendingAnnouncements.length}</p>
                  <p className="text-sm text-muted-foreground">Pending Review</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card className="glass-card">
            <CardContent className="pt-6">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-sage-light">
                  <Check className="h-5 w-5 text-sage-dark" />
                </div>
                <div>
                  <p className="text-2xl font-semibold">
                    {announcements.filter((a) => a.status === 'approved').length}
                  </p>
                  <p className="text-sm text-muted-foreground">Published</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="announcements" className="space-y-6">
          <TabsList className="bg-muted/50">
            <TabsTrigger value="announcements" className="gap-2">
              <Megaphone className="h-4 w-4" />
              Announcements
              {pendingAnnouncements.length > 0 && (
                <Badge variant="destructive" className="ml-1">
                  {pendingAnnouncements.length}
                </Badge>
              )}
            </TabsTrigger>
            <TabsTrigger value="members" className="gap-2">
              <Users className="h-4 w-4" />
              Members
            </TabsTrigger>
          </TabsList>

          <TabsContent value="announcements" className="space-y-4">
            {announcements.length === 0 ? (
              <Card className="elevated-card">
                <CardContent className="py-12 text-center">
                  <Megaphone className="h-12 w-12 text-muted-foreground/50 mx-auto mb-4" />
                  <p className="text-muted-foreground">No announcements to review.</p>
                </CardContent>
              </Card>
            ) : (
              announcements.map((announcement) => (
                <Card key={announcement.id} className="elevated-card">
                  <CardHeader className="pb-3">
                    <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3">
                      <div>
                        <CardTitle className="text-lg">{announcement.title}</CardTitle>
                        <CardDescription className="flex items-center gap-2 mt-1">
                          <span>by {announcement.profiles?.name || 'Unknown'}</span>
                          <span>•</span>
                          <span className="capitalize">{announcement.category}</span>
                        </CardDescription>
                      </div>
                      <Badge
                        variant={
                          announcement.status === 'approved'
                            ? 'default'
                            : announcement.status === 'rejected'
                            ? 'destructive'
                            : 'secondary'
                        }
                        className="capitalize shrink-0"
                      >
                        {announcement.status}
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground mb-4 line-clamp-3">
                      {announcement.content}
                    </p>
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                      <span className="text-xs text-muted-foreground flex items-center gap-1">
                        <Calendar className="h-3 w-3" />
                        {formatDistanceToNow(new Date(announcement.created_at), {
                          addSuffix: true,
                        })}
                      </span>
                      <div className="flex gap-2">
                        {announcement.status === 'pending' && (
                          <>
                            <Button
                              size="sm"
                              onClick={() => handleAnnouncementAction(announcement.id, 'approved')}
                              disabled={processingId === announcement.id}
                            >
                              {processingId === announcement.id ? (
                                <Loader2 className="h-4 w-4 animate-spin" />
                              ) : (
                                <>
                                  <Check className="h-4 w-4 mr-1" />
                                  Approve
                                </>
                              )}
                            </Button>
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => handleAnnouncementAction(announcement.id, 'rejected')}
                              disabled={processingId === announcement.id}
                            >
                              <X className="h-4 w-4 mr-1" />
                              Reject
                            </Button>
                          </>
                        )}
                        <Button
                          size="sm"
                          variant="ghost"
                          className="text-destructive hover:text-destructive"
                          onClick={() => handleDeleteAnnouncement(announcement.id)}
                          disabled={processingId === announcement.id}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))
            )}
          </TabsContent>

          <TabsContent value="members" className="space-y-4">
            {members.length === 0 ? (
              <Card className="elevated-card">
                <CardContent className="py-12 text-center">
                  <Users className="h-12 w-12 text-muted-foreground/50 mx-auto mb-4" />
                  <p className="text-muted-foreground">No members yet.</p>
                </CardContent>
              </Card>
            ) : (
              <div className="grid gap-4">
                {members.map((member) => (
                  <Card key={member.id} className="elevated-card">
                    <CardContent className="py-4">
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                        <div>
                          <h3 className="font-medium text-foreground">{member.name}</h3>
                          <div className="flex items-center gap-2 text-sm text-muted-foreground mt-1">
                            <MapPin className="h-3 w-3" />
                            <span>
                              {member.city}, {member.country}
                            </span>
                            {member.email && (
                              <>
                                <span>•</span>
                                <span>{member.email}</span>
                              </>
                            )}
                          </div>
                        </div>
                        <div className="flex items-center gap-3">
                          <Badge variant={member.is_public ? 'default' : 'secondary'}>
                            {member.is_public ? 'Public' : 'Private'}
                          </Badge>
                          <Button
                            size="sm"
                            variant="ghost"
                            className="text-destructive hover:text-destructive"
                            onClick={() => handleDeleteMember(member.id)}
                            disabled={processingId === member.id}
                          >
                            {processingId === member.id ? (
                              <Loader2 className="h-4 w-4 animate-spin" />
                            ) : (
                              <Trash2 className="h-4 w-4" />
                            )}
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </Layout>
  );
};

export default Admin;
