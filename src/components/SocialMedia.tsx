import { Facebook, Github, Linkedin, Slack, Youtube } from 'lucide-react'
import React from 'react'
import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from "@/components/ui/tooltip"

import { cn } from '@/lib/utils'


const socialLink = [
    {
        title: "Youtube",
        href: 'https:',
        icon: <Youtube className='w-5 h-5' />
    },
    {
        title: "Github",
        href: 'https:',
        icon: <Github className='w-5 h-5' />
    },
    {
        title: "Linkdin",
        href: 'https:',
        icon: <Linkedin className='w-5 h-5' />
    },
    {
        title: "Facebook",
        href: 'https:',
        icon: <Facebook className='w-5 h-5' />
    },
    {
        title: "Slack",
        href: 'https://www.youtube.com/',
        icon: <Slack className='w-5 h-5' />
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