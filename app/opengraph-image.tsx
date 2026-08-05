import { ImageResponse } from "next/og";
import { SIGNATURE_PATH } from "@/components/layout/logo-mark";

export const alt = "matte design — Design with Purpose. Build with Intelligence.";
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
          justifyContent: "center",
          background: "#0e0e0e",
          padding: 88,
        }}
      >
        <svg width={220} height={77} viewBox="0 0 240 84" style={{ display: "flex" }}>
          <path
            d={SIGNATURE_PATH}
            fill="none"
            stroke="#f7f6f3"
            strokeWidth={9}
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
        <div style={{ fontSize: 76, fontWeight: 700, color: "#f7f6f3", letterSpacing: -2, marginTop: 36, display: "flex" }}>
          matte design
        </div>
        <div style={{ fontSize: 30, color: "#8c877d", marginTop: 18, display: "flex" }}>
          Design with Purpose. Build with Intelligence.
        </div>
      </div>
    ),
    { ...size }
  );
}
