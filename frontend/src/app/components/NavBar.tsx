import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";

const NavBar = () => {
  const router = useRouter();

  const handleLogout = () => {
    localStorage.removeItem("access_token");
    router.push("/login");
  };

  return (
    <nav
      className="z-10 flex items-center justify-between py-2 px-5 border-b-1 bg-nav border-light-foreground"
    >
      <div className="flex items-center gap-10">
        <Link href="/" aria-label="Home">
          <Image src="/memsheets-icon.svg" alt="Memsheets logo" width={50} height={50} className="hover:brightness-110 hover-animation" />
        </Link>
        <Link href="/groups" className="nav-link hover-animation">
          Groups
        </Link>
      </div>
      <button onClick={handleLogout} className="nav-link hover-animation">
        Logout
      </button>
    </nav>
  );
}

export default NavBar;