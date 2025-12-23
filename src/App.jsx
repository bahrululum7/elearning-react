import { Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/Login';
import Register from './pages/Register';
import Home from './pages/Home';
import Profile from './pages/Profile';
import QuizPage from './pages/QuizPages';
import Leaderboard from './pages/Leaderboard';
import AdminPanel from './pages/AdminPanel';
import AdminEditSessions from './pages/AdminEditSessions';
import AuthGuard from './auth/AuthGuard';
import AdminGuard from './auth/AdminGuard';

function App() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />

      <Route
        path="/home"
        element={
          <AuthGuard>
            <Home />
          </AuthGuard>
        }
      />
      <Route
        path="/profile"
        element={
          <AuthGuard>
            <Profile />
          </AuthGuard>
        }
      />
      <Route
        path="/quiz/:semester"
        element={
          <AuthGuard>
            <QuizPage />
          </AuthGuard>
        }
      />
      <Route
        path="/leaderboard/:semester"
        element={
          <AuthGuard>
            <Leaderboard />
          </AuthGuard>
        }
      />

      {/* ADMIN ONLY */}
      <Route
        path="/admin"
        element={
          <AuthGuard>
            <AdminGuard>
              <AdminPanel />
            </AdminGuard>
          </AuthGuard>
        }
      />
      <Route
        path="/admin/edit-session"
        element={
          <AuthGuard>
            <AdminGuard>
              <AdminEditSessions />
            </AdminGuard>
          </AuthGuard>
        }
      />

      <Route path="*" element={<Navigate to="/login" replace />} />
    </Routes>
  );
}

export default App;
