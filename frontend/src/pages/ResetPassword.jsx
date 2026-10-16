import { useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { resetPassword } from '../api/auth';
import { getErrorMessage } from '../api/axios';
import AuthLayout, { Field, FormError, SubmitButton } from '../components/AuthLayout';

const ResetPassword = () => {
  const { token } = useParams();
  const navigate = useNavigate();
  const [form, setForm] = useState({ password: '', confirmPassword: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => setForm((f) => ({ ...f, [e.target.name]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (form.password.length < 6) {
      return setError('Password must be at least 6 characters');
    }
    if (form.password !== form.confirmPassword) {
      return setError('Passwords do not match');
    }

    setLoading(true);
    try {
      const data = await resetPassword(token, form.password);
      navigate('/login', { replace: true, state: { message: data?.message } });
    } catch (err) {
      setError(getErrorMessage(err, 'Password reset failed'));
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthLayout
      title="Set a new password"
      subtitle="Choose a new password for your account"
      footer={
        <>
          Link expired?{' '}
          <Link to="/forgot-password" className="font-medium text-indigo-600 hover:text-indigo-700">
            Request a new one
          </Link>
        </>
      }
    >
      <FormError message={error} />
      <form onSubmit={handleSubmit} className="space-y-5">
        <Field
          id="password"
          label="New password"
          type="password"
          autoComplete="new-password"
          required
          value={form.password}
          onChange={handleChange}
          placeholder="At least 6 characters"
        />
        <Field
          id="confirmPassword"
          label="Confirm new password"
          type="password"
          autoComplete="new-password"
          required
          value={form.confirmPassword}
          onChange={handleChange}
          placeholder="Re-enter password"
        />
        <SubmitButton loading={loading} loadingText="Resetting…">
          Reset password
        </SubmitButton>
      </form>
    </AuthLayout>
  );
};

export default ResetPassword;
