import { useEffect, useState } from "react";

const SPLASH_DELAY_MS = 700;
const REVEAL_DELAY_MS = 120;

function useStartupSequence() {
  const [showSplash, setShowSplash] = useState(true);
  const [mountRealApp, setMountRealApp] = useState(false);
  const [isAppReady, setIsAppReady] = useState(false);

  useEffect(() => {
    let splashTimer = null;
    let revealTimer = null;
    let frame1 = null;
    let frame2 = null;

    splashTimer = setTimeout(() => {
      setMountRealApp(true);

      frame1 = requestAnimationFrame(() => {
        frame2 = requestAnimationFrame(() => {
          revealTimer = setTimeout(() => {
            setShowSplash(false);
            setIsAppReady(true);
          }, REVEAL_DELAY_MS);
        });
      });
    }, SPLASH_DELAY_MS);

    return () => {
      if (splashTimer) clearTimeout(splashTimer);
      if (revealTimer) clearTimeout(revealTimer);
      if (frame1) cancelAnimationFrame(frame1);
      if (frame2) cancelAnimationFrame(frame2);
    };
  }, []);

  return {
    showSplash,
    mountRealApp,
    isAppReady,
  };
}

export default useStartupSequence;
