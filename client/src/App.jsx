import React, { useState, useEffect } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { jwtDecode } from "jwt-decode";
import Layout from "./Layout";
import HomePage from "./pages/HomePage";
import SignupPage from "./pages/SignupPage";
import SigninPage from "./pages/SigninPage";
import ForgotPassword from "./pages/ForgotPassword"; // Use this component
import { signin, setAuthToken, signup, generateOtp, verifyOtp } from "./api";

function App() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem("jwt");
    if (token) {
      try {
        const decoded = jwtDecode(token);
        const now = Date.now() / 1000;
        if (decoded.exp && decoded.exp > now) {
          setUser({
            name: decoded.name || "Unknown",
            email: decoded.email || "Unknown",
            role: decoded.role || "customer",
          });
          setAuthToken(token);
        } else {
          setUser(null);
          localStorage.removeItem("jwt");
        }
      } catch (err) {
        setUser(null);
        localStorage.removeItem("jwt");
      }
    }
  }, []);

  const handleSignin = async (email, password) => {
    try {
      const res = await signin({ email, password });
      if (res.token) {
        setAuthToken(res.token);
        localStorage.setItem("jwt", res.token);
        setUser({
          name: res.name,
          email: res.email,
          role: res.role,
        });
        return { success: true };
      }
      return { success: false, error: res.message };
    } catch (err) {
      return { success: false, error: "Network error" };
    }
  };

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Layout user={user} setUser={setUser} />}>
          <Route index element={<HomePage />} />
          <Route path="signup" element={
            <SignupPage signup={signup} generateOtp={generateOtp} verifyOtp={verifyOtp} />
          } />
          <Route path="signin" element={
            <SigninPage handleSignin={handleSignin} />
          } />
          <Route path="forgot-password" element={<ForgotPassword />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
