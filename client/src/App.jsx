import React, { useState, useEffect } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { jwtDecode } from "jwt-decode";
import Layout from "./Layout";
import HomePage from "./pages/HomePage";
import SignupPage from "./pages/SignupPage";
import SigninPage from "./pages/SigninPage";
import { signin, setAuthToken, signup, generateOtp, verifyOtp } from "./api";

function App() {
  const [user, setUser] = useState(null);

  // Restore user from JWT on app load/refresh with error logging
  useEffect(() => {
    const token = localStorage.getItem("jwt");
    console.log("JWT from localStorage:", token); // Log token for debugging
    if (token) {
      try {
        const decoded = jwtDecode(token);
        console.log("Decoded JWT:", decoded); // Log decoded token
        const now = Date.now() / 1000;
        if (decoded.exp && decoded.exp > now) {
          setUser({
            name: decoded.name || "Unknown",
            email: decoded.email || "Unknown",
            role: decoded.role || "customer",
          });
          setAuthToken(token); // Set Axios default header
        } else {
          setUser(null);
          localStorage.removeItem("jwt");
        }
      } catch (err) {
        console.error("JWT decode failed:", err);
        setUser(null);
        localStorage.removeItem("jwt");
      }
    }
  }, []);

  // Auth handler for signin
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
        <Route
          path="/"
          element={<Layout user={user} setUser={setUser} />}
        >
          <Route index element={<HomePage />} />
          <Route
            path="signup"
            element={
              <SignupPage
                signup={signup}
                generateOtp={generateOtp}
                verifyOtp={verifyOtp}
              />
            }
          />
          <Route
            path="signin"
            element={
              <SigninPage
                handleSignin={handleSignin}
              />
            }
          />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
