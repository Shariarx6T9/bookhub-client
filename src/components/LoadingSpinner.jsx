import React from "react";

const LoadingSpinner = React.memo(({ size = 42 }) => (
  <div 
    style={{
      width: size,
      height: size,
      borderRadius: "50%",
      border: "5px solid rgba(0,0,0,0.08)",
      borderTopColor: "var(--accent)",
      animation: "spin 1s linear infinite",
      margin: "40px auto",
    }}
    aria-label="loading" 
  />
));

export default LoadingSpinner;