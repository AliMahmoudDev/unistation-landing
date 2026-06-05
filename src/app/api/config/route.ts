import { NextRequest, NextResponse } from "next/server";
import { setConfig } from "@/lib/turso";

export const dynamic = "force-dynamic";

export async function PUT(request: NextRequest) {
  try {
    // Verify admin password
    const password = request.headers.get("x-admin-password");
    if (password !== process.env.ADMIN_PASSWORD) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { key, value } = body;

    if (!key || value === undefined) {
      return NextResponse.json({ error: "Missing key or value" }, { status: 400 });
    }

    await setConfig(key, value);
    return NextResponse.json({ success: true, key });
  } catch (error) {
    console.error("Failed to update config:", error);
    return NextResponse.json({ error: "Failed to update" }, { status: 500 });
  }
}
