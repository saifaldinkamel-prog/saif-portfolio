import { ImageResponse } from "next/og";
import { OG_SIZE, ShareCard } from "@/components/og/ShareCard";

export const alt = "PocketBalance — a real Android finance app by Saifaldin Kamel";
export const size = OG_SIZE;
export const contentType = "image/png";

export default function Image() {
  return new ImageResponse(
    (
      <ShareCard
        eyebrow="Saif.dev · Currently building"
        badge="Real Android app"
        title="PocketBalance"
        subtitle="Turns the bank SMS you already get into a live balance and spending insights."
        footer="Try the interactive replica · by Saifaldin Kamel"
        glow="#7C3AED"
      />
    ),
    size
  );
}
