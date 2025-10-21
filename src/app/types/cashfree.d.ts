// types/cashfree.d.ts

// ------------------------------
// Server: Cashfree Order Response
// ------------------------------
export interface CashfreeOrderResponse {
  status: string; // "OK" or "ERROR"
  message?: string;
  payment_session_id?: string; // Used to start payment in client SDK
  order_id?: string;
  order_amount?: number;
  order_currency?: string;
}

// ------------------------------
// Client: Cashfree SDK
// ------------------------------
export interface CashfreePayResponse {
  orderId: string;
  orderAmount: number;
  referenceId: string;
  txStatus: 'SUCCESS' | 'FAILED' | 'PENDING';
  paymentMode: string;
  txMsg: string;
  txTime: string;
}

export interface CashfreePayOptions {
  paymentSessionId: string; // generated from server
  redirectTarget?: '_self' | '_blank';
  onSuccess?: (response: CashfreePayResponse) => void;
  onFailure?: (error: unknown) => void;
}

export interface CashfreeUI {
  pay: (options: CashfreePayOptions) => void;
}

// ------------------------------
// Add Cashfree to Window
// ------------------------------
declare global {
  interface Window {
    Cashfree?: new (config: CashfreeConfig) => CashfreeInstance;
  }
}

export {};
