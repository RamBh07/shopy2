
import Combox from "@/components/Combox";
import Container from "@/components/Container";
import HomeBanner from "@/components/Main/HomeBanner";
// import HomeCategories from "@/components/HomeCategories";
// import LatestBlog from "@/components/LatestBlog";
import ProductGrid from "@/components/Product/ProductGrid";

// import ShopByBrands from "@/components/ShopByBrands";
// import { getCategories } from "@/sanity/queries";


export default async function Home() {
  // const categories = await getCategories(6);
  return (
    <Container>
      <Combox />
      <HomeBanner />
      <ProductGrid />
      {/* <HomeCategories categories={categories} /> */}
      {/* <ShopByBrands /> */}
      {/* <LatestBlog /> */}
    </Container>
  );
}
