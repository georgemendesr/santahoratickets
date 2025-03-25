
/**
 * Format currency values to BRL format
 * @param value Number to format
 * @returns Formatted currency string
 */
export function formatCurrency(value: number): string {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL'
  }).format(value);
}

/**
 * Format date to Brazilian format
 * @param dateString Date string to format
 * @returns Formatted date string (DD/MM/YYYY)
 */
export function formatDate(dateString: string): string {
  const date = new Date(dateString);
  return new Intl.DateTimeFormat('pt-BR').format(date);
}

/**
 * Format date and time to Brazilian format
 * @param dateString Date string to format
 * @returns Formatted date and time string (DD/MM/YYYY HH:MM)
 */
export function formatDateTime(dateString: string): string {
  const date = new Date(dateString);
  return new Intl.DateTimeFormat('pt-BR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  }).format(date);
}

/**
 * Format date range for event display
 * @param startDate Start date string
 * @param endDate End date string
 * @returns Formatted date range string
 */
export function formatDateRange(startDate: string, endDate: string): string {
  const start = new Date(startDate);
  const end = new Date(endDate);
  
  // Same day
  if (start.toDateString() === end.toDateString()) {
    return `${formatDate(startDate)} · ${formatTime(startDate)} - ${formatTime(endDate)}`;
  }
  
  // Different days
  return `${formatDate(startDate)} - ${formatDate(endDate)}`;
}

/**
 * Format time only from date string
 * @param dateString Date string to extract time from
 * @returns Formatted time string (HH:MM)
 */
export function formatTime(dateString: string): string {
  const date = new Date(dateString);
  return new Intl.DateTimeFormat('pt-BR', {
    hour: '2-digit',
    minute: '2-digit'
  }).format(date);
}
