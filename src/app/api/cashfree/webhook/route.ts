import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    console.log('🔔 Cashfree webhook received:', body);

    // TODO: Verify signature and update order status in DB
    // if (body.txStatus === 'SUCCESS') { ... }

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error('Webhook error:', err);
    return NextResponse.json({ error: 'Invalid payload' }, { status: 400 });
  }
}
