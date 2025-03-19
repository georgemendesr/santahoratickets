
import React, { createContext, useContext, useState, ReactNode } from 'react';
import { useToast } from '@/hooks/use-toast';

interface FeedbackContextType {
  isLoading: boolean;
  loadingMessage: string;
  showLoading: (message?: string) => void;
  hideLoading: () => void;
  showError: (message: string, description?: string) => void;
  showSuccess: (message: string, description?: string) => void;
  showInfo: (message: string, description?: string) => void;
}

const FeedbackContext = createContext<FeedbackContextType | null>(null);

export const FeedbackProvider = ({ children }: { children: ReactNode }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [loadingMessage, setLoadingMessage] = useState('Carregando...');
  const { toast } = useToast();
  
  const showLoading = (message = 'Carregando...') => {
    setLoadingMessage(message);
    setIsLoading(true);
  };
  
  const hideLoading = () => {
    setIsLoading(false);
  };
  
  const showError = (title: string, description?: string) => {
    toast({
      title,
      description,
      variant: "destructive",
    });
  };
  
  const showSuccess = (title: string, description?: string) => {
    toast({
      title,
      description,
      variant: "default",
    });
  };
  
  const showInfo = (title: string, description?: string) => {
    toast({
      title,
      description,
      variant: "default",
    });
  };
  
  return (
    <FeedbackContext.Provider
      value={{
        isLoading,
        loadingMessage,
        showLoading,
        hideLoading,
        showError,
        showSuccess,
        showInfo,
      }}
    >
      {children}
      {isLoading && (
        <div className="fixed inset-0 bg-background/80 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-card p-6 rounded-lg shadow-lg flex flex-col items-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
            <p className="mt-4">{loadingMessage}</p>
          </div>
        </div>
      )}
    </FeedbackContext.Provider>
  );
};

export const useFeedback = (): FeedbackContextType => {
  const context = useContext(FeedbackContext);
  if (!context) {
    throw new Error('useFeedback deve ser usado dentro de FeedbackProvider');
  }
  return context;
};
