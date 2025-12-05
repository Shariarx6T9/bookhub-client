import React, { useState, useCallback } from "react";
import { Link } from "react-router-dom";
import LazyImage from "./LazyImage";

const BookCard = React.memo(({ book }) => {
  const [imageError, setImageError] = useState(false);
  
  const handleImageError = useCallback(() => setImageError(true), []);
  
  const truncatedSummary = book.summary?.length > 120 
    ? `${book.summary.slice(0, 120)}...` 
    : book.summary;

  return (
    <article className="card" role="article">
      {imageError ? (
        <div className="cover bg-gradient-to-br from-purple-500/20 to-blue-500/20 border border-white/10 flex items-center justify-center">
          <div className="text-center text-white/40">
            <svg className="w-8 h-8 mx-auto mb-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
            </svg>
            <span className="text-xs">{book.title}</span>
          </div>
        </div>
      ) : (
        <LazyImage 
          className="cover" 
          src={book.coverUrl} 
          alt={book.title}
          fallback={
            <div className="cover bg-gradient-to-br from-purple-500/20 to-blue-500/20 border border-white/10 flex items-center justify-center">
              <span className="text-white/40 text-xs">{book.title}</span>
            </div>
          }
        />
      )}
      <div className="meta">
        <h3>
          <Link to={`/book/${book._id}`} className="text-white hover:text-white/80 transition">
            {book.title}
          </Link>
        </h3>
        <p className="font-semibold text-white/90">
          {book.author} • <span className="text-white/60 font-medium">{book.genre}</span>
        </p>
        {truncatedSummary && (
          <p className="text-white/60 text-sm leading-relaxed">{truncatedSummary}</p>
        )}
        <div className="row">
          <div className="badge">⭐ {book.rating}</div>
          <div className="text-white/50 text-xs">{book.userName}</div>
        </div>
      </div>
    </article>
  );
});

export default BookCard;