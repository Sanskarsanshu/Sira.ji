"use client";

/*
 * Pull Lamp
 * Ported from the original Web Component (HTML/CSS/JS custom element)
 * by Ship Notes (https://x.com/shipnotesai), MIT licensed.
 * Source: https://github.com/aqualang89/shipnotes-components
 *
 * MIT License
 *
 * Copyright (c) 2026 Ship Notes
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in all
 * copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
 * SOFTWARE.
 */

import React, { useEffect, useId, useRef } from "react";

export interface PullLampProps {
  /** Whether the lamp starts in the "on" (light theme) state. Matches the original's boolean `on` attribute. */
  on?: boolean;
  /** Fired when the user drags, taps, or keyboard-activates the lamp. Mirrors the original's `themechange` CustomEvent. */
  onThemeChange?: (theme: "light" | "dark") => void;
  className?: string;
  style?: React.CSSProperties;
}

export default function PullLamp({
  on = false,
  onThemeChange,
  className,
  style,
}: PullLampProps) {
  const uid = useId().replace(/[:]/g, "");
  const rootRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const cordRef = useRef<SVGPathElement>(null);
  const beadsRef = useRef<SVGPathElement>(null);
  const knobRef = useRef<SVGGElement>(null);

  const isOnRef = useRef(on);
  const pullRef = useRef(0);
  const swayRef = useRef(0);
  const velocityRef = useRef(0);
  const sideVelocityRef = useRef(0);
  const lightRef = useRef(on ? 1 : 0);
  const lastRef = useRef(0);
  const frameRef = useRef(0);
  const dragRef = useRef<{
    id: number;
    x: number;
    y: number;
    scale: number;
  } | null>(null);
  const movedRef = useRef(0);
  const mediaRef = useRef<MediaQueryList | null>(null);
  const mountedRef = useRef(false);

  function pose(pull = 0, sway = 0, light = 0) {
    const root = rootRef.current;
    if (!root) return;
    root.style.setProperty("--light", String(Math.max(0, Math.min(1, light))));
    const x = 350 + sway;
    const y = 329 + pull;
    const d = `M350 226 Q${350 + sway * 0.22} ${277 + pull * 0.45} ${x} ${y}`;
    cordRef.current?.setAttribute("d", d);
    beadsRef.current?.setAttribute("d", d);
    knobRef.current?.setAttribute("transform", `translate(${sway} ${pull})`);
    if (buttonRef.current) {
      buttonRef.current.style.left = (x / 480) * 100 + "%";
      buttonRef.current.style.top = ((y + 3) / 560) * 100 + "%";
    }
  }

  function updateLabel() {
    const btn = buttonRef.current;
    if (!btn) return;
    const onNow = isOnRef.current;
    btn.setAttribute("aria-pressed", String(onNow));
    btn.setAttribute(
      "aria-label",
      onNow ? "Switch to dark theme" : "Switch to light theme",
    );
  }

  function tick(now: number) {
    const dt = lastRef.current
      ? Math.min((now - lastRef.current) / 1000, 0.025)
      : 0.016;
    lastRef.current = now;
    if (!dragRef.current) {
      velocityRef.current +=
        (-pullRef.current * 220 - velocityRef.current * 19) * dt;
      pullRef.current += velocityRef.current * dt;
      sideVelocityRef.current +=
        (-swayRef.current * 100 - sideVelocityRef.current * 9) * dt;
      swayRef.current += sideVelocityRef.current * dt;
    }
    const target = isOnRef.current ? 1 : 0;
    lightRef.current += (target - lightRef.current) * (1 - Math.exp(-dt * 9));
    pose(pullRef.current, swayRef.current, lightRef.current);
    if (
      Math.abs(pullRef.current) +
        Math.abs(velocityRef.current) +
        Math.abs(swayRef.current) +
        Math.abs(sideVelocityRef.current) +
        Math.abs(target - lightRef.current) >
        0.015 ||
      dragRef.current
    ) {
      frameRef.current = requestAnimationFrame(tick);
    } else {
      frameRef.current = 0;
      pose(0, 0, target);
    }
  }

  function animate() {
    if (mediaRef.current?.matches) {
      pullRef.current = 0;
      swayRef.current = 0;
      lightRef.current = isOnRef.current ? 1 : 0;
      pose(0, 0, lightRef.current);
      return;
    }
    if (!frameRef.current) {
      lastRef.current = 0;
      frameRef.current = requestAnimationFrame(tick);
    }
  }

  function toggle() {
    isOnRef.current = !isOnRef.current;
    updateLabel();
    const theme = isOnRef.current ? "light" : "dark";
    rootRef.current?.dispatchEvent(
      new CustomEvent("themechange", { detail: { theme }, bubbles: true }),
    );
    onThemeChange?.(theme);
    animate();
  }

  useEffect(() => {
    const button = buttonRef.current;
    const root = rootRef.current;
    if (!button || !root) return;

    mediaRef.current = window.matchMedia("(prefers-reduced-motion: reduce)");
    const motionChange = () => {
      if (mediaRef.current?.matches) {
        cancelAnimationFrame(frameRef.current);
        frameRef.current = 0;
        pullRef.current =
          swayRef.current =
          velocityRef.current =
          sideVelocityRef.current =
            0;
        lightRef.current = isOnRef.current ? 1 : 0;
        pose(0, 0, lightRef.current);
      }
    };
    mediaRef.current.addEventListener("change", motionChange);

    const onPointerDown = (e: PointerEvent) => {
      if (e.button !== 0) return;
      const rect = root.getBoundingClientRect();
      dragRef.current = {
        id: e.pointerId,
        x: e.clientX,
        y: e.clientY,
        scale: 480 / rect.width,
      };
      button.setPointerCapture(e.pointerId);
      movedRef.current = 0;
    };
    const onPointerMove = (e: PointerEvent) => {
      const drag = dragRef.current;
      if (!drag || e.pointerId !== drag.id) return;
      const dx = (e.clientX - drag.x) * drag.scale;
      const dy = (e.clientY - drag.y) * drag.scale;
      movedRef.current = Math.max(movedRef.current, Math.hypot(dx, dy));
      pullRef.current = Math.max(0, Math.min(65, dy));
      swayRef.current = Math.max(-24, Math.min(24, dx));
      pose(pullRef.current, swayRef.current, lightRef.current);
    };
    const release = (e: PointerEvent, cancelled: boolean) => {
      const drag = dragRef.current;
      if (!drag || e.pointerId !== drag.id) return;
      const doToggle =
        !cancelled && (pullRef.current > 16 || movedRef.current < 5);
      dragRef.current = null;
      if (button.hasPointerCapture(e.pointerId))
        button.releasePointerCapture(e.pointerId);
      if (doToggle) toggle();
      animate();
    };
    const onPointerUp = (e: PointerEvent) => release(e, false);
    const onPointerCancel = (e: PointerEvent) => release(e, true);
    const onLostPointerCapture = (e: PointerEvent) => {
      if (dragRef.current) release(e, true);
    };
    const onClick = (e: MouseEvent) => {
      if (e.detail === 0) toggle();
    };

    button.addEventListener("pointerdown", onPointerDown);
    button.addEventListener("pointermove", onPointerMove);
    button.addEventListener("pointerup", onPointerUp);
    button.addEventListener("pointercancel", onPointerCancel);
    button.addEventListener("lostpointercapture", onLostPointerCapture);
    button.addEventListener("click", onClick);

    updateLabel();
    pose(0, 0, isOnRef.current ? 1 : 0);

    return () => {
      cancelAnimationFrame(frameRef.current);
      frameRef.current = 0;
      mediaRef.current?.removeEventListener("change", motionChange);
      button.removeEventListener("pointerdown", onPointerDown);
      button.removeEventListener("pointermove", onPointerMove);
      button.removeEventListener("pointerup", onPointerUp);
      button.removeEventListener("pointercancel", onPointerCancel);
      button.removeEventListener("lostpointercapture", onLostPointerCapture);
      button.removeEventListener("click", onClick);
      dragRef.current = null;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (!mountedRef.current) {
      mountedRef.current = true;
      return;
    }
    isOnRef.current = on;
    updateLabel();
    animate();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [on]);

  return (
    <div
      ref={rootRef}
      className={["pull-lamp-" + uid, className].filter(Boolean).join(" ")}
      style={style}
    >
      <style>{`
.pull-lamp-${uid}{display:block;width:100%;aspect-ratio:480/560;--light:0;isolation:isolate}
.pull-lamp-${uid} *{box-sizing:border-box}
.pull-lamp-${uid} svg{display:block;width:100%;height:100%;overflow:visible}
.pull-lamp-${uid} .art{position:relative;width:100%;height:100%}
.pull-lamp-${uid} .lit{opacity:var(--light)}
.pull-lamp-${uid} .handle{position:absolute;left:calc(350 / 480 * 100%);top:calc(329 / 560 * 100%);width:48px;height:48px;transform:translate(-50%,-50%);border:0;border-radius:50%;background:transparent;cursor:grab;touch-action:none;-webkit-tap-highlight-color:transparent}
.pull-lamp-${uid} .handle:active{cursor:grabbing}
.pull-lamp-${uid} .handle:focus-visible{outline:2px solid #c79551;outline-offset:2px;background:#d4a56815}
.pull-lamp-${uid} .hint{position:absolute;width:1px;height:1px;overflow:hidden;clip-path:inset(50%)}
      `}</style>
      <div className="art">
        <svg viewBox="0 0 480 560" aria-hidden="true">
          <defs>
            <linearGradient id={`metal-${uid}`}>
              <stop stopColor="#4a3826" />
              <stop offset=".25" stopColor="#bf9c62" />
              <stop offset=".45" stopColor="#ffe4a5" />
              <stop offset=".6" stopColor="#a27d47" />
              <stop offset="1" stopColor="#49331f" />
            </linearGradient>
            <linearGradient id={`enamel-${uid}`} x1="0" y1="0" x2="1" y2=".85">
              <stop stopColor="#99b9a4" />
              <stop offset=".15" stopColor="#436a58" />
              <stop offset=".43" stopColor="#254737" />
              <stop offset=".73" stopColor="#132d23" />
              <stop offset="1" stopColor="#0a1e16" />
            </linearGradient>
            <linearGradient id={`base-${uid}`} x1="0" y1="0" x2="0" y2="1">
              <stop stopColor="#476450" />
              <stop offset=".4" stopColor="#163627" />
              <stop offset="1" stopColor="#0a1c14" />
            </linearGradient>
            <linearGradient id={`beam-${uid}`} x1="0" y1="0" x2="0" y2="1">
              <stop stopColor="#ffd892" stopOpacity=".24" />
              <stop offset="1" stopColor="#ffd892" stopOpacity="0" />
            </linearGradient>
            <radialGradient id={`pool-${uid}`}>
              <stop stopColor="#ffd997" stopOpacity=".6" />
              <stop offset=".55" stopColor="#ffd28a" stopOpacity=".17" />
              <stop offset="1" stopColor="#ffd28a" stopOpacity="0" />
            </radialGradient>
            <radialGradient id={`under-${uid}`}>
              <stop stopColor="#fffde1" />
              <stop offset=".5" stopColor="#ffe6a2" />
              <stop offset="1" stopColor="#b17839" />
            </radialGradient>
            <radialGradient id={`shadow-${uid}`}>
              <stop stopColor="#000" stopOpacity=".5" />
              <stop offset="1" stopColor="#000" stopOpacity="0" />
            </radialGradient>
            <linearGradient id={`edge-${uid}`}>
              <stop stopColor="#5a412b" />
              <stop offset=".5" stopColor="#eac98f" />
              <stop offset="1" stopColor="#795433" />
            </linearGradient>
            <filter id={`soft-${uid}`}>
              <feGaussianBlur stdDeviation="11" />
            </filter>
          </defs>
          <ellipse
            cx="245"
            cy="496"
            rx="169"
            ry="29"
            fill={`url(#shadow-${uid})`}
          />
          <g className="lit">
            <path
              d="M91 216 10 487 Q240 547 470 487L389 216Z"
              fill={`url(#beam-${uid})`}
            />
            <ellipse
              cx="240"
              cy="487"
              rx="225"
              ry="60"
              fill={`url(#pool-${uid})`}
            />
          </g>
          <path
            d="M320 487 Q410 507 456 492"
            fill="none"
            stroke="#0b1511"
            strokeWidth="4"
            strokeLinecap="round"
          />
          <ellipse cx="240" cy="477" rx="112" ry="25" fill="#0b1f16" />
          <path
            d="M128 468 Q132 447 240 445 Q346 447 352 468L351 478Q240 518 129 478Z"
            fill={`url(#base-${uid})`}
          />
          <ellipse
            cx="240"
            cy="467"
            rx="112"
            ry="23"
            fill={`url(#enamel-${uid})`}
          />
          <path
            d="M140 465Q240 433 340 465"
            fill="none"
            stroke="#d2dec5"
            strokeOpacity=".22"
            strokeWidth="1.5"
          />
          <ellipse
            cx="240"
            cy="464"
            rx="28"
            ry="8"
            fill={`url(#metal-${uid})`}
          />
          <rect
            x="230"
            y="213"
            width="20"
            height="249"
            rx="8"
            fill={`url(#metal-${uid})`}
          />
          <path d="M233 225V451" stroke="#ffedc6" strokeOpacity=".35" />
          <rect
            x="220"
            y="208"
            width="40"
            height="42"
            rx="12"
            fill={`url(#metal-${uid})`}
          />
          <ellipse cx="240" cy="216" rx="153" ry="24" fill="#0b1810" />
          <ellipse
            className="lit"
            cx="240"
            cy="224"
            rx="141"
            ry="23"
            fill="#ffcf77"
            filter={`url(#soft-${uid})`}
          />
          <ellipse
            className="lit"
            cx="240"
            cy="220"
            rx="146"
            ry="18"
            fill={`url(#under-${uid})`}
          />
          <path
            d="M86 216C92 151 139 110 206 103Q240 99 274 103C341 110 388 151 394 216Q240 244 86 216Z"
            fill={`url(#enamel-${uid})`}
          />
          <path
            d="M102 188C123 140 159 118 208 113"
            fill="none"
            stroke="#d5e8d6"
            strokeOpacity=".32"
            strokeWidth="3"
            strokeLinecap="round"
          />
          <path
            d="M87 215Q240 246 393 215"
            fill="none"
            stroke={`url(#edge-${uid})`}
            strokeWidth="4"
          />
          <ellipse
            cx="240"
            cy="102"
            rx="16"
            ry="5"
            fill={`url(#metal-${uid})`}
          />
          <path
            ref={cordRef}
            d="M350 226Q350 274 350 329"
            fill="none"
            stroke={`url(#metal-${uid})`}
            strokeWidth="2.5"
          />
          <path
            ref={beadsRef}
            d="M350 226Q350 274 350 329"
            fill="none"
            stroke="#e5ca97"
            strokeWidth="3.3"
            strokeLinecap="round"
            strokeDasharray=".1 5.5"
          />
          <g ref={knobRef}>
            <ellipse
              cx="350"
              cy="332"
              rx="7"
              ry="10"
              fill={`url(#metal-${uid})`}
            />
            <ellipse
              cx="348"
              cy="329"
              rx="1.5"
              ry="4"
              fill="#fff1c8"
              opacity=".65"
            />
          </g>
        </svg>
        <button
          ref={buttonRef}
          className="handle"
          type="button"
          aria-label={on ? "Switch to dark theme" : "Switch to light theme"}
          aria-pressed={on}
        />
        <span className="hint">
          Pull the cord down, or press Enter or Space.
        </span>
      </div>
    </div>
  );
}

