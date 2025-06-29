"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";

const Login = () => {
  const [formData, setFormData] = useState({
    email: "",
    password: ""
  })
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({...formData, [name]: value});
  }
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      const response = await axios.post("/api/login", formData);
      // Clear errors before redirecting in case of slow loading
      setError(null);
      localStorage.setItem("token", response.data.token);
      router.push("/sheets");
    }
    catch {
      setError("Invalid email or password.");
    }
  }

  return (
    <div>
      <form method="POST" onSubmit={handleSubmit} className="flex flex-col" >
        <label className="step-1">
          Email
          <br />
          <input type="email" onChange={handleChange} name="email" required />
        </label>
        <label className="step-2">
          Password
          <br />
          <input type="password" onChange={handleChange} name="password" required />
        </label>
        {error && <p>{error}</p>}
        <button type="submit" className="step-3">Login</button>
      </form>
    </div>
  );
}
export default Login;