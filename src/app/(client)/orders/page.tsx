import Container from '@/components/Container'
import Title from '@/components/Title'
import { getOrder } from '@/lib/getOrders'

import { currentUser } from '@clerk/nextjs/server'

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
}


const OrderPage = async () => {

    const user = await currentUser()
    if (!user) {
        return
    }
    const userName = user?.fullName

    if (!userName) {
        console.log('no user name');
    }
    const userOrders = await getOrder(userName!);
    if (userOrders) {
        console.log("Fetched orders:", userOrders);
    } else {
        console.log("No orders found for this user.");
    }
    return (
        <Container>
            <Title className='mt-1' >
                My  Orders
            </Title>
            <div>
                {userOrders && userOrders.length > 0 ? (
                    userOrders.map((order: RazorpayOrder) => (
                        <Link href={`/orders/${order._id}`} key={order._id}>
                            <div className="flex justify-between items-center bg-shop_light_pink mt-2 pr-5 pt-1 rounded-md md:justify-center hover:opacity-80 shadow-sm">
                                {/* Product Image */}
                                <div>
                                    <Image
                                        src={order.productImage || "/products/product_1.png"}
                                        alt={order.productName || "Product"}
                                        width={200}
                                        height={200}
                                        className="rounded-md"
                                    />
                                </div>

                                {/* Product Details */}
                                <div className="space-y-0.5 w-full md:w-auto md:ml-6">
                                    <p className="capitalize font-medium text-lg">
                                        {order.productName || "Unknown Product"}
                                    </p>

                                    <div className="flex justify-between">
                                        <p className="text-gray-700">Quantity</p>
                                        <p>{order.productQuantity || 1}</p>
                                    </div>

                                    <div className="flex justify-between">
                                        <p className="text-gray-700">Price</p>
                                        <p>${order.amount || 0}</p>
                                    </div>


                                </div>
                            </div>
                        </Link>
                    ))
                ) : (
                    <div className="text-center text-gray-500 mt-4">
                        No Purchased Products
                    </div>
                )}


            </div>


        </Container>
    )
}

export default OrderPage