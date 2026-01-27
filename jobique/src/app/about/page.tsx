"use client";

import Navbar from "@/components/Navbar";
import { motion } from "framer-motion";
import { Code2, Heart, Rocket, Linkedin, Globe } from "lucide-react";

export default function About() {
    return (
        <main className="min-h-screen bg-white">
            <Navbar />

            {/* Hero Section */}
            <section className="pt-32 pb-20 px-6">
                <div className="container mx-auto max-w-4xl text-center">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6 }}
                    >
                        <h1 className="text-4xl md:text-6xl font-extrabold text-gray-900 mb-6">
                            Empowering Your <br />
                            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600">
                                Career Journey
                            </span>
                        </h1>
                        <p className="text-xl text-gray-600 leading-relaxed max-w-2xl mx-auto">
                            Jobique was built to turn the chaos of job hunting into a streamlined, intelligent, and successful experience.
                        </p>
                    </motion.div>
                </div>
            </section>

            {/* Mission & Values */}
            <section className="py-16 px-6 bg-gray-50/50">
                <div className="container mx-auto max-w-5xl">
                    <div className="grid md:grid-cols-3 gap-8">
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.1 }}
                            className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100"
                        >
                            <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-xl flex items-center justify-center mb-6">
                                <Rocket className="w-6 h-6" />
                            </div>
                            <h3 className="text-xl font-bold text-gray-900 mb-3">Our Mission</h3>
                            <p className="text-gray-600">
                                To provide job seekers with the most advanced tools to track, apply, and land their dream jobs without the stress of disorganization.
                            </p>
                        </motion.div>

                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.2 }}
                            className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100"
                        >
                            <div className="w-12 h-12 bg-purple-50 text-purple-600 rounded-xl flex items-center justify-center mb-6">
                                <Code2 className="w-6 h-6" />
                            </div>
                            <h3 className="text-xl font-bold text-gray-900 mb-3">Built for Efficiency</h3>
                            <p className="text-gray-600">
                                Leveraging safe AI and modern web technologies to automate the tedious parts of applying, giving you more time to prep for interviews.
                            </p>
                        </motion.div>

                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.3 }}
                            className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100"
                        >
                            <div className="w-12 h-12 bg-pink-50 text-pink-600 rounded-xl flex items-center justify-center mb-6">
                                <Heart className="w-6 h-6" />
                            </div>
                            <h3 className="text-xl font-bold text-gray-900 mb-3">User-Centric</h3>
                            <p className="text-gray-600">
                                We believe in privacy and control. Your data is yours. We implement strict strict security and scoping to ensure your journey is private.
                            </p>
                        </motion.div>
                    </div>
                </div>
            </section>

            <section className="py-24 px-6">
                <div className="container mx-auto max-w-4xl">
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        viewport={{ once: true }}
                        className="bg-gradient-to-br from-gray-900 to-gray-800 rounded-3xl p-10 md:p-14 text-white shadow-2xl relative overflow-hidden"
                    >
                        <div className="absolute top-0 right-0 w-64 h-64 bg-blue-500/10 rounded-full blur-3xl translate-x-1/2 -translate-y-1/2"></div>

                        <div className="relative z-10 flex flex-col md:flex-row items-center gap-10">
                            <div className="w-32 h-32 md:w-40 md:h-40 bg-gray-700 rounded-full border-4 border-white/10 flex items-center justify-center shrink-0 shadow-lg">
                                <span className="text-4xl text-gray-500">NK</span>
                            </div>

                            <div className="text-center md:text-left">
                                <div className="inline-block px-3 py-1 bg-blue-500/20 text-blue-300 rounded-full text-xs font-semibold tracking-wide mb-3 uppercase">Founder & Lead Developer</div>
                                <h2 className="text-3xl font-bold mb-4">Nikhil Kumar Gattu</h2>
                                <p className="text-gray-300 leading-relaxed mb-6">
                                    "I am passionate about coding and building web applications that solve real user problems.
                                    I built Jobique after my own struggles with organizing job applications, aiming to ensure no one else
                                    has to feel that same chaos. While Jobique is open source, your support helps me sustain the AI features
                                    for everyone."
                                </p>

                                <div className="flex items-center justify-center md:justify-start gap-4">
                                    <a
                                        href="https://www.linkedin.com/in/nikhil-kumar-gattu-a315a1184/"
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="flex items-center gap-2 px-4 py-2 bg-white/10 hover:bg-white/20 rounded-lg transition-colors font-medium text-sm"
                                    >
                                        <Linkedin className="w-4 h-4" /> LinkedIn
                                    </a>
                                    <a
                                        href="https://nikhilportfoliosite.netlify.app/"
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="flex items-center gap-2 px-4 py-2 bg-white/10 hover:bg-white/20 rounded-lg transition-colors font-medium text-sm"
                                    >
                                        <Globe className="w-4 h-4" /> Portfolio
                                    </a>
                                </div>
                            </div>
                        </div>
                    </motion.div>
                </div>
            </section>
        </main>
    );
}
