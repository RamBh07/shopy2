import { NextResponse } from "next/server";
import axios from "axios";

import { currentUser } from "@clerk/nextjs/server";


export async function POST(req: Request) {
  try {
      const {  productName,productQuantity,orderAmount,customerPhone,userAddress,customerAddress,paymentMode} =
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
        order_amount: Number(orderAmount).toFixed(2),
        order_currency: "INR",
        customer_details: {
          customer_id: "cust_" + Date.now(),
          customer_name: userName_,
          customer_email: userEmail_,
          customer_phone: customerPhone,
       
          
        },
        order_meta: {
          return_url: `${process.env.NEXT_PUBLIC_DOMAIN_URL}/payment-success?order_id={orderId}`,
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
