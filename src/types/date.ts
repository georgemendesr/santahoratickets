
import { DateRange as DayPickerDateRange } from "react-day-picker";

// Extended DateRange with required from and to properties
export interface DateRange extends DayPickerDateRange {
  from: Date | undefined;
  to: Date | undefined;
}

// Date utility functions
export const dateUtils = {
  // Create a default date range (e.g., last 30 days)
  createDefaultRange: (days: number = 30): DateRange => {
    const to = new Date();
    const from = new Date();
    from.setDate(from.getDate() - days);
    return { from, to };
  },

  // Ensure we always have a valid range, even if undefined is passed
  ensureValidRange: (range?: DateRange): DateRange => {
    if (!range || !range.from || !range.to) {
      return dateUtils.createDefaultRange();
    }
    return range;
  },

  // Format for API consumption
  toApiFormat: (range: DateRange): { start_date: string; end_date: string } => {
    const safeRange = dateUtils.ensureValidRange(range);
    return {
      start_date: safeRange.from.toISOString(),
      end_date: safeRange.to.toISOString(),
    };
  },

  // Check if range is complete
  isCompleteRange: (range?: DateRange): boolean => {
    return Boolean(range && range.from && range.to);
  }
};
