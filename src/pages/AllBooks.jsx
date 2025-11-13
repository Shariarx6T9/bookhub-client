// client/src/pages/AllBooks.jsx
import React, { useEffect, useState } from "react";
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
      <h1>All Books</h1>
      <form onSubmit={(e) => { e.preventDefault(); fetch(); }} style={{display:'flex',gap:10,alignItems:'center'}}>
        <input className="input" placeholder="Search title or author" value={q} onChange={e=>setQ(e.target.value)} style={{maxWidth:320}} />
        <button className="btn">Search</button>
        <select className="input" value={order} onChange={e=>setOrder(e.target.value)} style={{width:180}}>
          <option value="desc">Rating High → Low</option>
          <option value="asc">Rating Low → High</option>
        </select>
      </form>

      {loading ? <LoadingSpinner /> : <BookGrid books={books} />}
    </div>
  );
}
