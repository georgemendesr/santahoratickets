
import { supabase } from '@/integrations/supabase/client';
import { PostgrestQueryBuilder } from '@supabase/supabase-js';

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

export class QueryBuilder {
  private query: PostgrestQueryBuilder<any, any>;

  constructor(table: string) {
    this.query = supabase.from(table);
  }

  static create(table: string) {
    return supabase.from(table);
  }

  select(columns: string) {
    return this.query.select(columns);
  }

  eq(column: string, value: any) {
    return this.query.eq(column, value);
  }

  order(column: string, options: { ascending: boolean }) {
    return this.query.order(column, options);
  }

  async execute() {
    const { data, error } = await this.query;
    if (error) throw error;
    return data;
  }
}
