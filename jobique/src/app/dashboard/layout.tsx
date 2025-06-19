"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import "../../globals.css";
import Navbar from "@/components/Navbar";

const navItems = [
  { href: "/dashboard/jobs", label: "Jobs" },
  { href: "/dashboard/goals", label: "Goals" },
  { href: "/dashboard/stats", label: "Stats" },
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

      <div className="flex flex-1">
        {/* Sidebar */}
        <aside className="w-44 bg-gray-100 fixed top-18 left-0 h-screen p-6 space-y-4 shadow-md">
          <nav className="flex flex-col space-y-2">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={`px-4 py-2 rounded-md hover:bg-blue-100 ${
                  pathname === item.href
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
        <main className="flex-1 ml-38 p-8 overflow-y-auto w-full">{children}</main>
      </div>
    </div>
  );
}
