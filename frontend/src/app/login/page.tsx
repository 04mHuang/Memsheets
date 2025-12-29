"use client";

import React, { useState } from "react";
import { FcGoogle } from "react-icons/fc";
import Link from "next/link";
import Image from "next/image";
import axios from "axios";
import { useRouter } from "next/navigation";

const Login = () => {
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();
  
  const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);
    
    const formData = new FormData(e.currentTarget);
    const email = formData.get('email') as string;
    const password = formData.get('password') as string;
    
    try {
      await axios.post('/api/users/login', { email, password });
      localStorage.setItem("auth_method", "password");
      router.push('/');
    } catch (err: any) {
      if (err.response?.status === 401) {
        setError('Invalid email or password');
      } else {
        setError('An error occurred. Please try again.');
      }
    }
  };

  const handleGoogleLogin = () => {
    localStorage.setItem("auth_method", "google");
    // Redirect directly to the OAuth endpoint
    window.open("/api/users/login-google", "_self");
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
        <form onSubmit={handleLogin} className="flex flex-col" >
          <input
            type="email"
            name="email"
            autoComplete="email"
            aria-label="Email"
            placeholder="Email"
            className="account-input"
            required
          />
          <input
            type="password"
            name="password"
            autoComplete="current-password"
            aria-label="Password"
            placeholder="Password"
            className="account-input"
            required
          />
          {error && <p className="error">{error}</p>}
          <button type="submit" className="account-input account-button hover-animation">
            Login
          </button>
          <p className="text-center mt-5">or</p>
          <button type="button" onClick={handleGoogleLogin} className="account-input flex justify-center items-center gap-5 hover-animation hover:cursor-pointer hover:bg-support/[0.3]">
            <FcGoogle />
            Login with Google
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