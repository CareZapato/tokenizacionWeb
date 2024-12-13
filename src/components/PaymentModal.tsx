import React, { useState } from "react";
import { X } from "lucide-react";
import { formatCardNumber, validateCardNumber } from "../utils/cardUtils";
import { processPayment, confirmTransaction } from "../services/paymentService";
import {
  processPaymentQA,
  confirmTransactionQA,
} from "../services/paymentServiceQA";
import { SuccessModal } from "./SuccessModal";

interface PaymentModalProps {
  isOpen: boolean;
  onClose: () => void;
  amount: number;
}

export function PaymentModal({ isOpen, onClose, amount }: PaymentModalProps) {
  const [cardNumber, setCardNumber] = useState("");
  const [expiryDate, setExpiryDate] = useState("");
  const [cvv, setCvv] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [modalMessage, setModalMessage] = useState("");
  const [useQA, setUseQA] = useState(false); // Estado para seleccionar entre Local o QA

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    // if (!validateCardNumber(cardNumber)) {
    //   setError("El número de tarjeta debe tener 16 dígitos");
    //   return;
    // }

    setIsProcessing(true);

    try {
      // Selección de entorno (Local o QA)
      const token = useQA
        ? await processPaymentQA({
            cardNumber: cardNumber.replace(/\s/g, ""),
            expiryDate,
            cvr: cvv,
            amount,
          })
        : await processPayment({
            cardNumber: cardNumber.replace(/\s/g, ""),
            expiryDate,
            cvv: cvv,
            amount,
          });

      // Verificamos que el token sea válido
      if (!token) {
        throw new Error("No se recibió un token válido para la transacción.");
      }

      // Confirmar la transacción
      if (useQA) {
        await confirmTransactionQA(token);
      } else {
        await confirmTransaction(token);
      }

      // Simula un proceso en segundo plano con una demora de 3 segundos
      setTimeout(() => {
        setIsProcessing(false); // Deja de mostrar el ícono de carga
        onClose(); // Cierra el modal de pago
        setIsSuccess(true); // Indica éxito
        setModalMessage("Tu pago ha sido procesado exitosamente.");
        setShowSuccessModal(true); // Muestra el modal de éxito
      }, 3000);
    } catch (error) {
      setTimeout(() => {
        setIsProcessing(false);
        onClose(); // Cierra el modal de pago
        setIsSuccess(false); // Indica error
        setModalMessage(
          "Hubo un problema al procesar tu pago. Intenta nuevamente."
        );
        setShowSuccessModal(true); // Muestra el modal de error
      }, 3000);
      console.error(error);
    }
  };

  return (
    <>
      {isOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg max-w-md w-full p-6">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold">
                Tokenización Simulación de Pago
              </h2>
              <div className="flex items-center space-x-2">
                <label
                  className={`text-sm font-medium ${
                    !useQA ? "text-gray-800" : "text-gray-400"
                  }`}
                >
                  Local
                </label>
                <div
                  className={`w-12 h-6 flex items-center bg-gray-300 rounded-full p-1 cursor-pointer ${
                    useQA ? "bg-blue-500" : "bg-gray-300"
                  }`}
                  onClick={() => setUseQA(!useQA)}
                >
                  <div
                    className={`w-4 h-4 bg-white rounded-full shadow-md transform ${
                      useQA ? "translate-x-6" : "translate-x-0"
                    }`}
                  ></div>
                </div>
                <label
                  className={`text-sm font-medium ${
                    useQA ? "text-gray-800" : "text-gray-400"
                  }`}
                >
                  QA
                </label>
              </div>
              <button
                onClick={onClose}
                className="text-gray-500 hover:text-gray-700"
                disabled={isProcessing}
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            <div className="mb-6">
              <h3 className="text-xl mb-4">Resumen del pedido</h3>
              <div className="flex justify-between items-center">
                <span>Monto a pagar</span>
                <span className="text-xl font-bold">
                  ${amount.toLocaleString()}
                </span>
              </div>
            </div>

            <form onSubmit={handleSubmit}>
              {/* <div className="mb-4">
                <input
                  type="text"
                  placeholder="Número de tarjeta"
                  value={cardNumber}
                  onChange={(e) =>
                    setCardNumber(formatCardNumber(e.target.value))
                  }
                  maxLength={19}
                  className="w-full p-3 border rounded-lg"
                  disabled={isProcessing}
                />
              </div>
              <div className="flex gap-4 mb-6">
                <input
                  type="text"
                  placeholder="MM/YY"
                  value={expiryDate}
                  onChange={(e) => setExpiryDate(e.target.value)}
                  maxLength={5}
                  className="w-1/2 p-3 border rounded-lg"
                  disabled={isProcessing}
                />
                <input
                  type="text"
                  placeholder="CVV"
                  value={cvv}
                  onChange={(e) => setCvv(e.target.value)}
                  maxLength={3}
                  className="w-1/2 p-3 border rounded-lg"
                  disabled={isProcessing}
                />
              </div> */}

              {error && (
                <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-lg">
                  {error}
                </div>
              )}

              <div className="flex justify-center">
                {isProcessing ? (
                  <div className="flex items-center justify-center">
                    <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-gray-500"></div>
                  </div>
                ) : (
                  <button
                    type="submit"
                    className="w-full py-3 bg-gray-500 text-white rounded-lg hover:bg-gray-600 disabled:opacity-50"
                  >
                    Pagar
                  </button>
                )}
              </div>
            </form>

            <div className="mt-6 text-center">
              <img
                src="https://www.klap.cl/assets/logo.svg"
                alt="MedioPago"
                className="h-6 mx-auto"
              />
            </div>
          </div>
        </div>
      )}

      {/* Modal de éxito o error */}
      <SuccessModal
        isOpen={showSuccessModal}
        onClose={() => setShowSuccessModal(false)}
        isSuccess={isSuccess}
        message={modalMessage}
      />
    </>
  );
}
