import { ImageResponse } from "next/og";
import { appIcon } from "@/lib/appIcon";

export const runtime = "nodejs";

export function GET() {
  return new ImageResponse(appIcon(192, false), { width: 192, height: 192 });
}
