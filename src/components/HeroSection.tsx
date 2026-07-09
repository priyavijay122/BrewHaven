import React from 'react';

export default function HeroSection({ onOrderPopular }: { onOrderPopular: () => void }) {
  return (
    <section 
      id="home" 
      className="relative w-full min-h-screen overflow-hidden flex flex-col justify-between pt-28 sm:pt-36 pb-8 select-none bg-black"
    >
      {/* Background Video covering entire section */}
      <div className="absolute inset-0 w-full h-full overflow-hidden z-0 pointer-events-none">
        <div className="absolute inset-0 w-full h-full pointer-events-none select-none">
          <iframe
            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[177.77vh] min-w-full h-full min-h-[56.25vw] pointer-events-none border-0"
            src="https://www.youtube.com/embed/dFmSk-QCtA0?autoplay=1&mute=1&controls=0&loop=1&playlist=dFmSk-QCtA0&playsinline=1&rel=0&showinfo=0&modestbranding=1&iv_load_policy=3&enablejsapi=1"
            title="Brew Haven Experience"
            allow="autoplay; encrypted-media"
          ></iframe>
        </div>
        {/* Luxury Dark-and-Gold overlay tint for perfect text legibility */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/85 via-black/55 to-black/90 pointer-events-none"></div>
      </div>

      {/* Ambient background glows */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[350px] sm:w-[600px] h-[350px] sm:h-[600px] rounded-full blur-[100px] sm:blur-[140px] pointer-events-none bg-[#C5A059]/10 z-1"></div>

      {/* Side Labels - Perfectly Aligned and Symmetrical with elegant horizontal gold lines */}
      <div className="absolute left-6 md:left-12 top-1/2 -translate-y-1/2 hidden md:flex flex-col space-y-8 items-center z-10 pointer-events-none">
        <div className="h-[1px] w-12 bg-[#C5A059]/60"></div>
        <span className="text-[9px] uppercase tracking-[0.4em] text-[#C5A059] -rotate-90 origin-center py-6 whitespace-nowrap font-medium">
          PREMIUM BLEND
        </span>
        <div className="h-[1px] w-12 bg-[#C5A059]/60"></div>
      </div>



      {/* Central Composition */}
      <div className="w-full max-w-5xl mx-auto px-6 flex flex-col items-center justify-center flex-1 z-10 pointer-events-none">
        
        {/* Title and Header */}
        <div className="text-center pointer-events-none">
          <h1 className="text-4xl sm:text-6xl md:text-[84px] font-serif font-light leading-tight tracking-tight text-[#F5F5F0] drop-shadow-2xl">
            A Symphony of <br/>
            <span className="italic text-[#C5A059] font-normal">Golden Roast</span>
          </h1>
          <p className="mt-6 text-xs sm:text-sm uppercase tracking-[0.5em] text-[#C5A059]/80 font-medium drop-shadow">
            Crafted with Passion & Heritage
          </p>
        </div>

      </div>

      {/* Bottom Interface Bar */}
      <footer className="w-full max-w-7xl mx-auto px-6 sm:px-12 mt-12 z-10">
        <div className="bg-black/40 backdrop-blur-md border border-white/10 rounded-2xl p-6 sm:p-8 flex items-center justify-between">
          <div className="flex space-x-6 sm:space-x-12">
            <div className="flex flex-col">
              <span className="text-[9px] uppercase tracking-[0.2em] text-white/40 mb-1">Popular Choice</span>
              <span className="text-sm sm:text-base font-serif text-[#F5F5F0]">Caramel Macchiato</span>
              <span className="text-[#C5A059] font-mono text-xs sm:text-sm mt-1 font-semibold">₹ 349.00</span>
            </div>
            <div className="flex flex-col border-l border-white/10 pl-6 sm:pl-12">
              <span className="text-[9px] uppercase tracking-[0.2em] text-white/40 mb-1">Region</span>
              <span className="text-sm sm:text-base font-serif text-[#F5F5F0]">Coorg Estates</span>
              <span className="text-[#C5A059] font-mono text-xs sm:text-sm mt-1 font-semibold">Medium Dark</span>
            </div>
          </div>

          <div className="flex items-center">
            <button 
              onClick={() => onOrderPopular()}
              className="px-6 py-2.5 sm:px-8 sm:py-3 bg-[#C5A059] hover:bg-[#A6864A] text-black text-[10px] sm:text-xs font-bold uppercase tracking-widest rounded-full transition-all transform hover:-translate-y-0.5 cursor-pointer hover:scale-105 active:scale-95 shadow-lg shadow-[#C5A059]/20"
            >
              Order Now
            </button>
          </div>
        </div>
      </footer>

    </section>
  );
}
