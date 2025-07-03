import React from "react";

function HeroSection() {
  return (
    <section className="relative h-screen w-full flex items-center justify-center text-white text-center overflow-hidden">
      <video
        autoPlay
        loop
        muted
        playsInline
        className="absolute inset-0 w-full h-full object-cover z-[-1] scale-[1.6] md:scale-[1.2]"
      >
        <source src="/videos/covid-video.mp4" type="video/mp4" />
        Your browser does not support the video tag.
      </video>

      <div className="z-10 bg-black/50 p-6 md:rounded-lg max-w-2xl">
        <h1 className="text-3xl sm:text-5xl font-bold mb-4">
          Because Every Number Is a Life.
        </h1>
        <p className="text-lg sm:text-xl">Track the Facts. Fight the Fear.</p>
      </div>
    </section>
  );
}

export default HeroSection;
