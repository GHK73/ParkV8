import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./SigninPage.css";

function SigninPage({ handleSignin }) {
  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    const res = await handleSignin(form.email, form.password);
    if (!res.success) {
      setError(res.error);
    } else {
      navigate("/");
    }
    setLoading(false);
  };

  return (
    <div className="landing-container">
      <header className="landing-header">
        <h1>Signin</h1>
        <p>Login to the Parking Lot System.</p>
      </header>
      <main>
        <form className="signin-form" onSubmit={handleSubmit}>
          <input
            type="email"
            name="email"
            value={form.email}
            onChange={handleChange}
            placeholder="Email"
            required
          />
          <input
            type="password"
            name="password"
            value={form.password}
            onChange={handleChange}
            placeholder="Password"
            required
          />
          <button type="submit" disabled={loading}>
            {loading ? "Signing in..." : "Signin"}
          </button>
          {error && <div className="error-msg">{error}</div>}
          <div className="forgot-btn-wrapper">
            <button
              type="button"
              className="forgot-btn"
              onClick={() => navigate("/forgot-password")}
            >
              Forgot Password?
            </button>
          </div>
        </form>
      </main>
    </div>
  );
}

export default SigninPage;
