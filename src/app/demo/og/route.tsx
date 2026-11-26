import { ImageResponse } from "next/og";

export const runtime = "edge";

export async function GET(request: Request) {
  const url = new URL(request.url);
  const title = url.searchParams.get("title") ?? "Acme Cloud";
  const tenant = url.searchParams.get("tenant") ?? "acme";

  return new ImageResponse(
    (
      <div
        style={{
          height: "100%",
          width: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          background: "#070a09",
          color: "#eef5ef",
          padding: "64px",
          fontFamily: "sans-serif",
        }}
      >
        <div style={{ display: "flex", gap: "18px", alignItems: "center" }}>
          <span style={{ color: "#c6f36b", fontSize: "26px" }}>
            ACME CLOUD
          </span>
          <span style={{ color: "#94a39b", fontSize: "22px" }}>
            tenant {tenant}
          </span>
        </div>
        <div
          style={{
            display: "flex",
            fontSize: "64px",
            fontWeight: 700,
            lineHeight: 1.1,
            maxWidth: "980px",
          }}
        >
          {title}
        </div>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            color: "#94a39b",
            fontSize: "24px",
          }}
        >
          <span>Mock production app</span>
          <span>edge og · 1200×630</span>
        </div>
      </div>
    ),
    { width: 1200, height: 630 },
  );
}
