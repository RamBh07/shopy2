"use client";

import React, { useEffect, useState } from "react";
import { Product } from "@/sanity.types";
import { Loader2 } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import ProductCard from "./ProductCard";
import NoProductAvailable from "../NoProductAvailable";
import Container from "../Container";
import HomeTabBar from "../Main/HomeTabBar";
import { productType } from "@/constants/data";

const ProductGridClient = () => {
    const [products, setProducts] = useState<Product[]>([]);
    const [loading, setLoading] = useState(false);
    const [selectedTab, setSelectedTab] = useState(productType[0]?.title || "");

    useEffect(() => {
        if (!selectedTab) return;

        const fetchFiltered = async () => {
            setLoading(true);
            try {
                const res = await fetch(`/api/products?variant=${selectedTab.toLowerCase()}`);
                const data = await res.json();
                setProducts(data);
            } catch (err) {
                console.error("Product fetch failed:", err);
            } finally {
                setLoading(false);
            }
        };

        fetchFiltered();
    }, [selectedTab]);

    return (
        <Container className="flex flex-col lg:px-0 my-10">
            <HomeTabBar selectedTab={selectedTab} onTabSelect={setSelectedTab} />
            {loading ? (
                <div className="flex items-center justify-center min-h-80 py-10 text-blue-600">
                    <Loader2 className="w-5 h-5 animate-spin mr-2" /> Product is loading...
                </div>
            ) : products?.length ? (
                <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-2.5 mt-10">
                    <AnimatePresence mode="popLayout">
                        {products.map((product) => (
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

export default ProductGridClient;
