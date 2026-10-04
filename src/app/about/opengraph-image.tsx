import { buildOgImage, ogSize, ogContentType } from "@/lib/og-image";

export const size = ogSize;
export const contentType = ogContentType;

export default async function Image() {
  return buildOgImage({ title: "Who builds SkilledScan" });
}
