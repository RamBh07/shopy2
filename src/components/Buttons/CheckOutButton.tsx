// // components/CheckoutButton.tsx
// "use client";

// import React from "react";

// type Props = {
//   price: number;
//   name: string;
// };


// const CheckoutButton: React.FC<Props> = ({ price, name }) => {

//   const handleCheckout = async () => {
//     const res = await fetch("/api/createOrder", {
//       method: "POST",
//       body: JSON.stringify({ amount: price * 100, userName: name }),
//     });
//     const data = await res.json();

//     const paymentData: RazorpayOptions = {
//       key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID!, // use ! to tell TS it exists
//       amount: price * 100, // amount in paise, e.g., 500 * 100 = 50000
//       currency: "INR",
//       order_id: data.id,
//       handler: async (response: RazorpayResponse) => {
//         const res = await fetch("/api/verifyOrder", {
//           method: "POST",
//           body: JSON.stringify({
//             orderId: response.razorpay_order_id,
//             razorpayPaymentId: response.razorpay_payment_id,
//             razorpaySignature: response.razorpay_signature,
//             name: name,
//             amount: price
//           }),
//         });

//         window.location.href = `/payment-success?paymentId=${response.razorpay_payment_id}&orderId=${response.razorpay_order_id}&user=${encodeURIComponent(
//           name
//         )}`;

//         const data = await res.json();
//         if (data.isOk) {
//           // alert("Payment successful");
//           console.log(data);

//         } else {
//           alert("Payment failed");
//         }



//       },
//     };


//     const payment = new window.Razorpay(paymentData);
//     payment.open();

//   };

//   return (
//     <button
//       onClick={handleCheckout}
//       className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
//     >
//       Buy
//     </button>
//   );
// };

// export default CheckoutButton;

// components/CheckoutButton.tsx
// "use client";

// import { useUser } from "@clerk/nextjs";
// import React, { useEffect, useState } from "react";


// type Props = {
//   price: number;
//   // name: string;
//   productName: string,
//   // productCategory: string,
//   // productBrand: string,
//   quantity: number

// };



// const CheckOutButton: React.FC<Props> = ({ price, productName, quantity }) => {
//   const [razorpayLoaded, setRazorpayLoaded] = useState(false);

//   const [userName, setUserName] = useState("");


//   const time = new Date().toISOString()
//   const { user } = useUser()
//   useEffect(() => {
//     if (user) {
//       setUserName(user.id || '')

//     }
//   }, [user])
//   // Load Razorpay script dynamically
//   useEffect(() => {
//     const script = document.createElement("script");
//     script.src = "https://checkout.razorpay.com/v1/checkout.js";
//     script.async = true;
//     script.onload = () => setRazorpayLoaded(true);
//     script.onerror = () => console.error("Failed to load Razorpay SDK");
//     document.body.appendChild(script);
//   }, []);

//   const handleCheckout = async () => {
//     if (!razorpayLoaded) {
//       alert("Razorpay SDK is still loading. Please wait a moment.");
//       return;
//     }

//     const res = await fetch("/api/createOrder", {
//       method: "POST",
//       body: JSON.stringify({
//         amount: price * 100, userName: userName, productName: productName, productQuantity: 5

//       }),
//     });
//     const data = await res.json();

//     const paymentData: RazorpayOptions = {
//       key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID!, // use ! to tell TS it exists
//       amount: price * 100, // amount in paise, e.g., 500 * 100 = 50000
//       currency: "INR",
//       order_id: data.id,
//       handler: async (response: RazorpayResponse) => {
//         const res = await fetch("/api/verifyOrder", {
//           method: "POST",
//           body: JSON.stringify({
//             orderId: response.razorpay_order_id,
//             razorpayPaymentId: response.razorpay_payment_id,
//             razorpaySignature: response.razorpay_signature,
//             name: userName,
//             amount: price,
//             productName: productName,
//             productQuantity: quantity,
//             createdAt: time,


//           }),
//         });

//         window.location.href = `/payment-success?paymentId=${response.razorpay_payment_id}&orderId=${response.razorpay_order_id}&user=${encodeURIComponent(productName)}`;

//         const data = await res.json();
//         if (data.isOk == true) {
//           // alert("Payment successful");
//           console.log(data);

//         } else {
//           alert("Payment failed");
//         }
//       },
//     };


//     const payment = new window.Razorpay(paymentData);
//     payment.open();

//   };

//   return (
//     <button
//       onClick={handleCheckout}
//       className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 disabled:opacity-60"
//       disabled={!razorpayLoaded}
//     >
//       {razorpayLoaded ? "Buy Now" : "Loading..."}
//     </button>
//   );
// };

// export default CheckOutButton;

"use client";
import React, { useEffect, useState } from "react";

import axios from "axios";
import { load } from "@cashfreepayments/cashfree-js";
import { useUser } from "@clerk/nextjs";
import toast from "react-hot-toast";

import { useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";

type Props = {
  price: number;
  // name: string;
  productName: string,
  // productCategory: string,
  // productBrand: string,
  quantity: number,
  selectedAddr: string,
  paymentMode: string,
  imgUrl: string,
  isReady: boolean

};

const CheckOutButton: React.FC<Props> = ({ price, productName, quantity, selectedAddr, paymentMode, imgUrl, isReady }) => {
  const [loading, setLoading] = useState(false);

  const [userName, setUserName] = useState("");
  const [customerEmail, setCustomerEmail] = useState('')



  const time = new Date().toISOString()
  const { user } = useUser()
  const { isSignedIn } = useUser();
  const router = useRouter();

  useEffect(() => {
    if (user) {
      setUserName(user.fullName || '')
      setCustomerEmail(user.emailAddresses[0].emailAddress || '')


    }
  }, [user])


  const handlePayment = async () => {
    setLoading(true);

    if (!isSignedIn) {
      toast.success("Please Log in to purchase")
      router.push("/sign-in"); // Redirect to login page
      return;
    }
    if (!isReady) {
      toast.error("Please Select Chekout Details")
    } else {


      try {
        // 1️⃣ Create order session on server
        const orderId_ = `order_ ${crypto.randomUUID()}`
        const { data } = await axios.post("/api/create-order", {
          orderId: orderId_,
          orderAmount: Number(price).toFixed(2),
          userName: userName,
          userEmail: customerEmail,
          customerPhone: "9999999999",
          productName: productName,
          productQuantity: quantity,
          createdAt: time,
          customerAddress: selectedAddr,
          paymentMode: paymentMode

        });

        if (!data.payment_session_id) {
          alert("No payment session ID received");
          return;
        }

        const mode = process.env.NEXT_PUBLIC_CASHFREE_MODE;
        if (mode !== "sandbox" && mode !== "production") {
          throw new Error("Invalid CASHFREE_MODE. Must be 'sandbox' or 'production'.");
        }

        const cf = await load({ mode });

        // 3️⃣ Start checkout
        await cf.checkout({
          paymentSessionId: data.payment_session_id,
          redirectTarget: "_self",


        });
      } catch (err) {
        console.error("Payment error:", err);
        alert("Payment failed. Check console for details.");
      } finally {
        setLoading(false);
      }
    }

  };
  const [isLoading, setIsLoading] = useState(false);
  const handleCashPayment = async () => {
    if (!isReady) {
      toast.error("Please Select Chekout Details")
    } else {
      setIsLoading(true);
      try {
        const orderId_ = `order_ ${crypto.randomUUID()}`
        const { data } = await axios.post("/api/cash-payment", {
          orderId: orderId_,
          orderAmount: price,
          customerName: userName,
          customerEmail: customerEmail,
          customerPhone: "9999999999",
          productName: productName,
          productQuantity: quantity,
          createdAt: time,
          customerAddress: selectedAddr,
          paymentMode: paymentMode,
          productImgUrl: imgUrl

        })
        if (data?.success) {
          router.push(`/payment-success?orderId=${orderId_}`);
        }

      } catch (err) {
        console.error("Cash Payment error:", err);
        alert("Payment failed. Check console for details.");
      } finally {
        setIsLoading(false)
      }
    }
  }

  return (

    <div className="w-full">
      {paymentMode === "Online" ? (<button
        onClick={handlePayment}
        className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 w-full"
        disabled={loading || !isReady}
      >
        {loading ? "Processing..." : "Buy Now"}


      </button>) : <button
        onClick={handleCashPayment}

        className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 w-full"
        disabled={loading}
      >
        {isLoading ? (
          < div className="flex items-center justify-center gap-2">
            <Loader2 className="animate-spin" size={18} />
            Processing Payment...
          </div>
        ) : (
          "Buy Now"
        )}


      </button>}

    </div>



  );
}


export default CheckOutButton;