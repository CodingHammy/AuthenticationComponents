type PasswordInputProps = {
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  testid?: string;
  placeholder?: string;
};

export default function PasswordInput({
  value,
  onChange,
  testid = 'password',
  placeholder = 'Password',
}: PasswordInputProps) {
  const inputId = testid + '-input';
  return (
    <input
      id={inputId}
      type='password'
      data-testid={testid}
      aria-label={placeholder}
      placeholder={placeholder}
      className='w-full p-2 border rounded'
      value={value}
      onChange={onChange}
      required
    />
  );
}
