import { ImageResponse } from "next/og";

export const size = { width: 180, height: 180 };
export const contentType = "image/png";

export default function AppleIcon() {
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
        }}
      >
        <svg viewBox="0 0 32 32" width="136" height="136">
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
