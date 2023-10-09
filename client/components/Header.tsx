"use client";
import Link from "next/link";
import { MdOutlineEditNote } from "react-icons/md";
import { FaSun, FaMoon } from "react-icons/fa";
import { Navbar, NavbarBrand, NavbarItem } from "@nextui-org/react";
import { useAuth } from "@/hooks/useAuth";
import { useTheme } from "next-themes";
import { useState, useEffect } from "react";
import UserMenu from "./UserMenu";

const Header = () => {
  const [mounted, setMounted] = useState(false);
  const { isAuthenticated } = useAuth();
  const { theme, setTheme } = useTheme();

  console.log(theme);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  return (
    <Navbar
      className={`w-full h-[3rem] bg-purple-600 absolute top-0 left-0 items-center text-white duration-200 ${
        theme === "dark" && "bg-purple-950"
      }`}
    >
      <NavbarBrand>
        <Link className="uppercase text-3xl font-semibold" href="/">
          posts
        </Link>
      </NavbarBrand>
      <NavbarItem>
        <Link className="flex items-center gap-1" href="/create">
          <MdOutlineEditNote size={20} />
          New Post
        </Link>
      </NavbarItem>
      <NavbarItem>
        {isAuthenticated ? (
         <UserMenu />
        ) : (
          <Link href="/login">Login</Link>
        )}
      </NavbarItem>
      <div className="cursor-pointer">
        {theme === "light" && (
          <FaSun
            className="text-white"
            size={21}
            onClick={() => setTheme("dark")}
          />
        )}
        {theme === "dark" && (
          <FaMoon size={21} onClick={() => setTheme("light")} />
        )}
      </div>
    </Navbar>
  );
};

export default Header;
