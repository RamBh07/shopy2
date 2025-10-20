import { NextResponse } from "next/server";
import { client } from "@/sanity/lib/client";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const variant = searchParams.get("variant") || "default";

  if (!process.env.SANITY_API_TOKEN) {
    console.error("SANITY_API_TOKEN is missing");
    return NextResponse.json({ error: "Server misconfiguration" }, { status: 500 });
  }

  const query = `
    *[_type == "product" && variant match $variant] | order(name asc) {
      ...,
      "categories": categories[]->title
    }
  `;

  try {
    const products = await client.fetch(query, { variant });
    return NextResponse.json(products);
  } catch (error) {
    console.error("Sanity fetch error:", error);
    return NextResponse.json({ error: "Failed to fetch products" }, { status: 500 });
  }
}
