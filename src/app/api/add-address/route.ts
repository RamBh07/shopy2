// src/app/api/add-address/route.ts
import { NextResponse } from "next/server";
import { serverClient } from "@/sanity/lib/client";

export async function POST(req: Request) {
  try {
    const body = await req.json();

    if (!body.email) {
      return NextResponse.json(
        { success: false, error: "Email is required" },
        { status: 400 }
      );
    }

    // If the new address is default, unset previous defaults for this user
    if (body.default) {
      const prevDefaults = await serverClient.fetch(
        `*[_type == "newaddress" && email == $email && default == true]._id`,
        { email: body.email }
      );

      for (const id of prevDefaults) {
        await serverClient
          .patch(id)
          .set({ default: false })
          .commit();
      }
    }

    // Create new address
    const newAddress = await serverClient.create({
      _type: "newaddress",
      title: body.title,
      email: body.email,
      phone: body.phone,
      fulladdress: body.fulladdress,
      city: body.city,
      state: body.state,
      pin: body.pin,
      default: !!body.default,
    });

    return NextResponse.json({ success: true, data: newAddress });
  } catch (error) {
    console.error("Sanity create error:", error);
    return NextResponse.json({ success: false, error: String(error) }, { status: 500 });
  }
}
