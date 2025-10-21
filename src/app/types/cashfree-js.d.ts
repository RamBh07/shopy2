declare module '@cashfreepayments/cashfree-js' {
  interface Cashfree {
    pay(options: {
      paymentSessionId: string;
      redirectTarget?: '_self' | '_blank';
      onSuccess?: (data: unknown) => void;
      onFailure?: (error: unknown) => void;
    }): void;
  }

  export function load(options: { mode: 'sandbox' | 'production' }): Promise<Cashfree>;
}
