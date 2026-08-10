import { Leaf } from "lucide-react";

export default function HeroSection() {
  return (
    <section className="min-h-screen flex items-center justify-between gap-12 px-10 md:px-20 py-20 bg-surface-base">

      <div className="w-full md:w-[45%]">

        <span className="inline-flex items-center gap-1.5 bg-brand-50 text-brand-700 px-5 py-2.5 rounded-full font-semibold text-sm border border-brand-200">
          <Leaf size={16} /> CarbonTrack Platform
        </span>

        <h1 className="mt-8 text-5xl md:text-[65px] leading-[1.1] font-extrabold text-ink-900">
          Track Your
          <br />
          <span className="text-brand-700">Carbon Footprint</span>
        </h1>

        <p className="my-8 text-ink-500 text-xl leading-relaxed">
          Monitor your daily carbon emissions,
          build sustainable habits,
          and create a greener future.
        </p>

        <div className="flex flex-wrap gap-5">

          <button className="px-9 py-4 rounded-full bg-brand-500 hover:bg-brand-600 text-white font-semibold transition-colors shadow-[0_4px_20px_rgba(34,194,116,0.25)]">
            Get Started
          </button>

          <button className="px-9 py-4 rounded-full bg-surface-card border-2 border-brand-500 text-brand-700 font-semibold hover:bg-brand-50 transition-colors">
            Learn More
          </button>

        </div>

      </div>

      <div className="hidden md:block w-[45%]">

        <img
          src="https://images.unsplash.com/photo-1511497584788-876760111969?w=900"
          alt="Nature"
          className="w-full rounded-3xl shadow-card-hover"
        />

      </div>

    </section>
  );
}
