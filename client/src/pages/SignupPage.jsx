import React, { useState } from "react";
import "./SignupPage.css";
import { generateOtp, verifyOtp, signup } from "../api";

function SignupPage() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    password: "",
    role: "",
    parkingLotGovId: ""
  });
  const [step, setStep] = useState("details"); // details, otp, done
  const [otp, setOtp] = useState("");
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setError("");
  };

  // Send OTP using API helper
  const handleDetailsSubmit = async (e) => {
    e.preventDefault();
    setError(""); setMessage(""); setLoading(true);
    if (form.role === "owner" && !form.parkingLotGovId.trim()) {
      setError("Parking Lot Gov ID is required for owners.");
      setLoading(false); return;
    }
    try {
      const data = await generateOtp(form.email, "signup");
      setStep("otp");
      setMessage(data.message || "OTP sent to your email.");
    } catch (err) {
      setError(err.response?.data?.message || "Could not send OTP.");
    }
    setLoading(false);
  };

  // Verify OTP, then signup using API helpers
  const handleOtpSubmit = async (e) => {
    e.preventDefault();
    setError(""); setMessage(""); setLoading(true);
    try {
      const verifyData = await verifyOtp(form.email, otp, "signup");
      // If verification fails, it'll throw
      const signupData = await signup(form);
      setStep("done");
      setMessage(signupData.message || "Signup successful! You can log in now.");
    } catch (err) {
      setError(err.response?.data?.message || "Error during signup/OTP.");
    }
    setLoading(false);
  };

  return (
    <div className="landing-container">
      <header className="landing-header">
        <h1>Signup</h1>
        <p>Register a new account for the Parking Lot System.</p>
      </header>
      <main>
        {step === "details" && (
          <form className="signup-form" onSubmit={handleDetailsSubmit}>
            <input name="name" value={form.name} onChange={handleChange} type="text" required placeholder="Name"/>
            <input name="email" value={form.email} onChange={handleChange} type="email" required placeholder="Email"/>
            <input name="phone" value={form.phone} onChange={handleChange} type="tel" required placeholder="Phone"/>
            <input name="password" value={form.password} onChange={handleChange} type="password" required placeholder="Password" minLength={6}/>
            <select name="role" value={form.role} onChange={handleChange} required>
              <option value="">Role</option>
              <option value="admin">Admin</option>
              <option value="owner">Owner</option>
              <option value="customer">Customer</option>
            </select>
            {form.role === "owner" && (
              <input name="parkingLotGovId" value={form.parkingLotGovId} onChange={handleChange}
                type="text" required={form.role === "owner"} placeholder="Parking Lot Gov ID (owner only)"/>
            )}
            <button type="submit" disabled={loading}>
              {loading ? "Sending OTP..." : "Send OTP"}
            </button>
            {error && <div className="error-msg">{error}</div>}
          </form>
        )}
        {step === "otp" && (
          <form className="otp-form" onSubmit={handleOtpSubmit}>
            <input type="text" value={otp} onChange={e => setOtp(e.target.value)}
              placeholder="Enter OTP" required pattern="\d{6}" maxLength={6} />
            <button type="submit" disabled={loading}>
              {loading ? "Verifying..." : "Verify & Signup"}
            </button>
            {message && <div className="success-msg">{message}</div>}
            {error && <div className="error-msg">{error}</div>}
          </form>
        )}
        {step === "done" && (
          <div className="success-msg">{message || "Signup successful! You can now log in."}</div>
        )}
      </main>
    </div>
  );
}

export default SignupPage;
