import { ImageResponse } from "next/og";

export const size = { width: 64, height: 64 };
export const contentType = "image/png";

// The wordmark is the only loud mark in the product — the favicon echoes that:
// a plain --ink square with the initial, nothing else.
export default function Icon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "#0F0F10",
          borderRadius: 12,
          color: "#FFFFFF",
          fontSize: 40,
          fontWeight: 700,
          fontFamily: "sans-serif",
        }}
      >
        A
      </div>
    ),
    { ...size },
  );
}
