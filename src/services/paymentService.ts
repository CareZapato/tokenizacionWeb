import { TokenizedPaymentData } from "../model/TokenizedPaymentData";

interface PaymentData {
  cardNumber: string;
  expiryDate: string;
  cvv: string;
  amount: number;
}

// export const processPayment = async (
//   paymentData: PaymentData
// ): Promise<void> => {
//   try {
//     // Usamos JSONPlaceholder como servicio mock
//     const response = await fetch("https://jsonplaceholder.typicode.com/posts", {
//       method: "POST",
//       headers: {
//         "Content-Type": "application/json",
//         "X-Transaction-ID": `KLAP-${Date.now()}`, // Simulamos un ID de transacción
//       },
//       body: JSON.stringify({
//         transactionId: `KLAP-${Date.now()}`,
//         merchantId: "DEMO-MERCHANT",
//         timestamp: new Date().toISOString(),
//         ...paymentData,
//         // Enmascaramos el número de tarjeta por seguridad
//         cardNumber: `****-****-****-${paymentData.cardNumber.slice(-4)}`,
//       }),
//     });

//     if (!response.ok) {
//       throw new Error("Payment request failed");
//     }

//     const result = await response.json();
//     console.log("Payment processed successfully:", result);

//     return Promise.resolve();
//   } catch (error) {
//     console.error("Payment processing error:", error);
//     return Promise.reject(new Error("Payment failed"));
//   }
// };

export const processPayment = async (
  paymentData: TokenizedPaymentData
): Promise<string> => {
  try {
    const response = await fetch("http://localhost:8080/transactions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(paymentData),
    });

    if (!response.ok) {
      throw new Error(`Error en la solicitud local: ${response.statusText}`);
    }

    const result = await response.json();
    const token = result.data?.token;

    if (!token) {
      throw new Error("No se recibió un token válido para la transacción.");
    }

    return token;
  } catch (error) {
    console.error("Error en el procesamiento local:", error);
    throw error;
  }
};

// Función para confirmar la transacción
export const confirmTransaction = async (token: string): Promise<void> => {
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
      `Llamando a PUT /transactions/${token} con el body:`,
      JSON.stringify(requestBody, null, 2)
    );

    // Llamada PUT al backend
    const response = await fetch(
      `http://localhost:8080/transactions/${token}`,
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(requestBody),
      }
    );

    if (!response.ok) {
      throw new Error(
        `Confirmación de transacción fallida con código HTTP ${response.status}`
      );
    }

    const result = await response.json();
    console.log("Confirmación exitosa:", result);

    return Promise.resolve();
  } catch (error) {
    console.error("Error en la confirmación de la transacción:", error);
    return Promise.reject(error);
  }
};
