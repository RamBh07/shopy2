"use client";

import React, { useState } from "react";
import { useUser, SignInButton } from "@clerk/nextjs";

import { Button } from "@/components/ui/button";
import Address from "@/components/Address";

import CounterWrapper from '@/components/CountnerWrapper';
import { useSearchParams } from "next/navigation";
import PriceFormatter from "@/components/PriceFormatter";
import { Separator } from "@radix-ui/react-separator";

const CheckOutPage = () => {
    const { isSignedIn, user } = useUser();

    const [selectedAddress, setSelectedAddress] = useState<string | null>(null);
    const [selectedAddressTitle, setSelectedAddressTitle] = useState<string | null>(null);
    const [selectedFullAddress, setSelectedFullAddress] = useState<string | null>(null);
    const [paymentMode, setPaymentMode] = useState<string>("");
    const [selectedPaymentMode, setSelectedPaymentMode] = useState('')
    const searchParams = useSearchParams();
    const productName = searchParams.get("productName");
    const imgUrl = searchParams.get("imgUrl")
    const priceParam = searchParams.get("price");
    const discountParam = searchParams.get("discount")

    const price = priceParam ? Number(priceParam) : 0;

    console.log(selectedAddress);

    const isReadyToPay = isSignedIn && paymentMode !== "" && selectedAddress !== null;

    console.log(selectedAddressTitle);
    console.log(selectedFullAddress);
    // 🧱 If not logged in, show login screen first
    if (!isSignedIn) {
        return (
            <div className="flex flex-col items-center justify-center min-h-screen text-center">
                <h2 className="text-xl font-semibold mb-3">You need to log in first</h2>
                <p className="text-gray-600 mb-4">
                    Please log in to continue to checkout.
                </p>
                <SignInButton mode="modal">
                    <Button>Log in with Clerk</Button>
                </SignInButton>
            </div>
        );
    }

    return (

        <div className="flex flex-col md:flex-row justify-between gap-6 p-6">
            {/* LEFT SIDE */}
            <div className="flex-1 space-y-6">
                {/* Step 1 - User Info */}
                <div className="border p-4 rounded-xl shadow-sm">
                    <h2 className="text-lg font-semibold mb-2">1️⃣ User Details</h2>
                    <div className="mt-2">
                        <p className="font-medium">{user?.fullName}</p>
                        <p className="text-green-600 text-sm">✅ Logged in</p>
                    </div>
                </div>

                {/* Step 2 - Addresses */}
                <Address
                    onAddressSelect={(id, title, fullAddress) => {
                        setSelectedAddress(id);
                        setSelectedAddressTitle(title!);
                        setSelectedFullAddress(fullAddress!)
                    }}
                />




                {/* Step 3 - Payment Mode (Always Visible) */}
                <div className="border p-4 rounded-xl shadow-sm">
                    <h2 className="text-lg font-semibold mb-3">3️⃣ Payment Mode</h2>
                    <div className="flex gap-3">
                        <Button
                            variant={paymentMode === "Online" ? "default" : "outline"}
                            onClick={() => {
                                setPaymentMode("Online")

                                setSelectedPaymentMode("Online")
                            }}

                        >
                            Online Payment
                        </Button>
                        <Button
                            variant={paymentMode === "Cash on Delivery" ? "default" : "outline"}
                            onClick={() => {
                                setPaymentMode("Cash on Delivery")
                                setSelectedPaymentMode("Cash on Delivery")
                            }}
                        >
                            Cash on Delivery
                        </Button>
                    </div>

                    {paymentMode && (
                        <div className="mt-2 text-sm text-gray-700">
                            ✅ Selected: <span className="font-medium">{paymentMode}</span>
                        </div>
                    )}
                </div>
            </div>

            {/* RIGHT SIDE - ORDER SUMMARY */}
            <div className="flex-1 border p-4 rounded-xl shadow-sm h-fit sticky top-6">
                <h2 className="text-lg font-semibold mb-3">🧾 Order Summary</h2>
                <h4 className="text-center mb-2 opacity-80">{productName}</h4>
                <div className=" md:inline-block w-full bg-white p-6 rounded-lg border">
                    <div className="space-y-4">
                        <div className="flex items-center justify-between">
                            <span>SubTotal</span>
                            <PriceFormatter amount={price + Number(discountParam)} />
                        </div>
                        <div className="flex items-center justify-between">
                            <span>Discount</span>
                            <PriceFormatter
                                amount={Number(discountParam)}
                            />
                        </div>
                        <Separator />
                        <div className="flex items-center justify-between font-semibold text-lg">
                            <span>Total</span>
                            <PriceFormatter
                                amount={price}
                                className="text-lg font-bold text-black"
                            />
                        </div>
                        {/* <Button
                        className="w-full rounded-full font-semibold tracking-wide hoverEffect"
                        size="lg"

                    >
                    
                        Proceed to Checkout

                    </Button> */}
                    </div>
                </div>
                {/* <CounterWrapper price={0} name={""} productName={""}/> */}

                <div className="text-sm text-gray-600 mt-3 space-y-1">

                    <p>
                        <span className="font-medium">Delivery Address:</span>{" "}
                        {selectedAddressTitle || "Not selected"}
                    </p>
                    <p>
                        <span className="font-medium">Payment Mode:</span>{" "}
                        {paymentMode || "Not selected"}
                    </p>
                </div>

                {/* <Button className=" w-full mt-4 p-3" disabled={!isReadyToPay}>
                    Proceed to Checkout
                </Button> */}

                <CounterWrapper price={price} name={""} productName={productName!} selectedAddress={selectedFullAddress!} selectedPaymentMode={selectedPaymentMode} imgUrl={imgUrl!} isReady={isReadyToPay!} />

            </div>
        </div>

    );
};

export default CheckOutPage;
