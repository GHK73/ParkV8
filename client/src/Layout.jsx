import React from "react";
import { Outlet, useNavigate } from "react-router-dom";
import "./App.css";

function Layout({ user, setUser }) {
  const navigate = useNavigate();

  return (
    <div className="app-root">
      <nav className="top-bar">
        <div className="brand-title" onClick={() => navigate("/")}>Parking Lot System</div>
        <div className="nav-actions">
          {user ? (
            <span className="user-display">👤 {user.name}</span>
          ) : (
            <>
              <button className="nav-btn" onClick={() => navigate("/signup")}>
                📝 Signup
              </button>
              <button
                className="nav-btn"
                onClick={() => navigate("/signin")}
              >
                🔒 Signin
              </button>
            </>
          )}
        </div>
      </nav>
      <Outlet />
    </div>
  );
}

export default Layout;
