import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export default function SplashScreen({ onComplete }: { onComplete: () => void }) {
  const [phase, setPhase] = useState<'intro' | 'text' | 'exit' | 'done'>('intro');

  useEffect(() => {
    const t1 = setTimeout(() => setPhase('text'),  900);
    const t2 = setTimeout(() => setPhase('exit'),  2400);
    const t3 = setTimeout(() => { setPhase('done'); onComplete(); }, 3200);
    return () => { clearTimeout(t1); clearTimeout(t2); clearTimeout(t3); };
  }, []);

  return (
    <AnimatePresence>
      {phase !== 'done' && (
        <motion.div
          key="splash"
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.7, ease: 'easeInOut' }}
          className="fixed inset-0 z-[9999] flex items-center justify-center bg-[#D91E36]"
        >
          {/* Vertical grid lines texture */}
          <div className="absolute inset-0 overflow-hidden opacity-10 pointer-events-none">
            {Array.from({ length: 12 }).map((_, i) => (
              <div
                key={i}
                className="absolute top-0 bottom-0 border-r border-white"
                style={{ left: `${(i + 1) * (100 / 13)}%` }}
              />
            ))}
          </div>

          <div className="relative flex flex-col items-center gap-6">

            {/* ── Logo mark — matches site header SVG exactly ── */}
            <motion.div
              initial={{ scale: 0.4, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
              className="w-20 h-20"
            >
              <svg viewBox="0 0 40 40" className="w-full h-full" fill="none">
                {/* Back polygon — white at 50% opacity (was red/0.5 on dark, inverted here) */}
                <motion.polygon
                  points="20,5 35,35 20,25 5,35"
                  fill="white"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 0.45 }}
                  transition={{ duration: 0.5, delay: 0.15 }}
                />
                {/* Front polygon — solid white */}
                <motion.polygon
                  points="20,5 35,35 32,33 20,25 20,24"
                  fill="white"
                  initial={{ opacity: 0, scaleY: 0 }}
                  animate={{ opacity: 1, scaleY: 1 }}
                  style={{ transformOrigin: '20px 5px' }}
                  transition={{ duration: 0.55, delay: 0.4, ease: [0.16, 1, 0.3, 1] }}
                />
                {/* Subtle inner shine */}
                <motion.line
                  x1="20" y1="5" x2="20" y2="25"
                  stroke="white"
                  strokeWidth="0.6"
                  strokeOpacity="0.25"
                  initial={{ pathLength: 0 }}
                  animate={{ pathLength: 1 }}
                  transition={{ duration: 0.5, delay: 0.65 }}
                />
              </svg>
            </motion.div>

            {/* ── Wordmark ── */}
            <AnimatePresence>
              {(phase === 'text' || phase === 'exit') && (
                <motion.div
                  initial={{ opacity: 0, y: 10, letterSpacing: '0.3em' }}
                  animate={{ opacity: 1, y: 0, letterSpacing: '0.45em' }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.5, ease: 'easeOut' }}
                  className="text-white text-2xl font-black tracking-[0.45em]"
                >
                  SCALERS
                </motion.div>
              )}
            </AnimatePresence>

            {/* ── Tagline ── */}
            <AnimatePresence>
              {(phase === 'text' || phase === 'exit') && (
                <motion.p
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 0.5 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.5, delay: 0.15 }}
                  className="text-white text-[10px] tracking-[0.3em] uppercase font-medium"
                >
                  Business Agency
                </motion.p>
              )}
            </AnimatePresence>
          </div>

          {/* Progress bar */}
          <motion.div
            className="absolute bottom-0 left-0 h-0.5 bg-white/30"
            initial={{ width: '0%' }}
            animate={{ width: '100%' }}
            transition={{ duration: 2.4, ease: 'linear' }}
          />
        </motion.div>
      )}
    </AnimatePresence>
  );
}