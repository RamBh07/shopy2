import { client } from "@/sanity/lib/client"; // ✅ client only, no token

export const getAddress = async (email: string) => {
  const query = `*[_type == "newaddress" && email == $email]{
    _id, title, fulladdress, city, state, pin, phone, email, default
  }`;
  return await client.fetch(query, { email });
};
