import { ImageResponse } from "next/og";
import { siteConfig } from "@/lib/site-config";

export const runtime = "edge";
export const alt = `${siteConfig.name} - Professional Plastering Services`;
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OGImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          padding: "60px",
          background: "#111111",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "16px",
            marginBottom: "32px",
          }}
        >
          <div
            style={{
              width: "64px",
              height: "64px",
              borderRadius: "12px",
              background: "#D90429",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: "white",
              fontSize: "28px",
              fontWeight: 900,
            }}
          >
            PP
          </div>
          <span
            style={{ color: "white", fontSize: "36px", fontWeight: 700 }}
          >
            {siteConfig.name}
          </span>
        </div>
        <p
          style={{
            color: "white",
            fontSize: "52px",
            fontWeight: 800,
            lineHeight: 1.15,
            maxWidth: "900px",
          }}
        >
          {siteConfig.tagline}
        </p>
        <p style={{ color: "rgba(255,255,255,0.5)", fontSize: "24px", marginTop: "24px" }}>
          {siteConfig.location.serviceArea} &bull; Free Quotes &bull; Fully Insured
        </p>
      </div>
    ),
    { ...size }
  );
}
