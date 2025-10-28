import React, { useEffect, useRef, useState } from "react";
import VendingMachine from "../components/VendingMachine";
import '@fortawesome/fontawesome-free/css/all.min.css';

const SECTION_WIDTH = 830;
const SECTION_HEIGHT = 830;
const HOLD_MS = 1000;

export default function Home() {
  const rightRef = useRef(null);
  const leftRef = useRef(null);

  const [rightDuration, setRightDuration] = useState(4);
  const [leftDuration, setLeftDuration] = useState(4);
  const [isRightPlaying, setIsRightPlaying] = useState(false);
  const [isLeftPlaying, setIsLeftPlaying] = useState(false);

  const leftTextVisible = !isLeftPlaying;
  const rightTextVisible = !isRightPlaying;

  const startRightToLeft = () => {
    const v = rightRef.current;
    if (!v) return;
    const lv = leftRef.current;
    if (lv) { try { lv.pause(); lv.currentTime = 0; } catch (e) {} }
    setIsRightPlaying(true);
    setIsLeftPlaying(false);
    v.style.transition = `left ${rightDuration}s linear`;
    v.style.left = "100%";
    v.currentTime = 0;
    requestAnimationFrame(() => {
      v.play().catch(() => {});
      v.style.left = "-100%";
    });
  };

  const startLeftToRight = () => {
    const v = leftRef.current;
    if (!v) return;
    const rv = rightRef.current;
    if (rv) { try { rv.pause(); rv.currentTime = 0; } catch (e) {} }
    setIsLeftPlaying(true);
    setIsRightPlaying(false);
    v.style.transition = `left ${leftDuration}s linear`;
    v.style.left = "-100%";
    v.currentTime = 0;
    requestAnimationFrame(() => {
      v.play().catch(() => {});
      v.style.left = "100%";
    });
  };

  useEffect(() => {
    const rv = rightRef.current;
    const lv = leftRef.current;
    if (!rv || !lv) return;

    const onRightEnded = () => {
      setIsRightPlaying(false);
      rv.style.transition = "none";
      rv.style.left = "100%";
      setTimeout(() => startLeftToRight(), HOLD_MS);
    };

    const onLeftEnded = () => {
      setIsLeftPlaying(false);
      lv.style.transition = "none";
      lv.style.left = "-100%";
      setTimeout(() => startRightToLeft(), HOLD_MS);
    };

    rv.addEventListener("ended", onRightEnded);
    lv.addEventListener("ended", onLeftEnded);
    return () => {
      rv.removeEventListener("ended", onRightEnded);
      lv.removeEventListener("ended", onLeftEnded);
    };
  }, [rightDuration, leftDuration]);

  useEffect(() => {
    const rv = rightRef.current;
    const lv = leftRef.current;
    if (!rv || !lv) return;

    const onMetaR = () => {
      const d = rv.duration || rightDuration;
      setRightDuration(Math.max(0.2, d));
      Object.assign(rv.style, {
        position: "absolute", top: "0", left: "100%",
        width: "100%", height: "100%", objectFit: "cover"
      });
      rv.loop = false;
      rv.play().catch(() => {});
    };

    const onMetaL = () => {
      const d = lv.duration || leftDuration;
      setLeftDuration(Math.max(0.2, d));
      Object.assign(lv.style, {
        position: "absolute", top: "0", left: "-100%",
        width: "100%", height: "100%", objectFit: "cover"
      });
      lv.loop = false;
      lv.play().catch(() => {}); 
    };

    rv.addEventListener("loadedmetadata", onMetaR);
    lv.addEventListener("loadedmetadata", onMetaL);

    rv.style.position = "absolute"; rv.style.top = "0"; rv.style.left = "100%";
    lv.style.position = "absolute"; lv.style.top = "0"; lv.style.left = "-100%";
    rv.style.width = "100%"; rv.style.height = "100%"; rv.style.objectFit = "cover";
    lv.style.width = "100%"; lv.style.height = "100%"; lv.style.objectFit = "cover";
    rv.loop = false; lv.loop = false;
    rv.preload = "auto";
    lv.preload = "auto";

    //start first animation immediately after metadata is loaded
    const starter = setTimeout(() => startRightToLeft(), 50);

    return () => {
      rv.removeEventListener("loadedmetadata", onMetaR);
      lv.removeEventListener("loadedmetadata", onMetaL);
      clearTimeout(starter);
    };
  }, []);

  const scrollToTop = () => {
    const el = document.getElementById("home");
    if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
    else window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <main>
      {/*home section*/}
      <section
        id="home"
        className="relative bg-black text-white flex justify-center items-center home-section"
        style={{ minHeight: "100vh", overflow: "hidden", paddingTop: 0 }}
      >
        <div
          className="home-video-wrapper"
          style={{ width: SECTION_WIDTH, height: SECTION_HEIGHT, position: "relative", overflow: "hidden", background: "#000" }}
        >
          {/*left text*/}
          <div
            className="desktop-only-text"
            style={{ position: "absolute", left: 12, top: "50%", transform: "translateY(-50%)", zIndex: 2, maxWidth: 340, opacity: leftTextVisible ? 1 : 0, transition: "opacity 240ms ease" }}
          >
            <h2 id="monet" className="text-2xl font-semibold mb-2">Meme Reviews</h2>
            <p id="monet" className="opacity-80">
              And the recurrent yap section
            </p>
          </div>

          {/*right text*/}
          <div
            className="desktop-only-text"
            style={{ position: "absolute", right: 12, top: "50%", transform: "translateY(-50%)", zIndex: 2, maxWidth: 340, textAlign: "right", opacity: rightTextVisible ? 1 : 0, transition: "opacity 240ms ease" }}
          >
            <h2 id="monet" className="text-2xl font-semibold mb-2">Almost daily uploads</h2>
            <p id="monet" className="opacity-80">And the podcast you can't stop asking for
            </p>
          </div>

          {/*videos*/}
          <div className="videos-container" style={{ position: "absolute", inset: 0 }}>
            <video ref={rightRef} src="/right-slide.mp4" muted playsInline preload="auto" className="video-desktop" style={{ position: "absolute", top: 0, left: "100%", width: "100%", height: "100%", objectFit: "cover", zIndex: 10 }} />
            <video ref={leftRef} src="/left-slide.mp4" muted playsInline preload="auto" className="video-desktop" style={{ position: "absolute", top: 0, left: "-100%", width: "100%", height: "100%", objectFit: "cover", zIndex: 9 }} />
          </div>

          {/*mobile video*/}
          <video src="/newvid.mp4" muted playsInline autoPlay loop preload="metadata" className="mobile-video" style={{ display: "none" }} />

          {/*mobile text*/}
          <div className="mobile-only">
            <div className="mobile-text">
              <p className="opacity-80">
                From the creator of Packing for LA:
              </p>
               <p className="opacity-80">
               Vlog 1 - Sumito Media
              </p>
            </div>
          </div>
        </div>
      </section>

      {/*machine section*/}
      <section id="machine" className="w-full bg-black text-white flex justify-center">
        <img src="/social_background.png" alt="bg" className="absolute inset-0 w-full h-full object-cover blur-lg opacity-10" />
        <div className="max-w-5xl mx-auto px-4 flex justify-center">
          <VendingMachine />
        </div>
      </section>

      {/*socials*/}
      <section id="socials" className="relative py-12 text-white">
        <img src="/social_background.png" alt="bg" className="absolute inset-0 w-full h-full object-cover blur-lg opacity-10" />
        <div id="monet" className="relative max-w-5xl mx-auto px-6 py-10 flex flex-col items-center z-10">
          <div id="monet" className="text-center mb-6 z-10">
            {/*<h3 className="desktop-only-text text-2xl font-semibold">
              Sumito Media | Meme Scholar - Vending Machines Aficionado - Father - Husband
            </h3>*/}
              <h3 id="new-mobile" className="mobile-text text-2xl font-semibold">
              Sumito Media | Meme Scholar  Vending Machines Aficionado  Father | Husband</h3>
            {/*<h6 id="plug" className="desktop-only-text text-2xl font-semibold">
              Website by <a id="heart" href="https://www.youtube.com/@ricksahuman" target="_blank">Rick's a Human</a>
            </h6>*/}
          </div>
          <div id="socialicons" className="social-icons-fixed">
            <a href="https://www.youtube.com/@SumitoMedia" target="blank" id="youtube" className="text-3xl heartbeat-1"><i className="fab fa-youtube"></i></a>
            <a href="https://www.twitch.tv/SumitoMedia" id="twitch" target="blank" className="text-3xl heartbeat-2"><i className="fab fa-twitch"></i></a>
            <a href="https://x.com/sumitomedia" id="twitter" target="blank" className="text-3xl heartbeat-3"><i className="fab fa-x-twitter"></i></a>
            <a href="https://www.reddit.com/r/SumitoMedia/" id="reddit" target="blank" className="text-3xl heartbeat-4"><i className="fab fa-reddit"></i></a>
            <a href="https://www.patreon.com/SumitoMedia" id="patreon" target="blank" className="text-3xl heartbeat-5"><i className="fab fa-patreon"></i></a>
            <a href="https://www.instagram.com/sumitomedia/" id="instagram" target="blank" className="text-3xl heartbeat-6"><i className="fab fa-instagram"></i></a>
            <a href="https://sumitomedia.com/" target="blank" id="heart" className="text-2xl mt-2 heartbeat-2"><i className="fa fa-heart"></i></a>
          </div>
          <h6 id="plug" className="mobile-text-only plugin">
              Website by <a id="heart" href="https://www.youtube.com/@ricksahuman" target="_blank">Rick's a Human</a>
            </h6>
        </div>
      </section>

      {/*scroll to top*/}
      <button onClick={scrollToTop} aria-label="Scroll to top" className="scroll-top-btn">
        <img src="/simple_logo.png" alt="top" className="h-8 w-auto logo-pulse" />
      </button>
    </main>
  );
}
