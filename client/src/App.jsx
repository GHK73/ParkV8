import React, { useState } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Layout from "./Layout";
import HomePage from "./pages/HomePage";
import SignupPage from "./pages/SignupPage";
import SigninPage from "./pages/SigninPage";
import { signin, setAuthToken, signup, generateOtp, verifyOtp } from "./api"; // Import your API helpers

function App() {
  const [user, setUser] = useState(null);

  // Auth handler for signin
  const handleSignin = async (email, password) => {
    try {
      const res = await signin({ email, password });
      if (res.token) {
        setAuthToken(res.token);
        setUser({ name: res.name, email: res.email, role: res.role });
        return { success: true };
      }
      return { success: false, error: res.message };
    } catch (err) {
      return { success: false, error: "Network error" };
    }
  };

  // You can similarly define a callback for handling signup, OTP, etc.
  // For simplicity, pass signup/generateOtp/verifyOtp directly to SignupPage, as previously shown.

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
            element={<SignupPage signup={signup} generateOtp={generateOtp} verifyOtp={verifyOtp} />}
          />
          <Route
            path="signin"
            element={<SigninPage handleSignin={handleSignin} />}
          />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
