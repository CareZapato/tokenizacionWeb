import { TokenizedPaymentData } from "../model/TokenizedPaymentData";

export interface PaymentData {
  cardNumber: string;
  expiryDate: string;
  cvr: string;
  amount: number;
}

/**
 * Procesa el pago en el entorno QA.
 * @param paymentData Datos del pago.
 * @returns Token generado para la transacción.
 */
export const processPaymentQA = async (
  paymentData: TokenizedPaymentData
): Promise<string> => {
  try {
    const response = await fetch(
      "https://release.tem-ms-create-transaction-helm.qa2.us-east-1.aws.transbank.local/transactions",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(paymentData),
      }
    );

    if (!response.ok) {
      throw new Error(`Error en la solicitud de QA: ${response.statusText}`);
    }

    const result = await response.json();
    const token = result.data?.token;

    if (!token) {
      throw new Error("No se recibió un token válido para la transacción.");
    }

    return token;
  } catch (error) {
    console.error("Error en el procesamiento de QA:", error);
    throw error;
  }
};

/**
 * Confirma la transacción en el entorno QA.
 * @param token Token generado para la transacción.
 */
export const confirmTransactionQA = async (token: string): Promise<void> => {
  try {
    // Construimos el JSON que será enviado en el body
    const requestBody = {
      data: {
        idQueryInstallments: 15,
        deferredPeriodIndex: 1,
        recurrenceId: 1,
      },
    };

    console.log(
      `Llamando a QA PUT /transactions/${token} con el body:`,
      JSON.stringify(requestBody, null, 2)
    );

    // Llamada al endpoint de QA para confirmar la transacción
    const response = await fetch(
      `https://release.tem-ms-create-transaction-helm.qa2.us-east-1.aws.transbank.local/transactions/${token}`,
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(requestBody),
      }
    );

    if (!response.ok) {
      throw new Error(`Error en la confirmación de QA: ${response.statusText}`);
    }

    const result = await response.json();
    console.log("Confirmación de QA exitosa:", result);

    return Promise.resolve();
  } catch (error) {
    console.error("Error en la confirmación de QA:", error);
    throw error;
  }
};
