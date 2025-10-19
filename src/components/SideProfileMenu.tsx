

import Link from 'next/link'
import React from 'react'
import ClerkComp from './ClerkComp'

const SideProfileMenu = () => {

    return (
        <div>
            <div className="flex flex-col items-center justify-center gap-5">
                <div className="bg-shop_light_pink">
                    <ClerkComp />
                </div>
                <div className="flex flex-col items-center justify-center gap-1.5 font-semibold">
                    <Link href={'/orders'}>Profile</Link>
                    <Link href={'/orders'}>Orders</Link>
                    <Link href={'/orders'}>Wishlist</Link>
                    <Link href={'/orders'}>Chekout</Link>
                </div>
            </div>
        </div>
    )
}

export default SideProfileMenu