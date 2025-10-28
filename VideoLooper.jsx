import React, { useEffect, useRef } from "react";

export default function VideoLooper({ src, direction = "left", customClass = "" }) {
  const ref = useRef(null);

  useEffect(() => {
    const v = ref.current;
    if (v) {
      v.muted = true;
      v.loop = true;
      v.play().catch(() => {});
    }
  }, []);

  const posClass = direction === "left" ? "left-0" : "right-0";

  return (
    <video
      ref={ref}
      src={src}
      muted
      loop
      playsInline
      className={`absolute top-0 w-1/2 h-full object-cover ${posClass} ${customClass}`}
    />
  );
}
