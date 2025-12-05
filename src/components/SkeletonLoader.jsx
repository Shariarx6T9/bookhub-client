import React from "react";

const SkeletonLoader = React.memo(({ type = "card" }) => {
  if (type === "table") {
    return (
      <div className="skeleton-table">
        {Array(5).fill(0).map((_, i) => (
          <div key={i} className="skeleton-row">
            <div className="skeleton-cell w-48 h-16" />
            <div className="skeleton-cell w-32 h-4" />
            <div className="skeleton-cell w-24 h-6" />
            <div className="skeleton-cell w-20 h-4" />
            <div className="skeleton-cell w-32 h-8" />
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="skeleton-grid">
      {Array(6).fill(0).map((_, i) => (
        <div key={i} className="skeleton-card">
          <div className="skeleton-image" />
          <div className="skeleton-content">
            <div className="skeleton-title" />
            <div className="skeleton-author" />
            <div className="skeleton-summary" />
          </div>
        </div>
      ))}
    </div>
  );
});

export default SkeletonLoader;