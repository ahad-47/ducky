import { buildOgImage, ogSize, ogContentType } from "@/lib/og-image";

export const size = ogSize;
export const contentType = ogContentType;

export default async function Image() {
  return buildOgImage({ title: "A scanner that only reports what it can reproduce.", showMarks: true });
}
