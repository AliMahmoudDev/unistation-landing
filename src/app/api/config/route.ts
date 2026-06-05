import { NextRequest, NextResponse } from "next/server";
import { getAllConfig, setConfig } from "@/lib/turso";

export const dynamic = "force-dynamic";

const ADMIN_PASSWORD = "unistation2024";

/* GET — return all config (public, used by landing page) */
export async function GET() {
  try {
    const config = await getAllConfig();
    return NextResponse.json(config);
  } catch (error) {
    console.error("Failed to fetch config:", error);
    return NextResponse.json({ error: "Failed to fetch config" }, { status: 500 });
  }
}

/* PUT — update a single config key (admin only) */
export async function PUT(request: NextRequest) {
  try {
    const password = request.headers.get("x-admin-password");
    if (password !== ADMIN_PASSWORD) {
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
