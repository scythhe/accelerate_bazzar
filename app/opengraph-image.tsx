import { ImageResponse } from "next/og";

export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OpengraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "flex-start",
          justifyContent: "center",
          background: "#FFFFFF",
          padding: "80px",
          fontFamily: "sans-serif",
        }}
      >
        <div
          style={{
            fontSize: 96,
            fontWeight: 700,
            color: "#0F0F10",
            letterSpacing: "-2px",
          }}
        >
          Accelerate
        </div>
        <div style={{ fontSize: 34, color: "#52525B", marginTop: 24 }}>
          B2B food supply marketplace — Tbilisi
        </div>
      </div>
    ),
    { ...size },
  );
}
