import Container from "@/components/Container";
import ProductCard from "@/components/ProductCard";
import Title from "@/components/Title";
import { getDealProducts } from "@/sanity/queries";
import React from "react";

const DealPage = async () => {
  const products = await getDealProducts();
  return (
    <div className="py-10 bg-deal-bg">
      <Container>
        <Title className="mb-5 underline underline-offset-4 decoration-[1px] text-base uppercase tracking-wide">
          Hot Deals of the Week
        </Title>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-2.5">
          {products?.map((product) => (
            <ProductCard key={product?._id} product={{
              _id: "",
              _type: "product",
              _createdAt: "",
              _updatedAt: "",
              _rev: "",
              name: undefined,
              slug: undefined,
              images: undefined,
              description: undefined,
              price: undefined,
              discount: undefined,
              categories: undefined,
              stock: undefined,
              brand: undefined,
              status: undefined,
              variant: undefined,
              isFeatured: undefined
            }} />
          ))}
        </div>
      </Container>
    </div>
  );
};

export default DealPage;
