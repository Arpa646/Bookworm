"use client"; // Ensures this is a client component in Next.js

import GoogleLoginBtn from "../components/page/shared/GoogleLoginBtn";
import React, { useState, ChangeEvent, FormEvent } from "react";
// Use Next.js router instead of useNavigate


import { useForgottenPassMutation } from "@/GlobalRedux/api/api";
import Link from "next/link"; // Next.js Link for navigation




interface LoginForm {
  email: string;
  password: string;
}

const LoginPage: React.FC = () => {

  const [forgotPass] = useForgottenPassMutation();

  
  const [formData, setFormData] = useState<LoginForm>({
    email: "mdbadol290@gmail.com",
    password: "user",
  });

  const [, setErrorMessage] = useState<string>("");

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setErrorMessage(""); // Reset error message


      await forgotPass(formData).unwrap(); // Ensure type safety with 'unwrap'

  }

 

  return (
    <div className="bg-white pt-6 p-10 min-lg:h-[900px] shadow-xl lg:w-[700px] sm:w-[500px] md:w-[700px] mx-auto">
      <div className="divider"></div>
      <GoogleLoginBtn />
      <form
        onSubmit={handleSubmit}
        className="space-y-6 w-full flex flex-col items-center"
      >
        <h1 className="text-2xl font-medium" style={{ color: "#4F5C6E" }}>
      Send a email recovery pass
        </h1>

        <div className="flex flex-col items-center space-y-5 w-full">
          <div className="w-full lg:w-[500px] flex flex-col items-center">
            <div className="space-y-2 w-full">
              <h1 className="text-sm">
                PLEASE ENTER YOUR EMAIL
                <span style={{ color: "red" }}>*</span>
              </h1>
              <div className="relative w-full">
                <input
                  style={{ border: "1px solid #A4B0B1", borderRadius: "4px" }}
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="Type here"
                  className="hover:border-sky-700 input-bordered h-9 w-full pl-10"
                  required
                />
              </div>
            </div>
          </div>

        

          <div className="w-full lg:w-[500px] flex flex-col items-center">
            <div className="relative w-full">
              <button
                type="submit"
                style={{ backgroundColor: "#3CB95D", borderRadius: "4px" }}
                className="input hover:bg-sky-500 h-9 font-semibold text-white w-full pl-10"
              >
                Log In
              </button>
            </div>
          </div>

          <Link  href="/forgottenPass" >
            <h3 style={{ color: "#0088FF", borderRadius: "4px" }}>
              Recover your password
            </h3>
          </Link>
          <div>-OR-</div>
          <div className="w-full flex flex-col items-center">
            <div className="relative w-full text-center">
              <Link
                className="text-xs font-bold underline underline-offset-4"
                href="/signup" // Changed to Next.js 'Link' component
                style={{ color: "#3CB95D" }}
              >
                CREATE ACCOUNT ON ESCROW.COM
              </Link>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
};

export default LoginPage;
