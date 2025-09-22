import axios from 'axios';

// Use environment variable for backend URL (set VITE_API_URL in .env file)
const BASE_URL = import.meta.env.VITE_API_URL;

// Log for development (can remove for production)
console.log("🌐 Axios base URL:", BASE_URL);

// Create Axios instance
const api = axios.create({ baseURL: BASE_URL, headers: { "Content-Type": "application/json" } });

// Signup request
export async function signup(details) {
  const response = await api.post("/auth/signup", details);
  return response.data;
}

// Signin request
export async function signin({ email, password }) {
  const response = await api.post("/auth/signin", { email, password });
  return response.data;
}

// Generate OTP request
export async function generateOtp(email, purpose) {
  const response = await api.post("/otp/generate", { email, purpose });
  return response.data;
}

// Verify OTP request
export async function verifyOtp(email, otp, purpose) {
  const response = await api.post("/otp/verify", { email, otp, purpose });
  return response.data;
}

// Set JWT token for future requests (call after login)
export function setAuthToken(token) {
  api.defaults.headers.common["Authorization"] = `Bearer ${token}`;
}
