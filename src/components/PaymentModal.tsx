import React, { useState } from "react";
import { X } from "lucide-react";
import { processPayment, confirmTransaction } from "../services/paymentService";
import {
  processPaymentQA,
  confirmTransactionQA,
} from "../services/paymentServiceQA";
import { SuccessModal } from "./SuccessModal";
import VisaLogo from "../assets/Visa.png";

interface PaymentModalProps {
  isOpen: boolean;
  onClose: () => void;
  amount: number;
}

export function PaymentModal({ isOpen, onClose, amount }: PaymentModalProps) {
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [modalMessage, setModalMessage] = useState("");
  const [useQA, setUseQA] = useState(false); // Estado para seleccionar entre Local o QA
  const [use3DS, setUse3DS] = useState(false); // Estado para habilitar 3DS
  const [verificationCode, setVerificationCode] = useState(""); // Código de verificación ingresado
  const [isVerificationStep, setIsVerificationStep] = useState(false); // Paso de verificación 3DS

  const correctVerificationCode = "123456"; // Código ficticio para 3DS

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    // Si 3DS está habilitado, mostramos el paso de verificación
    if (use3DS && !isVerificationStep) {
      setIsVerificationStep(true);
      return;
    }

    // Validar el código de verificación en caso de 3DS
    if (use3DS && verificationCode !== correctVerificationCode) {
      setError("El código de verificación es incorrecto.");
      return;
    }

    setIsProcessing(true);

    try {
      const payload = use3DS
        ? {
            meta: {
              _rqDateTime: new Date().toISOString(),
              _ipAddress: "143.30.11.111",
            },
            data: {
              buyOrder: "B061177",
              amount,
              eci: "5",
              authenticationValue: "00010109991234000000EB8C1520817500000000",
              dsTransId: "03000000000070704C63EC909037C14051000000",
              posEntryMode: "010",
              pmntInd: null,
              cardToken: "4818528630000176",
              tokenExpirationDate: "9912",
            },
          }
        : {
            meta: {
              _rqDateTime: new Date().toISOString(),
              _ipAddress: "143.30.11.111",
            },
            data: {
              buyOrder: "D98883107",
              amount,
              eci: "7",
              authenticationValue: null,
              dsTransId: "03000000000070704C63EC909037C14051000000",
              posEntryMode: "010",
              pmntInd: null,
              cardToken: "4818528630000176",
              tokenExpirationDate: "9912",
            },
          };

      console.log("Payload enviado:", payload);

      const token = useQA
        ? await processPaymentQA(payload)
        : await processPayment(payload);

      if (!token) {
        throw new Error("No se recibió un token válido para la transacción.");
      }

      if (useQA) {
        await confirmTransactionQA(token);
      } else {
        await confirmTransaction(token);
      }

      setTimeout(() => {
        setIsProcessing(false);
        onClose();
        setIsSuccess(true);
        setModalMessage("Tu pago ha sido procesado exitosamente.");
        setShowSuccessModal(true);
      }, 3000);
    } catch (error) {
      setTimeout(() => {
        setIsProcessing(false);
        onClose();
        setIsSuccess(false);
        setModalMessage(
          "Hubo un problema al procesar tu pago. Intenta nuevamente."
        );
        setShowSuccessModal(true);
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
              <h2 className="text-2xl font-bold">Simulación de Pago</h2>
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
                onClick={() => setUse3DS(!use3DS)}
                className="text-blue-500 hover:text-blue-700 text-sm ml-4"
              >
                {use3DS ? "Desactivar 3DS" : "Activar 3DS"}
              </button>
              <button
                onClick={onClose}
                className="text-gray-500 hover:text-gray-700"
                disabled={isProcessing}
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            <div className="mb-4 flex justify-between items-center">
              <h3 className="text-xl font-semibold">Resumen del pedido</h3>
              <img src={VisaLogo} alt="Visa" className="h-6 w-auto" />
            </div>

            {!isVerificationStep && (
              <div className="mb-6">
                <div className="flex justify-between items-center">
                  <span>Monto a pagar</span>
                  <span className="text-xl font-bold">
                    ${amount.toLocaleString()}
                  </span>
                </div>
              </div>
            )}

            <form onSubmit={handleSubmit}>
              {isVerificationStep && (
                <div className="mb-4">
                  <input
                    type="text"
                    placeholder="Código de verificación"
                    value={verificationCode}
                    onChange={(e) => setVerificationCode(e.target.value)}
                    maxLength={6}
                    className="w-full p-3 border rounded-lg"
                    disabled={isProcessing}
                  />
                </div>
              )}

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
                    {isVerificationStep ? "Verificar" : "Pagar"}
                  </button>
                )}
              </div>
            </form>
          </div>
        </div>
      )}

      <SuccessModal
        isOpen={showSuccessModal}
        onClose={() => setShowSuccessModal(false)}
        isSuccess={isSuccess}
        message={modalMessage}
      />
    </>
  );
}
