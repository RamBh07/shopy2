import { NextResponse } from "next/server";
import { createHmac } from "crypto";
import { serverClient } from "@/sanity/lib/client";

export async function POST(req: Request) {
  try {
    const data = await req.json();
    const signature = req.headers.get("x-webhook-signature");

    if (!signature) return NextResponse.json({ status: "error", message: "Missing signature" }, { status: 400 });

    const keys = Object.keys(data).sort();
    let payload = "";
    keys.forEach(key => payload += data[key]);

    const hmac = createHmac("sha256", process.env.CASHFREE_SECRET_KEY!);
    hmac.update(payload);
    const calculated = hmac.digest("hex");

    if (calculated !== signature) return NextResponse.json({ status: "error", message: "Invalid signature" }, { status: 400 });

if (data?.data?.payment?.payment_status === "SUCCESS") {
      const order = data.data.order;

          // ✅ Store order in Sanity
     const orderDoc= await serverClient.create({
         _type: "razorpayorder",
        orderId: order.order_id,
        paymentId: data.data.payment.payment_id,
        userName: order.customer_details.customer_name,
        userEmail: order.customer_details.customer_email,
        amount: order.order_amount,
        productName: order.customer_details.productName,
        productQuantity: order.customer_details.productQuantity,
        customerAddress: order.customer_details.address,
        createdAt: new Date().toISOString(),
        paymentMode:order.customer_details.paymentMode
    
          });
          console.log(orderDoc + "ordersdoc is here");
}

    console.log("Webhook verified:", data);
    return NextResponse.json({ status: "ok" });
  } catch (err) {
    console.error("Webhook error:", err);
    return NextResponse.json({ status: "error" }, { status: 500 });
  }
}
