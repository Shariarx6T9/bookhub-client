// client/src/pages/Home.jsx
import React, { useEffect, useState } from "react";
import axios from "../services/axiosInstance";
import LoadingSpinner from "../components/LoadingSpinner";
import BookGrid from "../components/BookGrid";
import toast from "react-hot-toast";

export default function Home() {
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        const res = await axios.get("/books?sort=rating&order=desc&limit=6");
        setBooks(res.data);
      } catch (err) {
        toast.error("Failed to load top books");
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  return (
    <div className="container">
      <section className="hero">
        <div className="left">
          <h1>Discover & review the books you love</h1>
          <p>Explore curated top-rated picks, add your own reviews, and manage your collection.</p>
          <div style={{marginTop:12, display:'flex', gap:10}}>
            <a className="btn" href="#top-books">Explore top books</a>
            <a className="btn-outline" href="/all-books">Browse all</a>
          </div>
        </div>
        <div style={{flexBasis:360, textAlign:'right'}}>
          <img src="https://images.unsplash.com/photo-1512820790803-83ca734da794?w=800&q=80" alt="books" style={{width:280,borderRadius:12,boxShadow:'0 12px 36px rgba(0,0,0,0.06)'}} />
        </div>
      </section>

      <h2 id="top-books" style={{marginTop:8}}>Top Rated Books</h2>

      {loading ? <LoadingSpinner /> : <BookGrid books={books} />}
    </div>
  );
}
