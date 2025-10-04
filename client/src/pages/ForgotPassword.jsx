import React, { useState } from "react";
import { generateOtp, resetPassword } from "../api"; // Adjust this import to your api helper location
import "./ForgotPassword.css"; // Optional: CSS file for styling

function ForgotPassword() {
  const [step, setStep] = useState(1); // 1: Request OTP, 2: Enter OTP & new password, 3: Success
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [successMsg, setSuccessMsg] = useState("");

  // Request OTP
  const handleRequestOtp = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccessMsg("");
    try {
      await generateOtp(email, "password-reset");
      setSuccessMsg("OTP sent to your email address.");
      setStep(2);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to send OTP.");
      setSuccessMsg("");
    }
    setLoading(false);
  };

  // Reset Password
  const handleResetPassword = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccessMsg("");
    try {
      await resetPassword(email, otp, newPassword);
      setSuccessMsg("Password reset successful. You can now sign in.");
      setStep(3);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to reset password.");
      setSuccessMsg("");
    }
    setLoading(false);
  };

  return (
    <div className="forgot-reset-container">
      <h2>Forgot Password</h2>
      {step === 1 && (
        <form onSubmit={handleRequestOtp}>
          <input
            type="email"
            value={email}
            onChange={e => setEmail(e.target.value)}
            placeholder="Enter your registered email"
            required
            autoFocus
          />
          <button type="submit" disabled={loading}>
            {loading ? "Sending OTP..." : "Send OTP"}
          </button>
          {error && <div className="error-msg">{error}</div>}
          {successMsg && <div className="success-msg">{successMsg}</div>}
        </form>
      )}
      {step === 2 && (
        <form onSubmit={handleResetPassword}>
          <input
            type="text"
            value={otp}
            onChange={e => setOtp(e.target.value)}
            placeholder="Enter OTP"
            required
          />
          <input
            type="password"
            value={newPassword}
            onChange={e => setNewPassword(e.target.value)}
            placeholder="Enter new password"
            required
          />
          <button type="submit" disabled={loading}>
            {loading ? "Resetting..." : "Reset Password"}
          </button>
          {error && <div className="error-msg">{error}</div>}
          {successMsg && <div className="success-msg">{successMsg}</div>}
        </form>
      )}
      {step === 3 && (
        <div className="success-msg">
          {successMsg}
        </div>
      )}
    </div>
  );
}

export default ForgotPassword;
