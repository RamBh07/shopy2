import Container from "@/components/Container";
import Title from "@/components/Title";
import Image from "next/image";
import { getOrderById } from "@/lib/getOrders"; // we'll create this
import { IndianRupee, CheckCircle, Clock, Truck, Package, MapPin } from "lucide-react";
import React from "react";
import OrderStatusTracker from "@/components/OrderStatusTracker";

// types/order.ts
interface RazorpayOrder {
    _id: string;
    orderId: string;
    paymentId: string;
    userName: string;
    amount: number;
    productName: string;
    productCategory: string;
    productBrand: string;
    productQuantity: number;
    productImage?: string;
    status: string;
    createdAt: string;
    userEmail: string;
    productImgUrl: string;
    paymentMode?: string;
    customerAddress: string,
}

const OrderDetailsPage = async ({ params }: { params: { id: string } }) => {
    const orderId = params.id;
    const order: RazorpayOrder | null = await getOrderById(orderId);

    if (!order) {
        return (
            <Container>
                <div className="text-center mt-20 text-gray-500 text-lg">
                    Order not found
                </div>
            </Container>
        );
    }

    return (
        <Container>
            <Title className="mt-2 text-2xl font-semibold text-gray-800">
                Order Details
            </Title>

            <div className="bg-white shadow-md rounded-2xl mt-5 p-6 space-y-6">
                {/* Product Overview */}
                <div className="flex flex-col md:flex-row gap-6 " >
                    <div className="flex-shrink-0 mx-auto bg-white p-4 rounded-3xl shadow-xl hover:shadow-2xl transition-shadow duration-300">
                        <Image
                            src={order.productImgUrl || "/products/product_1.png"}
                            alt={order.productName}
                            width={220}
                            height={220}
                            className="rounded-2xl object-cover w-[220px] h-[220px]"
                        />
                    </div>


                    <div className="flex-1 space-y-2">
                        <h2 className="text-2xl font-semibold text-gray-800">
                            {order.productName}
                        </h2>
                        {/* <p className="text-gray-600">
                            Category: <span className="font-medium">{order.productCategory}</span>
                        </p>
                        <p className="text-gray-600">
                            Brand: <span className="font-medium">{order.productBrand}</span>
                        </p> */}

                        <div className="flex justify-between text-gray-700 mt-4">
                            <span>Quantity</span>
                            <span className="font-semibold">{order.productQuantity}</span>
                        </div>

                        <div className="flex justify-between text-gray-700">
                            <span>Total Amount</span>
                            <span className="flex items-center font-semibold text-gray-900">
                                <IndianRupee size={15} className="mr-1" />
                                {order.amount}
                            </span>
                        </div>
                    </div>
                </div>
                {/* Order Tracking */}
                <OrderStatusTracker status={"placed"} />

                {/* Order Info */}
                <div className="border-t pt-5 space-y-3">
                    <h3 className="text-xl font-semibold text-gray-800">Order Info</h3>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-2 text-gray-700">
                        <p>
                            <span className="font-medium">Order ID:</span> {order.orderId}
                        </p>
                        <p>
                            <span className="font-medium">Payment ID:</span> {order.paymentId || "N/A"}
                        </p>
                        <p>
                            <span className="font-medium">Payment Method:</span>{" "}
                            {order.paymentMode || "Not specified"}
                        </p>
                        <p>
                            <span className="font-medium">Order Date:</span>{" "}
                            {new Date(order.createdAt).toLocaleDateString("en-IN", {
                                day: "numeric",
                                month: "long",
                                year: "numeric",
                            })}
                        </p>
                    </div>
                </div>

                {/* Delivery Info */}

                <div className="border-t pt-5">
                    <h3 className="text-xl font-semibold text-gray-800 mb-2">
                        Delivery Address
                    </h3>
                    <div className="flex items-start gap-3 text-gray-700">
                        <MapPin className="text-pink-600 mt-1" />
                        <div>

                            <p>{order.customerAddress!}</p>

                        </div>
                    </div>
                </div>




            </div>
        </Container>
    );
};

export default OrderDetailsPage;
