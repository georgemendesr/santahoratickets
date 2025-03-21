
declare global {
  interface Window {
    diagnoseBatches?: (eventId: string) => void;
    fixBatchStatus?: (batchId: string) => void;
    fixAllBatchesForEvent?: (eventId: string) => void;
    fixAvailableTickets?: (eventId: string) => void;
  }
}

// Make it a module to ensure declarations merge properly
export {};
