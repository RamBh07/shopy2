import { NextResponse } from 'next/server';

export async function GET() {
  const orderId = 'order_' + Date.now();

  const response = await fetch('https://api.cashfree.com/pg/orders', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-api-version': '2022-01-01',
      'x-client-id': process.env.CASHFREE_APP_ID!,
      'x-client-secret': process.env.CASHFREE_SECRET_KEY!,
    },
    body: JSON.stringify({
      order_id: orderId,
      order_amount: 100.0,
      order_currency: 'INR',
      customer_details: {
        customer_id: 'cust_001',
        customer_email: 'user@example.com',
        customer_phone: '9876543210',
      },
      order_meta: {
    return_url: 'https://shopy345.netlify.app/payment-success?order_id={order_id}', // ✅ Required in live mode
  },
    }),
  });

  const data = await response.json();
console.log(data);
  if (!response.ok) {
    return NextResponse.json({ error: data.message || 'Failed to create order' }, { status: 500 });
  }

  return NextResponse.json({ token: data.order_token });
}
