import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";

interface UseSupabaseQueryOptions {
  table: string;
  select?: string;
  filters?: Array<{ column: string; operator: string; value: any }>;
  orderBy?: { column: string; ascending: boolean };
  limit?: number;
  enabled?: boolean;
}

export function useSupabaseQuery<T = any>(options: UseSupabaseQueryOptions) {
  const [data, setData] = useState<T[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchData = async () => {
    try {
      setLoading(true);
      setError(null);

      console.log('🔍 useSupabaseQuery: Starting query for table:', options.table);
      
      // Check if user is authenticated
      const { data: { user } } = await supabase.auth.getUser();
      console.log('👤 useSupabaseQuery: Current user:', user ? 'Authenticated' : 'Not authenticated');
      
      if (!user) {
        console.warn('⚠️ useSupabaseQuery: No authenticated user found');
        setData([]);
        setLoading(false);
        return;
      }

      let query = supabase
        .from(options.table as any)
        .select(options.select || '*');

      // Apply filters
      if (options.filters) {
        options.filters.forEach(filter => {
          query = query.filter(filter.column, filter.operator, filter.value);
        });
      }

      // Apply ordering
      if (options.orderBy) {
        query = query.order(options.orderBy.column, { ascending: options.orderBy.ascending });
      }

      // Apply limit
      if (options.limit) {
        query = query.limit(options.limit);
      }

      console.log('🚀 useSupabaseQuery: Executing query...');
      const { data: result, error: queryError } = await query;

      if (queryError) {
        console.error('❌ useSupabaseQuery: Query error:', queryError);
        throw queryError;
      }

      console.log('✅ useSupabaseQuery: Query successful, result count:', result?.length || 0);
      setData((result as T[]) || []);
    } catch (err: any) {
      console.error('💥 useSupabaseQuery: Error in fetchData:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (options.enabled !== false) {
      fetchData();
    }
  }, [JSON.stringify(options)]);

  return {
    data,
    loading,
    error,
    refetch: fetchData
  };
}