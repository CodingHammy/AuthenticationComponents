import { Routes, Route } from 'react-router-dom';
import LoginPage from './pages/LoginPage';
import DashboardPage from './pages/DashboardPage';
import RegisterPage from './pages/RegisterPage';
import PrivateRoute from './components/PrivateRoute';
import NavBar from './components/NavBar';
import SessionExpiredPage from './pages/SessionExpiredPage';
import ResetPasswordPage from './pages/ResetPasswordPage';

function App() {
  return (
    <>
      {/* Global Navbar */}
      <NavBar />
      <Routes>
        {/* public routes */}
        <Route path='/info' element={<SessionExpiredPage />} />
        <Route path='/' element={<LoginPage />} />
        <Route path='/register' element={<RegisterPage />} />
        {/* private routes - only accessible if authenticated */}
        <Route
          path='/dashboard'
          element={
            <PrivateRoute>
              <DashboardPage />
            </PrivateRoute>
          }
        />
        <Route
          path='/reset-password'
          element={
            <PrivateRoute>
              <ResetPasswordPage />
            </PrivateRoute>
          }
        />
      </Routes>
    </>
  );
}

export default App;
