//src/pages/HomePage
import React from "react";
import "./HomePage.css";


function HomePage() {
  return (
    <div className="landing-container">
      <header className="landing-header">
        <h1>Welcome to Parking Lot System</h1>
        <p>
          Effortless parking management for admins, owners, and customers.
        </p>
      </header>
      <main>
        <a className="landing-button" href="#">
          Get Started
        </a>
      </main>
      <footer className="landing-footer">
        &copy; {new Date().getFullYear()} Parking Lot App
      </footer>
    </div>
  );
}

export default HomePage;
