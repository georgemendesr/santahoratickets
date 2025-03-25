
import { supabase } from '@/integrations/supabase/client';
import type { Database } from '@/integrations/supabase/types';

type Tables = Database['public']['Tables'];
type TableNames = keyof Tables;

/**
 * A utility function to build Supabase queries with better type safety.
 * 
 * @param table The table name to query
 * @returns A Supabase query builder for the specified table
 */
export function createQuery<T extends TableNames>(table: T) {
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
  private query: any;

  constructor(table: TableNames) {
    this.query = supabase.from(table);
  }

  static create(table: TableNames) {
    return new QueryBuilder(table);
  }

  select(columns: string) {
    this.query = this.query.select(columns);
    return this;
  }

  eq(column: string, value: any) {
    this.query = this.query.eq(column, value);
    return this;
  }

  order(column: string, options: { ascending: boolean }) {
    this.query = this.query.order(column, options);
    return this;
  }

  async execute() {
    const { data, error } = await this.query;
    if (error) throw error;
    return data;
  }
}
