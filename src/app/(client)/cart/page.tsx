"use client";

// import {
//   createCheckoutSession,
//   Metadata,
// } from "@/actions/createCheckoutSession";
import AddToWishlist from "@/components/AddToWishlist";
import Container from "@/components/Container";
import EmptyCart from "@/components/EmptyCart";
import NoAccess from "@/components/NoAccess";
import PriceFormatter from "@/components/PriceFormatter";

import QuantityButtons from "@/components/QuantityButtons";
import Title from "@/components/Title";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Separator } from "@/components/ui/separator";
import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from "@/components/ui/tooltip";
import { Address } from "@/sanity.types";
import { client } from "@/sanity/lib/client";
import { urlFor } from "@/sanity/lib/image";
import useStore from "@/store";
import { useUser } from "@clerk/nextjs";
import { ShoppingBag, Trash } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import Script from "next/script";

const CartPage = () => {
    const {
        deleteCartProduct,
        getTotalPrice,
        getItemCount,
        getSubTotalPrice,
        resetCart,
    } = useStore();
    const [loading, setLoading] = useState(false);
    const groupedItems = useStore((state) => state.getGroupedItems());
    // const { isSignedIn } = useAuth();

    const [addresses, setAddresses] = useState<Address[] | null>(null);
    const [selectedAddress, setSelectedAddress] = useState<Address | null>(null);

    const fetchAddresses = async () => {
        setLoading(true);
        try {
            const query = `*[_type=="address"] | order(publishedAt desc)`;
            const data = await client.fetch(query);
            setAddresses(data);
            const defaultAddress = data.find((addr: Address) => addr.default);
            if (defaultAddress) {
                setSelectedAddress(defaultAddress);
            } else if (data.length > 0) {
                setSelectedAddress(data[0]); // Optional: select first address if no default
            }
        } catch (error) {
            console.log("Addresses fetching error:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchAddresses();
    }, []);

    const handleResetCart = () => {
        const confirmed = window.confirm(
            "Are you sure you want to reset your cart?"
        );
        if (confirmed) {
            resetCart();
            toast.success("Cart reset successfully!");
        }
    };

    const [userName, setUserName] = useState("");
    const [amount, setAmount] = useState<number>(0);
    const { user } = useUser()
    const { isSignedIn } = useUser()
    useEffect(() => {
        if (user) {
            setUserName(user.fullName || "")
            setAmount(getTotalPrice())
        }
    }, [getTotalPrice, user])


    const handleCheckout = () => {
        setLoading(true);

        const createOrder = async () => {

            console.log(getTotalPrice());
            console.log(amount + "this is");
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
                            name: userName,
                            amount: amount
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
        createOrder()


    }


    return (
        <>

            <div className="bg-gray-50 pb-52 md:pb-10">
                <Script
                    type="text/javascript"
                    src="https://checkout.razorpay.com/v1/checkout.js"
                />
                {isSignedIn ? (
                    <Container>
                        {groupedItems?.length ? (
                            <>
                                <div className="flex items-center gap-2 py-5">
                                    <ShoppingBag className="text-darkColor" />
                                    <Title>Shopping Cart</Title>
                                </div>
                                <div className="grid lg:grid-cols-3 md:gap-8">
                                    <div className="lg:col-span-2 rounded-lg">
                                        <div className="border bg-white rounded-md">
                                            {groupedItems?.map(({ product }) => {
                                                const itemCount = getItemCount(product?._id);
                                                return (
                                                    <div
                                                        key={product?._id}
                                                        className="border-b p-2.5 last:border-b-0 flex items-center justify-between gap-5"
                                                    >
                                                        <div className="flex flex-1 items-start gap-2 h-36 md:h-44">
                                                            {product?.images && (
                                                                <Link
                                                                    href={`/product/${product?.slug?.current}`}
                                                                    className="border p-0.5 md:p-1 mr-2 rounded-md  overflow-hidden group"
                                                                >
                                                                    <Image
                                                                        src={urlFor(product?.images[0]).url()}
                                                                        alt="productImage"
                                                                        width={500}
                                                                        height={500}
                                                                        loading="lazy"
                                                                        className="w-32 md:w-40 h-32 md:h-40 object-cover group-hover:scale-105 hoverEffect"
                                                                    />
                                                                </Link>
                                                            )}
                                                            <div className="h-full flex flex-1 flex-col justify-between py-1">
                                                                <div className="flex flex-col gap-0.5 md:gap-1.5">
                                                                    <h2 className="text-base font-semibold line-clamp-1">
                                                                        {product?.name}
                                                                    </h2>
                                                                    <p className="text-sm capitalize">
                                                                        Variant:{" "}
                                                                        <span className="font-semibold">
                                                                            {product?.variant}
                                                                        </span>
                                                                    </p>
                                                                    <p className="text-sm capitalize">
                                                                        Status:{" "}
                                                                        <span className="font-semibold">
                                                                            {product?.status}
                                                                        </span>
                                                                    </p>
                                                                </div>
                                                                <div className="flex items-center gap-2">
                                                                    <TooltipProvider>
                                                                        <Tooltip>
                                                                            <TooltipTrigger>
                                                                                <AddToWishlist
                                                                                    product={product}
                                                                                    className="relative top-0 right-0"
                                                                                />
                                                                            </TooltipTrigger>
                                                                            <TooltipContent className="font-bold">
                                                                                Add to Favorite
                                                                            </TooltipContent>
                                                                        </Tooltip>
                                                                        <Tooltip>
                                                                            <TooltipTrigger>
                                                                                <Trash
                                                                                    onClick={() => {
                                                                                        deleteCartProduct(product?._id);
                                                                                        toast.success(
                                                                                            "Product deleted successfully!"
                                                                                        );
                                                                                    }}
                                                                                    className="w-4 h-4 md:w-5 md:h-5 mr-1 text-gray-500 hover:text-red-600 hoverEffect"
                                                                                />
                                                                            </TooltipTrigger>
                                                                            <TooltipContent className="font-bold bg-red-600">
                                                                                Delete product
                                                                            </TooltipContent>
                                                                        </Tooltip>
                                                                    </TooltipProvider>
                                                                </div>
                                                            </div>
                                                        </div>
                                                        <div className="flex flex-col items-start justify-between h-36 md:h-44 p-0.5 md:p-1">
                                                            <PriceFormatter
                                                                amount={(product?.price as number) * itemCount}
                                                                className="font-bold text-lg"
                                                            />
                                                            <QuantityButtons product={product} />
                                                        </div>
                                                    </div>
                                                );
                                            })}
                                            <Button
                                                onClick={handleResetCart}
                                                className="m-5 font-semibold"
                                                variant="destructive"
                                            >
                                                Reset Cart
                                            </Button>
                                        </div>
                                    </div>
                                    <div>
                                        <div className="lg:col-span-1">
                                            <div className="hidden md:inline-block w-full bg-white p-6 rounded-lg border">
                                                <h2 className="text-xl font-semibold mb-4">
                                                    Order Summary
                                                </h2>
                                                <div className="space-y-4">
                                                    <div className="flex items-center justify-between">
                                                        <span>SubTotal</span>
                                                        <PriceFormatter amount={getSubTotalPrice()} />
                                                    </div>
                                                    <div className="flex items-center justify-between">
                                                        <span>Discount</span>
                                                        <PriceFormatter
                                                            amount={getSubTotalPrice() - getTotalPrice()}
                                                        />
                                                    </div>
                                                    <Separator />
                                                    <div className="flex items-center justify-between font-semibold text-lg">
                                                        <span>Total</span>
                                                        <PriceFormatter
                                                            amount={getTotalPrice()}
                                                            className="text-lg font-bold text-black"
                                                        />
                                                    </div>
                                                    <Button
                                                        className="w-full rounded-full font-semibold tracking-wide hoverEffect"
                                                        size="lg"
                                                        disabled={loading}
                                                        onClick={handleCheckout}
                                                    >
                                                        {loading ? "Please wait..." : "Proceed to Checkout"}
                                                    </Button>
                                                </div>
                                            </div>
                                            {addresses && (
                                                <div className="bg-white rounded-md mt-5">
                                                    <Card>
                                                        <CardHeader>
                                                            <CardTitle>Delivery Address</CardTitle>
                                                        </CardHeader>
                                                        <CardContent>
                                                            <RadioGroup
                                                                defaultValue={addresses
                                                                    ?.find((addr) => addr.default)
                                                                    ?._id.toString()}
                                                            >
                                                                {addresses?.map((address) => (
                                                                    <div
                                                                        key={address?._id}
                                                                        onClick={() => setSelectedAddress(address)}
                                                                        className={`flex items-center space-x-2 mb-4 cursor-pointer ${selectedAddress?._id === address?._id && "text-shop_dark_green"}`}
                                                                    >
                                                                        <RadioGroupItem
                                                                            value={address?._id.toString()}
                                                                        />
                                                                        <Label
                                                                            htmlFor={`address-${address?._id}`}
                                                                            className="grid gap-1.5 flex-1"
                                                                        >
                                                                            <span className="font-semibold">
                                                                                {address?.name}
                                                                            </span>
                                                                            <span className="text-sm text-black/60">
                                                                                {address.address}, {address.city},{" "}
                                                                                {address.state} {address.zip}
                                                                            </span>
                                                                        </Label>
                                                                    </div>
                                                                ))}
                                                            </RadioGroup>
                                                            <Button variant="outline" className="w-full mt-4">
                                                                Add New Address
                                                            </Button>
                                                        </CardContent>
                                                    </Card>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                    {/* Order summary for mobile view */}
                                    <div className="md:hidden fixed bottom-0 left-0 w-full bg-white pt-2">
                                        <div className="bg-white p-4 rounded-lg border mx-4">
                                            <h2>Order Summary</h2>
                                            <div className="space-y-4">
                                                <div className="flex items-center justify-between">
                                                    <span>SubTotal</span>
                                                    <PriceFormatter amount={getSubTotalPrice()} />
                                                </div>
                                                <div className="flex items-center justify-between">
                                                    <span>Discount</span>
                                                    <PriceFormatter
                                                        amount={getSubTotalPrice() - getTotalPrice()}
                                                    />
                                                </div>
                                                <Separator />
                                                <div className="flex items-center justify-between font-semibold text-lg">
                                                    <span>Total</span>
                                                    <PriceFormatter
                                                        amount={getTotalPrice()}
                                                        className="text-lg font-bold text-black"
                                                    />
                                                </div>
                                                <Button
                                                    className="w-full rounded-full font-semibold tracking-wide hoverEffect"
                                                    size="lg"
                                                    disabled={loading}
                                                    onClick={handleCheckout}
                                                >
                                                    {loading ? "Please wait..." : "Proceed to Checkout"}
                                                </Button>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </>
                        ) : (
                            <EmptyCart />
                        )}
                    </Container>
                ) : (
                    <NoAccess />
                )}
            </div>
        </>
    );


};

export default CartPage;
