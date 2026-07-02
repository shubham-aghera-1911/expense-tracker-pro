import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Wallet, PieChart, Bell, FileDown, Globe2, ShieldCheck, ArrowRight } from 'lucide-react';
import GlassCard from '../components/GlassCard';

const features = [
  { icon: Globe2, title: 'Multi-currency', desc: 'Log expenses in any currency and view totals converted to the one you think in.' },
  { icon: PieChart, title: 'Visual insights', desc: 'Category breakdowns and monthly trends, rendered as clean interactive charts.' },
  { icon: Bell, title: 'Budget alerts', desc: 'Get warned before you blow past your monthly budget, not after.' },
  { icon: FileDown, title: 'PDF reports', desc: 'Export a polished monthly report you can save or share in one click.' },
  { icon: ShieldCheck, title: 'Private by default', desc: 'Your data is scoped to your account, secured behind authenticated access.' },
  { icon: Wallet, title: 'Built for daily use', desc: 'Fast entry, smart defaults, and a dashboard that surfaces what matters.' },
];

export default function Landing() {
  return (
    <div className="app-bg min-h-screen overflow-x-hidden">
      <header className="max-w-7xl mx-auto flex items-center justify-between px-6 py-6">
        <div className="flex items-center gap-2.5">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-brand-500 to-mint-500 shadow-glow">
            <Wallet size={18} className="text-white" />
          </div>
          <span className="font-display text-lg font-bold text-slate-900 dark:text-white">Expense<span className="text-gradient">Pro</span></span>
        </div>
        <div className="flex items-center gap-3">
          <Link to="/login" className="focus-ring text-sm font-medium text-slate-800 dark:text-slate-200 hover:text-slate-950 dark:hover:text-white transition-colors px-3 py-2">Log in</Link>
          <Link to="/register" className="focus-ring rounded-xl bg-gradient-to-r from-brand-600 to-brand-500 px-4 py-2 text-sm font-semibold text-white shadow-glow hover:opacity-90 transition-opacity">
            Get started
          </Link>
        </div>
      </header>

      <section className="max-w-5xl mx-auto px-6 pt-16 pb-24 text-center">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="inline-flex items-center gap-2 rounded-full glass px-4 py-1.5 text-xs font-medium text-brand-700 dark:text-brand-200 mb-6"
        >
          <span className="h-1.5 w-1.5 rounded-full bg-mint-400 animate-pulse" />
          Multi-currency expense tracking, done right
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="font-display text-4xl sm:text-6xl font-extrabold tracking-tight text-slate-900 dark:text-white leading-[1.08]"
        >
          Know exactly where <br className="hidden sm:block" />
          your <span className="text-gradient">money goes</span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="mt-5 text-base sm:text-lg text-slate-600 dark:text-slate-300 max-w-2xl mx-auto"
        >
          Log spending in rupees, dollars, or any currency you like — see it all rolled up in the currency
          you think in. Budgets, charts, and reports included.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="mt-8 flex items-center justify-center gap-3"
        >
          <Link
            to="/register"
            className="focus-ring group flex items-center gap-2 rounded-xl bg-gradient-to-r from-brand-600 to-brand-500 px-6 py-3 text-sm font-semibold text-white shadow-glow hover:opacity-90 transition-opacity"
          >
            Start tracking free
            <ArrowRight size={16} className="transition-transform group-hover:translate-x-1" />
          </Link>
          <Link to="/login" className="focus-ring rounded-xl glass px-6 py-3 text-sm font-semibold text-slate-900 dark:text-slate-100 hover:bg-white/10 transition-colors">
            I have an account
          </Link>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.4 }}
          className="mt-16"
        >
          <GlassCard strong className="mx-auto max-w-3xl p-6 sm:p-8 animate-floaty">
            <div className="flex items-center justify-between mb-6">
              <div>
                <p className="text-xs text-slate-500 dark:text-slate-400">This month</p>
                <p className="text-3xl font-bold text-slate-900 dark:text-white font-display">₹42,180.50</p>
              </div>
              <div className="rounded-xl bg-mint-500/15 px-3 py-1.5 text-xs font-semibold text-mint-600 dark:text-mint-300">
                On track
              </div>
            </div>
            <div className="grid grid-cols-3 gap-3 text-left">
              {['Food & Dining', 'Transportation', 'Shopping'].map((c, i) => (
                <div key={c} className="glass rounded-xl p-3">
                  <p className="text-xs text-slate-500 dark:text-slate-400 truncate">{c}</p>
                  <p className="text-lg font-semibold text-slate-900 dark:text-white mt-1">₹{[8420, 3120, 6890][i].toLocaleString()}</p>
                </div>
              ))}
            </div>
          </GlassCard>
        </motion.div>
      </section>

      <section className="max-w-6xl mx-auto px-6 pb-24">
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {features.map(({ icon: Icon, title, desc }, i) => (
            <GlassCard key={title} hover className="p-5" as={motion.div} initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.05, duration: 0.5 }}>
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-brand-500/15 text-brand-600 dark:text-brand-300 mb-3.5">
                <Icon size={18} />
              </div>
              <h3 className="text-sm font-semibold text-slate-900 dark:text-white mb-1.5">{title}</h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">{desc}</p>
            </GlassCard>
          ))}
        </div>
      </section>

      <footer className="border-t border-white/10 py-6 text-center text-xs text-slate-500">
        Built with the MERN stack. Your data, your currency, your control.
      </footer>
    </div>
  );
}
