import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import {
  validateConfirmedPassword,
  validatePassword,
} from '../utils/authValidation';
import PasswordInput from '../components/auth/PasswordInput';

type FormError = {
  password?: string | null;
  confirmPassword?: string | null;
  general?: string | null;
};

export default function ResetPasswordPage() {
  const [newPassword, setNewPassword] = useState('');
  const [confirmNewPassword, setConfirmNewPassword] = useState('');

  const [disableButton, setDisableButton] = useState(false);
  const [formError, setFormError] = useState<FormError>({});

  const { logout, token } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    setDisableButton(true);
    setFormError({});

    const newPasswordError = validatePassword(newPassword);
    const confirmPasswordError = validateConfirmedPassword(
      newPassword,
      confirmNewPassword,
    );

    if (newPasswordError || confirmPasswordError) {
      setFormError({
        password: newPasswordError,
        confirmPassword: confirmPasswordError,
      });
      setDisableButton(false);
      return;
    } else {
      setFormError({});
    }
    try {
      const res = await fetch('http://localhost:3000/api/users/resetpassword', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          newPassword,
        }),
      });

      const data = await res.json();
      if (res.ok) {
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

    logout('Successfully Reset Password');
    setDisableButton(false);
  };

  return (
    <main className='max-w-md mx-auto p-4' aria-label='Reset password form'>
      <h2 className='text-2xl font-bold mb-4'>Change Password</h2>
      <form onSubmit={handleSubmit} className='space-y-4'>
        <PasswordInput
          onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
            setNewPassword(e.target.value)
          }
          testid='New-password'
          placeholder='New Password'
          value={newPassword}
        />
        <PasswordInput
          onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
            setConfirmNewPassword(e.target.value)
          }
          testid='Confirm-password'
          placeholder='Confirm New Password'
          value={confirmNewPassword}
        />
        <button
          disabled={disableButton}
          type='submit'
          className='w-full bg-blue-600 text-white p-2 rounded hover:bg-blue-700'
        >
          Change Password
        </button>
      </form>
      {formError.password && (
        <p className='mt-4 text-center text-red-600'>{formError.password}</p>
      )}
      {formError.confirmPassword && (
        <p className='mt-4 text-center text-red-600'>
          {formError.confirmPassword}
        </p>
      )}
      {formError.general && (
        <p className='mt-4 text-center text-red-600'>{formError.general}</p>
      )}
    </main>
  );
}
