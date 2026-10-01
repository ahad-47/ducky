import { ImageResponse } from "next/og";
import { getInstrumentSerifFont } from "@/lib/og-font";

export const ogSize = { width: 1200, height: 630 };
export const ogContentType = "image/png";

export async function buildOgImage({ title, showMarks = false }: { title: string; showMarks?: boolean }) {
  const font = await getInstrumentSerifFont();

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          background: "#0B1120",
          padding: 72,
        }}
      >
        <div
          style={{
            display: "flex",
            fontFamily: "Instrument Serif",
            fontSize: 64,
            color: "#F4F6FB",
            maxWidth: 900,
            lineHeight: 1.1,
          }}
        >
          {title}
        </div>
        <div style={{ display: "flex", width: "100%", justifyContent: "space-between", alignItems: "flex-end" }}>
          <div style={{ display: "flex", fontFamily: "Instrument Serif", fontSize: 32, color: "#F4F6FB" }}>
            SkilledScan
          </div>
          {showMarks ? (
            <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
              {Array.from({ length: 7 }).map((_, i) => (
                <div
                  key={i}
                  style={{
                    width: 18,
                    height: 18,
                    borderRadius: 9,
                    background: "#3D5FDE",
                  }}
                />
              ))}
            </div>
          ) : null}
        </div>
      </div>
    ),
    {
      ...ogSize,
      fonts: [{ name: "Instrument Serif", data: font, style: "normal", weight: 400 }],
    },
  );
}
