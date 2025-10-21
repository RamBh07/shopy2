import { NextResponse } from "next/server";
import { createHmac } from "crypto";

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

    console.log("Webhook verified:", data);
    return NextResponse.json({ status: "ok" });
  } catch (err) {
    console.error("Webhook error:", err);
    return NextResponse.json({ status: "error" }, { status: 500 });
  }
}
