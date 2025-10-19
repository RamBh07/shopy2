'use client'
import { UserIcon } from 'lucide-react'
import React, { useState } from 'react'
import SideProfileMenu from './SideProfileMenu'



const UserIconComp = () => {
    const [showSideProfileMenu, setShowSideProfileMenu] = useState<boolean>(false)



    return (
        <div>
            <button onClick={() => setShowSideProfileMenu(!showSideProfileMenu)}>
                <UserIcon />

            </button>
            {showSideProfileMenu === true && <SideProfileMenu />}
        </div>
    )
}

export default UserIconComp