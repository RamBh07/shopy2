import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const data = await req.json();

    // Cashfree sends order_id, reference_id, order_amount, order_status etc.
    console.log("Cashfree Webhook Data:", data);

    // Verify signature if needed (optional, recommended for security)
    // const signature = req.headers.get("x-webhook-signature");

    // TODO: Update your database order status here
    // Example: mark order as PAID if data.order_status === "PAID"

    return NextResponse.json({ status: "ok" });
  } catch (err) {
    console.error("Webhook error:", err);
    return NextResponse.json({ status: "error" }, { status: 500 });
  }
}
