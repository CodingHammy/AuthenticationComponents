import { useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { useAuth } from '../context/AuthContext';

type AuthFormProps = {
  type: 'login' | 'register';
};

export default function AuthForm({ type }: AuthFormProps) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSuccessfulResgister = () => {
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      navigate('/', { replace: true });
    }, 1500);
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage('');
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
        if (type === 'login') {
          // localStorage.setItem('token', data.token);
          login(data.token);
        } else {
          setMessage('Registration successful! You can now log in.');
          handleSuccessfulResgister();
        }
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
      {!isLoading ? (
        <form onSubmit={handleRegister} className='space-y-4'>
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
      ) : (
        <p className='mx-auto text-2xl font-bold'>Loading ...</p>
      )}
      {message && <p className='mt-4 text-center'>{message}</p>}
    </div>
  );
}
