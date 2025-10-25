import { NextResponse } from "next/server";
import { serverClient } from "@/sanity/lib/client";

export async function PATCH(req: Request) {
  try {
    const body = await req.json();
    const { _id, title, fulladdress, default: isDefault } = body;

    if (!_id) {
      return NextResponse.json({ success: false, error: "Missing _id" });
    }

    // 🧩 Fetch the current document to get user email
    const currentDoc = await serverClient.fetch(
      `*[_type == "newaddress" && _id == $id][0]{email}`,
      { id: _id }
    );

    if (!currentDoc?.email) {
      return NextResponse.json({ success: false, error: "Email not found for this address" });
    }

    // 🩵 If this address is being set as default, unset all others
    if (isDefault) {
      await serverClient
        .patch({
          query: `*[_type == "newaddress" && email == $email && _id != $id]`,
          params: { email: currentDoc.email, id: _id },
        })
        .set({ default: false })
        .commit();
    }

    // 📝 Update the selected address
    const updatedDoc = await serverClient
      .patch(_id)
      .set({ title, fulladdress, default: isDefault })
      .commit({ returnDocuments: true });

    return NextResponse.json({
      success: true,
      data: updatedDoc, // ✅ Return updated doc for instant frontend update
    });
  } catch (err) {
    console.error("❌ Edit Address Error:", err);
    return NextResponse.json({ success: false, error: err });
  }
}
