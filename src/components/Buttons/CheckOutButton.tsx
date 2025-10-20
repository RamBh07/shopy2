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
"use client";

import { useUser } from "@clerk/nextjs";
import React, { useEffect, useState } from "react";


type Props = {
  price: number;
  // name: string;
  productName: string,
  // productCategory: string,
  // productBrand: string,
  quantity: number

};



const CheckOutButton: React.FC<Props> = ({ price, productName, quantity }) => {
  const [razorpayLoaded, setRazorpayLoaded] = useState(false);

  const [userName, setUserName] = useState("");


  const time = new Date().toISOString()
  const { user } = useUser()
  useEffect(() => {
    if (user) {
      setUserName(user.id || '')

    }
  }, [user])
  // Load Razorpay script dynamically
  useEffect(() => {
    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.async = true;
    script.onload = () => setRazorpayLoaded(true);
    script.onerror = () => console.error("Failed to load Razorpay SDK");
    document.body.appendChild(script);
  }, []);

  const handleCheckout = async () => {
    if (!razorpayLoaded) {
      alert("Razorpay SDK is still loading. Please wait a moment.");
      return;
    }

    const res = await fetch("/api/createOrder", {
      method: "POST",
      body: JSON.stringify({
        amount: price * 100, userName: userName, productName: productName, productQuantity: 5

      }),
    });
    const data = await res.json();

    const paymentData: RazorpayOptions = {
      key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID!, // use ! to tell TS it exists
      amount: price * 100, // amount in paise, e.g., 500 * 100 = 50000
      currency: "INR",
      order_id: data.id,
      handler: async (response: RazorpayResponse) => {
        const res = await fetch("/api/verifyOrder", {
          method: "POST",
          body: JSON.stringify({
            orderId: response.razorpay_order_id,
            razorpayPaymentId: response.razorpay_payment_id,
            razorpaySignature: response.razorpay_signature,
            name: userName,
            amount: price,
            productName: productName,
            productQuantity: quantity,
            createdAt: time,


          }),
        });

        window.location.href = `/payment-success?paymentId=${response.razorpay_payment_id}&orderId=${response.razorpay_order_id}&user=${encodeURIComponent(productName)}`;

        const data = await res.json();
        if (data.isOk == true) {
          // alert("Payment successful");
          console.log(data);

        } else {
          alert("Payment failed");
        }
      },
    };


    const payment = new window.Razorpay(paymentData);
    payment.open();

  };

  return (
    <button
      onClick={handleCheckout}
      className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 disabled:opacity-60"
      disabled={!razorpayLoaded}
    >
      {razorpayLoaded ? "Buy Now" : "Loading..."}
    </button>
  );
};

export default CheckOutButton;

