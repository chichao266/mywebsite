import { NextResponse } from "next/server";
import { execSync } from "child_process";

export async function GET() {
  try {
    const output = execSync("npx prisma db push --skip-generate", {
      encoding: "utf-8",
      timeout: 30000,
    });

    return NextResponse.json({ ok: true, output });
  } catch (error: any) {
    return NextResponse.json(
      { ok: false, error: error.stderr || error.message || String(error) },
      { status: 500 }
    );
  }
}
