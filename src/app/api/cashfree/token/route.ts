import { NextResponse } from "next/server";
import axios from "axios";

export async function POST(req: Request) {
  try {
    const { orderAmount, customerName, customerEmail, customerPhone } = await req.json();

    const orderId = "order_" + Date.now();

    const response = await axios.post(
      "https://api.cashfree.com/pg/orders",
      {
        order_id: orderId,
        order_amount: orderAmount,
        order_currency: "INR",
        order_note: "Order for demo",
        customer_details: {
          customer_id: "cust_" + Date.now(),
          customer_name: customerName,
          customer_email: customerEmail,
          customer_phone: customerPhone,
        },
        order_meta: {
          return_url: `${process.env.NEXT_PUBLIC_DOMAIN_URL}/payment-status?order_id={order_id}`,
          notify_url: `${process.env.NEXT_PUBLIC_DOMAIN_URL}/api/cashfree-webhook`,
        },
      },
      {
        headers: {
          "x-client-id": process.env.NEXT_PUBLIC_CASHFREE_APP_ID!,
          "x-client-secret": process.env.CASHFREE_SECRET_KEY!,
          "x-api-version": "2022-09-01",
          "Content-Type": "application/json",
        },
      }
    );

    return NextResponse.json(response.data);
  } catch (error) {
   console.log(error);
    return NextResponse.json({ error: "Cashfree order failed" }, { status: 500 });
  }
}
