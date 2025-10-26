import React from "react";

import { notFound } from "next/navigation";
import ProductGrid from "@/components/ProductSearchGrid";
import { client } from "@/sanity/lib/client";
import Container from "@/components/Container";
import Combox from "@/components/Combox";

interface Product {
    _id: string;
    name: string;
    slug: { current: string };
}

interface Props {
    searchParams: { query?: string };
}

export default async function SearchPage({ searchParams }: Props) {
    const query = searchParams.query ?? "";

    if (!query) return notFound();

    const products: Product[] = await client.fetch<Product[]>(
        `*[_type == "product" && name match $searchTerm]{
      _id,
      name,
        price,
      slug,
        "imageUrl": images[0].asset->url
    }`,
        { searchTerm: `*${query}*` }
    );

    return (
        <Container>
            <Combox />
            <div className="max-w-4xl mx-auto mt-3 ">

                <h1 className="text-xl font-bold mb-4 max-w-2xl break-words">
                    Search Results for {query}
                </h1>



                {products.length === 0 ? (
                    <p className="text-muted-foreground">No products found.</p>
                ) : (
                    <ProductGrid products={products} />
                )}
            </div>
        </Container>
    );
}
