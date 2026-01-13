"use client";

import GoogleLoginBtn from "../components/page/shared/GoogleLoginBtn";
import React, { useState, ChangeEvent, FormEvent } from "react";
import { useRouter } from "next/navigation";
import { setUser } from "@/GlobalRedux/Features/auth/authSlice";
import { toast } from "sonner";
import { verifyToken } from "@/utils/verify";
import { useLogInMutation } from "@/GlobalRedux/api/api";
import Link from "next/link";
import { useDispatch } from "react-redux";
import { setCookie } from "nookies";

type ApiError = {
  status?: number;
  message?: string;
};

interface LoginForm {
  email: string;
  password: string;
}

const LoginPage: React.FC = () => {
  const router = useRouter();
  const [LogIn] = useLogInMutation();
  const dispatch = useDispatch();
  const [isLoading, setIsLoading] = useState(false);
  const [focusedField, setFocusedField] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState(false);

  const [formData, setFormData] = useState<LoginForm>({
    email: "",
    password: "",
  });

  const [errorMessage, setErrorMessage] = useState("");

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setErrorMessage("");
    setIsLoading(true);

    try {
      const response = await LogIn(formData).unwrap();

      if (response.token) {
        const user = verifyToken(response.token);
        dispatch(setUser({ user: user, token: response.token }));

        setCookie(null, "token", response.token, {
          maxAge: 30 * 24 * 60 * 60,
          path: "/",
        });

        setCookie(null, "user", JSON.stringify(user), {
          maxAge: 30 * 24 * 60 * 60,
          path: "/",
        });

        toast.success("Login successful!");
        const userRole = (user as any)?.role;
        if (userRole === "admin") {
          router.push("/admin-dashboard");
        } else {
          router.push("/dashboard/my-library");
        }
      } else {
        setErrorMessage("Wrong email or password.");
      }
    } catch (error) {
      console.error("Login error:", error);
      const apiError = error as ApiError;
      if (apiError.status === 500 || apiError.status === 400) {
        setErrorMessage("Wrong email or password.");
      } else {
        setErrorMessage("An unexpected error occurred. Please try again.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div
      style={{
        fontFamily: "'Outfit', sans-serif",
        minHeight: "100vh",
        backgroundColor: "#0a0a0a",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "20px",
        position: "relative",
        overflow: "hidden",
      }}
    >
      {/* Google Fonts */}
      <style jsx global>{`
        @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@400;500;600;700&family=Outfit:wght@300;400;500;600&display=swap');

        @keyframes float {
          0%, 100% { transform: translateY(0) scale(1); }
          50% { transform: translateY(-20px) scale(1.05); }
        }

        @keyframes glow {
          0%, 100% { box-shadow: 0 0 20px rgba(220, 38, 38, 0.2); }
          50% { box-shadow: 0 0 40px rgba(220, 38, 38, 0.4); }
        }

        @keyframes rotate {
          from { transform: translate(-50%, -50%) rotate(0deg); }
          to { transform: translate(-50%, -50%) rotate(360deg); }
        }

        @keyframes pulse {
          0%, 100% { opacity: 0.3; }
          50% { opacity: 0.6; }
        }

        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }

        input::placeholder {
          color: rgba(255, 255, 255, 0.25) !important;
        }
      `}</style>

      {/* Background orbs */}
      <div
        style={{
          position: "absolute",
          top: "-200px",
          left: "20%",
          width: "600px",
          height: "600px",
          background: "radial-gradient(circle, rgba(220, 38, 38, 0.15) 0%, transparent 70%)",
          borderRadius: "50%",
          filter: "blur(80px)",
          animation: "float 8s ease-in-out infinite",
          pointerEvents: "none",
        }}
      />
      <div
        style={{
          position: "absolute",
          bottom: "-200px",
          right: "20%",
          width: "500px",
          height: "500px",
          background: "radial-gradient(circle, rgba(220, 38, 38, 0.1) 0%, transparent 70%)",
          borderRadius: "50%",
          filter: "blur(60px)",
          animation: "float 8s ease-in-out infinite 4s",
          pointerEvents: "none",
        }}
      />

      {/* Rotating rings */}
      <div
        style={{
          position: "absolute",
          top: "50%",
          left: "50%",
          width: "800px",
          height: "800px",
          border: "1px solid rgba(220, 38, 38, 0.1)",
          borderRadius: "50%",
          animation: "rotate 30s linear infinite",
          pointerEvents: "none",
        }}
      />
      <div
        style={{
          position: "absolute",
          top: "50%",
          left: "50%",
          width: "600px",
          height: "600px",
          border: "1px solid rgba(255, 255, 255, 0.05)",
          borderRadius: "50%",
          animation: "rotate 25s linear infinite reverse",
          pointerEvents: "none",
        }}
      />

      {/* Main container */}
      <div style={{ width: "100%", maxWidth: "440px", position: "relative", zIndex: 10 }}>
        
        {/* Logo section */}
        <div style={{ textAlign: "center", marginBottom: "40px" }}>
          <div
            style={{
              display: "inline-flex",
              alignItems: "center",
              justifyContent: "center",
              width: "80px",
              height: "80px",
              background: "linear-gradient(135deg, #dc2626 0%, #991b1b 100%)",
              borderRadius: "20px",
              marginBottom: "24px",
              boxShadow: "0 20px 50px rgba(220, 38, 38, 0.3)",
              animation: "glow 3s ease-in-out infinite",
            }}
          >
            <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="1.5">
              <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </div>
          
          <h1
            style={{
              fontFamily: "'Cormorant Garamond', serif",
              fontSize: "42px",
              fontWeight: 600,
              color: "#ffffff",
              margin: 0,
              letterSpacing: "1px",
            }}
          >
            Welcome Back
          </h1>
          <p
            style={{
              color: "rgba(255, 255, 255, 0.4)",
              marginTop: "12px",
              fontSize: "13px",
              letterSpacing: "3px",
              textTransform: "uppercase",
            }}
          >
            Sign in to continue
          </p>
        </div>

        {/* Card */}
        <div
          style={{
            background: "linear-gradient(145deg, rgba(25, 25, 25, 0.95) 0%, rgba(15, 15, 15, 0.98) 100%)",
            borderRadius: "24px",
            padding: "40px",
            border: "1px solid rgba(255, 255, 255, 0.08)",
            boxShadow: "0 25px 80px rgba(0, 0, 0, 0.5), 0 0 40px rgba(220, 38, 38, 0.1)",
          }}
        >
          {/* Quick login */}
          <div style={{ marginBottom: "32px" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "16px", marginBottom: "16px" }}>
              <div style={{ flex: 1, height: "1px", background: "linear-gradient(90deg, transparent, rgba(220, 38, 38, 0.3), transparent)" }} />
              <span style={{ fontSize: "10px", color: "rgba(255, 255, 255, 0.3)", letterSpacing: "3px", textTransform: "uppercase" }}>Quick Access</span>
              <div style={{ flex: 1, height: "1px", background: "linear-gradient(90deg, transparent, rgba(220, 38, 38, 0.3), transparent)" }} />
            </div>
            
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px" }}>
              <button
                type="button"
                onClick={() => {
                  setFormData({ email: "admin@example.com", password: "password123" });
                  toast.success("Admin credentials filled!");
                }}
                style={{
                  padding: "14px 16px",
                  background: "linear-gradient(135deg, rgba(220, 38, 38, 0.15) 0%, rgba(220, 38, 38, 0.05) 100%)",
                  border: "1px solid rgba(220, 38, 38, 0.3)",
                  borderRadius: "12px",
                  cursor: "pointer",
                  transition: "all 0.3s ease",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: "8px",
                  color: "#ef4444",
                  fontSize: "14px",
                  fontWeight: 500,
                  fontFamily: "'Outfit', sans-serif",
                }}
                onMouseOver={(e) => {
                  e.currentTarget.style.borderColor = "rgba(220, 38, 38, 0.6)";
                  e.currentTarget.style.background = "linear-gradient(135deg, rgba(220, 38, 38, 0.25) 0%, rgba(220, 38, 38, 0.1) 100%)";
                }}
                onMouseOut={(e) => {
                  e.currentTarget.style.borderColor = "rgba(220, 38, 38, 0.3)";
                  e.currentTarget.style.background = "linear-gradient(135deg, rgba(220, 38, 38, 0.15) 0%, rgba(220, 38, 38, 0.05) 100%)";
                }}
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"/>
                </svg>
                Admin
              </button>
              
              <button
                type="button"
                onClick={() => {
                  setFormData({ email: "user@example.com", password: "password123" });
                  toast.success("User credentials filled!");
                }}
                style={{
                  padding: "14px 16px",
                  background: "rgba(255, 255, 255, 0.03)",
                  border: "1px solid rgba(255, 255, 255, 0.1)",
                  borderRadius: "12px",
                  cursor: "pointer",
                  transition: "all 0.3s ease",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: "8px",
                  color: "rgba(255, 255, 255, 0.6)",
                  fontSize: "14px",
                  fontWeight: 500,
                  fontFamily: "'Outfit', sans-serif",
                }}
                onMouseOver={(e) => {
                  e.currentTarget.style.borderColor = "rgba(255, 255, 255, 0.25)";
                  e.currentTarget.style.color = "rgba(255, 255, 255, 0.9)";
                }}
                onMouseOut={(e) => {
                  e.currentTarget.style.borderColor = "rgba(255, 255, 255, 0.1)";
                  e.currentTarget.style.color = "rgba(255, 255, 255, 0.6)";
                }}
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
                  <circle cx="12" cy="7" r="4"/>
                </svg>
                User
              </button>
            </div>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit}>
            {/* Email field */}
            <div style={{ marginBottom: "24px" }}>
              <label
                htmlFor="email"
                style={{
                  display: "block",
                  fontSize: "11px",
                  fontWeight: 500,
                  letterSpacing: "2px",
                  textTransform: "uppercase",
                  marginBottom: "12px",
                  color: focusedField === "email" ? "#ef4444" : "rgba(255, 255, 255, 0.4)",
                  transition: "color 0.3s ease",
                }}
              >
                Email Address
              </label>
              <div style={{ position: "relative" }}>
                <input
                  id="email"
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  onFocus={() => setFocusedField("email")}
                  onBlur={() => setFocusedField(null)}
                  required
                  placeholder="you@example.com"
                  style={{
                    width: "100%",
                    padding: "16px 20px",
                    paddingRight: "48px",
                    background: focusedField === "email" ? "rgba(255, 255, 255, 0.06)" : "rgba(255, 255, 255, 0.03)",
                    border: focusedField === "email" ? "1px solid rgba(220, 38, 38, 0.5)" : "1px solid rgba(255, 255, 255, 0.08)",
                    borderRadius: "12px",
                    color: "#ffffff",
                    fontSize: "15px",
                    fontFamily: "'Outfit', sans-serif",
                    outline: "none",
                    transition: "all 0.3s ease",
                    boxSizing: "border-box",
                    boxShadow: focusedField === "email" ? "0 0 0 4px rgba(220, 38, 38, 0.1), 0 0 30px rgba(220, 38, 38, 0.1)" : "none",
                  }}
                />
                {formData.email && (
                  <div
                    style={{
                      position: "absolute",
                      right: "16px",
                      top: "50%",
                      transform: "translateY(-50%)",
                      width: "20px",
                      height: "20px",
                      background: "linear-gradient(135deg, #22c55e 0%, #16a34a 100%)",
                      borderRadius: "50%",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3">
                      <path d="M20 6L9 17l-5-5" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  </div>
                )}
              </div>
            </div>

            {/* Password field */}
            <div style={{ marginBottom: "24px" }}>
              <label
                htmlFor="password"
                style={{
                  display: "block",
                  fontSize: "11px",
                  fontWeight: 500,
                  letterSpacing: "2px",
                  textTransform: "uppercase",
                  marginBottom: "12px",
                  color: focusedField === "password" ? "#ef4444" : "rgba(255, 255, 255, 0.4)",
                  transition: "color 0.3s ease",
                }}
              >
                Password
              </label>
              <div style={{ position: "relative" }}>
                <input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  onFocus={() => setFocusedField("password")}
                  onBlur={() => setFocusedField(null)}
                  required
                  placeholder="••••••••••"
                  style={{
                    width: "100%",
                    padding: "16px 20px",
                    paddingRight: "48px",
                    background: focusedField === "password" ? "rgba(255, 255, 255, 0.06)" : "rgba(255, 255, 255, 0.03)",
                    border: focusedField === "password" ? "1px solid rgba(220, 38, 38, 0.5)" : "1px solid rgba(255, 255, 255, 0.08)",
                    borderRadius: "12px",
                    color: "#ffffff",
                    fontSize: "15px",
                    fontFamily: "'Outfit', sans-serif",
                    outline: "none",
                    transition: "all 0.3s ease",
                    boxSizing: "border-box",
                    boxShadow: focusedField === "password" ? "0 0 0 4px rgba(220, 38, 38, 0.1), 0 0 30px rgba(220, 38, 38, 0.1)" : "none",
                  }}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  style={{
                    position: "absolute",
                    right: "16px",
                    top: "50%",
                    transform: "translateY(-50%)",
                    background: "none",
                    border: "none",
                    cursor: "pointer",
                    color: "rgba(255, 255, 255, 0.3)",
                    padding: 0,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  {showPassword ? (
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M17.94 17.94A10.07 10.07 0 0112 20c-7 0-11-8-11-8a18.45 18.45 0 015.06-5.94M9.9 4.24A9.12 9.12 0 0112 4c7 0 11 8 11 8a18.5 18.5 0 01-2.16 3.19m-6.72-1.07a3 3 0 11-4.24-4.24"/>
                      <line x1="1" y1="1" x2="23" y2="23"/>
                    </svg>
                  ) : (
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
                      <circle cx="12" cy="12" r="3"/>
                    </svg>
                  )}
                </button>
              </div>
            </div>

            {/* Error message */}
            {errorMessage && (
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "12px",
                  padding: "16px",
                  background: "rgba(220, 38, 38, 0.1)",
                  border: "1px solid rgba(220, 38, 38, 0.2)",
                  borderRadius: "12px",
                  marginBottom: "24px",
                }}
              >
                <div
                  style={{
                    width: "32px",
                    height: "32px",
                    background: "rgba(220, 38, 38, 0.2)",
                    borderRadius: "50%",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    flexShrink: 0,
                  }}
                >
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#ef4444" strokeWidth="2">
                    <circle cx="12" cy="12" r="10"/>
                    <line x1="15" y1="9" x2="9" y2="15"/>
                    <line x1="9" y1="9" x2="15" y2="15"/>
                  </svg>
                </div>
                <p style={{ color: "#ef4444", fontSize: "14px", margin: 0 }}>{errorMessage}</p>
              </div>
            )}

            {/* Submit button */}
            <button
              type="submit"
              disabled={isLoading}
              style={{
                width: "100%",
                padding: "18px",
                background: isLoading ? "rgba(220, 38, 38, 0.5)" : "linear-gradient(135deg, #dc2626 0%, #991b1b 100%)",
                border: "none",
                borderRadius: "12px",
                color: "#ffffff",
                fontSize: "16px",
                fontWeight: 600,
                fontFamily: "'Outfit', sans-serif",
                cursor: isLoading ? "not-allowed" : "pointer",
                transition: "all 0.3s ease",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: "12px",
                boxShadow: "0 10px 40px rgba(220, 38, 38, 0.3)",
              }}
              onMouseOver={(e) => {
                if (!isLoading) {
                  e.currentTarget.style.transform = "translateY(-2px)";
                  e.currentTarget.style.boxShadow = "0 20px 50px rgba(220, 38, 38, 0.4)";
                }
              }}
              onMouseOut={(e) => {
                e.currentTarget.style.transform = "translateY(0)";
                e.currentTarget.style.boxShadow = "0 10px 40px rgba(220, 38, 38, 0.3)";
              }}
            >
              {isLoading ? (
                <>
                  <svg
                    width="20"
                    height="20"
                    viewBox="0 0 24 24"
                    fill="none"
                    style={{ animation: "spin 1s linear infinite" }}
                  >
                    <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" opacity="0.25"/>
                    <path fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" opacity="0.75"/>
                  </svg>
                  Signing in...
                </>
              ) : (
                <>
                  Sign In
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M5 12h14M12 5l7 7-7 7" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </>
              )}
            </button>

            {/* Forgot password */}
            <div style={{ textAlign: "center", marginTop: "20px" }}>
              <Link
                href="/recover-password"
                style={{
                  color: "rgba(255, 255, 255, 0.4)",
                  fontSize: "14px",
                  textDecoration: "none",
                  transition: "color 0.3s ease",
                }}
                onMouseOver={(e) => (e.currentTarget.style.color = "#ef4444")}
                onMouseOut={(e) => (e.currentTarget.style.color = "rgba(255, 255, 255, 0.4)")}
              >
                Forgot your password?
              </Link>
            </div>
          </form>

          {/* Divider */}
          <div style={{ display: "flex", alignItems: "center", gap: "16px", margin: "32px 0" }}>
            <div style={{ flex: 1, height: "1px", background: "linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.1), transparent)" }} />
            <span style={{ fontSize: "10px", color: "rgba(255, 255, 255, 0.25)", letterSpacing: "2px", textTransform: "uppercase" }}>Or continue with</span>
            <div style={{ flex: 1, height: "1px", background: "linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.1), transparent)" }} />
          </div>

          {/* Google login */}
          <GoogleLoginBtn />
        </div>

        {/* Create account */}
        <div style={{ textAlign: "center", marginTop: "40px" }}>
          <p style={{ color: "rgba(255, 255, 255, 0.3)", fontSize: "14px", marginBottom: "16px" }}>
            Don&apos;t have an account?
          </p>
          <Link
            href="/register"
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "12px",
              padding: "16px 32px",
              border: "1px solid rgba(255, 255, 255, 0.1)",
              borderRadius: "12px",
              color: "rgba(255, 255, 255, 0.6)",
              fontSize: "15px",
              fontWeight: 500,
              textDecoration: "none",
              transition: "all 0.3s ease",
            }}
            onMouseOver={(e) => {
              e.currentTarget.style.borderColor = "rgba(220, 38, 38, 0.5)";
              e.currentTarget.style.color = "#ffffff";
              e.currentTarget.style.background = "rgba(220, 38, 38, 0.1)";
            }}
            onMouseOut={(e) => {
              e.currentTarget.style.borderColor = "rgba(255, 255, 255, 0.1)";
              e.currentTarget.style.color = "rgba(255, 255, 255, 0.6)";
              e.currentTarget.style.background = "transparent";
            }}
          >
            Create Account
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M5 12h14M12 5l7 7-7 7" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </Link>
        </div>

        {/* Trust badges */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: "32px",
            marginTop: "48px",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: "8px", color: "rgba(255, 255, 255, 0.2)" }}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
              <rect x="3" y="11" width="18" height="11" rx="2" ry="2"/>
              <path d="M7 11V7a5 5 0 0110 0v4"/>
            </svg>
            <span style={{ fontSize: "12px", letterSpacing: "1px" }}>Secure</span>
          </div>
          <div style={{ width: "1px", height: "12px", background: "rgba(255, 255, 255, 0.1)" }} />
          <div style={{ display: "flex", alignItems: "center", gap: "8px", color: "rgba(255, 255, 255, 0.2)" }}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
              <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
            </svg>
            <span style={{ fontSize: "12px", letterSpacing: "1px" }}>Protected</span>
          </div>
          <div style={{ width: "1px", height: "12px", background: "rgba(255, 255, 255, 0.1)" }} />
          <div style={{ display: "flex", alignItems: "center", gap: "8px", color: "rgba(255, 255, 255, 0.2)" }}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
              <path d="M22 11.08V12a10 10 0 11-5.93-9.14"/>
              <path d="M22 4L12 14.01l-3-3"/>
            </svg>
            <span style={{ fontSize: "12px", letterSpacing: "1px" }}>Verified</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;