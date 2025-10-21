"use client";
import React, { useState } from "react";

import axios from "axios";
import { load } from "@cashfreepayments/cashfree-js";

export default function CheckoutPage() {
    const [loading, setLoading] = useState(false);

    const handlePayment = async () => {
        setLoading(true);
        try {
            // 1️⃣ Create order session on server
            const { data } = await axios.post("/api/create-order", {
                orderAmount: 1,
                customerName: "John Doe",
                customerEmail: "john@example.com",
                customerPhone: "9999999999",
            });

            if (!data.payment_session_id) {
                alert("No payment session ID received");
                return;
            }

            const mode = process.env.NEXT_PUBLIC_CASHFREE_MODE;
            if (mode !== "sandbox" && mode !== "production") {
                throw new Error("Invalid CASHFREE_MODE. Must be 'sandbox' or 'production'.");
            }

            const cf = await load({ mode });

            // 3️⃣ Start checkout
            await cf.checkout({
                paymentSessionId: data.payment_session_id,
                redirectTarget: "_self",
            });
        } catch (err) {
            console.error("Payment error:", err);
            alert("Payment failed. Check console for details.");
        } finally {
            setLoading(false);
        }
    };


    return (
        <div className="flex flex-col items-center justify-center min-h-screen">
            <h1 className="text-2xl font-bold mb-4">Cashfree Payment</h1>
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
