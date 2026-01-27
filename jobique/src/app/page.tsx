"use client";

import { useRouter } from "next/navigation";
import Image from "next/image";
import {
  SignedIn,
  SignedOut,
  SignInButton,
  SignUpButton,
  useUser,
} from "@clerk/nextjs";
import Navbar from "@/components/Navbar";
import { motion } from "framer-motion";
import {
  Sparkles,
  MessageSquare,
  Share2,
  Kanban,
  ArrowRight,
  CheckCircle2
} from "lucide-react";

export default function Home() {
  const { user } = useUser();
  const router = useRouter();

  const features = [
    {
      icon: <Sparkles className="w-6 h-6 text-purple-600" />,
      title: "AI Auto-fill",
      desc: "Paste any job URL and let our AI instantly extract and fill in the details for you.",
      color: "bg-purple-50 border-purple-100"
    },
    {
      icon: <MessageSquare className="w-6 h-6 text-blue-600" />,
      title: "AI Referral Drafts",
      desc: "Generate professional, personalized referral request messages in seconds.",
      color: "bg-blue-50 border-blue-100"
    },
    {
      icon: <Share2 className="w-6 h-6 text-pink-600" />,
      title: "Collaborative Sharing",
      desc: "Share job cards with friends or mentors and track applications together.",
      color: "bg-pink-50 border-pink-100"
    },
    {
      icon: <Kanban className="w-6 h-6 text-orange-600" />,
      title: "Visual Tracking",
      desc: "Visualize your progress with a color-coded status pipeline and organized table.",
      color: "bg-orange-50 border-orange-100"
    }
  ];

  return (
    <main className="min-h-screen flex flex-col bg-white">
      <Navbar />

      {/* Hero Section */}
      <section className="relative flex-1 flex flex-col md:flex-row items-center justify-center px-6 pt-20 pb-32 md:px-20 md:py-32 overflow-hidden">
        {/* Abstract Background Elements */}
        <div className="absolute inset-0 z-0">
          <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-blue-100/50 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
          <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-purple-100/50 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2" />
        </div>

        <div className="container mx-auto z-10 flex flex-col md:flex-row items-center gap-12 md:gap-20">
          {/* Text Content */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="w-full md:w-1/2 text-center md:text-left space-y-6"
          >
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-blue-50 text-blue-700 text-sm font-medium rounded-full border border-blue-100 mb-2">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-blue-500"></span>
              </span>
              New: AI Referral Generator
            </div>

            <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight text-gray-900 leading-[1.1]">
              Your Job Hunt, <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-violet-600">
                Supercharged.
              </span>
            </h1>

            <p className="text-lg md:text-xl text-gray-600 max-w-lg mx-auto md:mx-0 leading-relaxed">
              Stop juggling spreadsheets. Track applications, generate referral messages, and organize your search with the power of AI.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center md:justify-start gap-4 pt-4">
              <SignedOut>
                <SignUpButton mode="modal">
                  <button className="px-8 py-3.5 bg-gray-900 text-white font-medium rounded-xl hover:bg-gray-800 hover:scale-105 transition-all shadow-lg shadow-gray-200/50 flex items-center gap-2">
                    Get Started Free <ArrowRight className="w-4 h-4" />
                  </button>
                </SignUpButton>
                <SignInButton mode="modal">
                  <button className="px-8 py-3.5 bg-white text-gray-700 font-medium rounded-xl border border-gray-200 hover:bg-gray-50 hover:border-gray-300 transition-all">
                    Sign In
                  </button>
                </SignInButton>
              </SignedOut>
              <SignedIn>
                <button
                  onClick={() => router.push("/dashboard")}
                  className="px-8 py-3.5 bg-blue-600 text-white font-medium rounded-xl hover:bg-blue-700 hover:shadow-xl hover:shadow-blue-200 hover:-translate-y-0.5 transition-all cursor-pointer flex items-center gap-2"
                >
                  Go to Dashboard <ArrowRight className="w-4 h-4" />
                </button>
              </SignedIn>
            </div>

            <div className="flex items-center justify-center md:justify-start gap-6 pt-6 text-sm text-gray-500">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-green-500" /> Free for everyone
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-green-500" /> No credit card required
              </div>
            </div>
          </motion.div>

          {/* Hero Image */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="w-full md:w-1/2 relative"
          >
            <div className="relative z-10 bg-white rounded-2xl shadow-2xl border border-gray-100 overflow-hidden transform md:rotate-2 hover:rotate-0 transition-transform duration-500">
              <Image
                src="/images/HeroBanner.png"
                alt="Jobique Dashboard"
                width={1200}
                height={800}
                className="w-full h-auto"
                priority
              />
              {/* Overlay Gradient for depth */}
              <div className="absolute inset-0 bg-gradient-to-t from-white/10 to-transparent pointer-events-none" />
            </div>

            {/* Decorative blobs behind image */}
            <div className="absolute -top-10 -right-10 w-24 h-24 bg-yellow-200 rounded-full blur-xl opacity-60 animate-pulse" />
            <div className="absolute -bottom-8 -left-8 w-32 h-32 bg-pink-200 rounded-full blur-xl opacity-60 animate-pulse delay-700" />
          </motion.div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="py-20 px-6 md:px-20 bg-gray-50/50">
        <div className="container mx-auto">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Everything you need to land your next role</h2>
            <p className="text-gray-600 text-lg">Streamline every step of your job search with powerful tools designed for modern candidates.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((feature, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: idx * 0.1 }}
                className={`${feature.color} p-6 rounded-2xl border hover:shadow-lg transition-all cursor-default group`}
              >
                <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center shadow-sm mb-4 group-hover:scale-110 transition-transform duration-300">
                  {feature.icon}
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">{feature.title}</h3>
                <p className="text-gray-600 leading-relaxed">{feature.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer / CTA Frame */}
      <section className="py-20 px-6">
        <div className="container mx-auto max-w-4xl bg-gray-900 rounded-3xl p-10 md:p-16 text-center text-white relative overflow-hidden">
          {/* Background Grid Pattern */}
          <div className="absolute inset-0 opacity-10" style={{ backgroundImage: 'radial-gradient(circle at 2px 2px, white 1px, transparent 0)', backgroundSize: '24px 24px' }}></div>

          <div className="relative z-10">
            <h2 className="text-3xl md:text-4xl font-bold mb-6">Ready to organize your job search?</h2>
            <p className="text-gray-300 text-lg mb-8 max-w-xl mx-auto">Join thousands of job seekers who are getting hired faster with Jobique.</p>

            <SignedOut>
              <SignUpButton mode="modal">
                <button className="px-8 py-3 bg-white text-gray-900 font-bold rounded-xl hover:bg-gray-100 transition-colors">
                  Join Jobique Now
                </button>
              </SignUpButton>
            </SignedOut>
            <SignedIn>
              <button
                onClick={() => router.push('/dashboard')}
                className="px-8 py-3 bg-white text-gray-900 font-bold rounded-xl hover:bg-gray-100 cursor-pointer transition-colors"
              >
                Go to Dashboard
              </button>
            </SignedIn>
          </div>
        </div>
      </section>
    </main>
  );
}
