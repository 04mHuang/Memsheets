"use client";

import { usePathname } from "next/navigation";
import NavBar from "./NavBar";

interface PageLayoutProps {
  children: React.ReactNode;
}

const PageLayout = ({ children }: PageLayoutProps) => {
  const pathname = usePathname();

  const isAuthPage = pathname.includes("login") || pathname.includes("signup");

  return (
    <div>
      {!isAuthPage && <NavBar />}
      {children}
    </div>
  );
}
export default PageLayout;