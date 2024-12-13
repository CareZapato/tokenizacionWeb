export interface TokenizedPaymentData {
  meta: {
    _rqDateTime: string;
    _ipAddress: string;
  };
  data: {
    buyOrder: string;
    amount: number;
    eci: string;
    authenticationValue: string | null;
    dsTransId: string;
    posEntryMode: string;
    pmntInd: string | null;
    cardToken: string;
    tokenExpirationDate: string;
  };
}
