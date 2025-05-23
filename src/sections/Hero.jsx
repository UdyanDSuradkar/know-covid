import React, { useEffect, useRef } from "react";
import { gsap } from "gsap";

const Hero = () => {
  const heroRef = useRef();
  const emojiRef = useRef();

  useEffect(() => {
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({
        defaults: { ease: "power3.out", duration: 1 },
      });

      tl.from(".hero-headline", { y: -50, opacity: 0 });
      tl.from(".hero-subtext", { y: 20, opacity: 0 }, "-=0.5");
      tl.from(".hero-button", { scale: 0.8, opacity: 0 }, "-=0.3");

      gsap.to(emojiRef.current, {
        y: -10,
        repeat: -1,
        yoyo: true,
        duration: 1.5,
        ease: "sine.inOut",
      });
    }, heroRef);

    return () => ctx.revert(); // cleanup
  }, []);

  return (
    <section
      ref={heroRef}
      className="h-[90vh] flex flex-col justify-center items-center text-center bg-gradient-to-br from-blue-100 to-red-200 px-6"
    >
      <div ref={emojiRef} className="text-6xl mb-4">
        🦠
      </div>
      <h1 className="hero-headline text-4xl md:text-6xl font-bold text-red-900 mb-4">
        Stay Safe, Stay Informed
      </h1>
      <p className="hero-subtext text-lg md:text-xl text-red-700 max-w-2xl mb-6">
        Get real-time COVID-19 updates, prevention tips, and vaccination info to
        protect yourself and your loved ones.
      </p>
    </section>
  );
};

export default Hero;
