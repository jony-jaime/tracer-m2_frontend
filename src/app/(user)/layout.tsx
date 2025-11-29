"use client";

import Script from "next/script";
import { useEffect, useState } from "react";
import { Tooltip } from "react-tooltip";
import "react-tooltip/dist/react-tooltip.css";

export default function Layout({ children }: { children: React.ReactNode }) {
  const [ready, setReady] = useState(false);

  useEffect(() => {
    setReady(true);
  }, []);

  return (
    <>
      {ready && (
        <div className="w-full h-screen relative">
          <div className="w-full h-full overflow-x-auto flex justify-center">{children}</div>
        </div>
      )}

      <Tooltip id="tooltip" className="tooltip-container" />
      {process.env.NEXT_PUBLIC_RECAPTCHA_CLIENT && <Script async src={`https://www.google.com/recaptcha/api.js?render=${process.env.NEXT_PUBLIC_RECAPTCHA_CLIENT}`} />}
    </>
  );
}
