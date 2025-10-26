"use client";

import { IndianRupee } from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";

interface Product {
    _id: string;
    name: string;
    slug: { current: string };
    imageUrl?: string;
    price?: number;
}

interface Props {
    products: Product[];
}



export default function ProductSearchGrid({ products }: Props) {
    const router = useRouter();

    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {products.map((product) => (
                <div
                    key={product._id}
                    className="border rounded-lg  hover:shadow-md cursor-pointer transition flex items-center justify-evenly "
                    onClick={() => router.push(`/product/${product.slug.current}`)}
                >
                    {product.imageUrl && (
                        <Image
                            src={product.imageUrl}
                            alt={product.name}
                            height={150}
                            width={150}

                        />
                    )}
                    <div className="flex flex-col">
                        <p className="font-semibold">{product.name}</p>
                        <p className="text-accent-foreground font-medium mt-1 flex items-center">
                            <IndianRupee size={16} /> <span>{product.price?.toLocaleString()}</span>
                        </p>
                    </div>

                </div>
            ))}
        </div>
    );
}
