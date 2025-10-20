// import { NextRequest, NextResponse } from "next/server";
// import crypto from "crypto";

// import { client } from "@/sanity/lib/client";

// const generatedSignature = (
//   razorpayOrderId: string,
//   razorpayPaymentId: string
// ) => {
//   const keySecret = process.env.RAZORPAY_SECRET_ID as string;

//   const sig = crypto
//     .createHmac("sha256", keySecret)
//     .update(razorpayOrderId + "|" + razorpayPaymentId)
//     .digest("hex");
//   return sig;
// };

// export async function POST(request: NextRequest) {
//   const { orderId, razorpayPaymentId, razorpaySignature,name,amount } =
//     await request.json();


//   const signature = generatedSignature(orderId, razorpayPaymentId);
//   if (signature !== razorpaySignature) {
//     return NextResponse.json(
//       { message: "payment verification failed", isOk: false , },
//       { status: 400 }
//     );
//   }
      
//   // ✅ Store order in Sanity
//       const orderDoc = await client.create({
//         _type: "razorpayorder",
//         orderId: orderId,
//         paymentId: razorpayPaymentId,
//         userName: name,
//         amount: amount,
//         status: "paid",
//         createdAt: new Date().toISOString(),
//       });
//   // Probably some database calls here to update order or add premium status to user
//   return NextResponse.json(
//     { message: "payment verified successfully", isOk: true,orderDoc},
//     { status: 200 }
//   );
// }

import { NextRequest, NextResponse } from "next/server";
import crypto from "crypto";

import { client } from "@/sanity/lib/client";

import { currentUser } from '@clerk/nextjs/server';

const generatedSignature = (
  razorpayOrderId: string,
  razorpayPaymentId: string
) => {
  const keySecret = process.env.RAZORPAY_SECRET_ID as string;

  const sig = crypto
    .createHmac("sha256", keySecret)
    .update(razorpayOrderId + "|" + razorpayPaymentId)
    .digest("hex");
  return sig;
};
  
   
export async function POST(request: NextRequest) {
  const { orderId, razorpayPaymentId, razorpaySignature,name,amount,productName,productCategory,productBrand,productQuantity,createdAt} =
    await request.json();


  const signature = generatedSignature(orderId, razorpayPaymentId);
  if (signature !== razorpaySignature) {
    return NextResponse.json(
      { message: "payment verification failed", isOk: false , },
      { status: 400 }
    );
  }
   const user = await currentUser()
     if(!user){
return
     }
     const userEmail_ = user?.emailAddresses[0].emailAddress
       
  // ✅ Store order in Sanity
  const orderDoc = await client.create({
    _type: "razorpayorder",
    orderId: orderId,
    paymentId: razorpayPaymentId,
    userName: name,
    userEmail:userEmail_,
    amount: amount,
    productName: productName,
    productCategory: productCategory,
    productBrand: productBrand,
    productQuantity: productQuantity,
    createdAt: createdAt

      });
  // Probably some database calls here to update order or add premium status to user
  return NextResponse.json(
    { message: "payment verified successfully", isOk: true,orderDoc},
    { status: 200 }
  );
}