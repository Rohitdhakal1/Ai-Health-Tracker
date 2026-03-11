import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import api from "../services/api";
import { useAuth } from "../context/AuthContext";

// user login logic
const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const { login } = useAuth();
  const navigate = useNavigate();

  // login form submit handler
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    try {

      const { data } = await api.post("/users/login", { email, password });

      login(data.token, data);


      navigate("/dashboard");
    } catch (error: any) {

      setError(error.respnse?.data?.messsage || "login failed");
    }
  };

  return (
    <div style={styles.container} className="fade-in">
      <div style={styles.card}>
        <h2 style={styles.title}>Welcome Back</h2>
        <p style={styles.subtitle}>Sign in to track your health progress</p>

        {error && <div style={styles.error}>{error}</div>}

        <form onSubmit={handleSubmit} style={styles.form}>
          <input
            type="email"
            placeholder="Email address"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            style={styles.input}
            required
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            style={styles.input}
            required
          />
          <button type="submit" style={styles.button} className="hover-lift">
            Login
          </button>
        </form>

        <p style={styles.footerText}>
          New here? <Link to="/register" style={{ color: "var(--primary)", fontWeight: 600, textDecoration: "none" }}>Create an account</Link>
        </p>
      </div>
    </div>
  );
};

const styles = {
  container: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    height: "100vh",
    backgroundColor: "var(--bg)",
  },
  card: {
    background: "var(--card-bg)",
    padding: "3rem",
    borderRadius: "16px",
    boxShadow: "var(--shadow-lg)",
    width: "100%",
    maxWidth: "400px",
    textAlign: "center" as const,
    border: "1px solid var(--accent-soft)",
  },
  title: {
    fontSize: "1.75rem",
    fontWeight: 800,
    marginBottom: "0.5rem",
    color: "var(--text-main)",
    letterSpacing: "-0.025em",
  },
  subtitle: {
    color: "var(--text-muted)",
    marginBottom: "2rem",
    fontSize: "0.9375rem",
  },
  form: {
    display: "flex",
    flexDirection: "column" as const,
    gap: "1.25rem",
  },
  input: {
    padding: "12px 16px",
    borderRadius: "10px",
    border: "1px solid var(--accent-secondary)",
    fontSize: "0.9375rem",
    transition: "var(--transition)",
    backgroundColor: "var(--bg)",
  },
  button: {
    padding: "12px",
    borderRadius: "10px",
    border: "1px solid var(--accent-secondary)",
    backgroundColor: "var(--primary)",
    color: "var(--text-main)",
    fontSize: "1rem",
    cursor: "pointer",
    fontWeight: 700,
    boxShadow: "0 10px 15px -3px rgba(243, 186, 96, 0.3)",
    marginTop: "0.5rem",
  },
  error: {
    color: "var(--danger)",
    background: "var(--accent-soft)",
    padding: "10px",
    borderRadius: "8px",
    fontSize: "0.875rem",
    border: "1px solid var(--accent-secondary)",
    marginBottom: "1.5rem",
    fontWeight: 500,
  },
  footerText: {
    marginTop: "1.5rem",
    fontSize: "0.875rem",
    color: "var(--text-muted)",
  },
};

export default Login;
