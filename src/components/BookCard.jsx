// client/src/components/BookCard.jsx
import React from "react";
import { Link } from "react-router-dom";

export default function BookCard({ book }) {
  return (
    <article className="card" role="article">
      <img className="cover" src={book.coverUrl} alt={book.title} />
      <div className="meta">
        <h3>
          <Link to={`/book/${book._id}`} className="text-white hover:text-white/80 transition">
            {book.title}
          </Link>
        </h3>
        <p className="font-semibold text-white/90">
          {book.author} • <span className="text-white/60 font-medium">{book.genre}</span>
        </p>
        <p className="text-white/60 text-sm leading-relaxed">
          {book.summary?.slice(0,120)}{book.summary && book.summary.length>120?'...':''}
        </p>
        <div className="row">
          <div className="badge">⭐ {book.rating}</div>
          <div className="text-white/50 text-xs">{book.userName}</div>
        </div>
      </div>
    </article>
  );
}
