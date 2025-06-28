"use client";

import { useState } from "react";
import axios from "axios";

const Signup = () => {
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    confirmPassword: ""
  });
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (formData.password !== formData.confirmPassword) {
      console.error("Passwords do not match");
      return;
    }
    try {
      const response = await axios.post("/api/signup", formData);
      console.log("Signup successful:", response.data);
    } catch (error) {
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
        <label className="step-2">
          Email
          <br />
          <input type="email" onChange={handleChange} name="email" required />
        </label>
        <label className="step-3">
          Password
          <br />
          <input type="password" onChange={handleChange} name="password" required />
        </label>
        <label className="step-4">
          Confirm Password
          <br />
          <input type="password" onChange={handleChange} name="confirmPassword" required />
        </label>
        <button type="submit" className="step-5">Sign up</button>
      </form>
    </div>
  );
}
export default Signup;