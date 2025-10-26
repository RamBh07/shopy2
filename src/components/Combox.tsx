"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { Search, X } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { getProducts } from "@/lib/getProduct";
import { cn } from "@/lib/utils";


interface Product {
    _id: string;
    name: string;
    slug: { current: string };
}

export default function InstantSearchBar() {
    const [products, setProducts] = React.useState<Product[]>([]);
    const [filteredProducts, setFilteredProducts] = React.useState<Product[]>([]);
    const [inputValue, setInputValue] = React.useState("");
    const router = useRouter();

    // Fetch all products on mount
    React.useEffect(() => {
        async function fetchProducts() {
            const allProducts = await getProducts();
            setProducts(allProducts);
        }
        fetchProducts();
    }, []);

    const handleChange = (value: string) => {
        setInputValue(value);
        if (value.length > 0) {
            const filtered = products.filter((product) =>
                product.name.toLowerCase().includes(value.toLowerCase())
            );
            setFilteredProducts(filtered);
        } else {
            setFilteredProducts([]);
        }
    };



    const handleSearch = () => {
        if (inputValue.trim() !== "") {
            router.push(`/search?query=${encodeURIComponent(inputValue)}`);
        }
    };
    return (
        <div className="relative w-full max-w-md mt-3">
            {/* Search Input */}
            <div className="flex items-center border rounded-2xl bg-background shadow-sm px-3 py-1 mb-2">
                <Search className="w-4 h-4 text-muted-foreground mr-2" />
                <Input
                    placeholder="Search products..."
                    value={inputValue}
                    onChange={(e) => handleChange(e.target.value)}
                    className="flex-1 border-none focus-visible:ring-0 focus-visible:ring-offset-0 p-0 bg-transparent"
                />
                {inputValue && (
                    <button
                        type="button"
                        onClick={() => {
                            setInputValue("");
                            setFilteredProducts([]);
                        }}
                        className="p-1 rounded-full hover:bg-accent transition"
                    >
                        <X className="w-4 h-4 text-muted-foreground" />
                    </button>
                )}
                <Button
                    type="button"
                    variant="default"
                    size="sm"
                    className="ml-2 rounded-xl"
                    onClick={handleSearch}
                >
                    Search
                </Button>
            </div>

            {/* Product List */}
            {filteredProducts.length > 0 && (
                <div className="absolute w-full max-h-80 overflow-y-auto rounded-xl border bg-popover shadow-md z-10">
                    {filteredProducts.map((product, index) => (
                        <div
                            key={product._id}
                            className={cn(
                                "cursor-pointer px-4 py-2 transition hover:bg-accent hover:text-accent-foreground",
                                index !== filteredProducts.length - 1 && "border-b border-border" // stylish bottom border except last item
                            )}
                            onClick={() => router.push(`/product/${product.slug.current}`)}
                        >
                            {product.name}
                        </div>
                    ))}
                </div>
            )}

        </div>
    );
}
