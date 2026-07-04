import { ImageResponse } from "next/og";
import { readFile } from "node:fs/promises";
import { join } from "node:path";
import { siteConfig } from "@/lib/site-config";

export const runtime = "nodejs";
export const alt = `${siteConfig.name} - Professional Plastering Services`;
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default async function OGImage() {
  const logoBuffer = await readFile(
    join(process.cwd(), "public/brand/ppl-logo-header.png")
  );
  const logoSrc = `data:image/png;base64,${logoBuffer.toString("base64")}`;

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
        {/* eslint-disable-next-line @next/next/no-img-element -- next/og ImageResponse requires native img */}
        <img
          src={logoSrc}
          width={360}
          height={249}
          alt=""
          style={{ marginBottom: "40px" }}
        />
        <p
          style={{
            color: "white",
            fontSize: "52px",
            fontWeight: 800,
            lineHeight: 1.15,
            maxWidth: "900px",
            margin: 0,
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
