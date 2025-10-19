"use client";

import React, { useEffect, useState } from "react";

import Container from "./Container";
import HomeTabBar from "./HomeTabBar";
import { productType } from "@/constants/data";
import { Product } from "@/sanity.types";
import { client } from "@/sanity/lib/client";
import { Loader2 } from "lucide-react";
import NoProductAvailable from "./NoProductAvailable";
import { AnimatePresence, motion } from "motion/react";
import ProductCard from "./ProductCard";

const ProductGrid = () => {
    const [products, setProducts] = useState<Product[]>([]);
    const [loading, setLoading] = useState(false);
    const [selectedTab, setSelectedTab] = useState(productType[0]?.title || "");
    const query = `*[_type == "product" && variant == $variant] | order(name asc){
  ...,"categories": categories[]->title
}`;


    useEffect(() => {
        const params = { variant: selectedTab.toLowerCase() };
        const fetchData = async () => {
            setLoading(true);
            try {
                const response = await client.fetch(query, params);
                setProducts(await response);
            } catch (error) {
                console.log("Product fetching Error", error);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, [query, selectedTab]);

    return (
        <Container className="flex flex-col lg:px-0 my-10">
            <HomeTabBar selectedTab={selectedTab} onTabSelect={setSelectedTab} />
            {loading ? (
                <div className="flex flex-col items-center justify-center py-10 min-h-80 space-y-4 text-center bg-gray-100 rounded-lg w-full mt-10">
                    <motion.div className="flex items-center space-x-2 text-blue-600">
                        <Loader2 className="w-5 h-5 animate-spin" />
                        <span>Product is loading...</span>
                    </motion.div>
                </div>
            ) : products?.length ? (
                <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-2.5 mt-10">
                    <AnimatePresence mode="popLayout">
                        {products?.map((product) => (
                            <motion.div
                                key={product._id}
                                layout
                                initial={{ opacity: 0, scale: 0.95 }}
                                animate={{ opacity: 1, scale: 1 }}
                                exit={{ opacity: 0, scale: 0.9 }}
                                transition={{ duration: 0.3 }}
                            >
                                <ProductCard product={product} />
                            </motion.div>
                        ))}
                    </AnimatePresence>

                </div>
            ) : (
                <NoProductAvailable selectedTab={selectedTab} />
            )}
        </Container>
    );
};

export default ProductGrid;
