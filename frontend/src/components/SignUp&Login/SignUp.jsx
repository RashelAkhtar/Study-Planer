import React, { useState } from "react";
import axios from "../../../api/axiosInstance";

function SignUp({ onSignUpSuccess }) {
  const [form, setForm] = useState({
    username: "",
    email: "",
    password: "",
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
    setError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    const formdata = {
      user: form.username,
      mail: form.email,
      pass: form.password,
    };

    try {
      const response = await axios.post("/api/register", formdata);

      console.log("Success: ", response.data);

      // Clear form
      setForm({ username: "", email: "", password: "" });

      // Switch to login tab after successful signup
      if (onSignUpSuccess) {
        onSignUpSuccess();
      }
    } catch (err) {
      console.error("Error: ", err);
      const errorMessage =
        err.response?.data?.message ||
        err.message ||
        "Failed to sign up. Please try again";
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="signup-form">
      <h2>Create Account</h2>
      <p className="subtitle">Sign up to get started</p>

      {error && <div className="error-message">{error}</div>}

      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label>Username</label>
          <input
            type="text"
            name="username"
            value={form.username}
            onChange={handleChange}
            placeholder="Enter username..."
            required
            disabled={loading}
          />
        </div>

        <div className="form-group">
          <label>Email</label>
          <input
            type="email"
            name="email"
            value={form.email}
            onChange={handleChange}
            placeholder="Enter your email..."
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
            placeholder="Enter your Password"
            required
            disabled={loading}
          />
        </div>

        <button type="submit" className="submit-button" disabled={loading}>
          {loading ? "Creating account..." : "Sign Up"}
        </button>
      </form>
    </div>
  );
}

export default SignUp;
