import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import {
  validateConfirmedPassword,
  validateEmail,
  validatePassword,
} from '../utils/authValidation';

type FormError = {
  email?: string | null;
  password?: string | null;
  confirmPassword?: string | null;
  general?: string | null;
};

export default function ResetPasswordPage() {
  const [newPassword, setNewPassword] = useState('');
  const [confirmNewPassword, setConfirmNewPassword] = useState('');
  const [email, setEmail] = useState('');
  const [disableButton, setDisableButton] = useState(false);
  const [formError, setFormError] = useState<FormError>({});
  const { login } = useAuth();

  const handleSumbit = async (e: React.FormEvent) => {
    e.preventDefault();
    setDisableButton(true);
    setFormError({});

    const emailError = validateEmail(email);
    const newPasswordError = validatePassword(newPassword);
    const confirmPasswordError = validateConfirmedPassword(
      newPassword,
      confirmNewPassword,
    );

    if (emailError || newPasswordError || confirmPasswordError) {
      setFormError({
        email: emailError,
        password: newPasswordError,
        confirmPassword: confirmPasswordError,
      });
      setDisableButton(false);
      return;
    } else {
      alert('Form is valid, submitting...');
      setFormError({});
    }
    try {
      const res = await fetch('http://localhost:3000/api/users/resetpassword', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email,
          newPassword,
        }),
      });

      const data = await res.json();
      if (res.ok) {
        login(data.token, data.user.emailusername);
        setEmail('');
        setNewPassword('');
        setConfirmNewPassword('');
      } else {
        setFormError(
          data.errors || {
            general:
              'An error occurred while resetting the password. Please try again later.',
          },
        );
      }
    } catch (error) {
      setFormError({ general: 'Server error. Please try again later.' });
      console.error('Error', error);
    }

    setDisableButton(false);
  };

  return (
    <div className='max-w-md mx-auto p-4'>
      <h2 className='text-2xl font-bold mb-4'>Change Password</h2>
      <form onSubmit={handleSumbit} className='space-y-4'>
        <input
          type='email'
          name='email'
          className='w-full p-2 border rounded'
          value={email}
          onChange={e => setEmail(e.target.value)}
          required
          placeholder='Email Address'
        />
        <input
          type='password'
          name='password'
          placeholder='New password'
          className='w-full p-2 border rounded'
          value={newPassword}
          onChange={e => setNewPassword(e.target.value)}
          required
        />
        <input
          type='password'
          name='confirmpassword'
          placeholder='Confirm New Password'
          className='w-full p-2 border rounded'
          value={confirmNewPassword}
          onChange={e => setConfirmNewPassword(e.target.value)}
          required
        />
        <button
          disabled={disableButton}
          type='submit'
          className='w-full bg-blue-600 text-white p-2 rounded hover:bg-blue-700'
        >
          Change Password
        </button>
      </form>
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
      {formError.confirmPassword && (
        <p className='mt-4 text-center text-red-600'>
          <span className='text-black font-bold'></span>{' '}
          {formError.confirmPassword}
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
