import { useState } from 'react';
import { Link } from 'react-router-dom';
import { forgotPassword } from '../api/auth';
import { getErrorMessage } from '../api/axios';
import AuthLayout, { Field, FormError, FormSuccess, SubmitButton } from '../components/AuthLayout';

const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setLoading(true);
    try {
      const data = await forgotPassword(email.trim());
      setSuccess(data?.message || 'If an account with that email exists, a reset link has been sent.');
      setEmail('');
    } catch (err) {
      setError(getErrorMessage(err, 'Could not send reset email'));
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthLayout
      title="Forgot your password?"
      subtitle="Enter your email and we'll send you a reset link"
      footer={
        <>
          Remembered it?{' '}
          <Link to="/login" className="font-medium text-indigo-600 hover:text-indigo-700">
            Back to sign in
          </Link>
        </>
      }
    >
      <FormSuccess message={success} />
      <FormError message={error} />
      <form onSubmit={handleSubmit} className="space-y-5">
        <Field
          id="email"
          label="Email"
          type="email"
          autoComplete="email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="you@example.com"
        />
        <SubmitButton loading={loading} loadingText="Sending link…">
          Send reset link
        </SubmitButton>
      </form>
    </AuthLayout>
  );
};

export default ForgotPassword;
