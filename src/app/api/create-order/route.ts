import { NextResponse } from "next/server";
import axios from "axios";
import { client } from "@/sanity/lib/client";
import { currentUser } from "@clerk/nextjs/server";
import paymentLink from "razorpay/dist/types/paymentLink";

export async function POST(req: Request) {
  try {
      const {  razorpayPaymentId, name,amount,productName,productCategory,productBrand,productQuantity,createdAt,orderAmount,customerName,customerEmail,customerPhone,userAddress,customerAddress,paymentMode} =
    await req.json();
  const user = await currentUser()
         if(!user){
    return
         }
         const userEmail_ = user?.emailAddresses[0].emailAddress
         const userName_=user.fullName
   
    const orderId = "order_" + Date.now();

    const response = await axios.post(
      "https://api.cashfree.com/pg/orders",
      {
        order_id: orderId,
        order_amount: orderAmount,
        order_currency: "INR",
        customer_details: {
          customer_id: "cust_" + Date.now(),
          customer_name: userName_,
          customer_email: userEmail_,
          customer_phone: customerPhone,
          productName: productName,
          addreess: userAddress,
          productQuantity: productQuantity,
          customerAddress:customerAddress,
          paymentMode:paymentMode
          
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
     
  
           const { payment_session_id } = response.data;
   const paymentLink = `https://payments.cashfree.com/order/#/checkout?payment_session_id=${payment_session_id}`;
    return NextResponse.json({
      orderId,
      paymentLink:paymentLink,
      payment_session_id,

      
    });
  } catch (err) {
console.log(err);
    return NextResponse.json({ error: "Failed" }, { status: 500 });
  }
}
