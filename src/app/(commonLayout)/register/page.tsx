"use client";

import React, { useState, useRef } from "react";
import Link from "next/link";
import { useSignUpMutation } from "@/GlobalRedux/api/api";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import Image from "next/image";

const Reg: React.FC = () => {
  interface SignUpError {
    data?: {
      message?: string;
    };
    error?: string;
  }

  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    phone: "",
    role: "user",
    address: "",
    image: "",
  });

  const [formErrors, setFormErrors] = useState({
    name: "",
    email: "",
    password: "",
    phone: "",
    address: "",
  });
  console.log()

  const [uploading, setUploading] = useState<boolean>(false);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState(false);
  const [signUp, { isLoading }] = useSignUpMutation();
  const [focusedField, setFocusedField] = useState<string | null>(null);
  const [dragActive, setDragActive] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setFormErrors({ ...formErrors, [e.target.name]: "" });
  };

  const IMG_BB_API_KEY = "9717d5d4436d262250f736d12880032f";

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      await uploadImage(file);
    }
  };

  const uploadImage = async (file: File) => {
    // Validate file type
    const validTypes = ["image/jpeg", "image/png", "image/gif", "image/webp"];
    if (!validTypes.includes(file.type)) {
      toast.error("Please upload a valid image (JPEG, PNG, GIF, or WebP)");
      return;
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      toast.error("Image size should be less than 5MB");
      return;
    }

    // Show preview immediately
    const reader = new FileReader();
    reader.onload = (e) => {
      setImagePreview(e.target?.result as string);
    };
    reader.readAsDataURL(file);

    // Upload to ImgBB
    setUploading(true);
    try {
      const formDataImg = new FormData();
      formDataImg.append("image", file);
      formDataImg.append("key", IMG_BB_API_KEY);

      const response = await fetch("https://api.imgbb.com/1/upload", {
        method: "POST",
        body: formDataImg,
      });

      const data = await response.json();

      if (data.success) {
        setFormData((prev) => ({ ...prev, image: data.data.url }));
        toast.success("Image uploaded successfully!");
      } else {
        throw new Error(data.error?.message || "Upload failed");
      }
    } catch (error) {
      console.error("Image upload error:", error);
      toast.error("Failed to upload image. Please try again.");
      setImagePreview(null);
    } finally {
      setUploading(false);
    }
  };

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = async (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    const file = e.dataTransfer.files?.[0];
    if (file) {
      await uploadImage(file);
    }
  };

  const removeImage = () => {
    setImagePreview(null);
    setFormData((prev) => ({ ...prev, image: "" }));
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const validateForm = () => {
    let isValid = true;
    const errors = {
      name: "",
      email: "",
      password: "",
      phone: "",
      address: "",
    };

    if (!formData.name.trim()) {
      errors.name = "Name is required";
      isValid = false;
    }
    if (!formData.email.trim()) {
      errors.email = "Email is required";
      isValid = false;
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      errors.email = "Please enter a valid email address";
      isValid = false;
    }
    if (!formData.password.trim()) {
      errors.password = "Password is required";
      isValid = false;
    } else if (formData.password.length < 6) {
      errors.password = "Password must be at least 6 characters";
      isValid = false;
    }
    if (!formData.phone.trim()) {
      errors.phone = "Phone number is required";
      isValid = false;
    }
    if (!formData.address.trim()) {
      errors.address = "Address is required";
      isValid = false;
    }

    setFormErrors(errors);
    return isValid;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) return;

    if (uploading) {
      toast.error("Please wait for image upload to complete");
      return;
    }

    try {
      setErrorMessage(null);
      console.log("📝 Signup Data:", formData);
      console.log("📤 Sending signup request with data:", { user: formData });
      await signUp({ user: formData }).unwrap();
      toast.success("Account created successfully!");
      router.push("/login");
    } catch (err) {
      const error = err as SignUpError;
      if (error.data?.message) {
        setErrorMessage(error.data.message);
      } else if (error.error) {
        setErrorMessage(error.error);
      } else {
        setErrorMessage("Failed to register user. Please try again.");
      }
    }
  };

  const inputStyle = (fieldName: string, hasError: boolean) => ({
    width: "100%",
    padding: "14px 16px",
    paddingLeft: "48px",
    paddingRight: fieldName === "password" ? "48px" : "16px",
    background: focusedField === fieldName ? "rgba(255, 255, 255, 0.06)" : "rgba(255, 255, 255, 0.03)",
    border: hasError
      ? "1px solid rgba(239, 68, 68, 0.5)"
      : focusedField === fieldName
      ? "1px solid rgba(220, 38, 38, 0.5)"
      : "1px solid rgba(255, 255, 255, 0.08)",
    borderRadius: "12px",
    color: "#ffffff",
    fontSize: "14px",
    fontFamily: "'Outfit', sans-serif",
    outline: "none",
    transition: "all 0.3s ease",
    boxSizing: "border-box" as const,
    boxShadow:
      focusedField === fieldName
        ? "0 0 0 4px rgba(220, 38, 38, 0.1), 0 0 30px rgba(220, 38, 38, 0.1)"
        : "none",
  });

  const labelStyle = (fieldName: string) => ({
    display: "block",
    fontSize: "11px",
    fontWeight: 500,
    letterSpacing: "2px",
    textTransform: "uppercase" as const,
    marginBottom: "10px",
    color: focusedField === fieldName ? "#ef4444" : "rgba(255, 255, 255, 0.4)",
    transition: "color 0.3s ease",
  });

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

        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }

        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.5; }
        }

        input::placeholder {
          color: rgba(255, 255, 255, 0.25) !important;
        }

        ::-webkit-scrollbar {
          width: 6px;
        }
        ::-webkit-scrollbar-track {
          background: rgba(255, 255, 255, 0.05);
        }
        ::-webkit-scrollbar-thumb {
          background: rgba(220, 38, 38, 0.3);
          border-radius: 3px;
        }
        ::-webkit-scrollbar-thumb:hover {
          background: rgba(220, 38, 38, 0.5);
        }
      `}</style>

      {/* Background orbs */}
      <div style={{ position: "absolute", top: "-200px", left: "10%", width: "600px", height: "600px", background: "radial-gradient(circle, rgba(220, 38, 38, 0.15) 0%, transparent 70%)", borderRadius: "50%", filter: "blur(80px)", animation: "float 8s ease-in-out infinite", pointerEvents: "none" }} />
      <div style={{ position: "absolute", bottom: "-200px", right: "10%", width: "500px", height: "500px", background: "radial-gradient(circle, rgba(220, 38, 38, 0.1) 0%, transparent 70%)", borderRadius: "50%", filter: "blur(60px)", animation: "float 8s ease-in-out infinite 4s", pointerEvents: "none" }} />
      <div style={{ position: "absolute", top: "50%", right: "-100px", width: "400px", height: "400px", background: "radial-gradient(circle, rgba(220, 38, 38, 0.08) 0%, transparent 70%)", borderRadius: "50%", filter: "blur(60px)", pointerEvents: "none" }} />

      {/* Rotating rings */}
      <div style={{ position: "absolute", top: "50%", left: "50%", width: "900px", height: "900px", border: "1px solid rgba(220, 38, 38, 0.08)", borderRadius: "50%", animation: "rotate 35s linear infinite", pointerEvents: "none" }} />
      <div style={{ position: "absolute", top: "50%", left: "50%", width: "700px", height: "700px", border: "1px solid rgba(255, 255, 255, 0.03)", borderRadius: "50%", animation: "rotate 28s linear infinite reverse", pointerEvents: "none" }} />

      {/* Main container */}
      <div style={{ width: "100%", maxWidth: "560px", position: "relative", zIndex: 10 }}>
        {/* Logo section */}
        <div style={{ textAlign: "center", marginBottom: "32px" }}>
          <div style={{ display: "inline-flex", alignItems: "center", justifyContent: "center", width: "72px", height: "72px", background: "linear-gradient(135deg, #dc2626 0%, #991b1b 100%)", borderRadius: "18px", marginBottom: "20px", boxShadow: "0 20px 50px rgba(220, 38, 38, 0.3)", animation: "glow 3s ease-in-out infinite" }}>
            <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="1.5">
              <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" strokeLinecap="round" strokeLinejoin="round"/>
              <circle cx="9" cy="7" r="4" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M22 21v-2a4 4 0 0 0-3-3.87" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M16 3.13a4 4 0 0 1 0 7.75" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </div>
          <h1 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "36px", fontWeight: 600, color: "#ffffff", margin: 0, letterSpacing: "1px" }}>Create Account</h1>
          <p style={{ color: "rgba(255, 255, 255, 0.4)", marginTop: "10px", fontSize: "13px", letterSpacing: "2px", textTransform: "uppercase" }}>Start your journey with us</p>
        </div>

        {/* Card */}
        <div style={{ background: "linear-gradient(145deg, rgba(25, 25, 25, 0.95) 0%, rgba(15, 15, 15, 0.98) 100%)", borderRadius: "24px", padding: "36px", border: "1px solid rgba(255, 255, 255, 0.08)", boxShadow: "0 25px 80px rgba(0, 0, 0, 0.5), 0 0 40px rgba(220, 38, 38, 0.1)" }}>
          {/* Form */}
          <form onSubmit={handleSubmit}>
            {/* Profile Image Upload */}
            <div style={{ marginBottom: "28px" }}>
              <label style={{ display: "block", fontSize: "11px", fontWeight: 500, letterSpacing: "2px", textTransform: "uppercase", marginBottom: "12px", color: "rgba(255, 255, 255, 0.4)" }}>
                Profile Photo <span style={{ color: "rgba(255, 255, 255, 0.25)" }}>(Optional)</span>
              </label>
              
              <div style={{ display: "flex", alignItems: "center", gap: "20px" }}>
                {/* Avatar Preview */}
                <div style={{ position: "relative", width: "100px", height: "100px", flexShrink: 0 }}>
                  {imagePreview || formData.image ? (
                    <div style={{ position: "relative", width: "100%", height: "100%", borderRadius: "50%", overflow: "hidden", border: "3px solid rgba(220, 38, 38, 0.3)" }}>
                      <Image
                        src={imagePreview || formData.image}
                        alt="Profile preview"
                        fill
                        style={{ objectFit: "cover" }}
                      />
                      {uploading && (
                        <div style={{ position: "absolute", inset: 0, background: "rgba(0, 0, 0, 0.7)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                          <div style={{ width: "30px", height: "30px", border: "3px solid rgba(255, 255, 255, 0.2)", borderTopColor: "#ef4444", borderRadius: "50%", animation: "spin 1s linear infinite" }} />
                        </div>
                      )}
                      {/* Remove button */}
                      {!uploading && (
                        <button
                          type="button"
                          onClick={removeImage}
                          style={{ position: "absolute", top: "-4px", right: "-4px", width: "28px", height: "28px", background: "linear-gradient(135deg, #dc2626 0%, #991b1b 100%)", border: "2px solid #0a0a0a", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", transition: "transform 0.2s ease" }}
                          onMouseOver={(e) => e.currentTarget.style.transform = "scale(1.1)"}
                          onMouseOut={(e) => e.currentTarget.style.transform = "scale(1)"}
                        >
                          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2">
                            <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
                          </svg>
                        </button>
                      )}
                    </div>
                  ) : (
                    <div style={{ width: "100%", height: "100%", borderRadius: "50%", background: "linear-gradient(135deg, rgba(220, 38, 38, 0.2) 0%, rgba(220, 38, 38, 0.05) 100%)", border: "2px dashed rgba(220, 38, 38, 0.3)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                      <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="rgba(220, 38, 38, 0.4)" strokeWidth="1.5">
                        <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
                        <circle cx="12" cy="7" r="4"/>
                      </svg>
                    </div>
                  )}
                </div>

                {/* Upload Zone */}
                <div
                  onDragEnter={handleDrag}
                  onDragLeave={handleDrag}
                  onDragOver={handleDrag}
                  onDrop={handleDrop}
                  onClick={() => fileInputRef.current?.click()}
                  style={{
                    flex: 1,
                    padding: "20px",
                    background: dragActive ? "rgba(220, 38, 38, 0.1)" : "rgba(255, 255, 255, 0.02)",
                    border: dragActive ? "2px dashed rgba(220, 38, 38, 0.5)" : "2px dashed rgba(255, 255, 255, 0.1)",
                    borderRadius: "16px",
                    cursor: "pointer",
                    transition: "all 0.3s ease",
                    textAlign: "center",
                  }}
                  onMouseOver={(e) => {
                    if (!dragActive) {
                      e.currentTarget.style.borderColor = "rgba(220, 38, 38, 0.3)";
                      e.currentTarget.style.background = "rgba(220, 38, 38, 0.05)";
                    }
                  }}
                  onMouseOut={(e) => {
                    if (!dragActive) {
                      e.currentTarget.style.borderColor = "rgba(255, 255, 255, 0.1)";
                      e.currentTarget.style.background = "rgba(255, 255, 255, 0.02)";
                    }
                  }}
                >
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/jpeg,image/png,image/gif,image/webp"
                    onChange={handleFileChange}
                    style={{ display: "none" }}
                  />
                  <div style={{ width: "40px", height: "40px", background: "rgba(220, 38, 38, 0.15)", borderRadius: "10px", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 12px" }}>
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#ef4444" strokeWidth="2">
                      <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4" />
                      <polyline points="17 8 12 3 7 8" />
                      <line x1="12" y1="3" x2="12" y2="15" />
                    </svg>
                  </div>
                  <p style={{ color: "rgba(255, 255, 255, 0.6)", fontSize: "13px", marginBottom: "4px" }}>
                    <span style={{ color: "#ef4444", fontWeight: 500 }}>Click to upload</span> or drag & drop
                  </p>
                  <p style={{ color: "rgba(255, 255, 255, 0.3)", fontSize: "11px" }}>PNG, JPG, GIF or WebP (Max 5MB)</p>
                </div>
              </div>
            </div>

            {/* Two column grid for name and email */}
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "20px", marginBottom: "20px" }}>
              {/* Name field */}
              <div>
                <label htmlFor="name" style={labelStyle("name")}>Full Name <span style={{ color: "#ef4444" }}>*</span></label>
                <div style={{ position: "relative" }}>
                  <div style={{ position: "absolute", left: "16px", top: "50%", transform: "translateY(-50%)", color: focusedField === "name" ? "#ef4444" : "rgba(255, 255, 255, 0.3)", transition: "color 0.3s ease" }}>
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/>
                    </svg>
                  </div>
                  <input id="name" name="name" value={formData.name} onChange={handleChange} onFocus={() => setFocusedField("name")} onBlur={() => setFocusedField(null)} type="text" placeholder="John Doe" style={inputStyle("name", !!formErrors.name)} />
                </div>
                {formErrors.name && <p style={{ color: "#ef4444", fontSize: "12px", margin: "6px 0 0 0" }}>{formErrors.name}</p>}
              </div>

              {/* Email field */}
              <div>
                <label htmlFor="email" style={labelStyle("email")}>Email <span style={{ color: "#ef4444" }}>*</span></label>
                <div style={{ position: "relative" }}>
                  <div style={{ position: "absolute", left: "16px", top: "50%", transform: "translateY(-50%)", color: focusedField === "email" ? "#ef4444" : "rgba(255, 255, 255, 0.3)", transition: "color 0.3s ease" }}>
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/>
                    </svg>
                  </div>
                  <input id="email" name="email" value={formData.email} onChange={handleChange} onFocus={() => setFocusedField("email")} onBlur={() => setFocusedField(null)} type="email" placeholder="john@example.com" style={inputStyle("email", !!formErrors.email)} />
                </div>
                {formErrors.email && <p style={{ color: "#ef4444", fontSize: "12px", margin: "6px 0 0 0" }}>{formErrors.email}</p>}
              </div>
            </div>

            {/* Two column grid for password and phone */}
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "20px", marginBottom: "20px" }}>
              {/* Password field */}
              <div>
                <label htmlFor="password" style={labelStyle("password")}>Password <span style={{ color: "#ef4444" }}>*</span></label>
                <div style={{ position: "relative" }}>
                  <div style={{ position: "absolute", left: "16px", top: "50%", transform: "translateY(-50%)", color: focusedField === "password" ? "#ef4444" : "rgba(255, 255, 255, 0.3)", transition: "color 0.3s ease" }}>
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0110 0v4"/>
                    </svg>
                  </div>
                  <input id="password" name="password" value={formData.password} onChange={handleChange} onFocus={() => setFocusedField("password")} onBlur={() => setFocusedField(null)} type={showPassword ? "text" : "password"} placeholder="••••••••" style={inputStyle("password", !!formErrors.password)} />
                  <button type="button" onClick={() => setShowPassword(!showPassword)} style={{ position: "absolute", right: "16px", top: "50%", transform: "translateY(-50%)", background: "none", border: "none", cursor: "pointer", color: "rgba(255, 255, 255, 0.3)", padding: 0, display: "flex", alignItems: "center", justifyContent: "center" }}>
                    {showPassword ? (
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M17.94 17.94A10.07 10.07 0 0112 20c-7 0-11-8-11-8a18.45 18.45 0 015.06-5.94M9.9 4.24A9.12 9.12 0 0112 4c7 0 11 8 11 8a18.5 18.5 0 01-2.16 3.19m-6.72-1.07a3 3 0 11-4.24-4.24"/><line x1="1" y1="1" x2="23" y2="23"/></svg>
                    ) : (
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>
                    )}
                  </button>
                </div>
                {formErrors.password && <p style={{ color: "#ef4444", fontSize: "12px", margin: "6px 0 0 0" }}>{formErrors.password}</p>}
              </div>

              {/* Phone field */}
              <div>
                <label htmlFor="phone" style={labelStyle("phone")}>Phone <span style={{ color: "#ef4444" }}>*</span></label>
                <div style={{ position: "relative" }}>
                  <div style={{ position: "absolute", left: "16px", top: "50%", transform: "translateY(-50%)", color: focusedField === "phone" ? "#ef4444" : "rgba(255, 255, 255, 0.3)", transition: "color 0.3s ease" }}>
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07 19.5 19.5 0 01-6-6 19.79 19.79 0 01-3.07-8.67A2 2 0 014.11 2h3a2 2 0 012 1.72 12.84 12.84 0 00.7 2.81 2 2 0 01-.45 2.11L8.09 9.91a16 16 0 006 6l1.27-1.27a2 2 0 012.11-.45 12.84 12.84 0 002.81.7A2 2 0 0122 16.92z"/>
                    </svg>
                  </div>
                  <input id="phone" name="phone" value={formData.phone} onChange={handleChange} onFocus={() => setFocusedField("phone")} onBlur={() => setFocusedField(null)} type="tel" placeholder="+1 234 567 8900" style={inputStyle("phone", !!formErrors.phone)} />
                </div>
                {formErrors.phone && <p style={{ color: "#ef4444", fontSize: "12px", margin: "6px 0 0 0" }}>{formErrors.phone}</p>}
              </div>
            </div>

            {/* Address field - full width */}
            <div style={{ marginBottom: "24px" }}>
              <label htmlFor="address" style={labelStyle("address")}>Address <span style={{ color: "#ef4444" }}>*</span></label>
              <div style={{ position: "relative" }}>
                <div style={{ position: "absolute", left: "16px", top: "50%", transform: "translateY(-50%)", color: focusedField === "address" ? "#ef4444" : "rgba(255, 255, 255, 0.3)", transition: "color 0.3s ease" }}>
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z"/><circle cx="12" cy="10" r="3"/>
                  </svg>
                </div>
                <input id="address" name="address" value={formData.address} onChange={handleChange} onFocus={() => setFocusedField("address")} onBlur={() => setFocusedField(null)} type="text" placeholder="123 Main St, City, State, ZIP" style={inputStyle("address", !!formErrors.address)} />
              </div>
              {formErrors.address && <p style={{ color: "#ef4444", fontSize: "12px", margin: "6px 0 0 0" }}>{formErrors.address}</p>}
            </div>

            {/* Error message */}
            {errorMessage && (
              <div style={{ display: "flex", alignItems: "center", gap: "12px", padding: "14px", background: "rgba(220, 38, 38, 0.1)", border: "1px solid rgba(220, 38, 38, 0.2)", borderRadius: "12px", marginBottom: "24px" }}>
                <div style={{ width: "28px", height: "28px", background: "rgba(220, 38, 38, 0.2)", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#ef4444" strokeWidth="2"><circle cx="12" cy="12" r="10"/><line x1="15" y1="9" x2="9" y2="15"/><line x1="9" y1="9" x2="15" y2="15"/></svg>
                </div>
                <p style={{ color: "#ef4444", fontSize: "13px", margin: 0 }}>{errorMessage}</p>
              </div>
            )}

            {/* Submit button */}
            <button
              type="submit"
              disabled={isLoading || uploading}
              style={{
                width: "100%",
                padding: "16px",
                background: (isLoading || uploading) ? "rgba(220, 38, 38, 0.5)" : "linear-gradient(135deg, #dc2626 0%, #991b1b 100%)",
                border: "none",
                borderRadius: "12px",
                color: "#ffffff",
                fontSize: "15px",
                fontWeight: 600,
                fontFamily: "'Outfit', sans-serif",
                cursor: (isLoading || uploading) ? "not-allowed" : "pointer",
                transition: "all 0.3s ease",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: "10px",
                boxShadow: "0 10px 40px rgba(220, 38, 38, 0.3)",
              }}
              onMouseOver={(e) => { if (!isLoading && !uploading) { e.currentTarget.style.transform = "translateY(-2px)"; e.currentTarget.style.boxShadow = "0 20px 50px rgba(220, 38, 38, 0.4)"; } }}
              onMouseOut={(e) => { e.currentTarget.style.transform = "translateY(0)"; e.currentTarget.style.boxShadow = "0 10px 40px rgba(220, 38, 38, 0.3)"; }}
            >
              {isLoading ? (
                <>
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" style={{ animation: "spin 1s linear infinite" }}>
                    <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" opacity="0.25"/>
                    <path fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" opacity="0.75"/>
                  </svg>
                  Creating Account...
                </>
              ) : uploading ? (
                <>
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" style={{ animation: "spin 1s linear infinite" }}>
                    <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" opacity="0.25"/>
                    <path fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" opacity="0.75"/>
                  </svg>
                  Uploading Image...
                </>
              ) : (
                <>
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><line x1="19" y1="8" x2="19" y2="14"/><line x1="22" y1="11" x2="16" y2="11"/>
                  </svg>
                  Create Account
                </>
              )}
            </button>
          </form>

          {/* Divider */}
          <div style={{ display: "flex", alignItems: "center", gap: "16px", margin: "28px 0" }}>
            <div style={{ flex: 1, height: "1px", background: "linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.1), transparent)" }} />
            <span style={{ fontSize: "10px", color: "rgba(255, 255, 255, 0.25)", letterSpacing: "2px", textTransform: "uppercase" }}>Already registered?</span>
            <div style={{ flex: 1, height: "1px", background: "linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.1), transparent)" }} />
          </div>

          {/* Sign in link */}
          <Link href="/login" style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "10px", padding: "14px", border: "1px solid rgba(255, 255, 255, 0.1)", borderRadius: "12px", color: "rgba(255, 255, 255, 0.6)", fontSize: "14px", fontWeight: 500, textDecoration: "none", transition: "all 0.3s ease" }}
            onMouseOver={(e) => { e.currentTarget.style.borderColor = "rgba(220, 38, 38, 0.5)"; e.currentTarget.style.color = "#ffffff"; e.currentTarget.style.background = "rgba(220, 38, 38, 0.1)"; }}
            onMouseOut={(e) => { e.currentTarget.style.borderColor = "rgba(255, 255, 255, 0.1)"; e.currentTarget.style.color = "rgba(255, 255, 255, 0.6)"; e.currentTarget.style.background = "transparent"; }}
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4"/><polyline points="10 17 15 12 10 7"/><line x1="15" y1="12" x2="3" y2="12"/></svg>
            Sign In to Your Account
          </Link>
        </div>

        {/* Footer */}
        <p style={{ textAlign: "center", color: "rgba(255, 255, 255, 0.25)", fontSize: "12px", marginTop: "24px", letterSpacing: "0.5px" }}>
          By creating an account, you agree to our{" "}
          <a href="#" style={{ color: "rgba(220, 38, 38, 0.7)", textDecoration: "none" }}>Terms of Service</a>{" "}and{" "}
          <a href="#" style={{ color: "rgba(220, 38, 38, 0.7)", textDecoration: "none" }}>Privacy Policy</a>
        </p>

        {/* Trust badges */}
        <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "24px", marginTop: "32px" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "6px", color: "rgba(255, 255, 255, 0.2)" }}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0110 0v4"/></svg>
            <span style={{ fontSize: "11px", letterSpacing: "1px" }}>Secure</span>
          </div>
          <div style={{ width: "1px", height: "10px", background: "rgba(255, 255, 255, 0.1)" }} />
          <div style={{ display: "flex", alignItems: "center", gap: "6px", color: "rgba(255, 255, 255, 0.2)" }}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>
            <span style={{ fontSize: "11px", letterSpacing: "1px" }}>Protected</span>
          </div>
          <div style={{ width: "1px", height: "10px", background: "rgba(255, 255, 255, 0.1)" }} />
          <div style={{ display: "flex", alignItems: "center", gap: "6px", color: "rgba(255, 255, 255, 0.2)" }}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M22 11.08V12a10 10 0 11-5.93-9.14"/><path d="M22 4L12 14.01l-3-3"/></svg>
            <span style={{ fontSize: "11px", letterSpacing: "1px" }}>Verified</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Reg;