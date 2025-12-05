import React from "react";

const LoadingSpinner = React.memo(({ size = 42, text = "Loading...", variant = "default" }) => (
  <div className={`loading-container ${variant === "overlay" ? "loading-overlay" : ""}`}>
    <div className={`spinner spinner-${variant}`} style={{ width: size, height: size }} />
    {text && <p className="loading-text">{text}</p>}
  </div>
));

export default LoadingSpinner;