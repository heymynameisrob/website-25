import { useEffect, useState } from "react";
import { BallpointHandwritten } from "@/components/Handwritten";
import { AsciiBanner } from "@/components/AsciiBanner";

export function ConditionalHeader() {
  const [isDark, setIsDark] = useState(false);

  useEffect(() => {
    const checkDark = () => {
      setIsDark(document.documentElement.classList.contains("dark"));
    };
    checkDark();

    const observer = new MutationObserver(checkDark);
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["class"],
    });
    return () => observer.disconnect();
  }, []);

  if (isDark) {
    return <AsciiBanner />;
  }

  return <BallpointHandwritten />;
}
