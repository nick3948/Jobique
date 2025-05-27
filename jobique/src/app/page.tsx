"use client";

import Image from "next/image";
import { SignedIn, SignedOut, SignInButton, SignUpButton, useUser } from "@clerk/nextjs";
import Navbar from "@/components/Navbar";

export default function Home() {
  const { user } = useUser();

  return (
    <main className="min-h-screen flex flex-col">
      <Navbar />
      {/* Top: 2-column layout */}
      <div
        className="flex flex-col md:flex-row gap-y-10 md:gap-0 flex-1 min-h-[80vh] bg-cover bg-center"
        style={{
          backgroundColor: "#C6E7FF",
        }}
      >
        {/* LEFT: Auth CTA */}
        <div className="w-full md:w-1/2 flex flex-col justify-center items-center px-6 py-20 md:px-20 md:py-32 text-center">
          <h1 className="text-3xl font-bold mb-4">
            {user?.firstName ? (
              <>Welcome, <span className="text-blue-500">{user.firstName}</span></>
            ) : (
              <>Welcome to <span className="text-blue-500">Jobique</span></>
            )}
          </h1>
          <SignedOut>
            <p className="mb-4 text-center text-gray-700">
              Track job apps, follow-ups, referrals and more — all in one place.
            </p>
            <div className="w-full max-w-md space-y-4">
              <SignUpButton mode="modal">
                <button className="w-full px-6 py-2 bg-blue-600 text-white rounded hover:bg-blue-700">
                  Sign Up
                </button>
              </SignUpButton>
              <SignInButton mode="modal">
                <button className="w-full px-6 py-2 border border-blue-600 text-blue-600 rounded hover:bg-blue-50">
                  Sign In
                </button>
              </SignInButton>
            </div>
          </SignedOut>
          <SignedIn>
            <div className="flex flex-col items-center space-y-2">
              <button className="w-full px-6 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 cursor-pointer">
                Get Started
              </button>
            </div>
          </SignedIn>
        </div>

        {/* RIGHT: App Info */}
        <div className="w-full md:w-1/2 px-6 py-12 md:px-10 flex flex-col justify-center text-gray-800">
          <div className="w-full flex justify-center mb-6 relative max-w-md h-[250px] sm:h-[300px] md:h-[350px] lg:h-[400px]">
            <Image
              src="/images/feeling_proud.svg"
              alt="Jobique App Preview"
              fill
              className="object-contain"
            />
          </div>
          <h2 className="text-2xl font-semibold mb-4">
            Manage Your Job Hunt Smartly
          </h2>
          <p className="mb-6 text-black">
            Jobique helps you track your job applications, referrals, resumes,
            and follow-ups in one smart dashboard. Set goals, stay motivated,
            and never miss a follow-up again.
          </p>
        </div>
      </div>

      {/* Bottom: Features */}
      <section className="bg-white text-black py-10 px-6 sm:px-10 md:px-20 lg:px-32">
        <h3 className="text-3xl font-bold mb-6 text-center">Key Features</h3>
        <div className="space-y-10">
          {[
            {
              img: "/images/job_track.png",
              title: "Track Jobs",
              desc: "Track every job application by status",
            },
            {
              img: "/images/document_upload.png",
              title: "Document Uploads",
              desc: "Upload and preview resumes and cover letters",
            },
            {
              img: "/images/set_goals.png",
              title: "Set Goals",
              desc: "Set weekly/monthly goals and monitor progress",
            },
            {
              img: "/images/reminders.png",
              title: "Reminders",
              desc: "Get email notifications for follow-ups",
            },
            {
              img: "/images/contacts_Referrals.png",
              title: "Referrals & Contacts",
              desc: "Link contacts and referrals to jobs",
            },
            {
              img: "/images/analytics.png",
              title: "Analytics",
              desc: "Visualize your job hunt with charts",
            },
            {
              img: "/images/interviewNotes.png",
              title: "Interview Notes",
              desc: "Add notes for interviews or preparation",
            },
          ].map(({ img, title, desc }, index) => (
            <div
              key={title}
              className={`flex flex-col sm:flex-col md:flex-row ${
                index % 2 === 0 ? "" : "md:flex-row-reverse"
              } items-center gap-10 bg-white text-gray-900 p-8 rounded-lg shadow-md max-w-4xl mx-auto`}
            >
              <div className="w-full md:w-1/2">
                <Image
                  src={img}
                  alt={title}
                  width={400}
                  height={200}
                  className="rounded-md"
                />
              </div>
              <div className="w-full md:w-1/2 space-y-4 text-center md:text-left">
                <h4 className="text-2xl font-semibold">{title}</h4>
                <p className="text-md">{desc}</p>
              </div>
            </div>
          ))}
        </div>
      </section>
    </main>
  );
}
