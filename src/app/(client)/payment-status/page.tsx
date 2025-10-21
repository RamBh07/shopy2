"use client";
import { useSearchParams } from "next/navigation";
import React, { useEffect, useState } from "react";
import axios from "axios";

export default function PaymentStatusPage() {
    const params = useSearchParams();
    const orderId = params.get("order_id");
    const [status, setStatus] = useState("Checking...");

    useEffect(() => {
        if (!orderId) return;
        axios
            .get(`https://api.cashfree.com/pg/orders/${orderId}`, {
                headers: {
                    "x-client-id": process.env.NEXT_PUBLIC_CASHFREE_APP_ID!,
                    "x-client-secret": process.env.CASHFREE_SECRET_KEY!,
                    "x-api-version": "2022-09-01",
                },
            })
            .then((res) => {
                setStatus(res.data.order_status);
            })
            .catch(() => setStatus("Error fetching status"));
    }, [orderId]);

    return (
        <div className="p-6 text-center">
            <h1 className="text-2xl font-bold mb-4">Payment Status</h1>
            <p className="text-lg">Order ID: {orderId}</p>
            <p className="text-xl mt-4 font-semibold">Status: {status}</p>
        </div>
    );
}
