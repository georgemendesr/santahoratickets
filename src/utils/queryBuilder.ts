
import { supabase } from '@/integrations/supabase/client';
import { Database } from '@/types/database.types';

type TableNames = keyof Database['public']['Tables'];

export class QueryBuilder<T = any> {
  private table: string;
  private query: any;
  private retryCount: number = 0;
  private maxRetries: number = 3;
  private debug: boolean = false;
  
  constructor(table: TableNames, options?: { debug?: boolean }) {
    this.table = table as string;
    this.query = supabase.from(table);
    this.debug = options?.debug || false;
  }
  
  select(columns: string = '*') {
    this.query = this.query.select(columns);
    return this;
  }
  
  eq(column: string, value: any) {
    if (value !== undefined && value !== null) {
      this.query = this.query.eq(column, value);
    }
    return this;
  }
  
  neq(column: string, value: any) {
    if (value !== undefined && value !== null) {
      this.query = this.query.neq(column, value);
    }
    return this;
  }
  
  gt(column: string, value: any) {
    if (value !== undefined && value !== null) {
      this.query = this.query.gt(column, value);
    }
    return this;
  }
  
  gte(column: string, value: any) {
    if (value !== undefined && value !== null) {
      this.query = this.query.gte(column, value);
    }
    return this;
  }
  
  lt(column: string, value: any) {
    if (value !== undefined && value !== null) {
      this.query = this.query.lt(column, value);
    }
    return this;
  }
  
  lte(column: string, value: any) {
    if (value !== undefined && value !== null) {
      this.query = this.query.lte(column, value);
    }
    return this;
  }
  
  is(column: string, value: any) {
    if (value !== undefined) {
      this.query = this.query.is(column, value);
    }
    return this;
  }
  
  in(column: string, values: any[]) {
    if (values && values.length > 0) {
      this.query = this.query.in(column, values);
    }
    return this;
  }
  
  contains(column: string, value: any) {
    if (value !== undefined && value !== null) {
      this.query = this.query.contains(column, value);
    }
    return this;
  }
  
  textSearch(column: string, query: string, options?: { config?: string }) {
    if (query && query.trim() !== '') {
      this.query = this.query.textSearch(column, query, options);
    }
    return this;
  }
  
  filter(column: string, operator: string, value: any) {
    if (value !== undefined && value !== null) {
      this.query = this.query.filter(column, operator, value);
    }
    return this;
  }
  
  order(column: string, options: { ascending?: boolean } = {}) {
    this.query = this.query.order(column, options);
    return this;
  }
  
  limit(count: number) {
    this.query = this.query.limit(count);
    return this;
  }
  
  range(from: number, to: number) {
    this.query = this.query.range(from, to);
    return this;
  }
  
  single() {
    this.query = this.query.single();
    return this;
  }
  
  maybeSingle() {
    this.query = this.query.maybeSingle();
    return this;
  }
  
  count(column?: string, options?: { head?: boolean, exact?: boolean }) {
    this.query = this.query.count(column, options);
    return this;
  }
  
  async execute(): Promise<T | T[]> {
    try {
      if (this.debug) {
        console.log(`[QueryBuilder] Executing query on ${this.table}:`, this.query);
      }
      
      const { data, error, count } = await this.query;
      
      if (error) throw error;
      
      if (this.debug) {
        console.log(`[QueryBuilder] Query results:`, { data, count });
      }
      
      // If count was requested, return both data and count
      if (count !== null && count !== undefined) {
        return { data, count } as any;
      }
      
      return data || [];
    } catch (error: any) {
      // Retry on network errors
      if (
        this.retryCount < this.maxRetries && 
        (error.message?.includes('network') || error.code === 'ECONNRESET')
      ) {
        this.retryCount++;
        if (this.debug) {
          console.log(`[QueryBuilder] Retrying query (${this.retryCount}/${this.maxRetries})...`);
        }
        await new Promise(r => setTimeout(r, 1000 * this.retryCount));
        return this.execute();
      }
      
      console.error(`[Supabase][${this.table}]`, error);
      throw error;
    }
  }
}
