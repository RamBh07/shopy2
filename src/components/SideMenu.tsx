'use client'
import React, { FC, useEffect, useRef } from 'react'
import Logo from './Header/Logo';
import { X } from 'lucide-react';
import { headerData } from '@/constants/data';

import { usePathname } from 'next/navigation';
import SocialMedia from './SocialMedia';
import { cn } from '@/lib/utils';

interface SidebarProps {
    isOpen: boolean;
    onClose: () => void,
    setOpen: React.Dispatch<React.SetStateAction<boolean>>
}


const SideMenu: FC<SidebarProps> = ({ isOpen, onClose, setOpen }) => {
    const pathName = usePathname()
    const sidebarRef = useRef<HTMLDivElement>(null);
    // Detect click outside
    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            if (sidebarRef.current && !sidebarRef.current.contains(event.target as Node)) {
                setOpen(false)
            }
        }

        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, [setOpen]);


    return (
        <div className={`fixed inset-y-0 h-screen left-0 z-50 w-full bg-black/50 shadow-xl ${isOpen ? 'translate-x-0' : '-translate-x-full'} hoverEffect`}>
            <div ref={sidebarRef} className='min-w-72 max-w-72 bg-black h-screen  border-r border-r-shop_light_green flex flex-col gap-6 items-start pt-3.5 pl-3.5'>
                <div className='flex items-center justify-center gap-5'>
                    <Logo className='text-white ' spanDesign='group-hover:text-white' />
                    <button onClick={onClose} className='hover:text-shop_light_green hoverEffect'><X size={30} /></button>
                </div>

                <div className={cn('flex flex-col space-y-3.5 font-semibold')}>
                    {headerData.map((item) => (
                        <a target="_blank" rel="noopener noreferrer" href={item.href} key={item.title} className={`hover:text-shop_light_green hoverEffect ${pathName === item.href && 'text-shop_light_green'}`}>{item.title}</a>
                    ))}
                </div>

                <div >
                    <SocialMedia />
                </div>
            </div>

        </div>
    )
}

export default SideMenu