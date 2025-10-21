'use client';

import { useEffect, useState } from 'react';
import { load, Cashfree } from '@cashfreepayments/cashfree-js';

export default function PaymentPage() {
    const [cashfree, setCashfree] = useState<Cashfree | null>(null);

    useEffect(() => {
        const initCashfree = async () => {
            const cf = await load({ mode: 'production' });
            setCashfree(cf);
        };
        initCashfree();
    }, []);

    const handlePayment = async () => {
        if (!cashfree) return;

        const paymentSessionId = await fetch('/api/create-session').then(res => res.json());

        cashfree.pay({
            paymentSessionId: paymentSessionId.id,
            redirectTarget: '_self',
            onSuccess: (data) => console.log('Success:', data),
            onFailure: (err) => console.error('Failure:', err),
        });
    };

    return (
        <div className="p-10 text-center">
            <h1 className="text-2xl font-bold mb-4">Cashfree Live Payment</h1>
            <button
                onClick={handlePayment}
                disabled={!cashfree}
                className={`px-6 py-3 rounded-md text-white ${cashfree ? 'bg-green-600 hover:bg-green-700' : 'bg-gray-400 cursor-not-allowed'}`}
            >
                {cashfree ? 'Pay Now' : 'Loading SDK...'}
            </button>
        </div>
    );
}
