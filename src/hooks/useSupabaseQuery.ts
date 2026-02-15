import { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';
import { PostgrestError } from '@supabase/supabase-js';

interface UseSupabaseQueryResult<T> {
  data: T[] | null;
  error: PostgrestError | null;
  loading: boolean;
  refetch: () => Promise<void>;
}

export function useSupabaseQuery<T>(
  table: string,
  options: {
    select?: string;
    filter?: Record<string, any>;
    orderBy?: { column: string; ascending?: boolean };
  } = {}
): UseSupabaseQueryResult<T> {
  const [data, setData] = useState<T[] | null>(null);
  const [error, setError] = useState<PostgrestError | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchData = async () => {
    try {
      setLoading(true);
      let query = supabase.from(table).select(options.select || '*');

      if (options.filter) {
        Object.entries(options.filter).forEach(([key, value]) => {
          if (value !== undefined && value !== null && value !== 'all') {
            query = query.eq(key, value);
          }
        });
      }

      if (options.orderBy) {
        query = query.order(options.orderBy.column, {
          ascending: options.orderBy.ascending ?? true
        });
      }

      const { data, error } = await query;

      if (error) {
        throw error;
      }

      setData(data);
      setError(null);
    } catch (err) {
      setError(err as PostgrestError);
      setData(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [table, JSON.stringify(options)]);

  return { data, error, loading, refetch: fetchData };
}