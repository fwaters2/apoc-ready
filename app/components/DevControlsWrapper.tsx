"use client";

import dynamic from "next/dynamic";

// Import DevControls dynamically to avoid server/client mismatch
const DevControls = dynamic(() => import("./DevControls"), {
  ssr: false,
});

export default function DevControlsWrapper() {
  return <DevControls />;
} 