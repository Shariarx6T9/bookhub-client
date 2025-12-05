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
        <div className="books-table-container">
          <div className="overflow-x-auto">
            <table className="books-table">
              <thead>
                <tr>
                  <th>Book Name</th>
                  <th>Author</th>
                  <th>Genre</th>
                  <th>Rating</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {books.map((book) => (
                  <tr key={book._id}>
                    <td className="book-title-cell">
                      <div className="flex items-center gap-4">
                        <img 
                          src={book.coverUrl} 
                          alt={book.title} 
                          className="w-14 h-20 object-cover rounded-xl shadow-2xl border-2 border-white/30 flex-shrink-0"
                        />
                        <span className="font-bold text-white text-sm leading-tight truncate">{book.title}</span>
                      </div>
                    </td>
                    <td className="author-cell">{book.author}</td>
                    <td>
                      <span className="genre-badge">{book.genre}</span>
                    </td>
                    <td>
                      <div className="rating-display">
                        <div className="rating-stars">
                          {[...Array(Math.floor(book.rating))].map((_, i) => (
                            <span key={i} className="text-yellow-400">★</span>
                          ))}
                          {[...Array(5 - Math.floor(book.rating))].map((_, i) => (
                            <span key={i} className="text-white/20">★</span>
                          ))}
                        </div>
                        <span className="rating-number">{book.rating}</span>
                      </div>
                    </td>
                    <td>
                      <div className="actions-container">
                        <Link 
                          to={`/update-book/${book._id}`} 
                          className="action-btn edit-btn"
                          title="Edit Book"
                        >
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                          </svg>
                        </Link>
                        <button 
                          onClick={() => remove(book._id)}
                          className="action-btn delete-btn"
                          title="Delete Book"
                        >
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                          </svg>
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
