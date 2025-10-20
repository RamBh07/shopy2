"use client";

import { useEffect, useState } from "react";
import Counter from "./Counter";
import CheckOutButton from "./Buttons/CheckOutButton";

type Props = {
    price: number;
    name: string;
    productName: string,
    //   productCategory:string,
    //   productBrand:string,
    //   productQuantity:number

};

const CheckoutButton: React.FC<Props> = ({ price, productName }) => {
    const [quantity, setQuantity] = useState(1);
    const [productName_, setProductName_] = useState<string>('')


    const totalPrice = price * quantity;

    useEffect(() => {
        setProductName_(productName)

    }, [productName])

    return (
        <div className="flex flex-col gap-4 bg-white p-4 rounded-xl shadow-md w-fit ">
            <Counter onChange={setQuantity} />

            <div className="flex justify-between items-center w-full text-gray-800 font-semibold">
                <span>Total:</span>
                <span>₹{totalPrice}</span>
            </div>


            <CheckOutButton price={totalPrice} productName={productName_} quantity={quantity} />
        </div>
    );
}

export default CheckoutButton