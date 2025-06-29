"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";

const Signup = () => {
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    confirmPassword: ""
  });
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const router = useRouter();

  const validateForm = () => {
    // Disallow form inputs of only whitespace
    for (const key in formData) {
      // Check key is valid for formData
      if (formData[key as keyof typeof formData].trim() === "") {
        setErrors(prev => ({ ...prev, [key]: "This field is required and cannot just be spaces." }));
        return false;
      } else {
        setErrors(prev => ({ ...prev, [key]: "" })); // Clear error for this field
      }
    }
    // Checks for password fields
    if (formData.password.length < 8) {
      setErrors(prev => ({ ...prev, password: "Password must be at least 8 characters long." }));
      return false;
    }
    if (formData.password !== formData.confirmPassword) {
      setErrors(prev => ({ ...prev, confirmPassword: "Passwords do not match." }));
      return false;
    }
    return true;
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  // TODO: remove console.error and log
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!validateForm()) return;
    try {
      const response = await axios.post("/api/signup", formData);
      console.log("Signup successful:", response.data);
      // Clear errors before redirecting in case of slow loading
      setErrors({});
      router.push("/login");
    } catch (error) {
      if (axios.isAxiosError(error) && error.response?.data?.error === "Email in use") {
        setErrors(prev => ({ ...prev, email: "Email is in use. Please use a different email."}));
      }
      console.error("Signup error:", error);
    }
  };

  return (
    <div>
      <form method="POST" onSubmit={handleSubmit} className="flex flex-col" >
        <label className="step-1">
          Username
          <br />
          <input type="text" onChange={handleChange} name="username" required />
        </label>
        {errors.username && <p className="error">{errors.username}</p>}
        <label className="step-2">
          Email
          <br />
          <input type="email" onChange={handleChange} name="email" required />
        </label>
        {errors.email && <p className="error">{errors.email}</p>}
        <label className="step-3">
          Password
          <br />
          <input type="password" onChange={handleChange} name="password" required />
        </label>
        {errors.password && <p className="error">{errors.password}</p>}
        <label className="step-4">
          Confirm Password
          <br />
          <input type="password" onChange={handleChange} name="confirmPassword" required />
        </label>
        {errors.confirmPassword && <p className="error">{errors.confirmPassword}</p>}
        <button type="submit" className="step-5">Sign up</button>
      </form>
    </div>
  );
}
export default Signup;