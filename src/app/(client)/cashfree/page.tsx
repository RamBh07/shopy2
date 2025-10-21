'use client';
import { useState, useEffect } from 'react';
import { CashfreePayResponse } from './../../types/cashfree.d';

declare global {
    interface Window {
        Cashfree?: {
            pay: (options: {
                paymentSessionId: string;
                redirectTarget?: '_self' | '_blank';
                onSuccess?: (response: CashfreePayResponse) => void;
                onFailure?: (error: unknown) => void;
            }) => void;
        };
    }
}

export default function HomePage() {
    const [sdkLoaded, setSdkLoaded] = useState(false);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        const script = document.createElement('script');
        script.src = 'https://sdk.cashfree.com/js/ui/2.0.0/cashfree.js';
        script.async = true;

        script.onload = () => {
            console.log('✅ Cashfree SDK loaded');
            if (window.Cashfree && typeof window.Cashfree.pay === 'function') {
                setSdkLoaded(true); // ✅ Mark SDK as ready
            } else {
                console.error('❌ Cashfree SDK loaded but pay() is missing');
            }
        };

        script.onerror = () => {
            console.error('❌ Failed to load Cashfree SDK');
        };

        document.body.appendChild(script);

        return () => {
            document.body.removeChild(script);
        };
    }, []);

    const makePayment = async () => {
        if (!sdkLoaded) return alert('Cashfree SDK not loaded yet!');

        setLoading(true);
        try {
            const res = await fetch('/api/cashfree/token', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    orderId: 'order_' + Date.now(),
                    orderAmount: 10,
                    customerName: 'John Doe',
                    customerPhone: '9999999999',
                    customerEmail: 'john@example.com',
                }),
            });

            const data = await res.json();
            console.log('✅ Token response:', data);

            if (!data.order_token) {
                alert('Payment token generation failed!');
                return;
            }

            window.Cashfree?.pay({
                paymentSessionId: data.order_token,
                redirectTarget: '_self',
                onSuccess: (res) => {
                    console.log('✅ Payment Success:', res);
                    alert('Payment Success!');
                },
                onFailure: (err) => {
                    console.error('❌ Payment Failed:', err);
                    alert('Payment Failed!');
                },
            });
        } catch (err) {
            console.error('❌ Payment error:', err);
            alert('Payment error! Check console');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="p-10 text-center">
            <h1 className="text-2xl font-bold mb-4">Cashfree Live Payment Demo</h1>
            <button
                onClick={makePayment}
                disabled={!sdkLoaded || loading}
                className={`px-6 py-3 rounded-md text-white ${sdkLoaded ? 'bg-green-600 hover:bg-green-700' : 'bg-gray-400 cursor-not-allowed'
                    }`}
            >
                {loading ? 'Processing...' : sdkLoaded ? 'Pay Now' : 'Loading SDK...'}
            </button>
            {!sdkLoaded && (
                <p className="mt-2 text-red-600">Cashfree SDK failed to initialize properly</p>
            )}
        </div>
    );
}
