import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, KeyRound, Loader2, UserRound } from 'lucide-react';
import { getProfile, updateProfile } from '../api/users';
import { getErrorMessage } from '../api/axios';
import { useAuth } from '../context/AuthContext';
import Navbar from '../components/Navbar';
import PasswordInput from '../components/PasswordInput';

const inputClass =
  'w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 placeholder-slate-400 transition focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 disabled:cursor-not-allowed disabled:bg-slate-100 disabled:text-slate-500 dark:border-slate-800 dark:bg-slate-950 dark:text-slate-100 dark:placeholder-slate-500 dark:disabled:bg-slate-900';

const EMPTY_PASSWORDS = { currentPassword: '', newPassword: '', confirmPassword: '' };

const Field = ({ label, id, hint, children }) => (
  <div>
    <label htmlFor={id} className="mb-1 block text-xs font-semibold text-slate-700 dark:text-slate-300">
      {label}
    </label>
    {children}
    {hint && <p className="mt-1 text-xs text-slate-400 dark:text-slate-500">{hint}</p>}
  </div>
);

const Notice = ({ type, message }) =>
  message ? (
    <div
      role={type === 'error' ? 'alert' : 'status'}
      className={`rounded-lg border px-3 py-2 text-sm ${
        type === 'error'
          ? 'border-rose-200 bg-rose-50 text-rose-700 dark:border-rose-500/30 dark:bg-rose-500/10 dark:text-rose-300'
          : 'border-emerald-200 bg-emerald-50 text-emerald-700 dark:border-emerald-500/30 dark:bg-emerald-500/10 dark:text-emerald-300'
      }`}
    >
      {message}
    </div>
  ) : null;

const Card = ({ icon: Icon, title, subtitle, children }) => (
  <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6 dark:border-slate-800 dark:bg-slate-900 dark:shadow-none">
    <div className="mb-5 flex items-start gap-3">
      <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-indigo-50 text-indigo-600 dark:bg-indigo-500/10 dark:text-indigo-400">
        <Icon size={18} />
      </div>
      <div>
        <h2 className="text-base font-semibold text-slate-900 dark:text-slate-100">{title}</h2>
        <p className="text-xs text-slate-500 dark:text-slate-400">{subtitle}</p>
      </div>
    </div>
    {children}
  </section>
);

const SaveButton = ({ loading, children }) => (
  <button
    type="submit"
    disabled={loading}
    className="inline-flex items-center justify-center gap-2 rounded-lg bg-indigo-600 px-5 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-indigo-700 disabled:cursor-not-allowed disabled:opacity-60 dark:hover:bg-indigo-500"
  >
    {loading && <Loader2 size={16} className="animate-spin" />}
    {children}
  </button>
);

const Profile = () => {
  const { user, updateUser, logout } = useAuth();
  const [form, setForm] = useState({
    name: user?.name ?? '',
    email: user?.email ?? '',
    targetRole: user?.targetRole ?? '',
    bio: user?.bio ?? '',
  });
  const [passwords, setPasswords] = useState(EMPTY_PASSWORDS);
  const [loading, setLoading] = useState(true);
  const [savingProfile, setSavingProfile] = useState(false);
  const [savingPassword, setSavingPassword] = useState(false);
  const [profileNotice, setProfileNotice] = useState({});
  const [passwordNotice, setPasswordNotice] = useState({});

  useEffect(() => {
    getProfile()
      .then((data) => {
        setForm({ name: data.name, email: data.email, targetRole: data.targetRole, bio: data.bio });
        updateUser(data);
      })
      .catch((err) => {
        if (err?.response?.status === 401) return logout();
        setProfileNotice({ type: 'error', message: getErrorMessage(err, 'Could not load profile') });
      })
      .finally(() => setLoading(false));
  }, [updateUser, logout]);

  const handleChange = (e) => setForm((f) => ({ ...f, [e.target.name]: e.target.value }));
  const handlePasswordChange = (e) => setPasswords((p) => ({ ...p, [e.target.name]: e.target.value }));

  const handleProfileSubmit = async (e) => {
    e.preventDefault();
    setProfileNotice({});
    if (!form.name.trim()) {
      return setProfileNotice({ type: 'error', message: 'Name cannot be empty' });
    }

    setSavingProfile(true);
    try {
      const data = await updateProfile({
        name: form.name.trim(),
        targetRole: form.targetRole.trim(),
        bio: form.bio.trim(),
      });
      updateUser(data);
      setForm((f) => ({ ...f, name: data.name, targetRole: data.targetRole, bio: data.bio }));
      setProfileNotice({ type: 'success', message: 'Profile updated.' });
    } catch (err) {
      setProfileNotice({ type: 'error', message: getErrorMessage(err, 'Could not update profile') });
    } finally {
      setSavingProfile(false);
    }
  };

  const handlePasswordSubmit = async (e) => {
    e.preventDefault();
    setPasswordNotice({});
    if (passwords.newPassword.length < 6) {
      return setPasswordNotice({ type: 'error', message: 'New password must be at least 6 characters' });
    }
    if (passwords.newPassword !== passwords.confirmPassword) {
      return setPasswordNotice({ type: 'error', message: 'Passwords do not match' });
    }

    setSavingPassword(true);
    try {
      await updateProfile({
        currentPassword: passwords.currentPassword,
        newPassword: passwords.newPassword,
      });
      setPasswords(EMPTY_PASSWORDS);
      setPasswordNotice({ type: 'success', message: 'Password changed.' });
    } catch (err) {
      setPasswordNotice({ type: 'error', message: getErrorMessage(err, 'Could not change password') });
    } finally {
      setSavingPassword(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 transition-colors dark:bg-slate-950 dark:text-slate-200">
      <Navbar />

      <main className="mx-auto max-w-3xl px-4 py-8 sm:px-6">
        <Link
          to="/dashboard"
          className="mb-4 inline-flex items-center gap-1.5 text-sm font-medium text-slate-500 transition hover:text-indigo-600 dark:text-slate-400 dark:hover:text-indigo-400"
        >
          <ArrowLeft size={16} />
          Back to dashboard
        </Link>
        <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-slate-100">Your Profile</h1>
        <p className="mt-1 mb-6 text-sm text-slate-500 dark:text-slate-400">Manage your account details and password.</p>

        {loading ? (
          <div className="flex items-center justify-center py-24 text-slate-400 dark:text-slate-500">
            <Loader2 size={28} className="animate-spin" />
          </div>
        ) : (
          <div className="space-y-6">
            <Card icon={UserRound} title="Account information" subtitle="How you appear in JobTrackr">
              <form onSubmit={handleProfileSubmit} className="space-y-4">
                <Notice {...profileNotice} />
                <div className="grid gap-4 sm:grid-cols-2">
                  <Field label="Full name" id="name">
                    <input id="name" name="name" required value={form.name} onChange={handleChange} className={inputClass} />
                  </Field>
                  <Field label="Email" id="email" hint="Email can't be changed.">
                    <input id="email" type="email" value={form.email} disabled className={inputClass} />
                  </Field>
                </div>
                <Field label="Target role" id="targetRole">
                  <input
                    id="targetRole"
                    name="targetRole"
                    maxLength={100}
                    value={form.targetRole}
                    onChange={handleChange}
                    placeholder="e.g. Senior Frontend Engineer"
                    className={inputClass}
                  />
                </Field>
                <Field label="Bio" id="bio" hint={`${form.bio.length}/500`}>
                  <textarea
                    id="bio"
                    name="bio"
                    rows={4}
                    maxLength={500}
                    value={form.bio}
                    onChange={handleChange}
                    placeholder="A short summary of your experience and what you're looking for…"
                    className={`${inputClass} resize-none`}
                  />
                </Field>
                <div className="flex justify-end">
                  <SaveButton loading={savingProfile}>{savingProfile ? 'Saving…' : 'Save changes'}</SaveButton>
                </div>
              </form>
            </Card>

            <Card icon={KeyRound} title="Change password" subtitle="Enter your current password to set a new one">
              <form onSubmit={handlePasswordSubmit} className="space-y-4">
                <Notice {...passwordNotice} />
                <Field label="Current password" id="currentPassword">
                  <PasswordInput
                    id="currentPassword"
                    name="currentPassword"
                    autoComplete="current-password"
                    required
                    value={passwords.currentPassword}
                    onChange={handlePasswordChange}
                    className={inputClass}
                  />
                </Field>
                <div className="grid gap-4 sm:grid-cols-2">
                  <Field label="New password" id="newPassword">
                    <PasswordInput
                      id="newPassword"
                      name="newPassword"
                      autoComplete="new-password"
                      required
                      value={passwords.newPassword}
                      onChange={handlePasswordChange}
                      placeholder="At least 6 characters"
                      className={inputClass}
                    />
                  </Field>
                  <Field label="Confirm new password" id="confirmPassword">
                    <PasswordInput
                      id="confirmPassword"
                      name="confirmPassword"
                      autoComplete="new-password"
                      required
                      value={passwords.confirmPassword}
                      onChange={handlePasswordChange}
                      className={inputClass}
                    />
                  </Field>
                </div>
                <div className="flex justify-end">
                  <SaveButton loading={savingPassword}>{savingPassword ? 'Updating…' : 'Update password'}</SaveButton>
                </div>
              </form>
            </Card>
          </div>
        )}
      </main>
    </div>
  );
};

export default Profile;
