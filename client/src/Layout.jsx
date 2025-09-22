//src/Layout.jsx
import React, { useState, useRef } from "react";
import { Outlet, useNavigate } from "react-router-dom";
import "./App.css";

function Layout({ user, setUser }) {
  const navigate = useNavigate();
  const [showMenu, setShowMenu] = useState(false);
  const menuRef = useRef();

  // Close menu if clicked outside
  React.useEffect(() => {
    function handleClickOutside(event) {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setShowMenu(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleLogout = () => {
  setUser(null);           
  localStorage.clear();    
  navigate("/");           
};


  return (
    <div className="app-root">
      <nav className="top-bar">
        <div className="brand-title" onClick={() => navigate("/")}>
          Parking Lot System
        </div>
        <div className="nav-actions">
          {user ? (
            <div
              className="user-menu"
              onClick={() => setShowMenu(!showMenu)}
              style={{ position: "relative", cursor: "pointer" }}
              ref={menuRef}
            >
              <span className="user-display">👤</span>
              {showMenu && (
                <div className="menu-dropdown">
                  <div className="menu-item">
                    <b>{user.name}</b>
                  </div>
                  <div className="menu-item" onClick={handleLogout} style={{ cursor: "pointer", color: "#d00" }}>
                    Logout
                  </div>
                </div>
              )}
            </div>
          ) : (
            <>
              <button className="nav-btn" onClick={() => navigate("/signup")}>
                📝 Signup
              </button>
              <button className="nav-btn" onClick={() => navigate("/signin")}>
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
