import { useState } from 'react';

export default function RegisterPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage('');
    try {
      const res = await fetch('http://localhost:3000/api/users/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });
      const data = await res.json();

      if (res.status === 201) {
        setMessage('Registration successful! You can now log in.');
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
      <h2 className='text-2xl font-bold mb-4'>Register</h2>
      <form onSubmit={handleRegister} className='space-y-4'>
        <input
          type='email'
          placeholder='email'
          className='w-full p2 border rounded'
          value={email}
          onChange={e => setEmail(e.target.value)}
          required
        />
        <input
          type='password'
          placeholder='password'
          className='w-full p2 border rounded'
          value={password}
          onChange={e => setPassword(e.target.value)}
          required
        />
        <button
          type='submit'
          className='w-full bg-blue-600 text-white p-2 rounded hover:bg-blue-700'
        >
          Register
        </button>
        {message && <p className='mt-4 text-center'>{message}</p>}
      </form>
    </div>
  );
}
