import React, { useState, useEffect } from "react";
import axios from "axios";
import { motion, AnimatePresence } from "framer-motion";
import { BarChart, Bar, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer, Cell, LabelList } from "recharts";
import "./App.css";
import heartHero from "./assets/heart-hero.png";

const SpeedometerGauge = ({ value, color }) => {
  const radius = 80;
  const strokeWidth = 16;
  const circumference = radius * Math.PI;
  const strokeDashoffset = circumference - (value / 100) * circumference;

  return (
    <div className="speedometer-wrapper">
      <svg width="240" height="140" viewBox="0 0 200 120">
        <path
          d={`M 20 100 A ${radius} ${radius} 0 0 1 180 100`}
          fill="none"
          stroke="var(--input-bg)"
          strokeWidth={strokeWidth}
          strokeLinecap="round"
        />
        <motion.path
          d={`M 20 100 A ${radius} ${radius} 0 0 1 180 100`}
          fill="none"
          stroke={color}
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          strokeDasharray={circumference}
          initial={{ strokeDashoffset: circumference }}
          animate={{ strokeDashoffset }}
          transition={{ duration: 1.5, ease: "easeOut" }}
        />
      </svg>
      <div className="speedometer-content">
        <motion.h2 
          className="speedometer-value"
          style={{ color }}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
        >
          {value}%
        </motion.h2>
        <span className="speedometer-label">Risk Probability</span>
      </div>
    </div>
  );
};

function App() {
  const [theme, setTheme] = useState("dark");
  const [currentView, setCurrentView] = useState("welcome"); // "welcome", "auth", "form", "results"
  const [authMode, setAuthMode] = useState("login");
  const [formStep, setFormStep] = useState(1);
  
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    age: "", sex: "1", cp: "", trestbps: "", chol: "",
    fbs: "0", restecg: "", thalach: "", exang: "0",
    oldpeak: "", slope: "", ca: "", thal: "",
  });
  const [result, setResult] = useState(null);

  useEffect(() => {
    document.body.setAttribute('data-theme', theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme(theme === "dark" ? "light" : "dark");
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleAuth = (e) => {
    e.preventDefault();
    setCurrentView("form");
  };

  const handleLogout = () => {
    setCurrentView("welcome");
    setAuthMode("login");
    setFormStep(1);
    setFormData({
      age: "", sex: "1", cp: "", trestbps: "", chol: "",
      fbs: "0", restecg: "", thalach: "", exang: "0",
      oldpeak: "", slope: "", ca: "", thal: "",
    });
    setResult(null);
  };

  const handleSubmit = async (e) => {
    if (e) e.preventDefault();
    setLoading(true);
    setResult(null);

    try {
      const res = await axios.post("http://127.0.0.1:8000/predict", {
        ...Object.fromEntries(
          Object.entries(formData).map(([k, v]) => [k, Number(v)])
        ),
      });

      setTimeout(() => {
        setResult(res.data);
        setLoading(false);
        setCurrentView("results");
      }, 1200);
    } catch {
      alert("Backend error ❌ Please ensure API is running.");
      setLoading(false);
    }
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    show: { opacity: 1, transition: { staggerChildren: 0.1, delayChildren: 0.2 } }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 100, damping: 12 } }
  };

  const renderWelcome = () => (
    <motion.div 
      className="welcome-container"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      key="welcome"
    >
      <div className="welcome-content">
        <motion.div 
          className="welcome-text"
          initial={{ x: -50, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
        >
          <h1 className="welcome-title">HeartCare AI Monitoring</h1>
          <p className="welcome-subtitle">
            Next-generation cardiovascular risk assessment powered by advanced machine learning. 
            Get clinical-grade insights in real-time.
          </p>
          
          <div className="welcome-features">
            <div className="feature-item">
              <span className="feature-icon">⚡</span>
              <span>Ultra-Fast Analysis</span>
            </div>
            <div className="feature-item">
              <span className="feature-icon">🛡️</span>
              <span>Biometric-Grade Privacy</span>
            </div>
          </div>

          <button 
            className="submit-btn welcome-btn" 
            onClick={() => setCurrentView("auth")}
            style={{ width: 'fit-content', padding: '1.2rem 3.5rem' }}
          >
            Launch Dashboard
          </button>
        </motion.div>

        <motion.div
          initial={{ scale: 0.8, opacity: 0, rotate: -5 }}
          animate={{ scale: 1, opacity: 1, rotate: 0 }}
          transition={{ duration: 1, type: "spring", stiffness: 50 }}
        >
          <img src={heartHero} alt="HeartCare AI" className="welcome-hero-img" />
        </motion.div>
      </div>
    </motion.div>
  );

  const renderAuth = () => (
    <motion.div 
      className="login-container"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.95 }}
      key="auth"
    >
      <div className="glass-card login-card">
        <div style={{ fontSize: "3.5rem", marginBottom: "1.5rem", textAlign: "center" }}>💙</div>
        <h2 style={{ marginBottom: "0.5rem", fontSize: "2.2rem", textAlign: "center", fontWeight: 800 }}>
          {authMode === "login" ? "Welcome Back" : "Join HeartCare"}
        </h2>
        <p style={{ color: "var(--text-muted)", marginBottom: "2.5rem", textAlign: "center", fontSize: "1.1rem" }}>
          {authMode === "login" ? "Securely sign in to your health portal" : "Create your private health profile"}
        </p>

        <form onSubmit={handleAuth} style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>
          <AnimatePresence mode="popLayout">
            {authMode === "signup" && (
              <motion.div
                key="name-field"
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                className="input-group"
              >
                <input type="text" placeholder="Full Name" className="custom-input" required />
              </motion.div>
            )}
          </AnimatePresence>

          <div className="input-group">
            <input type="email" placeholder="Email Address" className="custom-input" required autoComplete="email" />
          </div>
          <div className="input-group">
            <input type="password" placeholder="Password" className="custom-input" required autoComplete={authMode === "login" ? "current-password" : "new-password"} />
          </div>

          <button type="submit" className="submit-btn" style={{ marginTop: "1rem" }}>
            {authMode === "login" ? "Access Dashboard" : "Create Account"}
          </button>
        </form>

        <div style={{ marginTop: "2.5rem", color: "var(--text-muted)", fontSize: "1rem", textAlign: "center" }}>
          {authMode === "login" ? "New here? " : "Existing member? "}
          <button 
            type="button" 
            onClick={() => setAuthMode(authMode === "login" ? "signup" : "login")}
            style={{ background: "none", border: "none", color: "var(--primary-color)", fontWeight: "700", cursor: "pointer", textDecoration: "underline" }}
          >
            {authMode === "login" ? "Sign Up" : "Log In"}
          </button>
        </div>
      </div>
    </motion.div>
  );

  const renderForm = () => {
    const fieldsStep1 = [
      { name: "age", label: "Age", type: "number", min: "1", max: "120" },
      { name: "sex", label: "Sex", type: "select", options: [{ v: "1", l: "Male" }, { v: "0", l: "Female" }] },
      { name: "tresbps", label: "Blood Pressure (mm Hg)", type: "number", key: "trestbps" },
      { name: "chol", label: "Cholesterol (mg/dl)", type: "number" },
      { name: "cp", label: "Chest Pain Type (0-3)", type: "number", min: "0", max: "3" },
      { name: "fbs", label: "Fasting Blood Sugar > 120", type: "select", options: [{ v: "1", l: "True" }, { v: "0", l: "False" }] },
    ];

    const fieldsStep2 = [
      { name: "thalach", label: "Max Heart Rate", type: "number" },
      { name: "exang", label: "Exercise Angina", type: "select", options: [{ v: "1", l: "Yes" }, { v: "0", l: "No" }] },
      { name: "oldpeak", label: "ST Depression (Oldpeak)", type: "number", step: "0.1" },
      { name: "slope", label: "Slope of ST Segment (0-2)", type: "number", min: "0", max: "2" },
      { name: "ca", label: "Major Vessels (0-3)", type: "number", min: "0", max: "3" },
      { name: "thal", label: "Thalassemia (1-3)", type: "number", min: "1", max: "3" },
      { name: "restecg", label: "Resting ECG Results (0-2)", type: "number", min: "0", max: "2" },
    ];

    const currentFields = formStep === 1 ? fieldsStep1 : fieldsStep2;

    return (
      <motion.div key="form" initial={{ opacity: 0, x: 50 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -50 }} transition={{ duration: 0.5 }}>
        <header className="header-section">
          <h1 className="header-title">Biometric Profile</h1>
          <p className="header-subtitle">
            Please provide your clinical parameters for an AI-driven risk evaluation.
          </p>
        </header>

        <div className="form-container">
          <div className="glass-card">
            <div className="form-steps">
              <div className={`step-indicator ${formStep === 1 ? 'active' : ''}`} />
              <div className={`step-indicator ${formStep === 2 ? 'active' : ''}`} />
            </div>

            <form onSubmit={(e) => { e.preventDefault(); if(formStep === 1) setFormStep(2); else handleSubmit(); }}>
              <motion.div 
                className="form-grid" 
                variants={containerVariants} 
                initial="hidden" 
                animate="show"
                key={`step-${formStep}`}
              >
                {currentFields.map((field) => (
                  <motion.div className="input-group" key={field.name} variants={itemVariants}>
                    <label className="input-label" htmlFor={field.name}>{field.label}</label>
                    {field.type === "select" ? (
                      <select 
                        id={field.name} name={field.name} className="custom-select" 
                        value={formData[field.name]} onChange={handleChange}
                      >
                        {field.options.map(opt => <option key={opt.v} value={opt.v}>{opt.l}</option>)}
                      </select>
                    ) : (
                      <input
                        id={field.name} name={field.key || field.name} type={field.type} className="custom-input"
                        value={formData[field.key || field.name]} onChange={handleChange} required
                        min={field.min} max={field.max} step={field.step}
                        placeholder={field.label}
                      />
                    )}
                  </motion.div>
                ))}
                
                <div className="submit-btn-container" style={{ gridColumn: '1/-1', display: 'flex', gap: '1.5rem', marginTop: '2rem' }}>
                  {formStep === 2 && (
                    <button type="button" className="nav-btn" onClick={() => setFormStep(1)} style={{ flex: 1, border: '1px solid var(--glass-border)' }}>
                      Back
                    </button>
                  )}
                  <button type="submit" className="submit-btn" disabled={loading} style={{ flex: 2 }}>
                    {loading ? "Analyzing..." : (formStep === 1 ? "Next Step" : "Evaluate Profile")}
                  </button>
                </div>
              </motion.div>
            </form>
          </div>
        </div>
      </motion.div>
    );
  };

  const renderResults = () => {
    if (!result) return null;

    const isRisk = result.prediction === 1;
    const riskColor = isRisk ? "var(--danger-color)" : "var(--success-color)";
    const riskStatusText = isRisk ? "High Risk Detected" : "Low Risk Profile";
    const riskGaugeValue = parseFloat((result.probability * 100).toFixed(1));

    const comparisonData = [
      { name: 'BP', unit: 'mmHg', Patient: Number(formData.trestbps) || 0, Baseline: 120 },
      { name: 'Chol', unit: 'mg/dL', Patient: Number(formData.chol) || 0, Baseline: 200 },
      { name: 'Max HR', unit: 'bpm', Patient: Number(formData.thalach) || 0, Baseline: 155 },
    ];

    return (
      <motion.div key="results" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.5 }}>
        <header className="header-section" style={{ paddingBottom: '2rem' }}>
          <h1 className="header-title">Diagnostic Intelligence</h1>
          <p className="header-subtitle">Advanced algorithmic breakdown of your cardiovascular health status.</p>
        </header>

        <div className="result-container" style={{ display: 'flex', flexDirection: 'column', gap: '3rem' }}>
          
          <motion.div 
            className="glass-card result-top-card"
            initial={{ y: 30, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.2 }}
          >
            <div style={{ textAlign: "left" }}>
              <div className="result-status" style={{ color: riskColor }}>
                {isRisk ? "High Priority ⚠️" : "Healthy Status ✅"}
              </div>
              <p style={{ color: "var(--text-main)", fontSize: "1.2rem", fontWeight: 500, lineHeight: 1.5 }}>
                Your analysis indicates a <span style={{ color: riskColor, fontWeight: 800 }}>{riskGaugeValue}%</span> risk factor.
              </p>
              <p style={{ color: "var(--text-muted)", marginTop: "1rem", lineHeight: 1.6 }}>
                {isRisk 
                  ? "Our AI detected clinical markers consistent with high cardiovascular risk. Immediate consultation with a cardiologist is highly recommended." 
                  : "Excellent news! Your clinical metrics are within safe parameters. Continue your healthy routines to maintain this baseline."}
              </p>
            </div>

            <div style={{ display: "flex", justifyContent: "center" }}>
              <SpeedometerGauge value={riskGaugeValue} color={riskColor} />
            </div>
          </motion.div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))', gap: '2rem' }}>
            <motion.div 
              className="glass-card"
              initial={{ x: -30, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: 0.4 }}
            >
              <h3 style={{ marginBottom: "2rem", fontSize: "1.4rem", fontWeight: "700" }}>Clinical Comparison</h3>
              <div style={{ width: "100%", height: "300px" }}>
                <ResponsiveContainer>
                  <BarChart data={comparisonData}>
                    <XAxis dataKey="name" stroke="var(--text-muted)" />
                    <YAxis stroke="var(--text-muted)" />
                    <Tooltip cursor={{ fill: 'transparent' }} contentStyle={{ background: 'var(--bg-dark-secondary)', border: '1px solid var(--glass-border)', borderRadius: '12px' }} />
                    <Legend verticalAlign="top" height={36}/>
                    <Bar dataKey="Patient" name="Current Profile" fill={riskColor} radius={[6, 6, 0, 0]} />
                    <Bar dataKey="Baseline" name="Healthy Baseline" fill="var(--text-muted)" opacity={0.3} radius={[6, 6, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </motion.div>

            <motion.div 
              className="glass-card"
              initial={{ x: 30, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: 0.6 }}
            >
              <h3 style={{ marginBottom: "2rem", fontSize: "1.4rem", fontWeight: "700" }}>
                {isRisk ? "Action Plan" : "Wellness Roadmap"}
              </h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                {(isRisk ? [
                  { i: "🩺", t: "Urgent Clinical Consultation" },
                  { i: "📊", t: "Daily BP Monitoring" },
                  { i: "🥗", t: "Strict Low-Sodium Diet" },
                ] : [
                  { i: "⭐", t: "Maintain Current Habits" },
                  { i: "🏃", t: "Daily 30min Cardio" },
                  { i: "🥑", t: "Heart-Healthy Nutrients" },
                ]).map((item, idx) => (
                  <div key={idx} className="recommendation-card">
                    <div className="recommendation-icon">{item.i}</div>
                    <span style={{ fontWeight: 600 }}>{item.t}</span>
                  </div>
                ))}
              </div>
            </motion.div>
          </div>

          <button 
            className="nav-btn" 
            style={{ width: 'fit-content', padding: '1rem 3rem', alignSelf: 'center', background: 'var(--input-bg)', border: '1px solid var(--glass-border)' }}
            onClick={() => {
              setResult(null);
              setFormStep(1);
              setCurrentView("form");
            }}
          >
            Start New Assessment
          </button>
        </div>
      </motion.div>
    );
  }

  const renderAbout = () => (
    <motion.div 
      key="about" initial={{ opacity: 0, scale: 0.98 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0 }}
      className="about-container"
    >
      <header className="header-section">
        <h1 className="header-title">The Platform</h1>
        <p className="header-subtitle">Advanced technology bridging clinical data and AI insights.</p>
      </header>

      <div className="glass-card" style={{ maxWidth: "900px", margin: "0 auto", textAlign: "left" }}>
        <h2 style={{ fontSize: "2rem", marginBottom: "2rem", color: "var(--primary-color)" }}>Health Intelligence Disclaimer</h2>
        <div style={{ borderLeft: "4px solid var(--danger-color)", padding: "1.5rem", background: "rgba(244, 63, 94, 0.05)", borderRadius: "0 16px 16px 0", marginBottom: "3rem" }}>
          <p style={{ lineHeight: 1.6, fontSize: "1.1rem" }}>
            HeartCare AI is a predictive support tool, **not a clinical diagnostic system**. Predictions are based on historical data patterns and should only be used for informational purposes. Consult a certified medical professional for any health-related decisions.
          </p>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '3rem' }}>
          <div>
            <h3 style={{ fontSize: "1.4rem", marginBottom: "1rem" }}>Predictive Engine</h3>
            <p style={{ color: "var(--text-muted)", lineHeight: 1.7 }}>
              Our system utilizes a Deep Random Forest ensemble model trained on standardized clinical datasets, optimized for precision across diverse biometric profiles.
            </p>
          </div>
          <div>
            <h3 style={{ fontSize: "1.4rem", marginBottom: "1rem" }}>Data Fidelity</h3>
            <p style={{ color: "var(--text-muted)", lineHeight: 1.7 }}>
              Accuracy is dependent on high-fidelity input. We recommend using results from recent laboratory tests for the most reliable risk assessment.
            </p>
          </div>
        </div>

        <button className="submit-btn" style={{ marginTop: "4rem", width: 'fit-content', padding: '1rem 3rem' }} onClick={() => setCurrentView("welcome")}>
          Return Home
        </button>
      </div>
    </motion.div>
  );

  return (
    <div className="app-container">
      <div className="bg-shape bg-shape-1"></div>
      <div className="bg-shape bg-shape-2"></div>

      <nav className="nav-bar">
        <div className="logo" style={{ cursor: "pointer" }} onClick={() => setCurrentView("welcome")}>
          <div style={{ background: 'var(--primary-color)', width: '32px', height: '32px', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontWeight: 900 }}>H</div>
          HeartCare AI
        </div>
        
        <div className="nav-links">
          {currentView !== "welcome" && (
            <button onClick={() => setCurrentView("welcome")} className="nav-btn">Home</button>
          )}
          <button onClick={() => setCurrentView("about")} className="nav-btn">About</button>
          
          {currentView !== "auth" && currentView !== "welcome" && currentView !== "about" && (
            <button onClick={handleLogout} className="nav-btn">Logout</button>
          )}
          
          <button onClick={toggleTheme} className="theme-toggle">
            {theme === "dark" ? "☀️" : "🌙"}
          </button>
        </div>
      </nav>

      <main className="main-content">
        <AnimatePresence mode="wait">
          {currentView === "welcome" && renderWelcome()}
          {currentView === "auth" && renderAuth()}
          {currentView === "form" && renderForm()}
          {currentView === "results" && renderResults()}
          {currentView === "about" && renderAbout()}
        </AnimatePresence>
      </main>

      <footer className="footer">
        <div style={{ opacity: 0.5, marginBottom: '1rem' }}>⚡ Powered by Medical Gradient Boosting</div>
        © {new Date().getFullYear()} HeartCare AI Advanced Systems.
      </footer>
    </div>
  );
}

export default App;