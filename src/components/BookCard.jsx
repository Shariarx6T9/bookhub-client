// client/src/components/BookCard.jsx
import React from "react";
import { Link } from "react-router-dom";

export default function BookCard({ book }) {
  return (
    <article className="card" role="article">
      <img className="cover" src={book.coverUrl} alt={book.title} />
      <div className="meta">
        <h3><Link to={`/book/${book._id}`} style={{textDecoration:'none', color:'#111'}}>{book.title}</Link></h3>
        <p style={{fontWeight:600}}>{book.author} • <span style={{color:'var(--muted)',fontWeight:500}}>{book.genre}</span></p>
        <p style={{color:'var(--muted)',fontSize:14}}>{book.summary?.slice(0,120)}{book.summary && book.summary.length>120?'...':''}</p>
        <div className="row">
          <div className="badge">⭐ {book.rating}</div>
          <div style={{color:'var(--muted)',fontSize:13}}>{book.userName}</div>
        </div>
      </div>
    </article>
  );
}
