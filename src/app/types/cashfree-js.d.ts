declare module '@cashfreepayments/cashfree-js' {
  interface Cashfree {
    checkout(arg0: { paymentSessionId: unknown; redirectTarget: string; }): unknown;
    pay(options: {
      paymentSessionId: string;
      redirectTarget?: '_self' | '_blank';
      onSuccess?: (data: unknown) => void;
      onFailure?: (error: unknown) => void;
    }): void;
  }

  export function load(options: { mode: 'sandbox' | 'production' }): Promise<Cashfree>;
}
