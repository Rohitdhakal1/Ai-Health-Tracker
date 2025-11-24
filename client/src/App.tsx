import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import { useAuth } from './context/AuthContext';
import type { JSX } from 'react';
import Register from './pages/Register';

// Protected Route Component
// This acts like a "Bouncer" for frontend pages. 
// If you aren't logged in, it kicks you back to Login.
const PrivateRoute = ({ children }: { children: JSX.Element }) => {
    const { user, loading } = useAuth();
    
    if (loading) return <div>Loading...</div>;
    
    return user ? children : <Navigate to="/login" />;
};

function App() {
  return (
    <Router>
      <Routes>
        {/* Public Route */}
        <Route path="/login" element={<Login/>} />
        <Route path="/register" element={<Register/>} />
        {/* Protected Route */}
        <Route 
          path="/dashboard" 
          element={
            <PrivateRoute>
              <Dashboard />
            </PrivateRoute>
          } 
        />
        
        {/* Default Redirect */}
        <Route path="/" element={<Navigate to="/dashboard" />} />
      </Routes>
    </Router>
  );
}

export default App;