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
          background: "#561320",
          padding: "80px",
          fontFamily: "sans-serif",
        }}
      >
        <div
          style={{
            fontSize: 96,
            fontWeight: 700,
            color: "#FFFFFF",
            letterSpacing: "-2px",
          }}
        >
          Bazzar
        </div>
        <div style={{ fontSize: 34, color: "#E9A63A", marginTop: 24 }}>
          B2B food supply marketplace — Tbilisi
        </div>
      </div>
    ),
    { ...size },
  );
}
