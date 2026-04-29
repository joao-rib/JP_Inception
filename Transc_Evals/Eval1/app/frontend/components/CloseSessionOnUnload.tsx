"use client";

import { useEffect, useRef } from "react";

export default function CloseSessionOnUnload() {
  const hasSentCloseRequestRef = useRef(false);

  useEffect(() => {
    const closeSession = () => {
      if (hasSentCloseRequestRef.current) {
        return;
      }

      hasSentCloseRequestRef.current = true;

      void fetch("/api/auth/close-session", {
        method: "POST",
        keepalive: true,
        credentials: "same-origin",
      }).catch(() => {
        // Browser shutdown may interrupt the request; nothing to do client-side.
      });
    };

    window.addEventListener("pagehide", closeSession);
    window.addEventListener("beforeunload", closeSession);

    return () => {
      window.removeEventListener("pagehide", closeSession);
      window.removeEventListener("beforeunload", closeSession);
    };
  }, []);

  return null;
}
