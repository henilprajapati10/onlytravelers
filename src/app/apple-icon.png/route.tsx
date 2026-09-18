import { ImageResponse } from "next/og";
import { appIcon } from "@/lib/appIcon";

export const runtime = "nodejs";

/** iOS asks for this by name when someone adds the app to their home screen. */
export function GET() {
  return new ImageResponse(appIcon(180, false), { width: 180, height: 180 });
}
