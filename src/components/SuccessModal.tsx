import React from "react";
import { X, CheckCircle, XCircle } from "lucide-react";

interface SuccessModalProps {
  isOpen: boolean;
  onClose: () => void;
  isSuccess: boolean;
  message: string;
}

export function SuccessModal({
  isOpen,
  onClose,
  isSuccess,
  message,
}: SuccessModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg max-w-md w-full p-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold">
            {isSuccess ? "¡Pago Exitoso!" : "Error en el Pago"}
          </h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
          >
            <X className="w-6 h-6" />
          </button>
        </div>
        <div className="text-center mb-6">
          {isSuccess ? (
            <CheckCircle className="w-16 h-16 text-green-500 mx-auto" />
          ) : (
            <XCircle className="w-16 h-16 text-red-500 mx-auto" />
          )}
          <p className="text-lg mt-4">{message}</p>
        </div>
        <div className="text-center">
          <button
            onClick={onClose}
            className={`w-full py-3 rounded-lg ${
              isSuccess
                ? "bg-green-500 text-white hover:bg-green-600"
                : "bg-red-500 text-white hover:bg-red-600"
            }`}
          >
            Cerrar
          </button>
        </div>
      </div>
    </div>
  );
}
