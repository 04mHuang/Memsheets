"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
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

    // Checks for length of fields (limits set by database schema)
    if (formData.username.length > 50) {
      setErrors(prev => ({ ...prev, username: "Username must be 50 characters or less." }));
      return false;
    }
    if (formData.email.length > 100) {
      setErrors(prev => ({ ...prev, email: "Email must be 100 characters or less." }));
      return false;
    }
    if (formData.password.length > 255) {
      setErrors(prev => ({ ...prev, password: "Password must be 255 characters or less." }));
      return false;
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

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!validateForm()) return;
    try {
      // Remove trailing whitespace from username and email fields
      const trimmedData = {
        ...formData,
        username: formData.username.trim(),
        email: formData.email.trim()
      }
      await axios.post("/api/signup", trimmedData);
      // Clear errors before redirecting in case of slow loading
      setErrors({});
      router.push("/login");
    } catch (error) {
      if (axios.isAxiosError(error) && error.response?.data?.error === "Email in use") {
        setErrors(prev => ({ ...prev, email: "Email is in use. Please use a different email." }));
      }
    }
  };

  return (
    <div className="account-page">
      <section className="account-sections">
        <div className="sheet-photo">
          <Image src="/welcome.png" alt="" width={500} height={500} />
        </div>
      </section>
      <section className="account-sections account-form-section">
        <div className="flex items-center">
          <Image src="/memsheets-icon.svg" alt="Memsheets logo" width={70} height={70} className="hover:brightness-110 hover-animation" />
          <h1 className="text-2xl">
            <b className="text-accent">Mem</b>sheets
          </h1>
        </div>
        <h2 className="my-8 text-3xl font-bold">Sign up</h2>
        <form method="POST" onSubmit={handleSubmit} className="flex flex-col" >
          <input
            type="text"
            onChange={handleChange}
            name="username"
            aria-label="Username"
            placeholder="Username"
            className="account-input"
            required
          />
          {errors.username && <p className="error">{errors.username}</p>}
          <input
            type="email"
            onChange={handleChange}
            name="email"
            aria-label="Email"
            placeholder="Email"
            className="account-input"
            required
          />
          {errors.email && <p className="error">{errors.email}</p>}
          <input
            type="password"
            onChange={handleChange}
            name="password"
            aria-label="Password"
            placeholder="Password"
            className="account-input"
            required
          />
          {errors.password && <p className="error">{errors.password}</p>}
          <input
            type="password"
            onChange={handleChange}
            name="confirmPassword"
            aria-label="Confirm Password"
            placeholder="Confirm Password"
            className="account-input"
            required
          />
          {errors.confirmPassword && <p className="error">{errors.confirmPassword}</p>}
          <button type="submit" className="account-input account-button hover-animation">
            Sign up
          </button>
          <div className="flex justify-center mt-8 gap-1">
            <p>Already have an account?</p>
            <Link href="/login" className="underline text-dark-support hover:text-accent hover-animation">Login</Link>
          </div>
        </form>
      </section>
    </div>
  );
}
export default Signup;