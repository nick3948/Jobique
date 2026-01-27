"use client";

import Link from "next/link";
import { UserButton, useUser } from "@clerk/nextjs";
import { Briefcase } from "lucide-react";
import { usePathname } from "next/navigation";

export default function Navbar() {
  const { isSignedIn } = useUser();
  const pathname = usePathname();

  return (
    <nav className="glass-header fixed top-0 left-0 w-full z-50 transition-all duration-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo Section */}
          <Link href="/" className="flex items-center gap-2 group">
            <div className="bg-blue-600 p-1.5 rounded-lg text-white shadow-md group-hover:scale-105 transition-transform">
              <Briefcase className="w-5 h-5" />
            </div>
            <span className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-gray-900 to-gray-700 font-sans tracking-tight">
              Jobique
            </span>
          </Link>

          {/* Right Side Actions */}
          <div className="flex items-center gap-4">
            {isSignedIn && pathname === "/" && (
              <Link
                href="/dashboard"
                className="hidden md:block text-sm font-medium text-gray-600 hover:text-blue-600 transition-colors"
              >
                Dashboard
              </Link>
            )}
            <UserButton
              afterSignOutUrl="/"
              appearance={{
                elements: {
                  avatarBox: "w-9 h-9 border-2 border-white shadow-sm hover:shadow-md transition-shadow"
                }
              }}
            />
          </div>
        </div>
      </div>
    </nav>
  );
}