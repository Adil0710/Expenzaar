"use client";
import React from "react";
import LoaderLogo from "./loader";
import { ModeToggle } from "@/app/components/mode-toggle";
import Link from "next/link";
import { Button } from "./ui/button";
import { signOut, useSession } from "next-auth/react";
import { usePathname } from "next/navigation";

function Navbar() {
  const session = useSession();
  const pathname = usePathname();

  if (pathname.startsWith("/dashboard")) {
    return <div></div>;
  }

  return (
    <nav className=" flex justify-between items-center py-2 px-5 bg-white/20 backdrop-blur-xs text-black fixed w-full  dark:bg-black/20 dark:text-white">
      <LoaderLogo />
      <div>
        <Link href="/signin" className="">
          Sign In
        </Link>
        <ModeToggle />
        {session.data && <Button onClick={() => signOut()}>Log Out</Button>}
      </div>
    </nav>
  );
}

export default Navbar;
