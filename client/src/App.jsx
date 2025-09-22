
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import MainLayout from './layouts/MainLayout';
import PublicNavbar from './components/PublicNavbar';
import ProtectedRoute from './layouts/ProtectedRoute';
import SessionsPage from './pages/SessionsPage';
import NewSessionPage from './pages/NewSessionPage';
import DashboardPage from './pages/DashboardPage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import ProfilePage from './pages/ProfilePage';
import WelcomePage from './pages/WelcomePage';
import ContactMePage from './pages/ContactMePage';

function App() {
  return (
    <>
      {/* Show public navbar on public routes only */}
      <Routes>
        <Route
          path="/"
          element={
            <>
              <PublicNavbar />
              <WelcomePage />
            </>
          }
        />
        <Route
          path="/login"
          element={
            <>
              <PublicNavbar />
              <LoginPage />
            </>
          }
        />
        <Route
          path="/register"
          element={
            <>
              <PublicNavbar />
              <RegisterPage />
            </>
          }
        />
        {/* Protected app routes */}
        <Route element={<ProtectedRoute />}>
          <Route element={<MainLayout />}>
            <Route path="/sessions" element={<SessionsPage />} />
            <Route path="/new" element={<NewSessionPage />} />
            <Route path="/dashboard" element={<DashboardPage />} />
            <Route path="/profile" element={<ProfilePage />} />
            <Route path="/contact" element={<ContactMePage />} />
            <Route path="/welcome" element={<WelcomePage />} />
          </Route>
        </Route>
      </Routes>
    </>
  );
}

export default App;