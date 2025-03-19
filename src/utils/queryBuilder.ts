
import { supabase } from '@/integrations/supabase/client';
import { Database } from '@/types/database.types';

type TableNames = keyof Database['public']['Tables'];

export class QueryBuilder<T = any> {
  private table: string;
  private query: any;
  private retryCount: number = 0;
  private maxRetries: number = 3;
  
  constructor(table: TableNames) {
    this.table = table as string;
    this.query = supabase.from(table);
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
  
  order(column: string, options: { ascending?: boolean } = {}) {
    this.query = this.query.order(column, options);
    return this;
  }
  
  limit(count: number) {
    this.query = this.query.limit(count);
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
  
  async execute(): Promise<T | T[]> {
    try {
      const { data, error } = await this.query;
      
      if (error) throw error;
      
      return data || [];
    } catch (error) {
      // Retry on network errors
      if (
        this.retryCount < this.maxRetries && 
        (error.message?.includes('network') || error.code === 'ECONNRESET')
      ) {
        this.retryCount++;
        await new Promise(r => setTimeout(r, 1000 * this.retryCount));
        return this.execute();
      }
      
      console.error(`[Supabase][${this.table}]`, error);
      throw error;
    }
  }
}
