import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { loginUser, registerUser } from '../services/authApi';

import { validateForm } from '../utils/authValidation';

type AuthFormProps = {
  type: 'login' | 'register';
};
type FormError = {
  email?: string | null;
  password?: string | null;
  username?: string | null;
  general?: string | null;
};

export default function AuthForm({ type = 'login' }: AuthFormProps) {
  // NOTE: form state for : email, password, and message,
  const [email, setEmail] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const [disableButton, setDisableButton] = useState(false);
  const [formError, setFormError] = useState<FormError>({});

  const { login } = useAuth();

  /**
   * Handles form submission for login or registration.
   * Sends POST to API and acts based on response and form type.
   */
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setDisableButton(true);
    setFormError({});
    // NOTE: endpoint is determined by the type of form, register or login

    const errors = validateForm({ email, password, username }, type);

    if (errors.email || errors.password || errors.username) {
      setFormError(errors);
      setDisableButton(false);
      return;
    } else {
      setFormError({});
    }
    try {
      const { ok, data } =
        type === 'register'
          ? await registerUser({ email, password, username })
          : await loginUser({ email, password });

      if (ok) {
        // NOTE: log in store token and navigate to dashboard
        login(data.token, data.user.username);
        // NOTE: reset form fields after successful login or register
        setEmail('');
        setPassword('');
        setUsername('');
      } else {
        setFormError(
          data.errors || {
            general: 'Something went wrong. Please try again.',
          },
        );
      }
    } catch (error) {
      setFormError({ general: 'server error. Please try again later.' });
      console.error('Error:', error);
    }
    setDisableButton(false);
  };
  return (
    <div className='max-w-md mx-auto p-4'>
      <h2 className='text-2xl font-bold mb-4'>
        {type === 'register' ? 'Register' : 'Login'}
      </h2>
      {/* Form for login or register */}
      <form onSubmit={handleSubmit} className='space-y-4'>
        {type === 'register' && (
          <input
            type='text'
            data-testid='username-input'
            aria-label='Username'
            placeholder='username'
            className='w-full p-2 border rounded font-bold'
            value={username}
            onChange={e => setUsername(e.target.value)}
            required
          />
        )}
        <input
          type='email'
          data-testid='email-input'
          aria-label='Email'
          placeholder='email'
          className='w-full p-2 border rounded'
          value={email}
          onChange={e => setEmail(e.target.value)}
          required
        />
        <input
          type='password'
          data-testid='password-input'
          aria-label='Password'
          placeholder='password'
          className='w-full p-2 border rounded'
          value={password}
          onChange={e => setPassword(e.target.value)}
          required
        />
        <button
          disabled={disableButton}
          data-testid='submit-button'
          type='submit'
          className='w-full bg-blue-600 text-white p-2 rounded hover:bg-blue-700'
        >
          {type === 'register' ? 'Register' : 'Login'}
        </button>
      </form>
      {formError.username && (
        <p className='mt-4 text-center text-red-600'>
          <span className='text-black font-bold'></span> {formError.username}
        </p>
      )}

      {formError.email && (
        <p className='mt-4 text-center text-red-600'>
          <span className='text-black font-bold'></span> {formError.email}
        </p>
      )}
      {formError.password && (
        <p className='mt-4 text-center text-red-600'>
          <span className='text-black font-bold'></span> {formError.password}
        </p>
      )}
      {formError.general && (
        <p className='mt-4 text-center text-red-600'>
          <span className='text-black font-bold'></span> {formError.general}
        </p>
      )}
    </div>
  );
}
