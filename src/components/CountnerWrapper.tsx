"use client";

import { useEffect, useState } from "react";
import Counter from "./Counter";
import CheckOutButton from "./Buttons/CheckOutButton";

type Props = {
    price: number;
    name: string;
    productName: string,

    selectedAddress: string,
    selectedPaymentMode: string,
    imgUrl: string,
    //   productCategory:string,
    //   productBrand:string,
    //   productQuantity:number

};

const CheckoutButton: React.FC<Props> = ({ price, productName, selectedAddress, selectedPaymentMode, imgUrl }) => {
    const [quantity, setQuantity] = useState(1);
    const [productName_, setProductName_] = useState<string>('')
    const [selectedAddress_, setSelectedAddress_] = useState('')
    const [imgUrl_, setImgUrl_] = useState('')
    const [paymentMode_, setPaymentMode_] = useState('')
    useEffect(() => {
        setSelectedAddress_(selectedAddress)
        setPaymentMode_(selectedPaymentMode)
        setImgUrl_(imgUrl)
    }, [imgUrl, selectedAddress, selectedPaymentMode])

    const totalPrice = price * quantity;

    useEffect(() => {
        setProductName_(productName)

    }, [productName])

    return (
        <div className="flex flex-col gap-4 bg-white p-4 rounded-xl shadow-md w-full  ">
            <Counter onChange={setQuantity} />

            <div className="flex justify-between items-center w-full text-gray-800 font-semibold">
                <span>Total:</span>
                <span>₹{totalPrice}</span>
            </div>


            <CheckOutButton price={totalPrice} productName={productName_} quantity={quantity} selectedAddr={selectedAddress_} paymentMode={paymentMode_} imgUrl={imgUrl_} />
            {/* <Button
                onClick={() => router.push("/check-out")}
                className="mt-4"
            >
                Go to Checkout
            </Button> */}
        </div>
    );
}

export default CheckoutButton