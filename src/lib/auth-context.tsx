import React, { createContext, useContext, useEffect, useState } from 'react';
import { User, Session } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';

// Role IDs from the roles table
const ROLE_IDS = {
  BASIC: 1,
  DEVOTEE: 2,
  ADMIN: 3,
} as const;

interface AuthContextType {
  user: User | null;
  session: Session | null;
  loading: boolean;
  roleId: number | null;
  hasProfile: boolean;
  signUp: (email: string, password: string, name: string) => Promise<{ error: Error | null }>;
  signIn: (email: string, password: string) => Promise<{ error: Error | null }>;
  signOut: () => Promise<void>;
  refreshProfile: () => Promise<void>;
  isAdmin: boolean;
  isDevotee: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);
  const [roleId, setRoleId] = useState<number | null>(null);
  const [hasProfile, setHasProfile] = useState(false);

  const fetchUserProfile = async (userId: string) => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('role_id')
        .eq('user_id', userId)
        .maybeSingle();

      if (error) {
        console.error('Error fetching user profile:', error);
        return { roleId: null, exists: false };
      }

      return { 
        roleId: data?.role_id as number | null, 
        exists: !!data 
      };
    } catch (error) {
      console.error('Error fetching user profile:', error);
      return { roleId: null, exists: false };
    }
  };

  useEffect(() => {
    // Set up auth state listener FIRST
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        setSession(session);
        setUser(session?.user ?? null);
        
        // Defer profile fetching to avoid deadlock
        if (session?.user) {
          setTimeout(() => {
            fetchUserProfile(session.user.id).then(({ roleId, exists }) => {
              setRoleId(roleId);
              setHasProfile(exists);
            });
          }, 0);
        } else {
          setRoleId(null);
          setHasProfile(false);
        }
        
        setLoading(false);
      }
    );

    // THEN check for existing session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setUser(session?.user ?? null);
      
      if (session?.user) {
        fetchUserProfile(session.user.id).then(({ roleId, exists }) => {
          setRoleId(roleId);
          setHasProfile(exists);
        });
      }
      
      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  const signUp = async (email: string, password: string, name: string) => {
    const redirectUrl = `${window.location.origin}/`;
    
    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo: redirectUrl,
        data: {
          name,
        },
      },
    });

    return { error: error as Error | null };
  };

  const signIn = async (email: string, password: string) => {
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    return { error: error as Error | null };
  };

  const signOut = async () => {
    await supabase.auth.signOut();
    setRoleId(null);
    setHasProfile(false);
  };

  const refreshProfile = async () => {
    if (user) {
      const { roleId, exists } = await fetchUserProfile(user.id);
      setRoleId(roleId);
      setHasProfile(exists);
    }
  };

  const isAdmin = roleId === ROLE_IDS.ADMIN;
  const isDevotee = roleId === ROLE_IDS.DEVOTEE || roleId === ROLE_IDS.ADMIN;

  return (
    <AuthContext.Provider
      value={{
        user,
        session,
        loading,
        roleId,
        hasProfile,
        signUp,
        signIn,
        signOut,
        refreshProfile,
        isAdmin,
        isDevotee,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
