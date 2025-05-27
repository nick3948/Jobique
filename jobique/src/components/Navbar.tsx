"use client";
import { UserButton } from "@clerk/nextjs";

export default function Navbar() {
  return (
    <nav className="w-full bg-blue-400 shadow-sm px-6 py-5 flex justify-between items-center">
      <a href="#"><span className="text-lg font-bold text-black-900">Jobique</span></a> 
      <UserButton afterSignOutUrl="/" />
    </nav>
  );
}