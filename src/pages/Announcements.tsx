import { useState, useEffect, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { Layout } from '@/components/layout/Layout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useAuth } from '@/lib/auth-context';
import { supabase } from '@/integrations/supabase/client';
import { Megaphone, Plus, Calendar, User, Loader2, Search, ArrowUpDown } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';

interface Announcement {
  id: string;
  title: string;
  content: string;
  category: string;
  created_at: string;
  profiles?: {
    name: string;
    city: string | null;
    country: string;
  };
}

const categoryColors: Record<string, string> = {
  collaboration: 'bg-primary/10 text-primary',
  relocation: 'bg-gold/20 text-earth',
  visiting: 'bg-sage-light text-sage-dark',
  project: 'bg-secondary text-secondary-foreground',
  other: 'bg-muted text-muted-foreground',
};

type SortOrder = 'latest' | 'oldest';

const Announcements = () => {
  const { user, isDevotee } = useAuth();
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [sortOrder, setSortOrder] = useState<SortOrder>('latest');

  useEffect(() => {
    fetchAnnouncements();
  }, []);

  const fetchAnnouncements = async () => {
    const { data, error } = await supabase
      .from('announcements')
      .select('id, title, content, category, created_at, user_id')
      .eq('status', 'approved')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching announcements:', error);
      setLoading(false);
      return;
    }

    // Fetch profiles for the announcements
    const userIds = data?.map(a => a.user_id) || [];
    if (userIds.length > 0) {
      const { data: profilesData } = await supabase
        .from('profiles')
        .select('user_id, name, city, country')
        .in('user_id', userIds);

      const profilesMap = new Map(profilesData?.map(p => [p.user_id, { name: p.name, city: p.city, country: p.country }]) || []);

      const announcementsWithProfiles = (data || []).map(a => ({
        ...a,
        profiles: profilesMap.get(a.user_id),
      }));

      setAnnouncements(announcementsWithProfiles);
    } else {
      setAnnouncements([]);
    }
    setLoading(false);
  };

  // Filter and sort announcements
  const filteredAndSortedAnnouncements = useMemo(() => {
    let result = [...announcements];

    // Filter by search query
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      result = result.filter((a) => {
        const titleMatch = a.title.toLowerCase().includes(query);
        const posterMatch = a.profiles?.name?.toLowerCase().includes(query) || false;
        return titleMatch || posterMatch;
      });
    }

    // Sort by date
    result.sort((a, b) => {
      const dateA = new Date(a.created_at).getTime();
      const dateB = new Date(b.created_at).getTime();
      return sortOrder === 'latest' ? dateB - dateA : dateA - dateB;
    });

    return result;
  }, [announcements, searchQuery, sortOrder]);

  return (
    <Layout>
      {/* Hero Section */}
      <section className="relative py-16 md:py-20 gradient-subtle border-b border-border/50">
        <div className="container px-4 md:px-8">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
            <div className="max-w-2xl">
              <h1 className="font-serif text-4xl md:text-5xl font-semibold text-foreground mb-4">
                Announcements
              </h1>
              <p className="text-lg text-muted-foreground">
                Discover collaboration opportunities, project updates, and community news from our members.
              </p>
            </div>
            {isDevotee && (
              <Button asChild size="lg">
                <Link to="/announcements/new">
                  <Plus className="h-4 w-4 mr-2" />
                  Post Announcement
                </Link>
              </Button>
            )}
          </div>
        </div>
      </section>

      {/* Filters */}
      <section className="sticky top-16 z-40 bg-background/95 backdrop-blur border-b border-border/50 py-4">
        <div className="container px-4 md:px-8">
          <div className="flex flex-col sm:flex-row gap-4 max-w-3xl mx-auto">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                type="text"
                placeholder="Search by title or poster name..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 bg-card"
              />
            </div>
            <Select value={sortOrder} onValueChange={(value: SortOrder) => setSortOrder(value)}>
              <SelectTrigger className="w-full sm:w-48 bg-card">
                <ArrowUpDown className="h-4 w-4 mr-2" />
                <SelectValue placeholder="Sort order" />
              </SelectTrigger>
              <SelectContent className="bg-popover">
                <SelectItem value="latest">Latest to Oldest</SelectItem>
                <SelectItem value="oldest">Oldest to Latest</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </section>

      {/* Announcements List */}
      <section className="py-8 md:py-12">
        <div className="container px-4 md:px-8">
          {loading ? (
            <div className="flex items-center justify-center py-20">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
          ) : filteredAndSortedAnnouncements.length === 0 ? (
            <div className="text-center py-20">
              <Megaphone className="h-12 w-12 text-muted-foreground/50 mx-auto mb-4" />
              <h3 className="font-serif text-xl font-medium text-foreground mb-2">
                {searchQuery ? 'No matching announcements' : 'No announcements yet'}
              </h3>
              <p className="text-muted-foreground mb-6">
                {searchQuery
                  ? 'Try adjusting your search terms.'
                  : 'Be the first to share something with the community!'}
              </p>
              {!searchQuery && isDevotee && (
                <Button asChild>
                  <Link to="/announcements/new">
                    <Plus className="h-4 w-4 mr-2" />
                    Post Announcement
                  </Link>
                </Button>
              )}
              {!searchQuery && !user && (
                <Button asChild>
                  <Link to="/auth?mode=signup">Join to Post</Link>
                </Button>
              )}
            </div>
          ) : (
            <div className="grid gap-6 max-w-3xl mx-auto">
              {filteredAndSortedAnnouncements.map((announcement, index) => (
                <Card
                  key={announcement.id}
                  className="elevated-card animate-slide-up"
                  style={{ animationDelay: `${index * 0.05}s` }}
                >
                  <CardHeader className="pb-3">
                    <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3">
                      <div>
                        <CardTitle className="font-serif text-xl text-foreground">
                          {announcement.title}
                        </CardTitle>
                        {announcement.profiles && (
                          <div className="flex items-center gap-2 mt-2 text-sm text-muted-foreground">
                            <User className="h-4 w-4" />
                            <span>
                              {announcement.profiles.name} • {announcement.profiles.city},{' '}
                              {announcement.profiles.country}
                            </span>
                          </div>
                        )}
                      </div>
                      <Badge
                        className={`${
                          categoryColors[announcement.category] || categoryColors.other
                        } capitalize shrink-0`}
                      >
                        {announcement.category}
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground leading-relaxed whitespace-pre-wrap">
                      {announcement.content}
                    </p>
                    <div className="flex items-center gap-1 mt-4 text-xs text-muted-foreground">
                      <Calendar className="h-3 w-3" />
                      <span>
                        {formatDistanceToNow(new Date(announcement.created_at), {
                          addSuffix: true,
                        })}
                      </span>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      </section>
    </Layout>
  );
};

export default Announcements;
