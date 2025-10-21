"use client";
import React, { useEffect, useState } from "react";
import axios from "axios";



export default function CheckoutPage() {
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        const script = document.createElement("script");
        script.src = "https://sdk.cashfree.com/js/ui/2.0.0/cashfree.prod.js";
        script.async = true;
        script.onload = () => console.log("✅ Cashfree SDK loaded");
        script.onerror = () => console.error("❌ Failed to load Cashfree SDK");
        document.body.appendChild(script);

        // ✅ Correct cleanup
        return () => {
            document.body.removeChild(script);
        };
    }, []);


    const handlePayment = async () => {
        setLoading(true);
        try {
            const { data } = await axios.post("/api/cashfree/token", {
                orderAmount: 1,
                customerName: "John Doe",
                customerEmail: "john@example.com",
                customerPhone: "9999999999",
            });

            if (!data.payment_session_id) {
                throw new Error("No payment_session_id from server");
            }

            if (!window.Cashfree) {
                alert("Cashfree SDK not loaded yet!");
                return;
            }

            const cashfree = new window.Cashfree!({
                mode: process.env.NEXT_PUBLIC_CASHFREE_MODE!,
            });

            cashfree
                .checkout({
                    paymentSessionId: data.payment_session_id,
                    redirectTarget: "_self",
                })
                .then(() => console.log("Payment flow initiated"))
                .catch((err: unknown) => console.error("Payment failed:", err));
        } catch (err) {
            console.error("Error initiating payment:", err);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex flex-col items-center justify-center min-h-screen">
            <h1 className="text-2xl font-bold mb-4">Cashfree Live Payment</h1>
            <button
                onClick={handlePayment}
                disabled={loading}
                className="bg-green-500 text-white px-6 py-2 rounded-md"
            >
                {loading ? "Processing..." : "Pay ₹1"}
            </button>
        </div>
    );
}
