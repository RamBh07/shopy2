import { Facebook, Instagram, Twitter, Youtube } from 'lucide-react'
import React from 'react'
import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from "@/components/ui/tooltip"

import { cn } from '@/lib/utils'
import { FaWhatsapp } from 'react-icons/fa'


const socialLink = [
    {
        title: "Youtube",
        href: 'https://www.youtube.com/@bhigurammahato7228',
        icon: <Youtube className='w-5 h-5' />
    },
    {
        title: "Instagram",
        href: 'https://www.instagram.com/v_ram09/',
        icon: <Instagram className='w-5 h-5' />
    },
    {
        title: "X",
        href: 'https:',
        icon: <Twitter className='w-5 h-5' />
    },
    {
        title: "Facebook",
        href: 'https:',
        icon: <Facebook className='w-5 h-5' />
    },
    {
        title: "Whatsapp",
        href: 'https://www.youtube.com/',
        icon: <FaWhatsapp className='w-5 h-5' />
    },
]

const SocialMedia = () => {
    return (
        <TooltipProvider >
            <div className={cn("flex items-center gap-3.5 ")}>
                {socialLink.map((item) => (
                    <Tooltip key={item.title}>
                        <TooltipTrigger asChild>
                            <a href={item.href}
                                target="_blank" rel="noopener noreferrer"
                                className={cn('p-2 border rounded-full hover:text-white hover:border-shop_light_green hoverEffect')} >{item.icon}</a>
                        </TooltipTrigger>
                        <TooltipContent className={cn('bg-white text-darkColor font-semibold')}>
                            {item.title}
                        </TooltipContent>
                    </Tooltip>
                ))}
            </div>

        </TooltipProvider>

    )
}

export default SocialMedia