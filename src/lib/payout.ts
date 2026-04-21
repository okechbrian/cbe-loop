// Mobile-money payout stub. Replace with Daraja (M-Pesa B2C) or similar in production.
// The interface is the contract; keep it stable so swap-in is easy.

export type PayoutRequest = {
  phone: string;
  amount: number;
  currency: string;
  reference: string;
};

export type PayoutResult =
  | { ok: true; providerRef: string }
  | { ok: false; error: string };

export async function sendPayoutStub(req: PayoutRequest): Promise<PayoutResult> {
  console.log('[payout-stub] would send', req);
  return {
    ok: true,
    providerRef: `STUB-${Date.now()}-${Math.floor(Math.random() * 1e6)}`,
  };
}
