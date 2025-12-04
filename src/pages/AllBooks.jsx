// client/src/pages/AllBooks.jsx
import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axios from "../services/axiosInstance";
import LoadingSpinner from "../components/LoadingSpinner";
import BookGrid from "../components/BookGrid";
import toast from "react-hot-toast";

export default function AllBooks() {
  const [books, setBooks] = useState([]);
  const [order, setOrder] = useState("desc");
  const [q, setQ] = useState("");
  const [loading, setLoading] = useState(true);

  const fetch = async () => {
    setLoading(true);
    try {
      const res = await axios.get(`/books?sort=rating&order=${order}&q=${encodeURIComponent(q)}`);
      setBooks(res.data);
    } catch (err) {
      toast.error("Failed to fetch books");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetch(); }, [order]);

  return (
    <div className="container">
      <h1 className="page-title">All Books</h1>
      
      <div className="search-section">
        <form onSubmit={(e) => { e.preventDefault(); fetch(); }} className="search-form">
          <div className="flex-1 flex gap-3">
            <input 
              className="search-input" 
              placeholder="Search by title, author, or genre..." 
              value={q} 
              onChange={e=>setQ(e.target.value)} 
            />
            <button className="btn px-6" type="submit">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </button>
          </div>
          <select className="filter-select" value={order} onChange={e=>setOrder(e.target.value)}>
            <option value="desc">⭐ Rating: High → Low</option>
            <option value="asc">⭐ Rating: Low → High</option>
          </select>
        </form>
        
        {books.length > 0 && !loading && (
          <div className="mt-4 text-white/60 text-sm">
            Found {books.length} book{books.length !== 1 ? 's' : ''}
            {q && ` matching "${q}"`}
          </div>
        )}
      </div>

      {loading ? (
        <LoadingSpinner />
      ) : books.length === 0 ? (
        <div className="empty">
          <div className="text-6xl mb-4">📚</div>
          <h3 className="text-xl font-semibold text-white mb-2">
            {q ? 'No books found' : 'No books available'}
          </h3>
          <p className="text-white/60">
            {q ? `Try searching for something else` : 'Be the first to add a book!'}
          </p>
        </div>
      ) : (
        <BookGrid books={books} />
      )}
    </div>
  );
}
