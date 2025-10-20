'use client'
import useStore from '@/store'
import { Heart } from 'lucide-react'
import Link from 'next/link'
import React from 'react'

function FavIcon() {
    const { favoriteProduct } = useStore()
    return (
        <Link href={'/wishlist'} className="group relative">
            <Heart className="w-5 h-5 hover:text-shop_light_green  hoverEffect" />
            <span className="absolute -top-1 -right-1 bg-shop_dark_green text-white h-3.5 w-3.5 rounded-full text-xs font-semibold flex items-center justify-center">
                {favoriteProduct?.length ? favoriteProduct?.length : 0}
            </span>

        </Link>
    )
}

export default FavIcon