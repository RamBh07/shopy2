'use client'
import React, { useEffect, useState } from 'react'

import PriceFormatter from './PriceFormatter'
import useStore from '@/store';
import { useUser } from '@clerk/nextjs';
import { Separator } from './ui/separator';
import { Button } from './ui/button';


const OrderSummary = () => {
    const [amount, setAmount] = useState<number>(0);
    const {
        deleteCartProduct,
        getTotalPrice,
        getItemCount,
        getSubTotalPrice,
        resetCart,
    } = useStore();

    const { user } = useUser()
    const { isSignedIn } = useUser()

    useEffect(() => {
        if (user) {

            setAmount(getTotalPrice())
        }
    }, [getTotalPrice, user])



    return (
        <div>

            <div className=" md:inline-block w-full bg-white p-6 rounded-lg border">
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
                    {/* <Button
                        className="w-full rounded-full font-semibold tracking-wide hoverEffect"
                        size="lg"

                    >
                    
                        Proceed to Checkout

                    </Button> */}
                </div>
            </div>

        </div>
    )
}

export default OrderSummary