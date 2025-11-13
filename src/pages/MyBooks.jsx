// client/src/pages/MyBooks.jsx
import React, { useEffect, useState } from "react";
import axios from "../services/axiosInstance";
import toast from "react-hot-toast";
import { Link } from "react-router-dom";
import LoadingSpinner from "../components/LoadingSpinner";

export default function MyBooks({ user }) {
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetch = async () => {
    if (!user) return;
    setLoading(true);
    try {
      const res = await axios.get(`/books/user/${user.email}`);
      setBooks(res.data);
    } catch (err) {
      toast.error("Failed to load your books");
    } finally {
      setLoading(false);
    }
  };

  const remove = async (id) => {
    const yes = window.confirm("Are you sure you want to delete this book?");
    if (!yes) return;
    try {
      await axios.delete(`/books/${id}`);
      toast.success("Deleted successfully");
      setBooks((prev) => prev.filter((b) => b._id !== id));
    } catch (err) {
      toast.error("Failed to delete");
    }
  };

  useEffect(() => {
    fetch();
  }, [user]);

  if (!user)
    return (
      <div className="container">
        <div className="empty">Please login to see your books.</div>
      </div>
    );

  return (
    <div className="container">
      <h1>My Books</h1>

      {loading ? (
        <LoadingSpinner />
      ) : books.length === 0 ? (
        <div className="empty">No books added yet. Add one now! 📚</div>
      ) : (
        <div className="grid">
          {books.map((b) => (
            <div key={b._id} className="card" style={{ flexDirection: "column" }}>
              <img
                src={b.coverUrl}
                alt={b.title}
                style={{
                  width: "100%",
                  height: 220,
                  objectFit: "cover",
                  borderRadius: 10,
                }}
              />
              <div style={{ marginTop: 10 }}>
                <h3 style={{ margin: "0 0 4px" }}>{b.title}</h3>
                <p style={{ color: "var(--muted)", fontSize: 14, margin: "0 0 10px" }}>
                  {b.author} • {b.genre}
                </p>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <div className="badge">⭐ {b.rating}</div>
                  <div style={{ display: "flex", gap: 6 }}>
                    <Link to={`/update-book/${b._id}`} className="btn-outline">
                      ✏️ Edit
                    </Link>
                    <button
                      onClick={() => remove(b._id)}
                      className="btn"
                      style={{ background: "#ef4444" }}
                    >
                      🗑 Delete
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
