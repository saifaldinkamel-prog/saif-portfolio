import { ImageResponse } from "next/og";
import { OG_SIZE, ShareCard } from "@/components/og/ShareCard";

export const alt = "Saifaldin Kamel — Software Engineer";
export const size = OG_SIZE;
export const contentType = "image/png";

export default function Image() {
  return new ImageResponse(
    (
      <ShareCard
        eyebrow="Saif.dev · Portfolio"
        badge="Open to internships"
        title="Saifaldin Kamel"
        subtitle="Software engineer, strongest in frontend and mobile apps."
        footer="Currently building PocketBalance · Giza, Egypt"
      />
    ),
    size
  );
}
