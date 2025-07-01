type UsernameInputProps = {
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
};

export default function UsernameInput({ value, onChange }: UsernameInputProps) {
  return (
    <input
      type='text'
      data-testid='username-input'
      aria-label='Username'
      placeholder='username'
      className='w-full p-2 border rounded font-bold'
      value={value}
      onChange={onChange}
      required
    />
  );
}
