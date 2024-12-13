import React, { useState } from "react";
import { X } from "lucide-react";
import { processPayment, confirmTransaction } from "../services/paymentService";
import {
  processPaymentQA,
  confirmTransactionQA,
} from "../services/paymentServiceQA";
import { SuccessModal } from "./SuccessModal";
import VisaLogo from "../assets/Visa.png";
import { formatCardNumber, validateCardNumber } from "../utils/cardUtils";

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
  const [use3DS, setUse3DS] = useState(false); // Estado para habilitar 3DS
  const [useTokenized, setUseTokenized] = useState(false); // Estado para habilitar el modo Tokenizado
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

    if (!useTokenized && !validateCardNumber(cardNumber)) {
      setError("El número de tarjeta debe tener 16 dígitos");
      return;
    }

    setIsProcessing(true);

    try {
      const payload = useTokenized
        ? {
            meta: {
              _rqDateTime: new Date().toISOString(),
              _ipAddress: "143.30.11.111",
            },
            data: {
              buyOrder: use3DS ? "B061177" : "D98883107",
              amount,
              eci: use3DS ? "5" : "7",
              authenticationValue: use3DS
                ? "00010109991234000000EB8C1520817500000000"
                : null,
              dsTransId: "03000000000070704C63EC909037C14051000000",
              posEntryMode: "010",
              pmntInd: null,
              cardToken: "4818528630000176", // Token preenrolado
              tokenExpirationDate: "9912",
            },
          }
        : {
            meta: {
              _rqDateTime: new Date().toISOString(),
              _ipAddress: "143.30.11.111",
            },
            data: {
              buyOrder: use3DS ? "B061177" : "D98883107",
              amount,
              eci: use3DS ? "5" : "7",
              authenticationValue: use3DS
                ? "00010109991234000000EB8C1520817500000000"
                : null,
              dsTransId: "03000000000070704C63EC909037C14051000000",
              posEntryMode: "010",
              pmntInd: null,
              cardToken: cardNumber.replace(/\s/g, ""), // Si no es tokenizado, usa el número de tarjeta
              tokenExpirationDate: expiryDate.replace("/", ""),
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
              <div className="flex space-x-4">
                <button
                  onClick={() => setUseTokenized(!useTokenized)}
                  className="text-green-500 hover:text-green-700 text-sm"
                >
                  {useTokenized
                    ? "Desactivar Tokenizado"
                    : "Activar Tokenizado"}
                </button>
                <button
                  onClick={() => setUse3DS(!use3DS)}
                  className="text-blue-500 hover:text-blue-700 text-sm"
                >
                  {use3DS ? "Desactivar 3DS" : "Activar 3DS"}
                </button>
              </div>
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
              {!useTokenized && !isVerificationStep && (
                <>
                  <div className="mb-4">
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
                  </div>
                </>
              )}

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
