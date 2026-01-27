"use client";

import Link from "next/link";
import Image from "next/image";
import { UserButton, useUser } from "@clerk/nextjs";
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
            <Image
              src="/images/logo_main.png"
              alt="Jobique Logo"
              width={120}
              height={40}
              className="h-10 w-auto object-contain"
              priority
            />
          </Link>

          {/* Right Side Actions */}
          <div className="flex items-center gap-4">
            <Link
              href="/about"
              className="text-sm font-medium text-gray-600 hover:text-blue-600 transition-colors mr-2"
            >
              About
            </Link>
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