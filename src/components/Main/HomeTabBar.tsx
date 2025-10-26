import { productType } from '@/constants/data'
import Link from 'next/link'
import React from 'react'

interface Props {
    selectedTab: string;
    onTabSelect: (tab: string) => void;
}

const HomeTabBar = ({ selectedTab, onTabSelect }: Props) => {
    return (
        <div className="flex items-center justify-between flex-wrap md:flex-nowrap gap-5">
            {/* Scrollable section for buttons */}
            <div className="flex gap-5.5 overflow-x-auto no-scrollbar md:overflow-visible md:flex-wrap md:gap-5 w-full mb-3 ">
                {productType?.map((item) => (
                    <button
                        onClick={() => onTabSelect(item.title)}
                        key={item.title}
                        className={`flex-shrink-0 border border-shop_light_green/30 px-4 py-1.5 md:px-6 rounded-full hover:bg-shop_light_green hover:border-shop_light_green hover:text-white hoverEffect ${selectedTab === item?.title
                            ? 'bg-shop_light_green text-white border-shop_light_green'
                            : 'bg-shop_light_green/10'
                            }`}
                    >
                        {item.title}
                    </button>
                ))}
            </div>

            {/* <Link
                href="/orders"
                className="border border-shop_light_green/30 px-4 py-1.5 md:px-6 rounded-full hover:bg-shop_light_green hover:border-shop_light_green hover:text-white hoverEffect whitespace-nowrap"
            >
                Orders
            </Link> */}
        </div>
    )
}

export default HomeTabBar
