import { NextRequest, NextResponse } from "next/server";
import { client } from "@/sanity/lib/client";

export async function GET(req: NextRequest, { params }: { params: { category: string }}) {
  const categorySlug = params.category;
  const query = `
    *[_type == 'product' && references(*[_type == "category" && slug.current == $categorySlug]._id)] | order(name asc){
      ...,"categories": categories[]->title}
  `;
  const data = await client.fetch(query, { categorySlug });
  return NextResponse.json(data);
}
