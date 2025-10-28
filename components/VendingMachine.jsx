import React, { useState, useEffect } from "react";

const MOBILE_BREAKPOINT = 768;

export default function VendingMachine() {
  const [showGrid, setShowGrid] = useState(false);
  const [showResult, setShowResult] = useState(null);
  const [selectedCode, setSelectedCode] = useState(null);
  const [shakeSide, setShakeSide] = useState(null);
  const [popItem, setPopItem] = useState(null);
  const [isMobile, setIsMobile] = useState(
    typeof window !== "undefined" ? window.innerWidth < MOBILE_BREAKPOINT : true
  );

  const rightAnswers = {
    A1: { img: "/saddam_a-1.png", sound: "/gothim.mp3", text: "You found Saddam Hussein's hiding spot. Congrats!" },
    B4: { img: "/award_b-4.png", sound: "/right.mp3", text: "You did it again, bozo" },
    C3: { img: "/job_c-3.png", sound: "/lion.mp3", text: "*trigger warning*" },
    D6: { img: "/intoam_d-6.png", sound: "/right.mp3", text: "You found 10% off of your first Into The AM purchase!", link: "https://IntoTheAm.com/Sumito" },
    E2: { img: "/monet_e-2.png", sound: "/right.mp3", text: "There you go! Don't drink it at once!" },
    F5: { img: "/evangelion_f-5.png", sound: "/jorking.mp3", text: "Straight up?" },
  };

  const playSound = (file) => {
    if (!file) return;
    const audio = new Audio(file);
    audio.play().catch(() => {});
  };

  useEffect(() => {
    const onResize = () => setIsMobile(window.innerWidth < MOBILE_BREAKPOINT);
    onResize();
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);

  const handleMachineClick = () => {
    playSound("/coinslide.mp3");
    setTimeout(() => setShowGrid(true), 160);
  };

  const handleChoice = (code) => {
    setSelectedCode(code);
    playSound("/press.mp3");

    const isRight = rightAnswers[code];
    if (!isRight) {
      setTimeout(() => {
        playSound("/wrong.mp3");
        setShowGrid(false);
        setSelectedCode(null);
      }, 400);
      return;
    }

    // Right flow
    setTimeout(() => {
      playSound("/drop.mp3");
      setShakeSide(["E2", "F5"].includes(code) ? "right" : "left");

      const overlayMap = { A1: "a", B4: "b", C3: "c", D6: "d", E2: "e", F5: "f" };
      setPopItem(overlayMap[code]);

      setTimeout(() => {
        setShakeSide(null);
        setPopItem(null);

        if (["B4", "D6", "E2"].includes(code)) playSound("/right.mp3");
        else playSound(isRight.sound);

        setShowGrid(false);
        setShowResult(isRight);
      }, 1200);
    }, 1000);
  };

  const closeModal = () => {
    setShowGrid(false);
    setShowResult(null);
    setSelectedCode(null);
    setShakeSide(null);
    setPopItem(null);
  };

  const letters = ["A","B","C","D","E","F"];
  const numbers = [1,2,3,4,5,6];

  return (
    <div id="machine" className="relative w-full flex flex-col md:flex-row items-center justify-center py-16 bg-black">
      <style>{`
        @keyframes shake {
          0% { transform: translateX(0); }
          10% { transform: translateX(-5px) rotate(-1deg); }
          20% { transform: translateX(5px) rotate(1deg); }
          30% { transform: translateX(-5px) rotate(-1deg); }
          40% { transform: translateX(5px) rotate(1deg); }
          50% { transform: translateX(0); }
          100% { transform: translateX(0); }
        }
        .animate-shake { animation: shake 0.6s ease-in-out; }
      `}</style>

      <div className={`flex flex-col items-center text-center transition-all duration-700 ${showGrid && !isMobile ? '-translate-x-16' : 'translate-x-0'}`}>
        <div id="monet">
        <h2 id="monet" className="mb-4 text-lg md:text-xl">Slide in, we don't mind. Put the coin in too, I guess.</h2></div>

        <div className="relative w-[291px] h-[480px] max-w-full">
          <img
            src="/vending_machine.png"
            alt="Vending Machine"
            className="absolute w-full h-full object-contain cursor-pointer z-10 transition-transform duration-700"
            onClick={handleMachineClick}
          />

          {["a","b","c","d","e","f"].map((name) => (
            <img
              key={name}
              src={`/${name}.png`}
              alt={name}
              className={`absolute top-0 left-0 w-full h-full object-contain z-15 cursor-pointer transition-transform duration-300 ${popItem === name ? "scale-105" : "scale-100"}`}
              onClick={handleMachineClick}
            />
          ))}

          <img
            src="/left_comp.png"
            alt="left comp"
            className={`absolute top-0 left-0 w-full h-full z-20 pointer-events-none ${shakeSide==='left'?'animate-shake':''}`}
          />
          <img
            src="/right_comp.png"
            alt="right comp"
            className={`absolute top-0 left-0 w-full h-full z-20 pointer-events-none ${shakeSide==='right'?'animate-shake':''}`}
          />

          {Object.entries(rightAnswers).map(([code, v]) => {
            const display = selectedCode === code;
            return (
              <img
                key={code}
                src={v.img}
                alt={code}
                className={`absolute top-0 left-0 w-full h-full object-contain pointer-events-none z-30 transition-all duration-500 ${display?'opacity-100 scale-105':'opacity-0 scale-95'}`}
              />
            );
          })}
        </div>
      </div>

      {/* Desktop Panel */}
      <div className="w-full md:w-[480px] md:ml-8 mt-6 md:mt-0 flex justify-center">
        {!isMobile && (showGrid || showResult) && (
          <div className="bg-gray-900 rounded-2xl p-6 w-full max-w-md">
            {!showResult && (
              <>
                <h3 className="mb-4 text-lg">Choose an item</h3>
                <div className="grid grid-cols-6 gap-2">
                  {letters.map((L) =>
                    numbers.map((N) => {
                      const code = `${L}${N}`;
                      return (
                        <button key={code} onClick={() => handleChoice(code)} className="bg-gray-700 hover:bg-gray-600 rounded-md px-3 py-2 text-sm">{code}</button>
                      );
                    })
                  )}
                </div>
                <p className="mt-4 text-sm opacity-70">Can you find the Monet champagne bottle?</p>
              </>
            )}

            {showResult && (
              <>
                <img src={showResult.img} alt="result" className="mx-auto mb-4 rounded-xl max-h-64 object-contain" />
                <p className="mb-3">{showResult.text}</p>
                {showResult.link && (
                  <a href={showResult.link} target="_blank" rel="noreferrer" className="underline text-blue-400 hover:text-blue-300">Grab it!</a>
                )}
                <div className="mt-4 flex justify-center">
                  <button onClick={closeModal} className="px-4 py-2 bg-white/10 hover:bg-white/20 rounded">Close</button>
                </div>
              </>
            )}
          </div>
        )}

        {/* Mobile Modals */}
        {isMobile && showGrid && !showResult && (
          <div onClick={closeModal} className="fixed inset-0 flex justify-center items-center modal-bg z-50">
            <div onClick={e=>e.stopPropagation()} className="bg-gray-900 rounded-2xl p-5 mx-4 w-[92%]">
              <h3 className="mb-3 text-lg">Choose an item</h3>
              <div className="grid grid-cols-6 gap-2">
                {letters.map((L) =>
                  numbers.map((N) => {
                    const code = `${L}${N}`;
                    return <button key={code} onClick={()=>handleChoice(code)} className="bg-gray-700 hover:bg-gray-600 rounded-md px-3 py-2 text-sm">{code}</button>
                  })
                )}
              </div>
            </div>
          </div>
        )}

        {isMobile && showResult && (
          <div onClick={closeModal} className="fixed inset-0 flex justify-center items-center modal-bg z-50">
            <div onClick={e=>e.stopPropagation()} className="bg-gray-900 rounded-2xl p-5 mx-4 w-[92%] text-center">
              <img src={showResult.img} alt="result" className="mx-auto mb-4 rounded-xl max-h-64 object-contain" />
              <p className="mb-3">{showResult.text}</p>
              {showResult.link && <a href={showResult.link} target="_blank" rel="noreferrer" className="underline text-blue-400 hover:text-blue-300">Visit link</a>}
              <div className="mt-4">
                <button onClick={closeModal} className="px-4 py-2 bg-white/10 hover:bg-white/20 rounded">Close</button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
