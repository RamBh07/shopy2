// lib/getOrder.ts
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
    console.error("Error fetching order by userName:", error);
    return null;
  }
};
