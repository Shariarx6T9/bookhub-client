// client/src/components/LoadingSpinner.jsx
import React from "react";

export default function LoadingSpinner({ size = 42 }) {
  const style = {
    width: size,
    height: size,
    borderRadius: "50%",
    border: "5px solid rgba(0,0,0,0.08)",
    borderTopColor: "var(--accent)",
    animation: "spin 1s linear infinite",
    margin: "40px auto",
  };
  return <div style={style} aria-label="loading" />;
}
