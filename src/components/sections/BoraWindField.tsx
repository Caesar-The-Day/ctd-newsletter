import { useEffect, useRef } from 'react';

interface BoraWindFieldProps {
  /** 0 = light drift, 1 = record gusts */
  intensity: number;
  className?: string;
}

type Kind = 'leaf' | 'scrap' | 'spray';

interface P {
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  rot: number;
  vrot: number;
  kind: Kind;
  hue: number;
  alpha: number;
  wobble: number;
  phase: number;
}

const LEAF_HUES = [28, 36, 18, 44];

function makeParticle(w: number, h: number, seedX?: number): P {
  const r = Math.random();
  const kind: Kind = r < 0.55 ? 'leaf' : r < 0.75 ? 'scrap' : 'spray';
  return {
    x: seedX ?? Math.random() * w,
    y: Math.random() * h,
    vx: 0.6 + Math.random() * 0.8,
    vy: (Math.random() - 0.5) * 0.4,
    size: kind === 'spray' ? 1.2 + Math.random() * 2 : 5 + Math.random() * 9,
    rot: Math.random() * Math.PI * 2,
    vrot: (Math.random() - 0.5) * 0.15,
    kind,
    hue: LEAF_HUES[Math.floor(Math.random() * LEAF_HUES.length)],
    alpha: 0.25 + Math.random() * 0.5,
    wobble: 6 + Math.random() * 22,
    phase: Math.random() * Math.PI * 2,
  };
}

function drawLeaf(ctx: CanvasRenderingContext2D, p: P, stretch: number) {
  ctx.beginPath();
  const s = p.size;
  ctx.ellipse(0, 0, s * (1 + stretch), s * 0.45, 0, 0, Math.PI * 2);
  ctx.fillStyle = `hsla(${p.hue}, 55%, 42%, ${p.alpha})`;
  ctx.fill();
  ctx.beginPath();
  ctx.moveTo(-s * (1 + stretch), 0);
  ctx.lineTo(s * (1 + stretch), 0);
  ctx.strokeStyle = `hsla(${p.hue}, 40%, 25%, ${p.alpha * 0.6})`;
  ctx.lineWidth = 0.6;
  ctx.stroke();
}

export default function BoraWindField({ intensity, className }: BoraWindFieldProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const target = useRef(intensity);
  const eased = useRef(intensity);
  const particles = useRef<P[]>([]);
  const raf = useRef<number | undefined>(undefined);

  target.current = intensity;

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const dpr = Math.min(window.devicePixelRatio || 1, 2);

    // Device capability budget
    const nav = navigator as Navigator & { deviceMemory?: number; hardwareConcurrency?: number };
    const cores = nav.hardwareConcurrency ?? 4;
    const mem = nav.deviceMemory ?? 4;
    const coarse = window.matchMedia('(pointer: coarse)').matches;
    const lowPower = cores <= 4 || mem <= 4;
    // frame budget: full rate on capable devices, ~30fps on constrained ones
    const minFrameMs = lowPower || coarse ? 33 : 0;

    let w = 0;
    let h = 0;
    let maxCount = 160;

    const resize = () => {
      const rect = canvas.getBoundingClientRect();
      w = rect.width;
      h = rect.height;
      canvas.width = Math.max(1, Math.floor(w * dpr));
      canvas.height = Math.max(1, Math.floor(h * dpr));
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      const base = w < 640 ? 60 : w < 1024 ? 120 : 190;
      const scale = (coarse ? 0.6 : 1) * (lowPower ? 0.6 : 1);
      maxCount = Math.max(24, Math.round(base * scale));
      particles.current = Array.from({ length: maxCount }, () => makeParticle(w, h));
    };

    resize();
    const ro = new ResizeObserver(resize);
    ro.observe(canvas);


    if (reduced) {
      // Static tilted scatter, no animation.
      ctx.clearRect(0, 0, w, h);
      particles.current.slice(0, 40).forEach((p) => {
        ctx.save();
        ctx.translate(p.x, p.y);
        ctx.rotate(0.15);
        if (p.kind === 'spray') {
          ctx.fillStyle = `hsla(200, 60%, 85%, ${p.alpha})`;
          ctx.beginPath();
          ctx.arc(0, 0, p.size, 0, Math.PI * 2);
          ctx.fill();
        } else {
          drawLeaf(ctx, p, 0.2);
        }
        ctx.restore();
      });
      return () => ro.disconnect();
    }

    let t = 0;
    const loop = () => {
      t += 0.016;
      // ease toward target intensity
      eased.current += (target.current - eased.current) * 0.06;
      const k = eased.current; // 0..1

      const speed = 1.2 + k * 13;
      const activeCount = Math.floor(maxCount * (0.28 + k * 0.72));
      const gust = 1 + Math.sin(t * (0.8 + k * 3)) * (0.12 + k * 0.55);
      const stretch = k * 1.6 * gust;

      ctx.clearRect(0, 0, w, h);

      for (let i = 0; i < activeCount; i++) {
        const p = particles.current[i];
        if (!p) continue;
        const drag = p.kind === 'spray' ? 1.5 : 1;
        p.x += p.vx * speed * gust * drag;
        p.y += p.vy * (1 + k * 2) + Math.sin(t * 2 + p.phase) * (p.wobble * 0.01) * (1 - k * 0.7);
        p.rot += p.vrot * (0.4 + k * 3);

        if (p.x - p.size > w) {
          Object.assign(p, makeParticle(w, h, -p.size - Math.random() * 120));
        }
        if (p.y < -30) p.y = h + 20;
        if (p.y > h + 30) p.y = -20;

        ctx.save();
        ctx.translate(p.x, p.y);
        ctx.rotate(p.rot * (1 - k * 0.6) + k * 0.25);
        ctx.globalAlpha = 1;

        if (p.kind === 'spray') {
          ctx.strokeStyle = `hsla(200, 70%, 90%, ${p.alpha * (0.4 + k * 0.6)})`;
          ctx.lineWidth = p.size * 0.7;
          ctx.lineCap = 'round';
          ctx.beginPath();
          ctx.moveTo(0, 0);
          ctx.lineTo(-(4 + k * 46) * gust, 0);
          ctx.stroke();
        } else if (p.kind === 'scrap') {
          ctx.fillStyle = `hsla(45, 30%, 88%, ${p.alpha * 0.8})`;
          const s = p.size;
          ctx.fillRect(-s * (1 + stretch * 0.6), -s * 0.3, s * 2 * (1 + stretch * 0.6), s * 0.6);
        } else {
          drawLeaf(ctx, p, stretch * 0.5);
          if (k > 0.45) {
            ctx.globalAlpha = (k - 0.45) * 0.7;
            ctx.strokeStyle = `hsla(${p.hue}, 45%, 55%, ${p.alpha * 0.5})`;
            ctx.lineWidth = p.size * 0.35;
            ctx.beginPath();
            ctx.moveTo(0, 0);
            ctx.lineTo(-(20 + k * 70) * gust, 0);
            ctx.stroke();
          }
        }
        ctx.restore();
      }

      raf.current = requestAnimationFrame(loop);
    };

    raf.current = requestAnimationFrame(loop);

    return () => {
      ro.disconnect();
      if (raf.current) cancelAnimationFrame(raf.current);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      className={className}
      style={{ width: '100%', height: '100%' }}
    />
  );
}
