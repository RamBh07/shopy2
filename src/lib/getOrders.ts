// lib/getOrder.ts
import { client } from "@/sanity/lib/client";
import { sanityFetch } from "@/sanity/lib/live";
import { ORDER_ITEMS_QUERY } from "@/sanity/queries/query";

export const getOrder = async (userEmail: string) => {
  try {
    const order = await sanityFetch({
      query: ORDER_ITEMS_QUERY,
      params: { userEmail },
    });
    return order?.data || null;
  } catch (error) {
    console.error("Error fetching order by userEmail:", error);
    return null;
  }
};

export async function getOrderById(id: string) {
  const query = `*[_type == "razorpayorder" && _id == $id][0]`;
  return await client.fetch(query, { id });
}
