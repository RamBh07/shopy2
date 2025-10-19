
import { ClerkLoaded, SignedIn, SignInButton, UserButton, useUser } from '@clerk/nextjs'

import React from 'react'

const ClerkComp = () => {
    const { isSignedIn } = useUser();
    return (
        <div>
            <ClerkLoaded>
                <SignedIn>
                    <UserButton />
                </SignedIn>


                {!isSignedIn && (
                    <div className='text-sm font-semibold hover:text-darkColor text-lightColor hover:cursor-pointer hoverEffect'>
                        <SignInButton />
                    </div>
                )}


            </ClerkLoaded>

        </div>
    )
}

export default ClerkComp