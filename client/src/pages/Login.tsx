import React, { useState } from "react";
import { Navigate, useNavigate, Link } from "react-router-dom";
import api from "../services/api";
import { useAuth } from "../context/AuthContext";

const Login = () => {
  //1 localstorage for the form input

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  //2. Hooks for navigation and global auth
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault(); //stop refreshing
    setError("");

    try {
      // api call
      const { data } = await api.post("/users/login", { email, password });
      //4. update context (save user and token)
      login(data.token, data);

      // 5. Redirect to Dashboard
      navigate("/dashboard");
    } catch (error: any) {
      //handle invalid pass or server error
      setError(error.respnse?.data?.messsage || "login failed");
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <h2>Welcome Back</h2>
        {error && <p style={styles.error}>{error}</p>}

        <form onSubmit={handleSubmit} style={styles.form}>
          <input
            type="email"
            placeholder="Email"
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
          <button type="submit" style={styles.button}>
            Login
          </button>
        </form>

        <p style={{ marginTop: "1rem" }}>
          New here? <Link to="/register">Create an account</Link>
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
    backgroundColor: "#f0f2f5",
  },
  card: {
    background: "white",
    padding: "2rem",
    borderRadius: "8px",
    boxShadow: "0 4px 6px rgba(0,0,0,0.1)",
    width: "100%",
    maxWidth: "400px",
    textAlign: "center" as const,
  },
  form: {
    display: "flex",
    flexDirection: "column" as const,
    gap: "1rem",
    marginTop: "1rem",
  },
  input: {
    padding: "0.75rem",
    borderRadius: "4px",
    border: "1px solid #ccc",
    fontSize: "1rem",
  },
  button: {
    padding: "0.75rem",
    borderRadius: "4px",
    border: "none",
    backgroundColor: "#007bff",
    color: "white",
    fontSize: "1rem",
    cursor: "pointer",
    fontWeight: "bold" as const,
  },
  error: {
    color: "red",
    background: "#ffe6e6",
    padding: "0.5rem",
    borderRadius: "4px",
    fontSize: "0.9rem",
  },
};

export default Login;
