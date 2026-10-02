// Fetches the Instrument Serif TTF for use with next/og's ImageResponse,
// which needs raw font bytes rather than a CSS @font-face link.
let cached: ArrayBuffer | null = null;

export async function getInstrumentSerifFont(): Promise<ArrayBuffer> {
  if (cached) return cached;

  const cssResponse = await fetch(
    "https://fonts.googleapis.com/css2?family=Instrument+Serif&text=SkilldcanAsmetpr0-9.",
    { headers: { "User-Agent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7)" } },
  );
  const css = await cssResponse.text();
  const match = css.match(/url\((https:\/\/[^)]+)\)/);
  if (!match) throw new Error("Could not resolve Instrument Serif font URL");

  const fontResponse = await fetch(match[1]);
  const buffer = await fontResponse.arrayBuffer();
  cached = buffer;
  return buffer;
}

// Montserrat at one weight, subset to the logo's letters, for the wordmark
// on generated images.
const logoCache = new Map<number, ArrayBuffer>();

export async function getLogoFont(weight: 300 | 800): Promise<ArrayBuffer> {
  const hit = logoCache.get(weight);
  if (hit) return hit;
  const cssResponse = await fetch(
    `https://fonts.googleapis.com/css2?family=Montserrat:wght@${weight}&text=SKILLEDCAN`,
    { headers: { "User-Agent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7)" } },
  );
  const css = await cssResponse.text();
  const match = css.match(/url\((https:\/\/[^)]+)\)/);
  if (!match) throw new Error("Could not resolve Montserrat font URL");
  const buffer = await (await fetch(match[1])).arrayBuffer();
  logoCache.set(weight, buffer);
  return buffer;
}
