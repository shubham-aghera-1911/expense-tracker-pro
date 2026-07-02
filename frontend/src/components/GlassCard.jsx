import { motion } from 'framer-motion';

export default function GlassCard({ children, className = '', strong = false, hover = false, as: Component = motion.div, ...rest }) {
  return (
    <Component
      className={`${strong ? 'glass-strong' : 'glass'} rounded-2xl shadow-glass ${hover ? 'transition-transform duration-300 hover:-translate-y-1 hover:shadow-glass-lg' : ''} ${className}`}
      {...rest}
    >
      {children}
    </Component>
  );
}
