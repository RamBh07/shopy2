"use client";
import React, { useEffect, useState } from "react";
import axios from "axios";
import { CashfreeInstance } from "@/app/types/cashfree";

type CashfreeConstructor = new (config: { mode: string }) => {
    checkout(options: { paymentSessionId: string; redirectTarget?: string }): Promise<void>;
};

export default function CheckoutPage() {
    const [loading, setLoading] = useState(false);
    const [sdkLoaded, setSdkLoaded] = useState(false);

    useEffect(() => {
        const script = document.createElement("script");
        script.src = "https://sdk.cashfree.com/js/ui/2.0.0/cashfree.prod.js";
        script.async = true;

        script.onload = () => {
            console.log("Cashfree SDK Loaded");
            setSdkLoaded(true);
        };

        script.onerror = () => console.error("Failed to load Cashfree SDK");

        document.body.appendChild(script);

        return () => {
            if (document.body.contains(script)) document.body.removeChild(script);
        };
    }, []);

    const handlePayment = async () => {
        if (!sdkLoaded) {
            alert("SDK not loaded yet!");
            return;
        }

        setLoading(true);
        try {
            const { data } = await axios.post("/api/createOrder", {
                orderAmount: 1,
                customerName: "John Doe",
                customerEmail: "john@example.com",
                customerPhone: "9999999999",
            });

            if (!window.Cashfree) {
                alert("Cashfree SDK not loaded!");
                return;
            }

            const CashfreeClass = window.Cashfree!;
            const cashfree: CashfreeInstance = new CashfreeClass({
                mode: process.env.NEXT_PUBLIC_CASHFREE_MODE!,
            });


            await cashfree.checkout({
                paymentSessionId: data.payment_session_id,
                redirectTarget: "_self",
            });
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
                disabled={loading || !sdkLoaded}
                className="bg-green-500 text-white px-6 py-2 rounded-md"
            >
                {loading ? "Processing..." : "Pay ₹1"}
            </button>
        </div>
    );
}
