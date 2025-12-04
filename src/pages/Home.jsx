// client/src/pages/Home.jsx
import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
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
          <div className="flex flex-col sm:flex-row gap-3 mt-6">
            <a className="btn" href="#top-books">Explore top books</a>
            <a className="btn-outline" href="/all-books">Browse all</a>
          </div>
        </div>
        <div className="flex-shrink-0">
          <img 
            src="https://images.unsplash.com/photo-1512820790803-83ca734da794?w=800&q=80" 
            alt="books" 
            className="w-72 h-80 object-cover rounded-xl shadow-2xl" 
          />
        </div>
      </section>

      <h2 id="top-books" className="text-2xl font-bold text-white mb-8">Top Rated Books</h2>

      {loading ? <LoadingSpinner /> : <BookGrid books={books} />}
    </div>
  );
}
