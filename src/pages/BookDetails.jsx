// client/src/pages/BookDetails.jsx
import React, { useEffect, useState } from "react";
import axios from "../services/axiosInstance";
import { useParams } from "react-router-dom";
import LoadingSpinner from "../components/LoadingSpinner";
import toast from "react-hot-toast";

export default function BookDetails() {
  const { id } = useParams();
  const [book, setBook] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        const res = await axios.get(`/books/${id}`);
        setBook(res.data);
      } catch (err) {
        toast.error("Failed to load book");
      } finally {
        setLoading(false);
      }
    })();
  }, [id]);

  if (loading) return <LoadingSpinner />;
  if (!book) return <div className="container"><div className="empty">Book not found</div></div>;

  return (
    <div className="container">
      <div style={{display:'grid',gridTemplateColumns:'260px 1fr',gap:20,alignItems:'start'}}>
        <img src={book.coverUrl} alt={book.title} style={{width:240,borderRadius:10}} />
        <div>
          <h1 style={{marginTop:0}}>{book.title}</h1>
          <p style={{color:'var(--muted)',fontWeight:600}}>{book.author} • {book.genre}</p>
          <div style={{marginTop:12}}>
            <div style={{display:'flex',gap:12,alignItems:'center'}}>
              <div className="badge">⭐ {book.rating}</div>
              <div style={{color:'var(--muted)'}}>Added by {book.userName} ({book.userEmail})</div>
            </div>
          </div>
          <hr style={{margin:'16px 0',borderColor:'rgba(15,23,42,0.06)'}} />
          <p style={{lineHeight:1.6}}>{book.summary}</p>
        </div>
      </div>
    </div>
  );
}
