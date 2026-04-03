import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useApp } from "../../context/AppContext";
import {
  generateDemoSteps,
  generateDemoWater,
  generateDemoWeight,
} from "../../utils/helpers";

export default function RegisterPage() {
  const navigate = useNavigate();
  const { dispatch } = useApp();
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    height: "",
    weight: "",
    age: "",
    gender: "male",
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    console.group("📝 RegisterPage Component");
    console.log("Component mounted at:", new Date().toISOString());
    console.log("Initial form state:", form);
    console.groupEnd();
    return () => {
      console.log(
        "📝 RegisterPage Component unmounted at:",
        new Date().toISOString(),
      );
    };
  }, []);

  const handleChange = (key, value) => {
    console.log(
      `📝 Form change: ${key} = ${["password", "email"].includes(key) ? "***" : value}`,
    );
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    const startTime = performance.now();
    console.group("🚀 Registration Attempt");
    console.log("Timestamp:", new Date().toISOString());
    console.log("Attempting registration for email:", form.email);
    console.log("Form data:", {
      ...form,
      password: "***",
      email: form.email.replace(/(.{2}).*(@.*)/, "$1***$2"),
    });

    setError("");

    if (!form.name || !form.email || !form.password) {
      const endTime = performance.now();
      console.error("❌ Validation failed: missing name, email, or password");
      console.log("Validation time:", (endTime - startTime).toFixed(2) + "ms");
      console.groupEnd();
      setError("Vui long nhap ten, email va mat khau.");
      return;
    }

    if (form.password.length < 6) {
      const endTime = performance.now();
      console.error("❌ Validation failed: password too short");
      console.log("Password length:", form.password.length);
      console.log("Validation time:", (endTime - startTime).toFixed(2) + "ms");
      console.groupEnd();
      setError("Mat khau phai co it nhat 6 ky tu.");
      return;
    }

    if (!form.height || !form.weight || !form.age) {
      const endTime = performance.now();
      console.error("❌ Validation failed: missing health info");
      console.log("Health data:", {
        height: form.height,
        weight: form.weight,
        age: form.age,
      });
      console.log("Validation time:", (endTime - startTime).toFixed(2) + "ms");
      console.groupEnd();
      setError("Vui long nhap day du thong tin suc khoe.");
      return;
    }

    try {
      const users = JSON.parse(localStorage.getItem("health_users") || "[]");
      console.log(
        "Retrieved existing users from localStorage:",
        users.length,
        "users",
      );

      const exists = users.some((u) => u.email === form.email);
      if (exists) {
        const endTime = performance.now();
        console.warn(
          "⚠️ Registration failed: email already exists:",
          form.email,
        );
        console.log(
          "Duplicate check time:",
          (endTime - startTime).toFixed(2) + "ms",
        );
        console.groupEnd();
        setError("Email nay da ton tai.");
        return;
      }

      console.log("✅ Email is available, proceeding with registration");
      setLoading(true);
      console.log("Setting loading state to true");

      setTimeout(() => {
        const saveStart = performance.now();

        const newUser = {
          name: form.name,
          email: form.email,
          password: form.password,
        };
        const nextUsers = [...users, newUser];
        localStorage.setItem("health_users", JSON.stringify(nextUsers));
        console.log(
          "✅ Users saved to localStorage, total users:",
          nextUsers.length,
        );

        const profile = {
          name: form.name,
          email: form.email,
          height: Number(form.height),
          weight: Number(form.weight),
          age: Number(form.age),
          gender: form.gender,
        };

        localStorage.setItem(
          `health_profile_${form.email}`,
          JSON.stringify(profile),
        );
        console.log("✅ Profile saved to localStorage:", profile);

        const demoSteps = generateDemoSteps();
        localStorage.setItem("health_steps", JSON.stringify(demoSteps));
        console.log(
          "✅ Demo steps generated and saved:",
          demoSteps.length,
          "entries",
        );

        const demoWater = generateDemoWater();
        localStorage.setItem("health_water", JSON.stringify(demoWater));
        console.log(
          "✅ Demo water data generated and saved:",
          demoWater.length,
          "entries",
        );

        const demoWeight = generateDemoWeight();
        localStorage.setItem("health_weight", JSON.stringify(demoWeight));
        console.log(
          "✅ Demo weight data generated and saved:",
          demoWeight.length,
          "entries",
        );

        const dispatchStart = performance.now();
        dispatch({
          type: "LOGIN",
          payload: { email: form.email, name: form.name },
        });
        dispatch({ type: "SET_PROFILE", payload: profile });
        console.log("✅ Dispatched LOGIN and SET_PROFILE actions");

        const dispatchEnd = performance.now();
        console.log(
          "Dispatch operations completed in:",
          (dispatchEnd - dispatchStart).toFixed(2) + "ms",
        );

        console.log("🔄 Navigating to dashboard");
        navigate("/dashboard");

        const totalTime = performance.now() - startTime;
        console.log(
          "🎉 Registration process completed in:",
          totalTime.toFixed(2) + "ms",
        );
        console.groupEnd();
      }, 600);
    } catch (error) {
      console.error("💥 Error during registration process:", error);
      console.error("Error stack:", error.stack);
      console.groupEnd();
      setError("Co loi xay ra. Vui long thu lai.");
    }
  };

  return (
    <div style={styles.page}>
      <div style={styles.backdrop} />
      <div style={styles.card}>
        <h1 style={styles.title}>Dang ky tai khoan</h1>
        <p style={styles.subtitle}>
          Bat dau hanh trinh theo doi suc khoe cung VitaTrack.
        </p>

        <form onSubmit={handleSubmit} style={styles.form}>
          <div className="input-group">
            <label className="input-label">Ho va ten</label>
            <input
              className="input-field"
              placeholder="Nguyen Van A"
              value={form.name}
              onChange={(e) => handleChange("name", e.target.value)}
            />
          </div>

          <div className="input-group">
            <label className="input-label">Email</label>
            <input
              type="email"
              className="input-field"
              placeholder="you@example.com"
              value={form.email}
              onChange={(e) => handleChange("email", e.target.value)}
            />
          </div>

          <div className="input-group">
            <label className="input-label">Mat khau</label>
            <input
              type="password"
              className="input-field"
              placeholder="Toi thieu 6 ky tu"
              value={form.password}
              onChange={(e) => handleChange("password", e.target.value)}
            />
          </div>

          <div style={styles.grid2}>
            <div className="input-group">
              <label className="input-label">Chieu cao (cm)</label>
              <input
                type="number"
                className="input-field"
                placeholder="170"
                value={form.height}
                onChange={(e) => handleChange("height", e.target.value)}
              />
            </div>
            <div className="input-group">
              <label className="input-label">Can nang (kg)</label>
              <input
                type="number"
                className="input-field"
                placeholder="65"
                value={form.weight}
                onChange={(e) => handleChange("weight", e.target.value)}
              />
            </div>
          </div>

          <div style={styles.grid2}>
            <div className="input-group">
              <label className="input-label">Tuoi</label>
              <input
                type="number"
                className="input-field"
                placeholder="25"
                value={form.age}
                onChange={(e) => handleChange("age", e.target.value)}
              />
            </div>
            <div className="input-group">
              <label className="input-label">Gioi tinh</label>
              <select
                className="input-field"
                value={form.gender}
                onChange={(e) => handleChange("gender", e.target.value)}
              >
                <option value="male">Nam</option>
                <option value="female">Nu</option>
              </select>
            </div>
          </div>

          {error ? <div style={styles.error}>{error}</div> : null}

          <button
            type="submit"
            className="btn btn-primary"
            style={styles.submitBtn}
            disabled={loading}
          >
            {loading ? "Dang tao tai khoan..." : "Dang ky"}
          </button>
        </form>

        <p style={styles.switchText}>
          Da co tai khoan?{" "}
          <Link to="/login" style={styles.link}>
            Dang nhap
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
      "radial-gradient(ellipse at 80% 20%, rgba(168,85,247,0.12) 0%, transparent 60%), radial-gradient(ellipse at 10% 90%, rgba(0,212,255,0.08) 0%, transparent 55%)",
    pointerEvents: "none",
  },
  card: {
    width: "100%",
    maxWidth: 520,
    background: "rgba(22, 29, 46, 0.9)",
    border: "1px solid rgba(255,255,255,0.08)",
    borderRadius: 20,
    padding: "30px 28px",
    boxShadow: "0 24px 80px rgba(0,0,0,0.45)",
    position: "relative",
    zIndex: 1,
  },
  title: {
    fontFamily: "var(--font-display)",
    fontSize: 30,
    fontWeight: 800,
    color: "#f0f4ff",
    marginBottom: 6,
  },
  subtitle: {
    color: "#8892aa",
    fontSize: 14,
    marginBottom: 20,
  },
  form: {
    display: "flex",
    flexDirection: "column",
    gap: 14,
  },
  grid2: {
    display: "grid",
    gridTemplateColumns: "1fr 1fr",
    gap: 12,
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
    marginTop: 4,
  },
  switchText: {
    marginTop: 18,
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
