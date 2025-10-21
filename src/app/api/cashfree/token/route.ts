import { NextResponse } from 'next/server';
import { CashfreeOrderResponse } from './../../../types/cashfree.d';


export async function POST(req: Request) {
  try {
    const { orderId, orderAmount, customerName, customerPhone, customerEmail } =
      await req.json();

    const res = await fetch('https://api.cashfree.com/pg/orders', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-client-id': process.env.CASHFREE_APP_ID!,
        'x-client-secret': process.env.CASHFREE_SECRET_KEY!,
        'x-api-version': '2023-08-01',
      },
      body: JSON.stringify({
        order_id: orderId,
        order_amount: orderAmount,
        order_currency: 'INR',
        customer_details: {
          customer_id: customerPhone,
          customer_name: customerName,
          customer_email: customerEmail,
          customer_phone: customerPhone,
        },
        order_note: 'Order Payment',
      notify_url: 'https://orthostyle-untranscended-nila.ngrok-free.dev/api/cashfree/webhook',

      }),
    });

    const data: CashfreeOrderResponse = await res.json();

    if (!res.ok || !data.payment_session_id) {
      console.error('Token generation failed', data);
      return NextResponse.json({ error: 'Token generation failed', data }, { status: 400 });
    }

    return NextResponse.json({ paymentSessionId: data.payment_session_id });
  } catch (err) {
    console.error('Server error:', err);
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}
