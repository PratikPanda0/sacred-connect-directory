import { useState, useEffect } from 'react';
import { Layout } from '@/components/layout/Layout';
import { MemberCard } from '@/components/directory/MemberCard';
import { CountrySelector } from '@/components/directory/CountrySelector';
import { Input } from '@/components/ui/input';
import { supabase } from '@/integrations/supabase/client';
import { Search, Users, MapPin, Loader2 } from 'lucide-react';

// Role IDs from the roles table
const ROLE_IDS = {
  BASIC: 1,
  DEVOTEE: 2,
  ADMIN: 3,
} as const;

interface Profile {
  id: string;
  user_id: string;
  name: string;
  city: string | null;
  country: string;
  email: string | null;
  phone: string | null;
  social_links: unknown;
  mission_description: string | null;
  avatar_url: string | null;
  role_id: number;
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
    // Extract unique location labels (city or country if city is null)
    const uniqueLocations = [...new Set(profiles.map((p) => p.city || p.country))].sort();
    setCities(uniqueLocations);
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

    setProfiles(profilesData || []);
    setLoading(false);
  };

  const filteredProfiles = profiles.filter((profile) => {
    const query = searchQuery.toLowerCase();
    const locationLabel = profile.city || profile.country;
    return (
      (profile.name?.toLowerCase() || '').includes(query) ||
      locationLabel.toLowerCase().includes(query)
    );
  });

  // Group by country first, then by city within country
  const groupedByCountryAndCity = filteredProfiles.reduce<Record<string, Record<string, Profile[]>>>(
    (acc, profile) => {
      const country = profile.country;
      const city = profile.city || country; // Use country as label if no city
      
      if (!acc[country]) {
        acc[country] = {};
      }
      if (!acc[country][city]) {
        acc[country][city] = [];
      }
      acc[country][city].push(profile);
      return acc;
    },
    {}
  );

  // Sort countries alphabetically
  const sortedCountries = Object.keys(groupedByCountryAndCity).sort();

  // For each country, sort cities with country-name-group first (no city), then alphabetically
  const getSortedCitiesForCountry = (country: string) => {
    const cities = Object.keys(groupedByCountryAndCity[country]);
    return cities.sort((a, b) => {
      // Country name (no city) comes first
      if (a === country) return -1;
      if (b === country) return 1;
      return a.localeCompare(b);
    });
  };

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
          ) : sortedCountries.length === 0 ? (
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
            <div className="space-y-16">
              {sortedCountries.map((country) => (
                <div key={country} className="animate-fade-in">
                  {/* Country Header - only show if viewing all countries */}
                  {selectedCountry === 'all' && (
                    <div className="mb-8">
                      <h2 className="font-serif text-3xl font-semibold text-foreground border-b border-border pb-3">
                        {country}
                      </h2>
                    </div>
                  )}
                  
                  {/* Cities within the country */}
                  <div className="space-y-10">
                    {getSortedCitiesForCountry(country).map((city) => (
                      <div key={city} className="animate-fade-in">
                        <div className="flex items-center gap-2 mb-6">
                          <MapPin className="h-5 w-5 text-primary" />
                          <h3 className="font-serif text-2xl font-semibold text-foreground">
                            {city}
                          </h3>
                          <span className="text-sm text-muted-foreground ml-2">
                            ({groupedByCountryAndCity[country][city].length} member{groupedByCountryAndCity[country][city].length !== 1 ? 's' : ''})
                          </span>
                        </div>
                        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
                          {groupedByCountryAndCity[country][city].map((profile) => (
                            <MemberCard
                              key={profile.id}
                              name={profile.name || 'Anonymous'}
                              city={profile.city || profile.country}
                              country={profile.country}
                              email={profile.email || undefined}
                              phone={profile.phone || undefined}
                              socialLinks={profile.social_links as Record<string, string> || undefined}
                              missionDescription={profile.mission_description || undefined}
                              roleId={profile.role_id}
                              avatarUrl={profile.avatar_url || undefined}
                            />
                          ))}
                        </div>
                      </div>
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
