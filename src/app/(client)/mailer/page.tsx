'use client'
import { Button } from '@/components/ui/button';
import React from 'react'

const page = () => {

    const sendEmail = async () => {
        const res = await fetch("/api/sendMail", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                to: "bhriguram9@gmail.com",
                subject: "Hello from Next.js",
                text: "This is a plain text email",
                html: "<h1>This is HTML email</h1>",
            }),
        });

        const data = await res.json();
        console.log(data);
    };


    return (
        <div>
            <Button onClick={sendEmail} />
        </div>
    )
}

export default page