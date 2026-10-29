import { useEffect, useState } from "react";
import { ReactLenis } from "lenis/react";

export default function ScrollProvider({ children }) {
  const [reducedMotion, setReducedMotion] = useState(
    () => window.matchMedia("(prefers-reduced-motion: reduce)").matches,
  );

  useEffect(() => {
    const media = window.matchMedia("(prefers-reduced-motion: reduce)");
    const update = () => setReducedMotion(media.matches);
    media.addEventListener("change", update);
    return () => media.removeEventListener("change", update);
  }, []);

  return (
    <ReactLenis
      root
      options={{
        autoRaf: true,
        anchors: true,
        lerp: 0.18,
        smoothWheel: !reducedMotion,
        wheelMultiplier: 1,
      }}
    >
      {children}
    </ReactLenis>
  );
}
