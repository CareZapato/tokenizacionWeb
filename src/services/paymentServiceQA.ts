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
  paymentData: PaymentData
): Promise<string> => {
  try {
    // Construimos el JSON para enviar al backend de QA
    const requestBody = {
      meta: {
        _rqDateTime: new Date().toISOString(),
        _ipAddress: "143.30.11.111", // Puedes obtenerlo dinámicamente si es necesario
      },
      data: {
        buyOrder: "FL00M030",
        amount: paymentData.amount,
        eci: "2",
        authenticationValue: null,
        dsTransId: "00010109991234000000EB8C1520757400000001",
        posEntryMode: "010",
        pmntInd: "C",
        cardToken: paymentData.cardNumber,
        tokenExpirationDate: paymentData.expiryDate,
        deviceTypeTkn: "00",
        tknAssuranceLvl: "21",
        tknRqId: "01234567891",
        dsTrxId: "85445dc5-2be1-4b47-a784-518731d57009",
        recurPmnt: "F",
        authenticationVersion: "0",
        pgmProto: "2",
        tknType: "05",
        txnType: "2",
      },
    };

    console.log(
      "Llamando a QA POST /transactions con el body:",
      JSON.stringify(requestBody, null, 2)
    );

    // Llamada al endpoint de QA
    const response = await fetch(
      "https://release.tem-ms-create-transaction-helm.qa2.us-east-1.aws.transbank.local/transactions",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(requestBody),
      }
    );

    if (!response.ok) {
      throw new Error(`Error en la solicitud de QA: ${response.statusText}`);
    }

    const result = await response.json();
    const token = result.data?.token;

    if (!token) {
      throw new Error("No se encontró un token en la respuesta de QA.");
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
