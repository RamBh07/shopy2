'use client'
import { AlignLeft } from 'lucide-react'
import React, { useState } from 'react'
import SideMenu from './SideMenu'

const MobileMenu = () => {
    const [isSidebarOpen, setIssidebarOpen] = useState(false)
    return (
        <div>
            <button onClick={() => setIssidebarOpen(!isSidebarOpen)}>
                <AlignLeft className='md:hidden hover:text-darkColor hoverEffect hover:cursor-pointer' />


            </button>
            <div>
                <SideMenu isOpen={isSidebarOpen} onClose={() => setIssidebarOpen(false)} setOpen={setIssidebarOpen} />
            </div>
        </div>
    )
}

export default MobileMenu