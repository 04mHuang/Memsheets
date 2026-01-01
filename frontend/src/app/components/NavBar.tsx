import Link from "next/link";
import Image from "next/image";
import { useRouter, usePathname } from "next/navigation";
import { useState, useEffect } from "react";
import { FaSearch } from "react-icons/fa";
import axiosInstance from "@/app/axiosInstance";

const NavBar = () => {
  const router = useRouter();
  const [search, setSearch] = useState("");

  const handleSearch = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (search.trim() === "") return;

    try {
      // Global search across groups, sheets, and events
      const res = await axiosInstance.get(`/search?q=${encodeURIComponent(search)}`);
      // Navigate to search results page with results in state
      router.push(`/search?q=${encodeURIComponent(search)}&results=${encodeURIComponent(JSON.stringify(res.data.results))}`);
    } catch (error) {
      console.error(error);
    }
  };

  const handleLogout = async () => {
    try {
      await axiosInstance.post("/users/logout", {}, { withCredentials: true });
      // Clear any client-side storage
      document.cookie = "access_token_cookie=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
      document.cookie = "csrf_access_token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
      localStorage.removeItem("auth_method");
    }
    catch (error) {
      console.error(error);
    }
    router.push("/login");
  };

  return (
    <nav
      className="z-10 flex items-center justify-between py-2 px-8 border-b-2 bg-nav border-light-foreground"
    >
      <div className="flex items-center gap-5">
        <Link href="/" aria-label="Home">
          <Image src="/memsheets-icon.svg" alt="Memsheets logo" width={50} height={50} className="hover:brightness-110 hover-animation" />
        </Link>
        <Link href="/" className="nav-link hover-animation">
          Calendar
        </Link>
        <Link href="/groups" className="nav-link hover-animation">
          Groups
        </Link>
      </div>
      <form onSubmit={handleSearch} className="flex items-center flex-1 mx-10">
        <input
          type="search"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search groups, sheets, events..."
          className="border py-1 px-3 rounded-tl-full rounded-bl-full text-dark-support bg-background border-light-foreground focus:outline-none focus:ring-1 focus:ring-foreground flex-1"
        />
        <button type="submit" className="py-2 px-4 bg-light-foreground border border-foreground rounded-tr-full rounded-br-full text-nav hover:bg-accent hover:cursor-pointer hover-animation">
          <FaSearch />
        </button>
      </form>

      <button onClick={handleLogout} className="nav-link hover-animation">
        Logout
      </button>
    </nav>
  );
}

export default NavBar;