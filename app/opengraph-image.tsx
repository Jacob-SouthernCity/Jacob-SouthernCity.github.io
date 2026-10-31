import { ImageResponse } from "next/og";

export const alt = "Jingze Ma, Software Engineer";
export const size = {
  width: 1200,
  height: 630,
};
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
          padding: "80px",
          background: "linear-gradient(135deg, #020617 0%, #1e1b4b 100%)",
          color: "#f8fafc",
        }}
      >
        <div style={{ fontSize: 88, fontWeight: 700 }}>Jingze Ma</div>
        <div
          style={{
            marginTop: 16,
            fontSize: 44,
            backgroundImage: "linear-gradient(90deg, #2dd4bf, #6366f1)",
            backgroundClip: "text",
            color: "transparent",
          }}
        >
          Software Engineer
        </div>
        <div style={{ marginTop: 40, fontSize: 30, color: "#cbd5e1" }}>
          Web, mobile and platform at Smule · Yale MSCS · USC CS (Games)
        </div>
        <div style={{ marginTop: "auto", fontSize: 26, color: "#94a3b8" }}>
          majingze.com
        </div>
      </div>
    ),
    size
  );
}
