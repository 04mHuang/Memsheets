import Link from "next/link";
import Image from "next/image";
import { FaSearch } from "react-icons/fa";

const NavBar = () => {

  return (
    <nav
      className="flex items-center justify-between py-2 px-5 border-b-1 bg-nav border-light-foreground"
    >
      <div className="flex items-center gap-10">
        <Link href="/" aria-label="Home">
          <Image src="/memsheets-icon.svg" alt="Memsheets logo" width={50} height={50} className="hover:brightness-110 transition-all duration-200 ease-in-out" />
        </Link>
        <Link href="/groups" className="nav-link hover-animation">
          Groups
        </Link>
      </div>
      <div className="relative">
        <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-light-foreground" />
        <input
          type="text"
          placeholder="Search..."
          className="w-xl border-1 py-1 pl-10 pr-4 rounded-xl text-dark-support bg-background border-light-foreground focus:outline-none focus:ring-1 focus:ring-foreground"
        />
      </div>
      {/* TODO: add non-arbitrary conditional */}
      {1 === 1 ?
        <div className="space-x-4">
          <Link href="/signup" className="nav-link hover-animation">Sign up</Link>
          <Link href="/login" className="nav-link hover-animation">Login</Link>
        </div>
        :
        <Link href="/" className="nav-link hover-animation">
          Profile
        </Link>
      }
    </nav>
  );
}

export default NavBar;