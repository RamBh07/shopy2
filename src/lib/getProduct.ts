import { client } from "@/sanity/lib/client";

export async function getProducts() {
  const query = `*[_type == "product"]{
    _id,
    name,
    slug
  }`;
  const products = await client.fetch(query);
  return products;
}


export async function getProductsByName(){
    const query=   `*[_type == "product" && name match $searchTerm]{
      _id,
      name,
        price,
      slug,
        "imageUrl": images[0].asset->url
    }`
    const products= await client.fetch(query)
    return products
}
   