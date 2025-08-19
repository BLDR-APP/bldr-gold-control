import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";

export function useUserRole() {
  const [role, setRole] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchUserRole() {
      try {
        console.log('🔍 useUserRole: Fetching user authentication status...');
        const { data: { user } } = await supabase.auth.getUser();
        console.log('👤 useUserRole: User found:', user ? `ID: ${user.id}` : 'No user');
        
        if (user) {
          console.log('🔍 useUserRole: Fetching user profile...');
          const { data: profile, error } = await supabase
            .from('profiles')
            .select('role')
            .eq('user_id', user.id)
            .single();

          if (error) {
            console.error('❌ useUserRole: Error fetching user role:', error);
            setRole('user');
          } else {
            console.log('✅ useUserRole: Profile found, role:', profile?.role || 'user');
            setRole(profile?.role || 'user');
          }
        } else {
          console.warn('⚠️ useUserRole: No authenticated user, setting default role');
          setRole(null);
        }
      } catch (error) {
        console.error('Error in fetchUserRole:', error);
        setRole('user');
      } finally {
        setLoading(false);
      }
    }

    fetchUserRole();
  }, []);

  const canWrite = role === 'partner' || role === 'admin';
  const canRead = true; // All authenticated users can read

  return {
    role,
    canWrite,
    canRead,
    loading
  };
}