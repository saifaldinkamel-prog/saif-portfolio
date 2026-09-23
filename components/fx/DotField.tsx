"use client";

import { useEffect, useRef } from "react";
import { useReducedMotion } from "motion/react";

const GAP = 26;
const RADIUS = 190;
const PUSH = 16;
const IDLE_AFTER_MS = 2200;
const SIGNAL = [61, 214, 140];

/**
 * A dark field of dots that only comes alive where the light is: the
 * pointer acts as a flashlight, brightening, tinting, and pushing the
 * dots around it. With no pointer (touch, or idle), the light drifts on
 * its own slow path so the field never looks dead. Pauses entirely
 * when scrolled offscreen; renders a single still frame under reduced
 * motion.
 */
export function DotField({ className = "" }: { className?: string }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const reduceMotion = useReducedMotion();

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext("2d");
    if (!canvas || !ctx) return;

    let width = 0;
    let height = 0;
    let dots: { x: number; y: number }[] = [];
    let frame = 0;
    let running = false;
    let lastMove = -Infinity;
    let lastDraw = 0;
    const light = { x: 0, y: 0, tx: 0, ty: 0 };
    // Touch devices are usually phones: draw at ~30fps and lower pixel
    // density there. The light drifts slowly, so the difference is invisible.
    const lowPower = window.matchMedia("(pointer: coarse)").matches;
    const frameInterval = lowPower ? 1000 / 30 : 0;

    function resize() {
      if (!canvas || !ctx) return;
      const rect = canvas.getBoundingClientRect();
      const dpr = Math.min(window.devicePixelRatio || 1, lowPower ? 1.5 : 2);
      width = rect.width;
      height = rect.height;
      canvas.width = Math.round(width * dpr);
      canvas.height = Math.round(height * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      dots = [];
      for (let y = GAP / 2; y < height; y += GAP) {
        for (let x = GAP / 2; x < width; x += GAP) dots.push({ x, y });
      }
      if (light.x === 0 && light.y === 0) {
        light.x = light.tx = width * 0.7;
        light.y = light.ty = height * 0.45;
      }
    }

    function draw(time: number) {
      if (!ctx) return;
      if (time - lastMove > IDLE_AFTER_MS) {
        light.tx = width * (0.62 + 0.24 * Math.sin(time / 2900));
        light.ty = height * (0.48 + 0.26 * Math.sin(time / 2100 + 1.3));
      }
      light.x += (light.tx - light.x) * 0.1;
      light.y += (light.ty - light.y) * 0.1;

      ctx.clearRect(0, 0, width, height);

      ctx.fillStyle = "rgba(242,244,247,0.16)";
      ctx.beginPath();
      const lit: { x: number; y: number; e: number }[] = [];
      for (const dot of dots) {
        const dx = dot.x - light.x;
        const dy = dot.y - light.y;
        const dist = Math.hypot(dx, dy);
        if (dist >= RADIUS) {
          ctx.rect(dot.x - 0.75, dot.y - 0.75, 1.5, 1.5);
          continue;
        }
        const t = 1 - dist / RADIUS;
        const e = t * t;
        const nx = dist > 0 ? dx / dist : 0;
        const ny = dist > 0 ? dy / dist : 0;
        lit.push({ x: dot.x + nx * e * PUSH, y: dot.y + ny * e * PUSH, e });
      }
      ctx.fill();

      for (const dot of lit) {
        const r = Math.round(242 + (SIGNAL[0] - 242) * dot.e);
        const g = Math.round(244 + (SIGNAL[1] - 244) * dot.e);
        const b = Math.round(247 + (SIGNAL[2] - 247) * dot.e);
        ctx.fillStyle = `rgba(${r},${g},${b},${0.12 + dot.e * 0.85})`;
        ctx.beginPath();
        ctx.arc(dot.x, dot.y, 0.9 + dot.e * 1.6, 0, Math.PI * 2);
        ctx.fill();
      }
    }

    function loop(time: number) {
      if (time - lastDraw >= frameInterval) {
        lastDraw = time;
        draw(time);
      }
      frame = requestAnimationFrame(loop);
    }

    function start() {
      if (running || reduceMotion) return;
      running = true;
      frame = requestAnimationFrame(loop);
    }

    function stop() {
      running = false;
      cancelAnimationFrame(frame);
    }

    function handleMove(event: PointerEvent) {
      if (!canvas) return;
      const rect = canvas.getBoundingClientRect();
      light.tx = event.clientX - rect.left;
      light.ty = event.clientY - rect.top;
      lastMove = performance.now();
    }

    resize();
    draw(0);

    const resizeObserver = new ResizeObserver(() => {
      resize();
      if (!running) draw(performance.now());
    });
    resizeObserver.observe(canvas);

    const visibility = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) start();
      else stop();
    });
    visibility.observe(canvas);

    window.addEventListener("pointermove", handleMove, { passive: true });

    return () => {
      stop();
      resizeObserver.disconnect();
      visibility.disconnect();
      window.removeEventListener("pointermove", handleMove);
    };
  }, [reduceMotion]);

  return <canvas ref={canvasRef} aria-hidden className={`pointer-events-none h-full w-full ${className}`} />;
}
