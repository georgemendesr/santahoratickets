
import { DateRange as ReactDayPickerDateRange } from 'react-day-picker';

// Estendendo o tipo DateRange para uso no projeto
export interface DateRange extends ReactDayPickerDateRange {
  from: Date | undefined;
  to: Date | undefined;
}

// Funções utilitárias para datas
export const dateUtils = {
  // Criar um DateRange com valores default
  createDefaultRange: (daysAgo: number = 30): DateRange => {
    return {
      from: new Date(Date.now() - daysAgo * 24 * 60 * 60 * 1000),
      to: new Date()
    };
  },
  
  // Garantir que um DateRange tenha valores válidos
  ensureValidRange: (range: DateRange): DateRange => {
    if (!range) return dateUtils.createDefaultRange();
    
    return {
      from: range.from || new Date(Date.now() - 30 * 24 * 60 * 60 * 1000),
      to: range.to || new Date()
    };
  },
  
  // Converter DateRange para formato da API
  toAPIFormat: (range: DateRange): { start_date?: string, end_date?: string } => {
    const safeRange = dateUtils.ensureValidRange(range);
    
    return {
      start_date: safeRange.from.toISOString(),
      end_date: safeRange.to.toISOString(),
    };
  },
  
  // Validar se é um range completo
  isCompleteRange: (range?: DateRange): boolean => {
    return Boolean(range && range.from && range.to);
  }
};
