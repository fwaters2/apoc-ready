"use client";

import dynamic from "next/dynamic";

// Import DevControls dynamically to avoid server/client mismatch
const DevControls = dynamic(() => import("./DevControls"), {
  ssr: false,
});

export default function DevControlsWrapper() {
  // Don't render the component in production
  if (process.env.NODE_ENV === "production") return null;
  
  return <DevControls />;
} 