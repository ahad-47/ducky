import { ImageResponse } from "next/og";
import { getInstrumentSerifFont } from "@/lib/og-font";

export const size = { width: 180, height: 180 };
export const contentType = "image/png";

export default async function AppleIcon() {
  const font = await getInstrumentSerifFont();

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
        }}
      >
        <span style={{ fontFamily: "Instrument Serif", fontSize: 140, color: "#8FA8FF" }}>S</span>
      </div>
    ),
    {
      ...size,
      fonts: [{ name: "Instrument Serif", data: font, style: "normal", weight: 400 }],
    },
  );
}
