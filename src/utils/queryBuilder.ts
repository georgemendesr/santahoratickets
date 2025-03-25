
import { supabase } from '@/integrations/supabase/client';

/**
 * A utility function to build Supabase queries with better type safety.
 * 
 * @param table The table name to query
 * @returns A Supabase query builder for the specified table
 */
export function createQuery(table: string) {
  return supabase.from(table);
}

/**
 * Get a related resource from a base query.
 * 
 * @param query The base Supabase query
 * @param relation The name of the relation to join
 * @returns A Supabase query builder for the joined relation
 */
export function getRelation(query: any, relation: string) {
  return query.select(`${relation}:${relation}(*)`);
}
