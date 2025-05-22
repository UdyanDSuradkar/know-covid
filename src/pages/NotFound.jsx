import React, { useEffect, useRef } from "react";
import { gsap } from "gsap";

const NotFound = () => {
  const ghostRef = useRef(null);
  const numbersRef = useRef(null);
  const textRef = useRef(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({ defaults: { ease: "power3.inOut" } });

      gsap.to(ghostRef.current, {
        y: -20,
        repeat: -1,
        yoyo: true,
        duration: 1.5,
        ease: "sine.inOut",
      });

      tl.from(numbersRef.current, {
        y: -100,
        opacity: 0,
        duration: 1,
      });

      tl.from(
        textRef.current,
        {
          opacity: 0,
          y: 20,
          duration: 1,
        },
        "-=0.5"
      );
    });

    return () => ctx.revert(); // clean up animations on unmount
  }, []);

  return (
    <div className="h-screen flex flex-col justify-center items-center bg-gray-900 text-white text-center px-4">
      <div
        ref={numbersRef}
        className="text-7xl md:text-9xl font-bold text-red-500 mb-4"
      >
        404
      </div>

      <div ref={textRef}>
        <h2 className="text-2xl md:text-3xl font-semibold mb-2">
          Oops! Page not found
        </h2>
        <p className="text-gray-400 mb-4">
          The page you're looking for doesn't exist.
        </p>
        <a
          href="/"
          className="px-6 py-3 bg-red-600 hover:bg-red-700 text-white rounded-full transition duration-300"
        >
          Go Home
        </a>
      </div>
    </div>
  );
};

export default NotFound;
