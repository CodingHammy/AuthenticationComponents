import { Navigate } from 'react-router-dom';

type Props = {
  children: React.JSX.Element;
};
const PrivateRoute = ({ children }: Props) => {
  const token = localStorage.getItem('token');

  if (!token) {
    return <Navigate to='/' replace />;
  }
  return children;
};

export default PrivateRoute;
