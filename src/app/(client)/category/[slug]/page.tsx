import CategoryProducts from "@/components/Product/CategoryProducts";
import Container from "@/components/Container";
import Title from "@/components/Title";
import { getCategories } from "@/sanity/queries";
import React from "react";

interface CategoryPageProps {
    params: { slug: string };
}

const CategoryPage = async ({ params }: CategoryPageProps) => {
    const categories = await getCategories();
    const { slug } = params;

    return (
        <div className="py-10">
            <Container>
                <Title>
                    Products by Category:{" "}
                    <span className="font-bold text-green-600 capitalize tracking-wide">
                        {slug}
                    </span>
                </Title>

                <CategoryProducts categories={categories} slug={slug} />
            </Container>
        </div>
    );
};

export default CategoryPage;
