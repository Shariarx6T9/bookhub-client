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
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-8">
        <h1 className="page-title mb-4 sm:mb-0">My Books</h1>
        <Link to="/add-book" className="btn flex items-center gap-2">
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
          </svg>
          Add New Book
        </Link>
      </div>

      {books.length > 0 && !loading && (
        <div className="mb-6 p-4 bg-[var(--card)] rounded-xl border border-white/10">
          <div className="flex items-center gap-4 text-white/80">
            <div className="flex items-center gap-2">
              <span className="text-2xl font-bold text-white">{books.length}</span>
              <span>book{books.length !== 1 ? 's' : ''}</span>
            </div>
            <div className="h-4 w-px bg-white/20"></div>
            <div className="flex items-center gap-2">
              <span className="text-yellow-400">⭐</span>
              <span>{(books.reduce((sum, b) => sum + b.rating, 0) / books.length).toFixed(1)} avg rating</span>
            </div>
          </div>
        </div>
      )}

      {loading ? (
        <LoadingSpinner />
      ) : books.length === 0 ? (
        <div className="empty">
          <div className="text-6xl mb-4">📚</div>
          <h3 className="text-xl font-semibold text-white mb-2">No books yet</h3>
          <p className="text-white/60 mb-6">Start building your collection by adding your first book!</p>
          <Link to="/add-book" className="btn">
            Add Your First Book
          </Link>
        </div>
      ) : (
        <div className="book-grid">
          {books.map((b) => (
            <div key={b._id} className="my-book-card">
              <div className="book-cover-container">
                <img
                  src={b.coverUrl}
                  alt={b.title}
                  className="book-cover"
                />
                <div className="book-actions">
                  <Link 
                    to={`/update-book/${b._id}`} 
                    className="action-btn edit-btn"
                    title="Edit book"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                    </svg>
                  </Link>
                  <button
                    onClick={() => remove(b._id)}
                    className="action-btn delete-btn"
                    title="Delete book"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                  </button>
                </div>
              </div>
              <div className="book-info">
                <h3 className="book-title">{b.title}</h3>
                <p className="book-meta">{b.author} • {b.genre}</p>
                <div className="flex items-center justify-between mt-3">
                  <div className="badge">⭐ {b.rating}</div>
                  <Link 
                    to={`/book/${b._id}`} 
                    className="text-[var(--accent-2)] hover:text-[var(--accent)] text-sm font-medium transition"
                  >
                    View Details →
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
