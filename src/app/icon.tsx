import { ImageResponse } from "next/og";
import { OgLogoMark } from "@/lib/logo-mark";

export const size = { width: 32, height: 32 };
export const contentType = "image/png";

export default function Icon() {
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
          borderRadius: 6,
        }}
      >
        <OgLogoMark size={26} color="#8FA8FF" />
      </div>
    ),
    size,
  );
}
