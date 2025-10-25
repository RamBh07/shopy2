
import { NextResponse } from "next/server";
import { serverClient } from "@/sanity/lib/client";
import { currentUser } from "@clerk/nextjs/server";

export async function POST(req: Request) {
  try {
    const body = await req.json();

     const user = await currentUser()
             if(!user){
        return
             }
             const userEmail_ = user?.emailAddresses[0].emailAddress
             const userName_=user.fullName

    const newCashPayment = await serverClient.create({
        _type: "razorpayorder",
        orderId: body.orderId,
        paymentId: body.paymentId,
        userName: userName_,
        userEmail: userEmail_,
        amount: body.orderAmount,
        productName: body.productName,
        productQuantity: body.productQuantity,
        customerAddress: body.customerAddress,
        createdAt: new Date().toISOString(),
        paymentMode:body.paymentMode,
        productImgUrl:body.productImgUrl
    
    
    });

    return NextResponse.json({ success: true, data: newCashPayment });
  } catch (error) {
    console.error("Sanity create error:", error);
    return NextResponse.json({ success: false, error: String(error) }, { status: 500 });
  }
}
