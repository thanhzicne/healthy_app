import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useApp } from "../../context/AppContext";

export default function LoginPage() {
  const navigate = useNavigate();
  const { dispatch } = useApp();
  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    console.group("🔐 LoginPage Component");
    console.log("Component mounted at:", new Date().toISOString());
    console.log("Initial state:", { form, error, loading });
    console.groupEnd();
    return () => {
      console.log(
        "🔐 LoginPage Component unmounted at:",
        new Date().toISOString(),
      );
    };
  }, []);

  const handleChange = (key, value) => {
    console.log(
      `📝 Form change: ${key} = ${key === "password" ? "***" : value}`,
    );
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    const startTime = performance.now();
    console.group("🚀 Login Attempt");
    console.log("Timestamp:", new Date().toISOString());
    console.log("Attempting login for email:", form.email);
    console.log("Form data:", { ...form, password: "***" });

    setError("");

    if (!form.email || !form.password) {
      const endTime = performance.now();
      console.error("❌ Validation failed: missing email or password");
      console.log("Validation time:", (endTime - startTime).toFixed(2) + "ms");
      console.groupEnd();
      setError("Vui long nhap day du email va mat khau.");
      return;
    }

    try {
      const users = JSON.parse(localStorage.getItem("health_users") || "[]");
      console.log(
        "Retrieved users from localStorage:",
        users.length,
        "users found",
      );

      const found = users.find(
        (u) => u.email === form.email && u.password === form.password,
      );

      if (!found) {
        const endTime = performance.now();
        console.warn("⚠️ Login failed: user not found for email:", form.email);
        console.log("Search time:", (endTime - startTime).toFixed(2) + "ms");
        console.groupEnd();
        setError("Email hoac mat khau khong dung.");
        return;
      }

      console.log("✅ User found:", { email: found.email, name: found.name });
      setLoading(true);
      console.log("Setting loading state to true");

      setTimeout(() => {
        const dispatchStart = performance.now();
        dispatch({
          type: "LOGIN",
          payload: { email: found.email, name: found.name },
        });
        console.log("Dispatched LOGIN action");

        const profile = JSON.parse(
          localStorage.getItem(`health_profile_${found.email}`) || "null",
        );
        if (profile) {
          dispatch({ type: "SET_PROFILE", payload: profile });
          console.log("✅ Profile loaded for user:", found.email, profile);
        } else {
          console.warn("⚠️ No profile found for user:", found.email);
        }

        const dispatchEnd = performance.now();
        console.log(
          "Dispatch operations completed in:",
          (dispatchEnd - dispatchStart).toFixed(2) + "ms",
        );

        console.log("🔄 Navigating to dashboard");
        navigate("/dashboard");

        const totalTime = performance.now() - startTime;
        console.log(
          "🎉 Login process completed in:",
          totalTime.toFixed(2) + "ms",
        );
        console.groupEnd();
      }, 500);
    } catch (error) {
      console.error("💥 Error during login process:", error);
      console.groupEnd();
      setError("Co loi xay ra. Vui long thu lai.");
    }
  };

  return (
    <div style={styles.page}>
      <div style={styles.backdrop} />
      <div style={styles.card}>
        <div style={styles.brand}>
          <div style={styles.logo}>VT</div>
          <div>
            <div style={styles.brandName}>VitaTrack</div>
            <div style={styles.brandSub}>Health Monitor</div>
          </div>
        </div>

        <h1 style={styles.title}>Dang nhap</h1>
        <p style={styles.subtitle}>Theo doi suc khoe cua ban moi ngay.</p>

        <form onSubmit={handleSubmit} style={styles.form}>
          <div className="input-group">
            <label className="input-label">Email</label>
            <input
              type="email"
              className="input-field"
              placeholder="you@example.com"
              value={form.email}
              onChange={(e) => handleChange("email", e.target.value)}
              autoComplete="email"
            />
          </div>

          <div className="input-group">
            <label className="input-label">Mat khau</label>
            <input
              type="password"
              className="input-field"
              placeholder="••••••••"
              value={form.password}
              onChange={(e) => handleChange("password", e.target.value)}
              autoComplete="current-password"
            />
          </div>

          {error ? <div style={styles.error}>{error}</div> : null}

          <button
            type="submit"
            className="btn btn-primary"
            style={styles.submitBtn}
            disabled={loading}
          >
            {loading ? "Dang dang nhap..." : "Dang nhap"}
          </button>
        </form>

        <p style={styles.switchText}>
          Chua co tai khoan?{" "}
          <Link to="/register" style={styles.link}>
            Dang ky ngay
          </Link>
        </p>
      </div>
    </div>
  );
}

const styles = {
  page: {
    minHeight: "100vh",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    padding: 20,
    position: "relative",
  },
  backdrop: {
    position: "fixed",
    inset: 0,
    background:
      "radial-gradient(ellipse at 20% 30%, rgba(0,212,255,0.12) 0%, transparent 60%), radial-gradient(ellipse at 90% 80%, rgba(0,229,160,0.08) 0%, transparent 60%)",
    pointerEvents: "none",
  },
  card: {
    width: "100%",
    maxWidth: 420,
    background: "rgba(22, 29, 46, 0.9)",
    border: "1px solid rgba(255,255,255,0.08)",
    borderRadius: 20,
    padding: "32px 28px",
    boxShadow: "0 24px 80px rgba(0,0,0,0.45)",
    position: "relative",
    zIndex: 1,
  },
  brand: {
    display: "flex",
    alignItems: "center",
    gap: 10,
    marginBottom: 24,
  },
  logo: {
    width: 40,
    height: 40,
    borderRadius: 10,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    background: "linear-gradient(135deg, #00d4ff, #00a8cc)",
    color: "#03111f",
    fontWeight: 800,
    fontSize: 14,
  },
  brandName: {
    fontFamily: "var(--font-display)",
    fontWeight: 800,
    fontSize: 20,
  },
  brandSub: {
    color: "#8892aa",
    fontSize: 11,
    textTransform: "uppercase",
    letterSpacing: 0.8,
  },
  title: {
    fontFamily: "var(--font-display)",
    fontSize: 32,
    fontWeight: 800,
    color: "#f0f4ff",
  },
  subtitle: {
    color: "#8892aa",
    marginTop: 6,
    marginBottom: 24,
    fontSize: 14,
  },
  form: {
    display: "flex",
    flexDirection: "column",
    gap: 14,
  },
  error: {
    border: "1px solid rgba(255,79,139,0.4)",
    borderRadius: 10,
    background: "rgba(255,79,139,0.1)",
    color: "#ff7aa7",
    padding: "10px 12px",
    fontSize: 13,
  },
  submitBtn: {
    width: "100%",
    marginTop: 6,
  },
  switchText: {
    marginTop: 20,
    textAlign: "center",
    color: "#8892aa",
    fontSize: 14,
  },
  link: {
    color: "#00d4ff",
    fontWeight: 700,
    textDecoration: "none",
  },
};
