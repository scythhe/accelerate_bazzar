import { ImageResponse } from "next/og";

export const size = { width: 64, height: 64 };
export const contentType = "image/png";

// The awning mark on the pomegranate band colour.
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
          background: "#7E1F2E",
          borderRadius: 12,
        }}
      >
        <svg viewBox="0 0 32 32" width="50" height="50">
          <path d="M7 18v10M25 18v10M7 24.5h18" fill="none" stroke="#FFF6E5" strokeWidth="2.2" strokeLinecap="round" />
          <path d="M4 5h6v12a3 3 0 0 1-6 0z" fill="#E9A63A" />
          <path d="M10 5h6v12a3 3 0 0 1-6 0z" fill="#FFF6E5" />
          <path d="M16 5h6v12a3 3 0 0 1-6 0z" fill="#E9A63A" />
          <path d="M22 5h6v12a3 3 0 0 1-6 0z" fill="#FFF6E5" />
        </svg>
      </div>
    ),
    { ...size },
  );
}
