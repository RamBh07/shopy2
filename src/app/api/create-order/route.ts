import { NextResponse } from "next/server";
import axios from "axios";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const orderId = "order_" + Date.now();

    const response = await axios.post(
      "https://api.cashfree.com/pg/orders",
      {
        order_id: orderId,
        order_amount: body.orderAmount,
        order_currency: "INR",
        customer_details: {
          customer_id: "cust_" + Date.now(),
          customer_name: body.customerName,
          customer_email: body.customerEmail,
          customer_phone: body.customerPhone,
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
  } catch (err) {
console.log(err);
    return NextResponse.json({ error: "Failed" }, { status: 500 });
  }
}
