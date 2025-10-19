import { ClerkLoaded, SignInButton } from '@clerk/nextjs'
import React from 'react'

const SignIn = () => {
    return (
        <ClerkLoaded>
            <SignInButton>
                <button className='text-sm font-semibold hover:text-darkColor text-lightColor hover:cursor-pointer hoverEffect'>
                    Login
                </button>
            </SignInButton>
        </ClerkLoaded>
    )
}

export default SignIn