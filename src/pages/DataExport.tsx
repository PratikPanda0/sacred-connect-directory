import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/lib/auth-context';
import { Layout } from '@/components/layout/Layout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { supabase } from '@/integrations/supabase/client';
import { Download, Loader2, Database, Users, Globe, Shield, Megaphone, CheckCircle } from 'lucide-react';
import { toast } from 'sonner';

interface ExportStatus {
  countries: boolean;
  roles: boolean;
  profiles: boolean;
  announcements: boolean;
}

const DataExport = () => {
  const { isAdmin, loading: authLoading } = useAuth();
  const navigate = useNavigate();
  const [exporting, setExporting] = useState<string | null>(null);
  const [exported, setExported] = useState<ExportStatus>({
    countries: false,
    roles: false,
    profiles: false,
    announcements: false,
  });

  if (authLoading) {
    return (
      <Layout>
        <div className="flex items-center justify-center min-h-[50vh]">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      </Layout>
    );
  }

  if (!isAdmin) {
    navigate('/');
    return null;
  }

  const downloadJSON = (data: any, filename: string) => {
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const exportCountries = async () => {
    setExporting('countries');
    try {
      const { data, error } = await supabase.from('countries').select('*').order('name');
      if (error) throw error;
      downloadJSON(data, 'countries_export.json');
      setExported(prev => ({ ...prev, countries: true }));
      toast.success(`Exported ${data.length} countries`);
    } catch (error) {
      console.error('Error exporting countries:', error);
      toast.error('Failed to export countries');
    } finally {
      setExporting(null);
    }
  };

  const exportRoles = async () => {
    setExporting('roles');
    try {
      const { data, error } = await supabase.from('roles').select('*').order('id');
      if (error) throw error;
      downloadJSON(data, 'roles_export.json');
      setExported(prev => ({ ...prev, roles: true }));
      toast.success(`Exported ${data.length} roles`);
    } catch (error) {
      console.error('Error exporting roles:', error);
      toast.error('Failed to export roles');
    } finally {
      setExporting(null);
    }
  };

  const exportProfiles = async () => {
    setExporting('profiles');
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .order('created_at', { ascending: false });
      if (error) throw error;
      downloadJSON(data, 'profiles_export.json');
      setExported(prev => ({ ...prev, profiles: true }));
      toast.success(`Exported ${data.length} profiles`);
    } catch (error) {
      console.error('Error exporting profiles:', error);
      toast.error('Failed to export profiles');
    } finally {
      setExporting(null);
    }
  };

  const exportAnnouncements = async () => {
    setExporting('announcements');
    try {
      const { data, error } = await supabase
        .from('announcements')
        .select('*')
        .order('created_at', { ascending: false });
      if (error) throw error;
      downloadJSON(data, 'announcements_export.json');
      setExported(prev => ({ ...prev, announcements: true }));
      toast.success(`Exported ${data.length} announcements`);
    } catch (error) {
      console.error('Error exporting announcements:', error);
      toast.error('Failed to export announcements');
    } finally {
      setExporting(null);
    }
  };

  const exportAll = async () => {
    setExporting('all');
    try {
      const [countriesRes, rolesRes, profilesRes, announcementsRes] = await Promise.all([
        supabase.from('countries').select('*').order('name'),
        supabase.from('roles').select('*').order('id'),
        supabase.from('profiles').select('*').order('created_at', { ascending: false }),
        supabase.from('announcements').select('*').order('created_at', { ascending: false }),
      ]);

      const allData = {
        exportedAt: new Date().toISOString(),
        countries: countriesRes.data || [],
        roles: rolesRes.data || [],
        profiles: profilesRes.data || [],
        announcements: announcementsRes.data || [],
      };

      downloadJSON(allData, 'full_database_export.json');
      setExported({ countries: true, roles: true, profiles: true, announcements: true });
      toast.success('Exported all data successfully');
    } catch (error) {
      console.error('Error exporting all data:', error);
      toast.error('Failed to export all data');
    } finally {
      setExporting(null);
    }
  };

  const exportItems = [
    {
      key: 'countries',
      title: 'Countries',
      description: 'All countries in the system',
      icon: Globe,
      action: exportCountries,
    },
    {
      key: 'roles',
      title: 'Roles',
      description: 'User role definitions',
      icon: Shield,
      action: exportRoles,
    },
    {
      key: 'profiles',
      title: 'Profiles',
      description: 'All user profiles with their data',
      icon: Users,
      action: exportProfiles,
    },
    {
      key: 'announcements',
      title: 'Announcements',
      description: 'All announcements (pending, approved, rejected)',
      icon: Megaphone,
      action: exportAnnouncements,
    },
  ];

  return (
    <Layout>
      <div className="container mx-auto py-8 px-4">
        <div className="max-w-4xl mx-auto">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-foreground mb-2">Data Export</h1>
            <p className="text-muted-foreground">
              Export your database tables as JSON files for SQL Server migration.
            </p>
          </div>

          <Card className="mb-6">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Database className="h-5 w-5" />
                Export All Data
              </CardTitle>
              <CardDescription>
                Download a single JSON file containing all tables for complete migration.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button onClick={exportAll} disabled={exporting !== null} className="w-full sm:w-auto">
                {exporting === 'all' ? (
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                ) : (
                  <Download className="h-4 w-4 mr-2" />
                )}
                Export Complete Database
              </Button>
            </CardContent>
          </Card>

          <div className="grid gap-4 md:grid-cols-2">
            {exportItems.map((item) => (
              <Card key={item.key}>
                <CardHeader className="pb-3">
                  <CardTitle className="text-lg flex items-center justify-between">
                    <span className="flex items-center gap-2">
                      <item.icon className="h-4 w-4" />
                      {item.title}
                    </span>
                    {exported[item.key as keyof ExportStatus] && (
                      <CheckCircle className="h-4 w-4 text-green-600" />
                    )}
                  </CardTitle>
                  <CardDescription>{item.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={item.action}
                    disabled={exporting !== null}
                  >
                    {exporting === item.key ? (
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    ) : (
                      <Download className="h-4 w-4 mr-2" />
                    )}
                    Export {item.title}
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>

          <Card className="mt-6 border-amber-200 bg-amber-50">
            <CardContent className="pt-6">
              <p className="text-sm text-amber-800">
                <strong>Note:</strong> Avatar files are stored separately. You'll need to download them
                from your storage bucket and re-upload to your new file storage solution (Azure Blob, S3, etc.).
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </Layout>
  );
};

export default DataExport;
