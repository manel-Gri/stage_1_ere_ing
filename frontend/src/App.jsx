import { Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import Documents from './pages/Documents';
import Chat from './pages/Chat';
import Historique from './pages/Historique';
import Profil from './pages/Profil';
import PrivateRoute from './components/PrivateRoute';

function App() {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/login" />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route
        path="/dashboard"
        element={
          <PrivateRoute>
            <Dashboard />
          </PrivateRoute>
        }
      />
      <Route
        path="/documents"
        element={
          <PrivateRoute>
            <Documents />
          </PrivateRoute>
        }
      />
      <Route
        path="/chat"
        element={
          <PrivateRoute>
            <Chat />
          </PrivateRoute>
        }
      />
      <Route
        path="/historique"
        element={
          <PrivateRoute>
            <Historique />
          </PrivateRoute>
        }
      />
      <Route
        path="/profil"
        element={
          <PrivateRoute>
            <Profil />
          </PrivateRoute>
        }
      />
    </Routes>
  );
}

export default App;