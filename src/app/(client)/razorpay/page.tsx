"use client";





import Script from "next/script";
import { useEffect, useState } from "react";

import { useUser } from "@clerk/nextjs"


export default function Home() {
    const [userName, setUserName] = useState("");

    const { user } = useUser()
    useEffect(() => {
        if (user) {
            setUserName(user.fullName || "")
        }
    }, [user])

    const [amount, setAmount] = useState<number>(0);



    const createOrder = async () => {
        const res = await fetch("/api/createOrder", {
            method: "POST",
            body: JSON.stringify({ amount: amount * 100, userName }),
        });
        const data = await res.json();

        const paymentData: RazorpayOptions = {
            key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID!, // use ! to tell TS it exists
            amount: amount * 100, // amount in paise, e.g., 500 * 100 = 50000
            currency: "INR",
            order_id: data.id,
            handler: async (response: RazorpayResponse) => {
                const res = await fetch("/api/verifyOrder", {
                    method: "POST",
                    body: JSON.stringify({
                        orderId: response.razorpay_order_id,
                        razorpayPaymentId: response.razorpay_payment_id,
                        razorpaySignature: response.razorpay_signature,
                    }),
                });

                window.location.href = `/payment-success?paymentId=${response.razorpay_payment_id}&orderId=${response.razorpay_order_id}&user=${encodeURIComponent(
                    userName
                )}`;

                const data = await res.json();
                if (data.isOk) {
                    // alert("Payment successful");
                    console.log(data);


                } else {
                    alert("Payment failed");
                }



            },
        };


        const payment = new window.Razorpay(paymentData);
        payment.open();
    };

    return (
        <div className="flex w-screen h-screen items-center justify-center flex-col gap-4">
            <Script
                type="text/javascript"
                src="https://checkout.razorpay.com/v1/checkout.js"
            />

            <input
                type="number"
                placeholder="Enter amount"
                className="px-4 py-2 rounded-md text-black"
                value={amount}
                onChange={(e) => setAmount(Number(e.target.value))}
            />
            <button
                className="bg-green-500 text-white px-4 py-2 rounded-md"
                onClick={createOrder}
            >
                Create Order
            </button>

        </div>
    );
}