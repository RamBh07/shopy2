import { NextResponse } from "next/server";
import { serverClient } from "@/sanity/lib/client";

export async function DELETE(req: Request) {
  try {
    const { _id } = await req.json();
    await serverClient.delete(_id);
    return NextResponse.json({ success: true });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ success: false, error: err });
  }
}
