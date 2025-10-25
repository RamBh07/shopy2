import Container from '@/components/Container'
import Title from '@/components/Title'
import { getOrder } from '@/lib/getOrders'

import { currentUser } from '@clerk/nextjs/server'
import { IndianRupee } from 'lucide-react'

import Image from 'next/image'
import Link from 'next/link'
import React from 'react'

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
    productImgUrl: string,
}


const OrderPage = async () => {

    const user = await currentUser()
    if (!user) {
        return
    }


    const userEmail = user?.emailAddresses[0].emailAddress

    if (!userEmail) {
        console.log('no user name');
    }
    const userOrders = await getOrder(userEmail!);
    if (userOrders) {
        console.log("Fetched orders:", userOrders);
    } else {
        console.log("No orders found for this user.");
    }
    return (
        <Container>
            <Title className="mt-2 text-2xl font-semibold text-gray-800">
                My Orders
            </Title>

            <div className="mt-4 space-y-4">
                {userOrders && userOrders.length > 0 ? (
                    userOrders.map((order: RazorpayOrder) => (
                        <div

                            key={order._id}
                            className="block"
                        >
                            <div className="group flex flex-col md:flex-row items-center md:items-start justify-between gap-4 bg-white border border-gray-200 hover:border-pink-400 rounded-2xl shadow-sm hover:shadow-md transition-all duration-300 p-4 sm:p-5">
                                {/* Product Image */}
                                <div className="flex-shrink-0">
                                    <div className="overflow-hidden rounded-xl">
                                        <Image
                                            src={order.productImgUrl || "/products/product_1.png"}
                                            alt={order.productName || "Product"}
                                            width={180}
                                            height={180}
                                            className="rounded-xl object-cover w-[150px] h-[150px] sm:w-[180px] sm:h-[180px] group-hover:scale-105 transition-transform duration-300"
                                        />
                                    </div>
                                </div>

                                {/* Product Details */}
                                <div className="flex-1 w-full md:w-auto">
                                    <div className="flex flex-col justify-between h-full space-y-2">
                                        <p className="capitalize font-semibold text-lg sm:text-xl text-gray-800">
                                            {order.productName || "Unknown Product"}
                                        </p>

                                        <div className="flex justify-between text-sm sm:text-base text-gray-600">
                                            <span>Quantity</span>
                                            <span className="font-medium text-gray-900">
                                                {order.productQuantity || 1}
                                            </span>
                                        </div>

                                        <div className="flex justify-between text-sm sm:text-base text-gray-600">
                                            <span>Price</span>
                                            <span className="flex items-center font-medium text-gray-900">
                                                <IndianRupee size={15} className="mr-1" />
                                                {order.amount || 0}
                                            </span>
                                        </div>

                                        <div className="flex justify-end">
                                            <Link
                                                href={`/orderpage/${order._id}`} // pass the ID in the URL
                                                key={order._id}
                                                className="text-sm px-4 py-1.5 rounded-full bg-pink-100 text-pink-700 font-medium hover:bg-pink-200 transition-colors duration-300"
                                            >
                                                View Details →
                                            </Link>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))
                ) : (
                    <div className="text-center text-gray-500 mt-10 text-lg">
                        No Purchased Products
                    </div>
                )}
            </div>
        </Container>
    )
}

export default OrderPage