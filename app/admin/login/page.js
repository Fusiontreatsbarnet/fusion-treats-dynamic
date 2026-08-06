"use client";
import { useState } from "react";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    const res = await fetch("/api/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });
    if (res.ok) {
      window.location.href = "/admin";
    } else {
      setError("Invalid email or password.");
    }
  }

  return (
    <div className="admin-auth-page">
      <div style={{ width: "100%", maxWidth: 380 }}>
        <h1 style={{ marginBottom: 20 }}>Admin Login</h1>
        <form onSubmit={handleSubmit} className="card">
          <div style={{ marginBottom: 14 }}>
            <label>Email</label>
            <input value={email} onChange={(e) => setEmail(e.target.value)} type="email" required />
          </div>
          <div style={{ marginBottom: 14 }}>
            <label>Password</label>
            <input value={password} onChange={(e) => setPassword(e.target.value)} type="password" required />
          </div>
          {error && <p style={{ color: "#C0392B", fontSize: "0.85rem", marginBottom: 10 }}>{error}</p>}
          <button className="btn" type="submit">Log In</button>
        </form>
      </div>
    </div>
  );
}
