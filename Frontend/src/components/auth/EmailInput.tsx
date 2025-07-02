type EmailInputProps = {
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
};

export default function EmailInput({ value, onChange }: EmailInputProps) {
  return (
    <input
      id='email-input'
      type='email'
      data-testid='email-input'
      aria-label='Email'
      placeholder='email'
      className='w-full p-2 border rounded'
      value={value}
      onChange={onChange}
      required
    />
  );
}
