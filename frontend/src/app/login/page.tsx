"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
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
    setFormData({ ...formData, [name]: value });
  }
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      const response = await axios.post("/api/users/login", formData);
      // Clear errors before redirecting in case of slow loading
      setError(null);
      localStorage.setItem("token", response.data.token);
      router.push("/groups");
    }
    catch {
      setError("Invalid email or password.");
    }
  }

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
        <h2 className="my-8 text-3xl font-bold">Login</h2>
        <form method="POST" onSubmit={handleSubmit} className="flex flex-col" >
          <input
            type="email"
            onChange={handleChange}
            name="email"
            aria-label="Email"
            placeholder="Email"
            className="account-input"
            required
          />
          <input
            type="password"
            onChange={handleChange}
            name="password"
            aria-label="Password"
            placeholder="Password"
            className="account-input"
            required
          />
          {error && <p className="error">{error}</p>}
          <button type="submit" className="account-input account-button hover-animation">
            Login
          </button>
          <div className="flex justify-center mt-8 gap-1">
            <p>New to Memsheets?</p>
            <Link href="/signup" className="underline text-dark-support hover:text-accent hover-animation">Sign up</Link>
          </div>
        </form>
      </section>
    </div>
  );
}
export default Login;