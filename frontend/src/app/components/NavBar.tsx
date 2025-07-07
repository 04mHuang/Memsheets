"use client";

import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { FaSearch } from "react-icons/fa";
import { useRouter } from "next/navigation";

const NavBar = () => {
  const router = useRouter();
  const [search, setSearch] = useState("");

  const handleLogout = () => {
    localStorage.removeItem("token");
    router.push("/login");
  };
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = e.target;
    setSearch(value);
  }
  const handleSearch = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    console.log("searching");
  }

  return (
    <nav
      className="flex items-center justify-between py-2 px-5 border-b-1 bg-nav border-light-foreground"
    >
      <div className="flex items-center gap-10">
        <Link href="/" aria-label="Home">
          <Image src="/memsheets-icon.svg" alt="Memsheets logo" width={50} height={50} className="hover:brightness-110 hover-animation" />
        </Link>
        <Link href="/groups" className="nav-link hover-animation">
          Groups
        </Link>
      </div>
      <form method="GET" onSubmit={handleSearch} className="relative">
        <button type="submit" className="hover:cursor-pointer">
          <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-light-foreground" />
        </button>
        <input
          type="search"
          name="search"
          onChange={handleChange}
          placeholder="Search..."
          className="w-xl border-1 py-1 pl-10 pr-4 rounded-xl text-dark-support bg-background border-light-foreground focus:outline-none focus:ring-1 focus:ring-foreground"
        />

      </form>
      <button onClick={handleLogout} className="nav-link hover-animation">
        Logout
      </button>
    </nav>
  );
}

export default NavBar;