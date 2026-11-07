"use client";

import * as React from "react";
import PullLamp from "@/components/ui/pull-lamp";

export default function PullLampDemo() {
  const [theme, setTheme] = React.useState<"light" | "dark">("dark");

  const colors =
    theme === "dark"
      ? {
          bg: "#101b17",
          ink: "#f2eee0",
          muted: "#a0afa6",
          line: "#ffffff18",
          panel: "#172720",
        }
      : {
          bg: "#f0e7d6",
          ink: "#263c30",
          muted: "#596451",
          line: "#223c3020",
          panel: "#e9ddc6",
        };

  return (
    <div
      style={{
        background: colors.bg,
        color: colors.ink,
        fontFamily: "system-ui, sans-serif",
        transition: "background-color .65s, color .65s",
        width: "100%",
        minHeight: "100vh",
      }}
    >
      <main style={{ maxWidth: 680, margin: "auto", padding: "42px 24px" }}>
        <header
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            fontSize: 10,
            letterSpacing: 2,
            color: colors.muted,
          }}
        >
          <span>SHIP NOTES / 05</span>
          <span
            style={{
              border: `1px solid ${colors.line}`,
              padding: "8px 12px",
              borderRadius: 30,
              fontSize: 10,
              letterSpacing: 1,
            }}
          >
            {theme === "light" ? "DAY MODE" : "NIGHT MODE"}
          </span>
        </header>
        <h1
          style={{
            fontSize: "clamp(34px,7vw,54px)",
            fontWeight: 500,
            letterSpacing: "-2px",
            lineHeight: 1.08,
            maxWidth: 440,
            margin: "42px 0 14px",
            textWrap: "balance" as any,
          }}
        >
          A brighter kind of switch.
        </h1>
        <p style={{ fontSize: 14, lineHeight: 1.6, color: colors.muted }}>
          Pull a little. Change the whole mood.
        </p>
        <PullLamp
          on={theme === "light"}
          onThemeChange={setTheme}
          style={{ width: "min(100%, 480px)", margin: "-20px auto -25px" }}
        />
        <p style={{ textAlign: "center", fontSize: 13, color: colors.muted }}>
          Drag the brass pull. Or use Tab + Enter.
        </p>
        <section
          style={{
            margin: "32px 0 0",
            padding: "20px 22px",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            gap: 18,
            borderRadius: 20,
            background: colors.panel,
            boxShadow: `0 0 0 1px ${colors.line}`,
            transition: "background-color .65s",
          }}
        >
          <div>
            <strong style={{ display: "block", fontSize: 14, fontWeight: 500 }}>
              Your space. Your light.
            </strong>
            <p style={{ margin: "6px 0 0", fontSize: 12, color: colors.muted }}>
              The page theme follows the lamp.
            </p>
          </div>
          <span aria-hidden="true" style={{ fontSize: 21 }}>
            ↗
          </span>
        </section>
        <p
          style={{
            fontSize: 11,
            lineHeight: 1.6,
            color: colors.muted,
            margin: "22px 0 0",
          }}
        >
          HTML, SVG and JavaScript. No libraries. The lamp emits a themechange
          event; this demo applies it to the page.
        </p>
      </main>
    </div>
  );
}

