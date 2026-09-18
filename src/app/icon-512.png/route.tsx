import { ImageResponse } from "next/og";
import { appIcon } from "@/lib/appIcon";

export const runtime = "nodejs";

export function GET() {
  return new ImageResponse(appIcon(512, false), { width: 512, height: 512 });
}
