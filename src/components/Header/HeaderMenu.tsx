
'use client'
import { headerData } from "@/constants/data";
import Link from "next/link";
import { usePathname } from "next/navigation";
import React from "react";

const HeaderMenu = () => {

    const pathName = usePathname()


    return (
        <div className="hidden md:inline-flex w1/3 items-center gap-7 text-sm capitalize font-semibold text-lightColor">
            {headerData.map((item) => (
                <Link key={item.title} href={item.href}
                    className={`hover:text-shop_light_green hoverEffect reative group ${pathName === item.href && "text-shop_light_green"}`}
                >{item.title}



                </Link>
            ))}
        </div >
    )
}
export default HeaderMenu