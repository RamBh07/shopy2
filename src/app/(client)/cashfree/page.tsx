'use client';

import { useEffect, useState } from 'react';
import { load, Cashfree } from '@cashfreepayments/cashfree-js';

export default function PaymentPage() {
    const [cashfree, setCashfree] = useState<Cashfree | null>(null);
    const [isReady, setIsReady] = useState(false);

    useEffect(() => {
        const initCashfree = async () => {
            try {
                const cf = await load({ mode: 'production' }); // Use 'sandbox' for testing
                console.log('✅ Cashfree SDK loaded:', cf);
                setCashfree(cf);
                setIsReady(typeof cf.pay === 'function');
            } catch (error) {
                console.error('❌ Failed to load Cashfree SDK:', error);
            }
        };
        initCashfree();
    }, []);

    const handlePayment = async () => {
        if (!cashfree || !isReady) return;

        try {
            const res = await fetch('/api/create-session');
            const data = await res.json();
            console.log('Session Token:', data.token);

            cashfree.pay({
                paymentSessionId: data.token,
                redirectTarget: '_self',
                onSuccess: (data) => console.log('✅ Payment Success:', data),
                onFailure: (err) => console.error('❌ Payment Failed:', err),
            });
        } catch (error) {
            console.error('❌ Error during payment:', error);
        }
    };

    return (
        <div className="p-10 text-center">
            <h1 className="text-2xl font-bold mb-4">Cashfree Live Payment</h1>
            <button
                onClick={handlePayment}

                className={`px-6 py-3 rounded-md text-white ${isReady ? 'bg-green-600 hover:bg-green-700' : 'bg-gray-400 cursor-not-allowed'
                    }`}
            >
                {isReady ? 'Pay Now' : 'Loading SDK...'}
            </button>
        </div>
    );
}
