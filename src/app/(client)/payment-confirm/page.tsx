'use client';

import { useSearchParams } from 'next/navigation';

export default function PaymentSuccessPage() {
    const searchParams = useSearchParams();
    const orderId = searchParams.get('order_id');

    return (
        <div className="p-10 text-center">
            <h1 className="text-3xl font-bold text-green-600 mb-4">🎉 Payment Successful!</h1>
            <p className="text-lg">Thank you for your payment.</p>
            {orderId && <p className="mt-2 text-gray-600">Order ID: {orderId}</p>}
        </div>
    );
}
