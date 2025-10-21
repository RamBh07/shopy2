import { NextResponse } from 'next/server';
import Razorpay from 'razorpay';

  const razorpay=  new Razorpay({ key_id: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID!, key_secret: process.env.RAZORPAY_SECRET_ID! })

export async function POST(req: Request) {

  try {
    const body = await req.json();

    const options = {
      amount: body.amount, // amount in paise
      currency: "INR",
      receipt: `receipt_${Date.now()}`,
      notes: {
        userName: body.userName,
        email: body.email || "",
        items: JSON.stringify(body.items || []),
      },
    };

    const order = await razorpay.orders.create(options);

    return NextResponse.json({
      id: order.id,
      amount: order.amount,
      currency: order.currency,
      receipt: order.receipt,
      userName: body.userName,
      email: body.email,
      items: body.items,
    });
  } catch (error) {
    console.error("Razorpay create order error:", error);
    return NextResponse.json({ error: "Failed to create order" }, { status: 500 });
  }
}
