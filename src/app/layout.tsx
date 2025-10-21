import { ClerkProvider } from "@clerk/nextjs";
import { Toaster } from "react-hot-toast";

const RootLayout = ({ children }: { children: React.ReactNode }) => {
    return (
        <ClerkProvider>

            <html lang="en">
                <body className="font-poppins antialiased">
                    <script src="https://checkout.razorpay.com/v1/checkout.js" async></script>



                    {children}
                    <Toaster position="bottom-right" />
                </body>
            </html>
        </ClerkProvider>

    )
}
export default RootLayout