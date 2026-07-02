import { motion } from 'framer-motion';

export function Spinner({ size = 24, className = '' }) {
  return (
    <motion.span
      className={`inline-block rounded-full border-2 border-brand-300/30 border-t-brand-400 ${className}`}
      style={{ width: size, height: size }}
      animate={{ rotate: 360 }}
      transition={{ repeat: Infinity, duration: 0.8, ease: 'linear' }}
    />
  );
}

export function FullPageLoader({ label = 'Loading your dashboard...' }) {
  return (
    <div className="app-bg min-h-screen flex flex-col items-center justify-center gap-4">
      <div className="relative">
        <motion.div
          className="w-16 h-16 rounded-2xl bg-gradient-to-br from-brand-500 to-mint-500 shadow-glow"
          animate={{ rotate: [0, 90, 180, 270, 360], borderRadius: ['20%', '50%', '20%'] }}
          transition={{ repeat: Infinity, duration: 2.4, ease: 'easeInOut' }}
        />
      </div>
      <p className="text-slate-600 dark:text-slate-300 text-sm font-medium tracking-wide animate-pulse-glow">{label}</p>
    </div>
  );
}

export function SkeletonBlock({ className = '' }) {
  return <div className={`shimmer-bg rounded-lg ${className}`} />;
}

export default Spinner;
