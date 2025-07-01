type PasswordInputProps = {
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
};

export default function PasswordInput({ value, onChange }: PasswordInputProps) {
  return (
    <input
      type='password'
      data-testid='password-input'
      aria-label='Password'
      placeholder='password'
      className='w-full p-2 border rounded'
      value={value}
      onChange={onChange}
      required
    />
  );
}
