"use client";

import { useState, useEffect } from "react";
import { Minus, Plus } from "lucide-react";

export default function Counter({ onChange }: { onChange?: (value: number) => void }) {
    const [count, setCount] = useState(1);

    useEffect(() => {
        onChange?.(count);
    }, [count, onChange]); // ✅ only triggers after render when count changes

    const handleIncrease = () => setCount((prev) => prev + 1);
    const handleDecrease = () => setCount((prev) => (prev > 1 ? prev - 1 : 1));

    return (
        <div className="flex items-center gap-3.5" >
            <p>Increase Quantity : </p>
            <div className="flex items-center justify-between gap-4 bg-white rounded-full shadow-md px-4 py-2 w-fit">

                <button
                    onClick={handleDecrease}
                    className="p-2 rounded-full hover:bg-gray-100 transition"
                >
                    <Minus className="w-5 h-5 text-gray-700" />
                </button>

                <span className="text-lg font-semibold text-gray-800 min-w-[2rem] text-center">
                    {count}
                </span>

                <button
                    onClick={handleIncrease}
                    className="p-2 rounded-full hover:bg-gray-100 transition"
                >
                    <Plus className="w-5 h-5 text-gray-700" />
                </button>
            </div>
        </div>
    );
}
