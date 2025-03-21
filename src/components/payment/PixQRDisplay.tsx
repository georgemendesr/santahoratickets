
import { AlertTriangle } from "lucide-react";
import { useEffect, useState } from "react";

interface PixQRDisplayProps {
  qrCodeUrl: string | null;
  validPixCode: string;
  isRefreshing: boolean;
  onImageError: () => void;
}

export const PixQRDisplay = ({ qrCodeUrl, validPixCode, isRefreshing, onImageError }: PixQRDisplayProps) => {
  const shouldShowQrCode = qrCodeUrl && !isRefreshing;
  const shouldShowErrorMessage = !shouldShowQrCode && validPixCode;

  return (
    <>
      {shouldShowQrCode ? (
        <div className="bg-white p-3 rounded-lg border border-gray-200">
          <img 
            src={qrCodeUrl}
            alt="QR Code PIX"
            className="w-48 h-48"
            onError={onImageError}
          />
        </div>
      ) : shouldShowErrorMessage ? (
        <div className="bg-white p-3 rounded-lg border border-gray-200">
          <div className="flex flex-col items-center">
            <AlertTriangle className="text-amber-500 mb-2" size={24} />
            <p className="text-sm text-gray-500 text-center mb-2">
              Não foi possível exibir o QR Code
            </p>
            <p className="text-xs text-gray-400 text-center">
              Use o código PIX abaixo
            </p>
          </div>
        </div>
      ) : (
        <div className="w-48 h-48 flex items-center justify-center bg-gray-100 rounded-lg">
          <p className="text-sm text-gray-500 text-center p-4">
            {isRefreshing 
              ? "Gerando QR Code..." 
              : "QR Code não disponível"}
          </p>
        </div>
      )}
    </>
  );
};
