import React from "react";
import { Rocket, Lightbulb, Zap } from "lucide-react";

export default function About() {
  return (
    <section className="w-full min-h-[500px] px-6 py-20 text-white relative overflow-hidden rounded-2xl">

      {/* Subtle background glow (no hard black background) */}
      <div className="absolute inset-0 bg-gradient-to-b from-cyan-500/5 via-transparent to-purple-500/5 pointer-events-none"></div>

      {/* Header */}
      <div className="relative text-center max-w-4xl mx-auto">
        <h2 className="text-4xl md:text-5xl font-extrabold tracking-tight bg-gradient-to-r from-cyan-400 via-purple-400 to-pink-400 text-transparent bg-clip-text">
          About Our Startup
        </h2>

        <p className="mt-6 text-gray-400 text-base md:text-lg leading-relaxed">
          We design and build modern digital products that are fast, scalable,
          and focused on delivering clean user experiences with real-world impact.
        </p>
      </div>

      {/* Feature Cards */}
      <div className="relative mt-14 grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">

        {/* Card 1 */}
        <div className="p-6 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-md hover:scale-[1.03] transition duration-300">
          <Rocket className="w-9 h-9 text-cyan-400 mb-4" />
          <h3 className="text-xl font-semibold">Fast Execution</h3>
          <p className="text-gray-400 mt-2 text-sm leading-relaxed">
            We move quickly from idea to production, helping startups ship faster.
          </p>
        </div>

        {/* Card 2 */}
        <div className="p-6 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-md hover:scale-[1.03] transition duration-300">
          <Lightbulb className="w-9 h-9 text-purple-400 mb-4" />
          <h3 className="text-xl font-semibold">Innovation</h3>
          <p className="text-gray-400 mt-2 text-sm leading-relaxed">
            We build creative, modern solutions to solve real-world problems.
          </p>
        </div>

        {/* Card 3 */}
        <div className="p-6 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-md hover:scale-[1.03] transition duration-300">
          <Zap className="w-9 h-9 text-pink-400 mb-4" />
          <h3 className="text-xl font-semibold">Scalability</h3>
          <p className="text-gray-400 mt-2 text-sm leading-relaxed">
            Our systems are built to grow smoothly as user demand increases.
          </p>
        </div>

      </div>
    </section>
  );
}