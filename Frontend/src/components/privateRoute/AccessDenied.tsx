export default function AccessDenied({
  onLoginRedirect,
}: {
  onLoginRedirect: () => void;
}) {
  return (
    <section
      role='alert'
      aria-live='assertive'
      className='flex flex-col items-center justify-center h-screen max-w-md mx-auto '
    >
      <h1 className='text-2xl font-bold mb-2'>Access Denied</h1>
      <p className='text-center flex flex-wrap mb-2 px-4'>
        You are not authenticated, please log in to access this page.
      </p>
      <button
        title='Redirect to login page'
        onClick={onLoginRedirect}
        className='p-2 bg-blue-600 text-white rounded hover:bg-blue-700'
        aria-label='Go to login page'
      >
        Go to Login
      </button>
    </section>
  );
}
