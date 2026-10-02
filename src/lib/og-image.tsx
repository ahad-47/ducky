import { ImageResponse } from "next/og";
import { getInstrumentSerifFont, getLogoFont } from "@/lib/og-font";
import { OgLogoMark } from "@/lib/logo-mark";

export const ogSize = { width: 1200, height: 630 };
export const ogContentType = "image/png";

export async function buildOgImage({ title, showMarks = false }: { title: string; showMarks?: boolean }) {
  const [font, logoBold, logoLight] = await Promise.all([getInstrumentSerifFont(), getLogoFont(800), getLogoFont(300)]);

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          background: "#0C0D0F",
          padding: 72,
        }}
      >
        <div
          style={{
            display: "flex",
            fontFamily: "Instrument Serif",
            fontSize: 64,
            color: "#EEEBE5",
            maxWidth: 900,
            lineHeight: 1.1,
          }}
        >
          {title}
        </div>
        <div style={{ display: "flex", width: "100%", justifyContent: "space-between", alignItems: "flex-end" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 16, color: "#EEEBE5" }}>
            <OgLogoMark size={52} color="#FF5A1F" />
            <div style={{ display: "flex", fontFamily: "Montserrat", fontSize: 36, letterSpacing: 1 }}>
              <span style={{ fontWeight: 800 }}>SKILLED</span>
              <span style={{ fontWeight: 300 }}>SCAN</span>
            </div>
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
                    background: "#FF5A1F",
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
      fonts: [
        { name: "Instrument Serif", data: font, style: "normal", weight: 400 },
        { name: "Montserrat", data: logoBold, style: "normal", weight: 800 },
        { name: "Montserrat", data: logoLight, style: "normal", weight: 300 },
      ],
    },
  );
}
