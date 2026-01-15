import { useState, useEffect } from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import SignIn from "./components/SignIn";
import ToDoList from "./components/To-Do-List";

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(() => {
    return localStorage.getItem('token') !== null;
  });

  // Listen for storage changes and custom auth events
  useEffect(() => {
    const checkAuth = () => {
      setIsAuthenticated(localStorage.getItem('token') !== null);
    };

    // Listen for storage events (cross-tab updates)
    window.addEventListener('storage', checkAuth);
    
    // Listen for custom auth event (same-tab updates)
    window.addEventListener('auth-changed', checkAuth);

    return () => {
      window.removeEventListener('storage', checkAuth);
      window.removeEventListener('auth-changed', checkAuth);
    };
  }, []);

  return (
    <BrowserRouter>
      <Routes>
        <Route 
          path="/login" 
          element={isAuthenticated ? <Navigate to="/dashboard" replace /> : <SignIn onLoginSuccess={() => setIsAuthenticated(true)} />} 
        />
        <Route 
          path="/dashboard" 
          element={isAuthenticated ? <ToDoList /> : <Navigate to="/login" replace />} 
        />
        <Route path="/" element={<Navigate to="/login" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App