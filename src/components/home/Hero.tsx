import { useEffect, useRef, useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import { Page } from '../../lib/types';

interface HeroProps {
  onNavigate: (page: Page) => void;
}

/* ─── Particle ─────────────────────────────────────────────────── */
class Particle {
  canvas: HTMLCanvasElement;
  tx: number; ty: number;
  x: number;  y: number;
  vx: number; vy: number;
  color: string;
  size: number; baseSize: number;
  ease: number;
  alpha: number; ta: number;
  wob: number; wobS: number; wobA: number;

  constructor(canvas: HTMLCanvasElement, tx: number, ty: number) {
    this.canvas = canvas;
    this.tx = tx; this.ty = ty;
    const pool = ['#ffffff','#ffffff','#E8E4D9','#ff6b85','#D91E36','#ffffff'];
    this.color = pool[Math.floor(Math.random() * pool.length)];
    this.size = Math.random() * 2.6 + 0.6;
    this.baseSize = this.size;
    const e = Math.floor(Math.random() * 4);
    if      (e === 0) { this.x = Math.random() * canvas.width;  this.y = -30; }
    else if (e === 1) { this.x = canvas.width  + 30;            this.y = Math.random() * canvas.height; }
    else if (e === 2) { this.x = Math.random() * canvas.width;  this.y = canvas.height + 30; }
    else              { this.x = -30;                            this.y = Math.random() * canvas.height; }
    this.vx = 0; this.vy = 0;
    this.ease = 0.044 + Math.random() * 0.04;
    this.alpha = 0; this.ta = 0.75 + Math.random() * 0.25;
    this.wob  = Math.random() * Math.PI * 2;
    this.wobS = 0.014 + Math.random() * 0.02;
    this.wobA = Math.random() * 0.9;
  }

  update(mx: number | null, my: number | null, dispersing: boolean, frame: number, attracting: boolean) {
    this.wob += this.wobS;
    const wx = Math.sin(this.wob) * this.wobA;
    const wy = Math.cos(this.wob * 0.7) * this.wobA;
    if (dispersing) {
      this.vx += (Math.random() - .5) * 5;
      this.vy += (Math.random() - .5) * 5 + 0.4;
      this.vx *= .93; this.vy *= .93;
      this.x += this.vx; this.y += this.vy;
      this.alpha -= 0.018;
    } else {
      const dx = this.tx + wx - this.x;
      const dy = this.ty + wy - this.y;
      this.vx += dx * this.ease; this.vy += dy * this.ease;
      this.vx *= .78; this.vy *= .78;
      this.x += this.vx; this.y += this.vy;
      this.alpha += (this.ta - this.alpha) * 0.07;
    }
    if (mx != null && my != null) {
      const dx = this.x - mx, dy = this.y - my;
      const d = Math.sqrt(dx * dx + dy * dy);
      if (attracting) {
        if (d > 5 && d < 200) {
          const f = ((200 - d) / 200) * 0.08;
          this.vx += (mx - this.x) * f;
          this.vy += (my - this.y) * f;
        }
      } else {
        if (d < 130) {
          const f = (130 - d) / 130;
          this.x += (dx / d) * f * 9;
          this.y += (dy / d) * f * 9;
        }
      }
    }
    this.size = this.baseSize + Math.sin(frame * 0.05 + this.wob) * 0.5;
  }

  draw(ctx: CanvasRenderingContext2D) {
    if (this.alpha <= 0) return;
    ctx.globalAlpha = Math.max(0, Math.min(1, this.alpha));
    ctx.fillStyle = this.color;
    ctx.beginPath();
    ctx.arc(this.x, this.y, Math.max(0.1, this.size), 0, Math.PI * 2);
    ctx.fill();
  }
}

/* ─── Spark ──────────────────────────────────────────────────────── */
class Spark {
  x: number; y: number; vx: number; vy: number;
  alpha: number; size: number; color: string;
  constructor(x: number, y: number, explosive = false) {
    this.x = x; this.y = y;
    const speed = explosive ? 7 : 4;
    this.vx = (Math.random() - .5) * speed;
    this.vy = (Math.random() - .5) * speed - 1.5;
    this.alpha = 0.95;
    this.size  = Math.random() * 2.8 + 0.5;
    this.color = Math.random() > .5 ? '#ff6b85' : '#E8E4D9';
  }
  update() {
    this.x += this.vx; this.y += this.vy;
    this.vy += 0.1; this.vx *= 0.96;
    this.alpha -= 0.022;
  }
  draw(ctx: CanvasRenderingContext2D) {
    if (this.alpha <= 0) return;
    ctx.globalAlpha = this.alpha; ctx.fillStyle = this.color;
    ctx.beginPath(); ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2); ctx.fill();
  }
}

/* ─── Sample text → pixel points ─────────────────────────────────── */
function sampleText(text: string, W: number, H: number, density: number) {
  const off = document.createElement('canvas');
  off.width = W; off.height = H;
  const ctx = off.getContext('2d')!;
  const fs = Math.min((W * 0.82) / (text.length * 0.62), H * 0.52);
  ctx.fillStyle = '#fff';
  ctx.font = `900 ${fs}px Georgia, serif`;
  ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
  ctx.fillText(text, W / 2, H / 2);
  const d = ctx.getImageData(0, 0, W, H).data;
  const pts: { x: number; y: number }[] = [];
  for (let y = 0; y < H; y += density)
    for (let x = 0; x < W; x += density)
      if (d[(y * W + x) * 4 + 3] > 128) pts.push({ x, y });
  return pts;
}

/* ─── Config ──────────────────────────────────────────────────────── */
const WORDS = ['SCALERS', 'SCALERS', 'SCALE', 'GROW', 'WIN', 'LEAD'];
const PHASES: Record<string, number> = { forming: 90, hold: 160, dispersing: 60, gap: 30 };

/* ─── Desktop Particle Canvas ─────────────────────────────────────── */
function ParticleCanvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const S = useRef({
    particles: [] as Particle[],
    sparks:    [] as Spark[],
    mouse:     { x: null as number | null, y: null as number | null },
    frame: 0, phase: 'forming', timer: 0, wi: 0, raf: 0,
    clicking: false,
  });

  useEffect(() => {
    const canvas = canvasRef.current!;
    const ctx    = canvas.getContext('2d')!;
    const s      = S.current;

    const resize  = () => { canvas.width = canvas.offsetWidth; canvas.height = canvas.offsetHeight; rebuild(); };
    const rebuild = () => {
      const word    = WORDS[s.wi % WORDS.length];
      const density = Math.max(3, Math.floor(canvas.width / 165));
      const pts     = sampleText(word, canvas.width, canvas.height, density);
      s.particles   = pts.map(p => new Particle(canvas, p.x, p.y));
    };

    const onMove  = (e: MouseEvent) => { const r = canvas.getBoundingClientRect(); s.mouse.x = e.clientX - r.left; s.mouse.y = e.clientY - r.top; };
    const onLeave = () => { s.mouse.x = null; s.mouse.y = null; };
    const onClick = (e: MouseEvent) => {
      const r = canvas.getBoundingClientRect();
      const cx = e.clientX - r.left, cy = e.clientY - r.top;
      for (let i = 0; i < 40; i++) s.sparks.push(new Spark(cx, cy, true));
      for (const p of s.particles) { if (Math.random() > 0.6) s.sparks.push(new Spark(p.x, p.y, true)); }
      s.wi++; s.phase = 'forming'; s.timer = 0; rebuild();
    };

    canvas.addEventListener('mousemove', onMove);
    canvas.addEventListener('mouseleave', onLeave);
    canvas.addEventListener('click', onClick);
    window.addEventListener('resize', resize);
    resize();

    const tick = () => {
      s.frame++; s.timer++;
      const { width: W, height: H } = canvas;
      ctx.globalAlpha = 1;
      ctx.fillStyle = 'rgba(13,2,5,0.88)'; ctx.fillRect(0, 0, W, H);
      ctx.globalAlpha = 0.045; ctx.strokeStyle = '#E8E4D9'; ctx.lineWidth = 0.5;
      for (let i = 1; i < 13; i++) { ctx.beginPath(); ctx.moveTo((i/13)*W,0); ctx.lineTo((i/13)*W,H); ctx.stroke(); }
      for (let i = 1; i < 8;  i++) { ctx.beginPath(); ctx.moveTo(0,(i/8)*H);  ctx.lineTo(W,(i/8)*H);  ctx.stroke(); }
      ctx.globalAlpha = 1;
      const pulse = s.phase === 'hold' ? 0.42 + Math.sin(s.frame * 0.06) * 0.2 : 0.22;
      const gr = ctx.createRadialGradient(W/2, H/2, 0, W/2, H/2, Math.min(W,H) * 0.65);
      gr.addColorStop(0, `rgba(217,30,54,${pulse})`);
      gr.addColorStop(0.5, `rgba(139,16,50,${pulse * 0.4})`);
      gr.addColorStop(1, 'rgba(0,0,0,0)');
      ctx.fillStyle = gr; ctx.fillRect(0, 0, W, H);
      if (s.mouse.x != null) {
        const cg = ctx.createRadialGradient(s.mouse.x!, s.mouse.y!, 0, s.mouse.x!, s.mouse.y!, 140);
        cg.addColorStop(0, 'rgba(255,107,133,0.18)'); cg.addColorStop(0.5, 'rgba(217,30,54,0.06)'); cg.addColorStop(1, 'rgba(0,0,0,0)');
        ctx.fillStyle = cg; ctx.fillRect(0, 0, W, H);
      }
      const disp = s.phase === 'dispersing';
      for (const p of s.particles) { p.update(s.mouse.x, s.mouse.y, disp, s.frame, false); p.draw(ctx); }
      if (disp && s.frame % 2 === 0 && s.particles.length) {
        const rp = s.particles[Math.floor(Math.random() * s.particles.length)];
        if (rp) s.sparks.push(new Spark(rp.x, rp.y));
      }
      for (let i = s.sparks.length - 1; i >= 0; i--) {
        s.sparks[i].update(); s.sparks[i].draw(ctx);
        if (s.sparks[i].alpha <= 0) s.sparks.splice(i, 1);
      }
      if (s.timer >= PHASES[s.phase]) {
        s.timer = 0;
        if      (s.phase === 'forming')    s.phase = 'hold';
        else if (s.phase === 'hold')       s.phase = 'dispersing';
        else if (s.phase === 'dispersing') { s.phase = 'gap'; s.wi++; }
        else                               { s.phase = 'forming'; rebuild(); }
      }
      ctx.globalAlpha = 1;
      s.raf = requestAnimationFrame(tick);
    };
    s.raf = requestAnimationFrame(tick);

    return () => {
      cancelAnimationFrame(s.raf);
      canvas.removeEventListener('mousemove', onMove);
      canvas.removeEventListener('mouseleave', onLeave);
      canvas.removeEventListener('click', onClick);
      window.removeEventListener('resize', resize);
    };
  }, []);

  return <canvas ref={canvasRef} className="absolute inset-0 w-full h-full block cursor-auto" />;
}

/* ─── Mobile Hero ─────────────────────────────────────────────────── */
const MOBILE_WORDS = ['SCALERS', 'SCALE', 'GROW', 'WIN', 'LEAD'];
const MOBILE_SUBS  = ['We are', 'We help you', 'We help you', 'We help you', 'We help you'];

function MobileHero({ onNavigate }: HeroProps) {
  const [wordIdx,  setWordIdx]  = useState(0);
  const [ripples,  setRipples]  = useState<{ id: number; x: number; y: number }[]>([]);
  const [progress, setProgress] = useState(0);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const rippleId    = useRef(0);
  const DURATION    = 3200; // ms per word

  const advance = useCallback((x?: number, y?: number) => {
    if (x !== undefined && y !== undefined) {
      const id = rippleId.current++;
      setRipples(r => [...r, { id, x, y }]);
      setTimeout(() => setRipples(r => r.filter(p => p.id !== id)), 700);
    }
    setWordIdx(i => (i + 1) % MOBILE_WORDS.length);
    setProgress(0);
  }, []);

  // Auto-advance timer
  useEffect(() => {
    setProgress(0);
    intervalRef.current = setInterval(() => {
      setProgress(p => {
        if (p >= 100) { advance(); return 0; }
        return p + (100 / (DURATION / 50));
      });
    }, 50);
    return () => { if (intervalRef.current) clearInterval(intervalRef.current); };
  }, [wordIdx]);

  const handleTap = (e: React.TouchEvent | React.MouseEvent) => {
    const rect = (e.currentTarget as HTMLElement).getBoundingClientRect();
    const clientX = 'touches' in e ? e.touches[0]?.clientX ?? rect.left + rect.width / 2 : (e as React.MouseEvent).clientX;
    const clientY = 'touches' in e ? e.touches[0]?.clientY ?? rect.top + rect.height / 2  : (e as React.MouseEvent).clientY;
    advance(clientX - rect.left, clientY - rect.top);
  };

  const word = MOBILE_WORDS[wordIdx];
  const sub  = MOBILE_SUBS[wordIdx];

  return (
    <div
      className="relative flex flex-col min-h-screen overflow-hidden select-none"
      style={{ background: '#0d0205' }}
      onTouchStart={handleTap}
      onClick={handleTap}
    >
      {/* ── Animated noise grain overlay ── */}
      <div className="absolute inset-0 pointer-events-none opacity-[0.04]"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`,
          backgroundSize: '160px',
        }}
      />

      {/* ── Red glow pulse ── */}
      <div
        className="absolute pointer-events-none"
        style={{
          width: '110vw', height: '110vw',
          top: '20%', left: '50%',
          transform: 'translateX(-50%)',
          background: 'radial-gradient(circle, rgba(217,30,54,0.18) 0%, rgba(139,16,50,0.07) 45%, transparent 72%)',
          animation: 'pulse-glow 3s ease-in-out infinite',
        }}
      />

      {/* ── Diagonal grid lines ── */}
      <svg className="absolute inset-0 w-full h-full pointer-events-none opacity-[0.04]" xmlns="http://www.w3.org/2000/svg">
        {Array.from({ length: 8 }).map((_, i) => (
          <line key={i} x1={`${(i + 1) * 12.5}%`} y1="0" x2={`${(i + 1) * 12.5}%`} y2="100%" stroke="#E8E4D9" strokeWidth="0.5" />
        ))}
        {Array.from({ length: 12 }).map((_, i) => (
          <line key={i} x1="0" y1={`${(i + 1) * 8.33}%`} x2="100%" y2={`${(i + 1) * 8.33}%`} stroke="#E8E4D9" strokeWidth="0.5" />
        ))}
      </svg>

      {/* ── Tap ripples ── */}
      {ripples.map(r => (
        <span
          key={r.id}
          className="absolute pointer-events-none rounded-full"
          style={{
            left: r.x, top: r.y,
            width: 10, height: 10,
            marginLeft: -5, marginTop: -5,
            background: 'rgba(217,30,54,0.5)',
            animation: 'ripple-out 0.65s ease-out forwards',
          }}
        />
      ))}

      {/* ── Top badge ── */}
      <div className="relative z-10 flex items-center justify-between px-6 pt-16 pb-0">
        <motion.div
          initial={{ opacity: 0, x: -10 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.7, delay: 0.2 }}
          className="flex items-center gap-2"
        >
          <span className="w-1.5 h-1.5 rounded-full bg-[#D91E36] animate-pulse" />
          <span className="text-[#E8E4D9]/30 text-[9px] tracking-[0.35em] uppercase font-semibold">Digital Growth Agency</span>
        </motion.div>
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.7, delay: 0.5 }}
          className="text-[#E8E4D9]/15 text-[9px] tracking-[0.2em] uppercase"
        >
          Tap to change
        </motion.div>
      </div>

      {/* ── Main word display ── */}
      <div className="relative z-10 flex-1 flex flex-col items-start justify-center px-6">

        {/* Sub label */}
        <AnimatePresence mode="wait">
          <motion.p
            key={`sub-${wordIdx}`}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.3 }}
            className="text-[#D91E36]/70 text-sm tracking-[0.25em] uppercase font-semibold mb-3"
          >
            {sub}
          </motion.p>
        </AnimatePresence>

        {/* Word — clips from bottom on enter, exits to top */}
        <div className="overflow-hidden mb-4" style={{ lineHeight: 1 }}>
          <AnimatePresence mode="wait">
            <motion.h1
              key={`word-${wordIdx}`}
              initial={{ y: '100%', opacity: 0 }}
              animate={{ y: '0%', opacity: 1 }}
              exit={{ y: '-100%', opacity: 0 }}
              transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
              className="font-serif font-black text-white leading-none"
              style={{
                fontSize: word.length <= 4 ? '22vw' : word.length <= 6 ? '18vw' : '13vw',
                letterSpacing: '-0.02em',
              }}
            >
              {word}
            </motion.h1>
          </AnimatePresence>
        </div>

        {/* Red accent line — animated width */}
        <motion.div
          key={`line-${wordIdx}`}
          initial={{ width: 0 }}
          animate={{ width: '100%' }}
          transition={{ duration: 0.6, delay: 0.15, ease: [0.22, 1, 0.36, 1] }}
          className="h-[2px] bg-gradient-to-r from-[#D91E36] via-[#ff6b85] to-transparent mb-6"
        />

        {/* Descriptor */}
        <AnimatePresence mode="wait">
          <motion.p
            key={`desc-${wordIdx}`}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.4, delay: 0.2 }}
            className="text-[#E8E4D9]/40 text-sm leading-relaxed max-w-[280px]"
          >
            Real results for real businesses — reels, creatives, and strategy that converts.
          </motion.p>
        </AnimatePresence>

        {/* Word counter */}
        <div className="flex items-center gap-2 mt-8">
          {MOBILE_WORDS.map((_, i) => (
            <div
              key={i}
              className="rounded-full transition-all duration-300"
              style={{
                height: 3,
                width: i === wordIdx ? 28 : 6,
                background: i === wordIdx ? '#D91E36' : 'rgba(255,255,255,0.15)',
              }}
            />
          ))}
        </div>
      </div>

      {/* ── Progress bar ── */}
      <div className="relative z-10 h-[1px] w-full bg-white/5">
        <div
          className="h-full bg-[#D91E36]/60 transition-none"
          style={{ width: `${progress}%` }}
        />
      </div>

      {/* ── CTAs ── */}
      <div className="relative z-10 px-6 pb-10 pt-6 flex flex-col gap-3"
        onTouchStart={e => e.stopPropagation()}
        onClick={e => e.stopPropagation()}
      >
        <motion.a
          href="/#contact"
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          onClick={() => { onNavigate('contact'); window.scrollTo({ top: 0 }); }}
          className="flex items-center justify-center gap-3 w-full py-4 bg-[#D91E36] rounded-full text-white text-sm font-semibold tracking-widest uppercase shadow-lg shadow-[#D91E36]/25"
        >
          Get Started
          <ArrowRight className="w-4 h-4" />
        </motion.a>

        <motion.a
          href="/#clients"
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.55 }}
          onClick={() => { onNavigate('clients'); window.scrollTo({ top: 0 }); }}
          className="flex items-center justify-center w-full py-4 border border-white/15 text-white/55 rounded-full text-sm font-semibold tracking-widest uppercase"
        >
          View Our Work
        </motion.a>
      </div>

      {/* ── Keyframes ── */}
      <style>{`
        @keyframes pulse-glow {
          0%, 100% { opacity: 0.7; transform: translateX(-50%) scale(1); }
          50%       { opacity: 1;   transform: translateX(-50%) scale(1.08); }
        }
        @keyframes ripple-out {
          0%   { transform: scale(1);  opacity: 0.7; }
          100% { transform: scale(18); opacity: 0;   }
        }
      `}</style>
    </div>
  );
}

/* ─── Hero Section ────────────────────────────────────────────────── */
export default function HeroSection({ onNavigate }: HeroProps) {
  return (
    <>
      {/* ── Mobile hero (< md) ── */}
      <div className="md:hidden">
        <MobileHero onNavigate={onNavigate} />
      </div>

      {/* ── Desktop hero (≥ md) — unchanged particle canvas ── */}
      <section className="hidden md:block relative min-h-screen overflow-hidden bg-[#0d0205]">
        <ParticleCanvas />

        <div
          className="absolute inset-0 pointer-events-none"
          style={{ background: 'radial-gradient(ellipse 80% 80% at 50% 50%, transparent 50%, rgba(8,1,4,0.75) 100%)' }}
        />

        <div className="absolute bottom-0 left-0 right-0 z-10 pointer-events-none">
          <div className="h-40 bg-gradient-to-t from-[#0d0205] via-[#0d0205]/60 to-transparent" />
          <div className="bg-[#0d0205] px-6 pb-10 flex flex-col sm:flex-row items-center justify-center gap-4 pointer-events-auto">
            <motion.button
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4, ease: [0.16, 1, 0.3, 1] }}
              onClick={() => { onNavigate('contact'); window.scrollTo({ top: 0 }); }}
              className="group relative px-9 py-4 bg-[#D91E36] hover:bg-[#B01830] text-white rounded-full flex items-center gap-3 transition-all duration-300 shadow-lg shadow-[#D91E36]/25 hover:shadow-xl hover:shadow-[#D91E36]/35 hover:-translate-y-0.5 overflow-hidden"
            >
              <span className="absolute inset-0 bg-white/10 translate-x-[-110%] group-hover:translate-x-[110%] transition-transform duration-500 skew-x-12 pointer-events-none" />
              <a href="/#contact"><span className="font-semibold text-sm tracking-widest uppercase">Get Started</span></a>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </motion.button>

            <a href="/#clients">
              <motion.button
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.55, ease: [0.16, 1, 0.3, 1] }}
                onClick={() => { onNavigate('clients'); window.scrollTo({ top: 0 }); }}
                className="px-9 py-4 border border-white/15 text-white/55 hover:text-white hover:border-white/35 rounded-full text-sm font-semibold tracking-widest uppercase transition-all duration-300 hover:bg-white/5"
              >
                View Our Work
              </motion.button>
            </a>
          </div>
        </div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.2 }}
          className="absolute top-28 right-6 z-10 hidden md:flex items-center gap-2 text-white/15 text-[9px] tracking-[0.3em] uppercase pointer-events-none"
        >
          Particles forming letters
          <div className="h-px w-8 bg-[#D91E36]/40" />
        </motion.div>
      </section>
    </>
  );
}