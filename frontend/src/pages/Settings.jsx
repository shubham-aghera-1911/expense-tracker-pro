import { useState } from 'react';
import { motion } from 'framer-motion';
import { Moon, Sun, Save, KeyRound } from 'lucide-react';
import toast from 'react-hot-toast';
import api from '../api/axios';
import GlassCard from '../components/GlassCard';
import { Spinner } from '../components/Loader';
import { CURRENCIES } from '../utils/currencies';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { useCurrency } from '../context/CurrencyContext';

export default function Settings() {
  const { user, updateUser } = useAuth();
  const { isDark, toggleTheme } = useTheme();
  const { setDisplayCurrency } = useCurrency();

  const [profile, setProfile] = useState({
    name: user?.name || '',
    baseCurrency: user?.baseCurrency || 'INR',
    monthlyBudget: user?.monthlyBudget || '',
  });
  const [savingProfile, setSavingProfile] = useState(false);

  const [passwordForm, setPasswordForm] = useState({ currentPassword: '', newPassword: '' });
  const [savingPassword, setSavingPassword] = useState(false);

  const handleProfileSave = async (e) => {
    e.preventDefault();
    setSavingProfile(true);
    try {
      const { data } = await api.put('/auth/me', {
        name: profile.name,
        baseCurrency: profile.baseCurrency,
        monthlyBudget: Number(profile.monthlyBudget) || 0,
      });
      updateUser(data.data.user);
      setDisplayCurrency(profile.baseCurrency);
      toast.success('Profile updated');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Could not update profile');
    } finally {
      setSavingProfile(false);
    }
  };

  const handlePasswordSave = async (e) => {
    e.preventDefault();
    setSavingPassword(true);
    try {
      await api.put('/auth/password', passwordForm);
      setPasswordForm({ currentPassword: '', newPassword: '' });
      toast.success('Password updated');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Could not update password');
    } finally {
      setSavingPassword(false);
    }
  };

  return (
    <div className="space-y-5 max-w-2xl">
      <div>
        <h2 className="font-display text-xl sm:text-2xl font-bold text-slate-900 dark:text-white">Settings</h2>
        <p className="text-sm text-slate-500 dark:text-slate-400 mt-0.5">Manage your profile, currency and preferences.</p>
      </div>

      <GlassCard className="p-5 sm:p-6">
        <h3 className="text-sm font-semibold text-slate-900 dark:text-white mb-4">Appearance</h3>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-brand-500/15 text-brand-600 dark:text-brand-300">
              {isDark ? <Moon size={17} /> : <Sun size={17} />}
            </div>
            <div>
              <p className="text-sm font-medium text-slate-900 dark:text-white">Dark mode</p>
              <p className="text-xs text-slate-500 dark:text-slate-400">Premium glass theme, tuned for day or night.</p>
            </div>
          </div>
          <button
            onClick={toggleTheme}
            className={`focus-ring relative h-7 w-12 rounded-full transition-colors ${isDark ? 'bg-brand-500' : 'bg-slate-600'}`}
            aria-label="Toggle dark mode"
          >
            <motion.span
              className="absolute top-1 h-5 w-5 rounded-full bg-white shadow"
              animate={{ left: isDark ? 26 : 4 }}
              transition={{ type: 'spring', stiffness: 500, damping: 30 }}
            />
          </button>
        </div>
      </GlassCard>

      <GlassCard as="form" onSubmit={handleProfileSave} className="p-5 sm:p-6">
        <h3 className="text-sm font-semibold text-slate-900 dark:text-white mb-4">Profile & currency</h3>
        <div className="space-y-4">
          <div>
            <label className="block text-xs font-medium text-slate-600 dark:text-slate-300 mb-1.5">Name</label>
            <input
              value={profile.name}
              onChange={(e) => setProfile((f) => ({ ...f, name: e.target.value }))}
              className="focus-ring w-full rounded-xl glass px-3.5 py-2.5 text-sm text-slate-900 dark:text-white"
            />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-medium text-slate-600 dark:text-slate-300 mb-1.5">Base currency</label>
              <select
                value={profile.baseCurrency}
                onChange={(e) => setProfile((f) => ({ ...f, baseCurrency: e.target.value }))}
                className="focus-ring w-full rounded-xl glass px-3.5 py-2.5 text-sm text-slate-900 dark:text-white [&>option]:bg-[#1a0b2e] [&>option]:text-white"
              >
                {CURRENCIES.map((c) => (
                  <option key={c.code} value={c.code}>{c.symbol} {c.code}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-600 dark:text-slate-300 mb-1.5">Monthly budget</label>
              <input
                type="number"
                min="0"
                step="0.01"
                value={profile.monthlyBudget}
                onChange={(e) => setProfile((f) => ({ ...f, monthlyBudget: e.target.value }))}
                placeholder="0.00"
                className="focus-ring w-full rounded-xl glass px-3.5 py-2.5 text-sm text-slate-900 dark:text-white placeholder:text-slate-500"
              />
            </div>
          </div>
        </div>
        <button
          type="submit"
          disabled={savingProfile}
          className="focus-ring mt-5 flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-brand-600 to-brand-500 px-4 py-2.5 text-sm font-semibold text-white shadow-glow hover:opacity-90 transition-opacity disabled:opacity-60"
        >
          {savingProfile ? <Spinner size={16} /> : <Save size={16} />}
          Save changes
        </button>
      </GlassCard>

      <GlassCard as="form" onSubmit={handlePasswordSave} className="p-5 sm:p-6">
        <h3 className="text-sm font-semibold text-slate-900 dark:text-white mb-4 flex items-center gap-2">
          <KeyRound size={15} className="text-brand-600 dark:text-brand-300" /> Change password
        </h3>
        <div className="space-y-4">
          <div>
            <label className="block text-xs font-medium text-slate-600 dark:text-slate-300 mb-1.5">Current password</label>
            <input
              type="password"
              required
              value={passwordForm.currentPassword}
              onChange={(e) => setPasswordForm((f) => ({ ...f, currentPassword: e.target.value }))}
              className="focus-ring w-full rounded-xl glass px-3.5 py-2.5 text-sm text-slate-900 dark:text-white"
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-slate-600 dark:text-slate-300 mb-1.5">New password</label>
            <input
              type="password"
              required
              minLength={6}
              value={passwordForm.newPassword}
              onChange={(e) => setPasswordForm((f) => ({ ...f, newPassword: e.target.value }))}
              className="focus-ring w-full rounded-xl glass px-3.5 py-2.5 text-sm text-slate-900 dark:text-white"
            />
          </div>
        </div>
        <button
          type="submit"
          disabled={savingPassword}
          className="focus-ring mt-5 flex items-center justify-center gap-2 rounded-xl glass px-4 py-2.5 text-sm font-semibold text-slate-900 dark:text-white hover:bg-white/10 transition-colors disabled:opacity-60"
        >
          {savingPassword ? <Spinner size={16} /> : 'Update password'}
        </button>
      </GlassCard>
    </div>
  );
}
