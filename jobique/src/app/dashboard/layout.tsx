"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import "../../globals.css";
import Navbar from "@/components/Navbar";

const navItems = [
  { href: "/dashboard/jobs", label: "Jobs" },
  { href: "/dashboard/resources", label: "Resources" },
  // { href: "/dashboard/goals", label: "Goals" },
  // { href: "/dashboard/stats", label: "Stats" },
  { href: "/dashboard/settings", label: "Settings" },
];

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />

      <div className="flex flex-1 relative">
        {/* Mobile Warning Overlay */}
        <div className="md:hidden fixed inset-0 z-[60] bg-white flex flex-col items-center justify-center p-8 text-center">
          <div className="w-16 h-16 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center mb-6">
            <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="20" height="14" x="2" y="3" rx="2" /><line x1="8" x2="16" y1="21" y2="21" /><line x1="12" x2="12" y1="17" y2="21" /></svg>
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-3">Desktop Experience</h2>
          <p className="text-gray-600 max-w-sm">
            For the best experience, please access the Jobique Dashboard on your laptop or desktop computer.
          </p>
        </div>

        {/* Sidebar */}
        <aside className="hidden md:block w-44 bg-gray-100 fixed top-18 left-0 h-screen p-6 space-y-4 shadow-md">
          <nav className="flex flex-col space-y-2">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={`px-4 py-2 rounded-md hover:bg-blue-100 ${pathname === item.href
                  ? "bg-blue-200 text-blue-700 font-semibold"
                  : ""
                  }`}
              >
                {item.label}
              </Link>
            ))}
          </nav>
        </aside>

        {/* Main Content */}
        <main className="flex-1 ml-0 md:ml-44 p-8 overflow-y-auto w-full">
          {children}
        </main>
      </div>
    </div>
  );
}
