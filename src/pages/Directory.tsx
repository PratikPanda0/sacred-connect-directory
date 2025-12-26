import { useState, useEffect } from 'react';
import { Layout } from '@/components/layout/Layout';
import { MemberCard } from '@/components/directory/MemberCard';
import { CountrySelector } from '@/components/directory/CountrySelector';
import { Input } from '@/components/ui/input';
import { supabase } from '@/integrations/supabase/client';
import { Search, Users, MapPin, Loader2 } from 'lucide-react';

interface Profile {
  id: string;
  user_id: string;
  name: string;
  city: string;
  country: string;
  email: string | null;
  phone: string | null;
  social_links: unknown;
  mission_description: string | null;
  role?: 'admin' | 'member' | 'viewer';
}

const Directory = () => {
  const [profiles, setProfiles] = useState<Profile[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCountry, setSelectedCountry] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [cities, setCities] = useState<string[]>([]);

  useEffect(() => {
    fetchProfiles();
  }, [selectedCountry]);

  useEffect(() => {
    // Extract unique cities from profiles
    const uniqueCities = [...new Set(profiles.map((p) => p.city))].sort();
    setCities(uniqueCities);
  }, [profiles]);

  const fetchProfiles = async () => {
    setLoading(true);
    
    let query = supabase
      .from('profiles')
      .select('*')
      .eq('is_public', true)
      .order('city');

    if (selectedCountry !== 'all') {
      query = query.eq('country', selectedCountry);
    }

    const { data: profilesData, error } = await query;

    if (error) {
      console.error('Error fetching profiles:', error);
      setLoading(false);
      return;
    }

    // Fetch roles for all users
    const userIds = (profilesData || []).map(p => p.user_id);
    const { data: rolesData } = await supabase
      .from('user_roles')
      .select('user_id, role')
      .in('user_id', userIds);

    // Map roles to profiles
    const rolesMap = new Map(rolesData?.map(r => [r.user_id, r.role]) || []);
    const profilesWithRoles = (profilesData || []).map(p => ({
      ...p,
      role: rolesMap.get(p.user_id) || 'member'
    }));

    setProfiles(profilesWithRoles);
    setLoading(false);
  };

  const filteredProfiles = profiles.filter((profile) => {
    const query = searchQuery.toLowerCase();
    return (
      profile.name.toLowerCase().includes(query) ||
      profile.city.toLowerCase().includes(query)
    );
  });

  const groupedByCity = filteredProfiles.reduce<Record<string, Profile[]>>(
    (acc, profile) => {
      const city = profile.city;
      if (!acc[city]) {
        acc[city] = [];
      }
      acc[city].push(profile);
      return acc;
    },
    {}
  );

  const sortedCities = Object.keys(groupedByCity).sort();

  return (
    <Layout>
      {/* Hero Section */}
      <section className="relative py-16 md:py-20 gradient-subtle border-b border-border/50">
        <div className="container px-4 md:px-8">
          <div className="max-w-2xl">
            <h1 className="font-serif text-4xl md:text-5xl font-semibold text-foreground mb-4">
              Global Directory
            </h1>
            <p className="text-lg text-muted-foreground">
              Explore our worldwide network of verified members. Find connections by country and city.
            </p>
          </div>
        </div>
      </section>

      {/* Filters */}
      <section className="sticky top-16 z-40 bg-background/95 backdrop-blur border-b border-border/50 py-4">
        <div className="container px-4 md:px-8">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="w-full sm:w-64">
              <CountrySelector
                value={selectedCountry}
                onChange={setSelectedCountry}
                placeholder="Filter by country"
              />
            </div>
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                type="text"
                placeholder="Search by name or city..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 bg-card"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Results */}
      <section className="py-8 md:py-12">
        <div className="container px-4 md:px-8">
          {loading ? (
            <div className="flex items-center justify-center py-20">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
          ) : sortedCities.length === 0 ? (
            <div className="text-center py-20">
              <Users className="h-12 w-12 text-muted-foreground/50 mx-auto mb-4" />
              <h3 className="font-serif text-xl font-medium text-foreground mb-2">
                No members found
              </h3>
              <p className="text-muted-foreground">
                {selectedCountry !== 'all'
                  ? `No members in ${selectedCountry} yet.`
                  : 'Be the first to join our community!'}
              </p>
            </div>
          ) : (
            <div className="space-y-12">
              {sortedCities.map((city) => (
                <div key={city} className="animate-fade-in">
                  <div className="flex items-center gap-2 mb-6">
                    <MapPin className="h-5 w-5 text-primary" />
                    <h2 className="font-serif text-2xl font-semibold text-foreground">
                      {city}
                    </h2>
                    <span className="text-sm text-muted-foreground ml-2">
                      ({groupedByCity[city].length} member{groupedByCity[city].length !== 1 ? 's' : ''})
                    </span>
                  </div>
                  <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {groupedByCity[city].map((profile) => (
                      <MemberCard
                        key={profile.id}
                        name={profile.name}
                        city={profile.city}
                        country={profile.country}
                        email={profile.email || undefined}
                        phone={profile.phone || undefined}
                        socialLinks={profile.social_links as Record<string, string> || undefined}
                        missionDescription={profile.mission_description || undefined}
                        role={profile.role}
                      />
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>
    </Layout>
  );
};

export default Directory;
