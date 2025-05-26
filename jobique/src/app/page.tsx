"use client";

import {
  SignedIn,
  SignedOut,
  SignInButton,
  SignUpButton,
  UserButton,
} from "@clerk/nextjs";
import Link from "next/link";

export default function Home() {
  return (
    <main className="flex flex-col items-center justify-center min-h-screen px-4 py-8 text-center">
      <h1 className="text-4xl font-bold mb-6">Welcome to ApplyWise</h1>

      <SignedOut>
        <p className="mb-4 text-lg">
          Track your job applications, referrals, goals, and reminders in one
          place.
        </p>
        <div className="flex gap-4">
          <SignUpButton mode="modal">
            <button className="px-6 py-2 bg-blue-600 text-white rounded hover:bg-blue-700">
              Get Started
            </button>
          </SignUpButton>
          <SignInButton mode="modal">
            <button className="px-6 py-2 border border-blue-600 text-blue-600 rounded hover:bg-blue-50">
              Sign In
            </button>
          </SignInButton>
        </div>
      </SignedOut>

      <SignedIn>
        <p className="mb-4 text-lg">You are signed in.</p>
        <div className="flex gap-4 items-center">
          <Link
            href="/dashboard"
            className="px-6 py-2 bg-green-600 text-white rounded hover:bg-green-700"
          >
            Go to Dashboard
          </Link>
          <UserButton />
        </div>
      </SignedIn>
    </main>
  );
}
