import { ImageResponse } from "next/og";
import { OgLogoMark } from "@/lib/logo-mark";

export const size = { width: 180, height: 180 };
export const contentType = "image/png";

export default function AppleIcon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "#0B1120",
          borderRadius: 36,
        }}
      >
        <OgLogoMark size={124} color="#8FA8FF" />
      </div>
    ),
    size,
  );
}
