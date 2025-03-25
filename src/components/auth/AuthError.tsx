
import React from "react";

interface AuthErrorProps {
  message: string | null;
}

export function AuthError({ message }: AuthErrorProps) {
  if (!message) return null;
  
  return (
    <div className="mt-4 p-3 bg-red-50 text-red-600 rounded-md border border-red-200">
      {message}
    </div>
  );
}
