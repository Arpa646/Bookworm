"use client";

import React, { useState, useEffect } from "react";
import {
  useGetSingleUserQuery,
  useUpdateUserProfileMutation,
} from "@/GlobalRedux/api/api";
import { useUser } from "@/services";

const UserProfileUpdate: React.FC = () => {
  // Get the userId from the service
  const { userId } = useUser();
  interface ErrorResponse {
    data?: {
      message?: string;
    };
    error?: string;
  }
  // Fetch the user's profile data
  const {
    data: userProfile1,
    isLoading: isFetchingProfile,
    isError,
  } = useGetSingleUserQuery(userId);
  console.log(userProfile1?.data);

const userProfile=userProfile1?.data;
  // Update mutation hook
  const [updateUser, { isLoading: isUpdating }] =
    useUpdateUserProfileMutation();

  // Form state management
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    address: "",
  });

  // Local state to handle validation errors
  const [formErrors, setFormErrors] = useState({
    name: "",
    email: "",
    phone: "",
    address: "",
  });

  // Local state to handle general error messages
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // When user profile is fetched, populate the form
  useEffect(() => {
    if (userProfile) {
      setFormData({
        name: userProfile.name,
        email: userProfile.email,
        phone: userProfile.phone,
        address: userProfile.address,
      });
    }
  }, [userProfile]);

  // Handle form input changes
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setFormErrors({ ...formErrors, [e.target.name]: "" }); // Clear the error when the user types
  };

  // Validation function
  const validateForm = () => {
    let isValid = true;
    const errors = {
      name: "",
      email: "",
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

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
  
    if (!validateForm()) return;
  
    try {
      setErrorMessage(null); // Reset error message before submission
      await updateUser({ userId, ...formData }).unwrap(); // Send updated form data to backend
      alert("User profile updated successfully!");
    } catch (err) {
      const error = err as ErrorResponse; // Type assertion to use ErrorResponse interface
  
      // Check the error response and display appropriate error message
      if (error?.data?.message) {
        setErrorMessage(error.data.message);
      } else if (error?.error) {
        setErrorMessage(error.error);
      } else {
        setErrorMessage("Failed to update profile. Please try again.");
      }
    }
  };
  

  return (
    <div className="bg-white pt-6 min-lg:h-[900px] shadow-xl lg:w-[800px] sm:w-[500px] md:w-[700px] mx-auto p-4">
      {isFetchingProfile ? (
        <p>Loading profile...</p>
      ) : isError ? (
        <p>Error fetching profile data.</p>
      ) : (
        <form onSubmit={handleSubmit}>
          <div className="divider"></div>
          <div className="space-y-6 w-full flex flex-col items-center">
            <h1 className="text-2xl font-medium" style={{ color: "#4F5C6E" }}>
              Update Your Profile
            </h1>

            {/* Name Input */}
            <div className="w-full lg:w-[500px] flex flex-col items-center">
              <div className="space-y-2 w-full">
                <h1 className="text-sm text-start">
                  PLEASE ENTER YOUR NAME
                  <span style={{ color: "red" }}>* </span>
                </h1>
                <input
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  style={{ border: "1px solid #A4B0B1", borderRadius: "4px" }}
                  type="text"
                  placeholder="Your name"
                  className="hover:border-sky-700 input-bordered p-2 h-9 w-full"
                />
                {formErrors.name && (
                  <p className="text-red-600">{formErrors.name}</p>
                )}
              </div>
            </div>

            {/* Email Input */}
            <div className="w-full lg:w-[500px] flex flex-col items-center">
              <div className="space-y-2 w-full">
                <h1 className="text-sm text-start">
                  PLEASE ENTER YOUR EMAIL
                  <span style={{ color: "red" }}>* </span>
                </h1>
                <input
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  style={{ border: "1px solid #A4B0B1", borderRadius: "4px" }}
                  type="email"
                  placeholder="Your email"
                  className="hover:border-sky-700 input-bordered p-2 h-9 w-full"
                />
                {formErrors.email && (
                  <p className="text-red-600">{formErrors.email}</p>
                )}
              </div>
            </div>

            {/* Phone Number Input */}
            <div className="w-full lg:w-[500px] flex flex-col items-center">
              <div className="space-y-2 w-full">
                <h1 className="text-sm text-start">
                  PLEASE ENTER YOUR PHONE NUMBER
                  <span style={{ color: "red" }}>* </span>
                </h1>
                <input
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  style={{ border: "1px solid #A4B0B1", borderRadius: "4px" }}
                  type="tel"
                  placeholder="Your phone number"
                  className="hover:border-sky-700 input-bordered p-2 h-9 w-full"
                />
                {formErrors.phone && (
                  <p className="text-red-600">{formErrors.phone}</p>
                )}
              </div>
            </div>

            {/* Address Input */}
            <div className="w-full lg:w-[500px] flex flex-col items-center">
              <div className="space-y-2 w-full">
                <h1 className="text-sm text-start">
                  PLEASE ENTER YOUR ADDRESS
                  <span style={{ color: "red" }}>* </span>
                </h1>
                <input
                  name="address"
                  value={formData.address}
                  onChange={handleChange}
                  style={{ border: "1px solid #A4B0B1", borderRadius: "4px" }}
                  type="text"
                  placeholder="Your address"
                  className="hover:border-sky-700 input-bordered p-2 h-9 w-full"
                />
                {formErrors.address && (
                  <p className="text-red-600">{formErrors.address}</p>
                )}
              </div>
            </div>

            {/* Submit Button */}
            <div className="w-full lg:w-[500px] flex flex-col items-center">
              <div className="relative w-full">
                <input
                  type="submit"
                  value={isUpdating ? "Updating..." : "Update Profile"}
                  disabled={isUpdating}
                  className="input hover:bg-sky-500 h-9 font-semibold text-white w-full pl-10"
                  style={{
                    backgroundColor: "#3CB95D",
                    borderRadius: "4px",
                  }}
                />
              </div>
            </div>

            {/* Error Message */}
            {errorMessage && (
              <p className="text-red-600 w-full lg:w-[500px] text-center">
                {errorMessage}
              </p>
            )}
          </div>
        </form>
      )}
    </div>
  );
};

export default UserProfileUpdate;
