import { useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { useAuth } from '../context/AuthContext';

type AuthFormProps = {
  type: 'login' | 'register';
};

export default function AuthForm({ type }: AuthFormProps) {
  // NOTE: form state for : email, password, and message,
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');

  const { login } = useAuth();
  const navigate = useNavigate();

  /**
   * Handles form submission for login or registration.
   * Sends POST to API and acts based on response and form type.
   */
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage('');
    // NOTE: endpoint is determined by the type of form, register or login
    const endPoint =
      type === 'register'
        ? 'http://localhost:3000/api/users/register'
        : 'http://localhost:3000/api/users/login';
    try {
      const res = await fetch(endPoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });
      const data = await res.json();

      if (res.ok) {
        // NOTE: log in store token and navigate to dashboard
        login(data.token);
        // NOTE: reset form fields after successful login or register
        setEmail('');
        setPassword('');
      } else {
        setMessage(data.message || 'Something went wrong. Please try again.');
      }
    } catch (error) {
      setMessage('server error. Please try again later.');
      console.error('Error:', error);
    }
  };
  return (
    <div className='max-w-md mx-auto p-4'>
      <h2 className='text-2xl font-bold mb-4'>
        {type === 'register' ? 'Register' : 'Login'}
      </h2>
      {/* Form for login or register */}
      <form onSubmit={handleSubmit} className='space-y-4'>
        <input
          type='email'
          placeholder='email'
          className='w-full p-2 border rounded'
          value={email}
          onChange={e => setEmail(e.target.value)}
          required
        />
        <input
          type='password'
          placeholder='password'
          className='w-full p-2 border rounded'
          value={password}
          onChange={e => setPassword(e.target.value)}
          required
        />
        <button
          type='submit'
          className='w-full bg-blue-600 text-white p-2 rounded hover:bg-blue-700'
        >
          {type === 'register' ? 'Register' : 'Login'}
        </button>
      </form>

      {message && <p className='mt-4 text-center'>{message}</p>}
    </div>
  );
}
