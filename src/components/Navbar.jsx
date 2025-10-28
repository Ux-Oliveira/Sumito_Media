import React from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";

export default function Navbar() {
  const location = useLocation();
  const navigate = useNavigate();
  const isHome = location.pathname === "/";
  const isCountdown = location.pathname === "/countdown";

  const scrollTo = (id) => {
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  const navigateAndScroll = (id) => {
    if (isHome) {
      scrollTo(id);
      return;
    }
    navigate("/");
    setTimeout(() => scrollTo(id), 160);
  };

  const goHome = () => {
    if (isHome) {
      window.scrollTo({ top: 0, behavior: "smooth" });
      return;
    }
    navigate("/");
    setTimeout(() => window.scrollTo({ top: 0, behavior: "smooth" }), 140);
  };

  return (
    <header className="fixed top-0 left-0 w-full z-50">
      {/* Desktop / tablet */}
      <nav className="hidden sm:flex h-16 items-center justify-center nav-translucent px-4">
        {isHome ? (
          <div className="flex items-center gap-6">
            {/* Left buttons */}
            <div className="flex items-center gap-3 text-sm text-white">
              <button onClick={() => navigateAndScroll("home")} className="hover:underline">Home</button>
              <span className="opacity-60">|</span>
              <button onClick={() => navigateAndScroll("machine")} className="hover:underline">Machine</button>
            </div>

            {/* Center logo */}
            <div className="flex-shrink-0">
              <button onClick={goHome} aria-label="Go home" className="flex items-center">
                <img src="/logo_lettering.png" alt="Sumito Media" className="h-10 w-auto logo-pulse" />
              </button>
            </div>

            {/* Right buttons */}
            <div className="flex items-center gap-3 text-sm text-white">
              <button onClick={() => navigateAndScroll("socials")} className="hover:underline">Socials</button>
              <span className="opacity-60">|</span>
              <Link to="/countdown" className="hover:underline">Countdown</Link>
            </div>
          </div>
        ) : isCountdown ? (
          <div className="flex items-center justify-center w-full gap-6">
            {/* Left Home button */}
            <div className="flex items-center">
              <button onClick={goHome} className="hover:underline">Home</button>
            </div>

            {/* Center logo */}
            <div className="flex-shrink-0">
              <button onClick={goHome} aria-label="Go home" className="flex items-center">
                <img src="/logo_lettering.png" alt="Sumito Media" className="h-10 w-auto logo-pulse" />
              </button>
            </div>

            {/* Right side empty */}
            <div style={{ width: 80 }} />
          </div>
        ) : (
          <div className="flex items-center gap-3 text-sm text-white">
            <button onClick={goHome} className="hover:underline">Home</button>
          </div>
        )}
      </nav>

      {/* Mobile */}
      <nav className="sm:hidden h-14 flex items-center nav-translucent px-3">
        {isCountdown ? (
          <div className="w-full flex items-center justify-between relative">
            <div className="flex items-center">
              <button onClick={goHome} className="px-2 py-1 text-xs bg-white/10 rounded">Home</button>
            </div>

            <div className="absolute left-0 right-0 flex items-center justify-center pointer-events-none">
              <button onClick={goHome} aria-label="Go home" className="pointer-events-auto">
                <img src="/logo_lettering.png" alt="Sumito Media" className="h-8 w-auto logo-pulse" />
              </button>
            </div>

            <div style={{ width: 48 }} />
          </div>
        ) : (
          <div className="w-full flex items-center justify-between">
            <div className="flex items-center">
              <button onClick={goHome} aria-label="Go home" className="flex items-center">
                <img src="/simple_logo.png" alt="Sumito" className="h-8 w-auto logo-pulse" />
              </button>
            </div>

            <div className="flex-1 flex items-center justify-center gap-2">
              <button onClick={() => navigateAndScroll("home")} className="px-2 py-1 text-xs bg-white/10 rounded">Home</button>
              <button onClick={() => navigateAndScroll("machine")} className="px-2 py-1 text-xs bg-white/10 rounded">Machine</button>
              <button onClick={() => navigateAndScroll("socials")} className="px-2 py-1 text-xs bg-white/10 rounded">Socials</button>
              <Link to="/countdown" className="px-2 py-1 text-xs bg-white/10 rounded">Countdown</Link>
            </div>

            <div style={{ width: 36 }} />
          </div>
        )}
      </nav>
    </header>
  );
}
