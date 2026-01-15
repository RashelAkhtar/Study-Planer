import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

function Login({ onLoginSuccess }) {
  const API = import.meta.VITE_API;

  const [form, setForm] = useState({
    email: "",
    password: "",
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
    setError(""); // Clear error on input change
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    const formData = {
      mail: form.email,
      pass: form.password,
    };

    try {
      const response = await fetch(`${API}/api/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        const result = await response.json();
        console.log("Login successful!", result);
        
        // Store user data if provided
        if (result.user) {
          localStorage.setItem('user', JSON.stringify(result.user));
        }
        
        // Store token - if backend doesn't provide one, create a simple one
        // This is a temporary solution until JWT is implemented
        const token = result.token || `token_${Date.now()}_${form.email}`;
        localStorage.setItem('token', token);
        
        // Ensure token is stored before proceeding
        if (localStorage.getItem('token')) {
          // Dispatch custom event to notify App component
          window.dispatchEvent(new Event('auth-changed'));
          
          // Call the success callback to update App state
          if (onLoginSuccess) {
            onLoginSuccess(result);
          }
          
          // Navigate to dashboard
          navigate("/dashboard", { replace: true });
        } else {
          throw new Error("Failed to store authentication token");
        }
      } else {
        const errorData = await response.json();
        throw new Error(errorData.message || "Login failed");
      }
    } catch (err) {
      console.error("Error", err);
      setError(err.message || "Login failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-form">
      <h2>Welcome Back</h2>
      <p className="subtitle">Sign in to continue</p>

      {error && <div className="error-message">{error}</div>}

      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label>Email</label>
          <input
            type="email"
            name="email"
            value={form.email}
            onChange={handleChange}
            placeholder="Enter your email"
            required
            disabled={loading}
          />
        </div>

        <div className="form-group">
          <label>Password</label>
          <input
            type="password"
            name="password"
            value={form.password}
            onChange={handleChange}
            placeholder="Enter your password"
            required
            disabled={loading}
          />
        </div>

        <button type="submit" className="submit-button" disabled={loading}>
          {loading ? "Signing in..." : "Sign In"}
        </button>
      </form>
    </div>
  );
}

export default Login;