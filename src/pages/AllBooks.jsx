import React, { useEffect, useState, useCallback, useMemo } from "react";
import { Link } from "react-router-dom";
import axios from "../services/axiosInstance";
import LoadingSpinner from "../components/LoadingSpinner";
import SkeletonLoader from "../components/SkeletonLoader";
import toast from "react-hot-toast";
import { useApiProtection } from "../hooks/useApiProtection";
import { useDebounce } from "../hooks/useDebounce";
import { useConfirm } from "../hooks/useConfirm";
import ConfirmDialog from "../components/ConfirmDialog";

const AllBooks = React.memo(({ user }) => {
  const [books, setBooks] = useState([]);
  const [order, setOrder] = useState("desc");
  const [q, setQ] = useState("");
  const debouncedQ = useDebounce(q, 300);
  const [loading, setLoading] = useState(true);
  const { protectedRequest, cancelAll } = useApiProtection();
  const { dialog, confirm, cancel } = useConfirm();

  const fetchBooks = useCallback(async () => {
    setLoading(true);
    const result = await protectedRequest(
      async (signal) => {
        const res = await axios.get(`/books?sort=rating&order=${order}&q=${encodeURIComponent(debouncedQ)}`, { signal });
        return res.data;
      },
      `fetch-books-${order}-${debouncedQ}`
    );
    
    setBooks(result || []);
    setLoading(false);
  }, [order, debouncedQ, protectedRequest]);

  const handleDelete = useCallback(async (bookId, bookTitle) => {
    const confirmed = await confirm('Delete Book', `Are you sure you want to delete "${bookTitle}"? This action cannot be undone.`);
    if (!confirmed) return;
    
    const result = await protectedRequest(
      async (signal) => {
        await axios.delete(`/books/${bookId}`, { signal });
        return true;
      },
      `delete-book-${bookId}`
    );
    
    if (result) {
      toast.success('Book deleted successfully');
      fetchBooks();
    }
  }, [confirm, protectedRequest, fetchBooks]);

  const handleSearch = useCallback((e) => {
    e.preventDefault();
    fetchBooks();
  }, [fetchBooks]);

  const getRatingStars = useCallback((rating) => {
    const fullStars = Math.floor(rating);
    const emptyStars = 5 - fullStars;
    return (
      <div className="flex items-center gap-1">
        {Array(fullStars).fill(0).map((_, i) => (
          <span key={`full-${i}`} className="text-yellow-400">★</span>
        ))}
        {Array(emptyStars).fill(0).map((_, i) => (
          <span key={`empty-${i}`} className="text-white/20">★</span>
        ))}
      </div>
    );
  }, []);

  const resultsText = useMemo(() => {
    if (books.length === 0) return null;
    const count = `${books.length} book${books.length !== 1 ? 's' : ''}`;
    return q ? `${count} matching "${q}"` : count;
  }, [books.length, q]);

  useEffect(() => {
    fetchBooks();
    return cancelAll;
  }, [fetchBooks, cancelAll]);

  return (
    <div className="container">
      <h1 className="page-title">All Books</h1>
      
      <div className="search-section">
        <form onSubmit={handleSearch} className="search-form">
          <div className="flex-1 flex gap-3">
            <input 
              className="search-input" 
              placeholder="Search by title, author, or genre..." 
              value={q} 
              onChange={e => setQ(e.target.value)} 
            />
            <button className="btn px-6" type="submit">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </button>
          </div>
          <select className="filter-select" value={order} onChange={e => setOrder(e.target.value)}>
            <option value="desc">⭐ Rating: High → Low</option>
            <option value="asc">⭐ Rating: Low → High</option>
          </select>
        </form>
        
        {resultsText && !loading && (
          <div className="mt-4 text-white/60 text-sm">Found {resultsText}</div>
        )}
      </div>

      {loading ? (
        <SkeletonLoader type="table" />
      ) : books.length === 0 ? (
        <div className="empty">
          <div className="text-6xl mb-4">📚</div>
          <h3 className="text-xl font-semibold text-white mb-2">
            {q ? 'No books found' : 'No books available'}
          </h3>
          <p className="text-white/60">
            {q ? 'Try searching for something else' : 'Be the first to add a book!'}
          </p>
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
                {books.map((book) => {
                  const isOwner = user?.email === book.userEmail;
                  return (
                    <tr key={book._id}>
                      <td className="book-title-cell">
                        <div className="flex items-center gap-3">
                          <img 
                            src={book.coverUrl} 
                            alt={book.title} 
                            className="w-12 h-16 object-cover rounded"
                            loading="lazy"
                          />
                          <span className="font-medium">{book.title}</span>
                        </div>
                      </td>
                      <td className="author-cell">{book.author}</td>
                      <td>
                        <span className="genre-badge">{book.genre}</span>
                      </td>
                      <td>
                        <div className="rating-display">
                          <div className="rating-stars">
                            {getRatingStars(book.rating)}
                          </div>
                          <span className="rating-number">{book.rating}</span>
                        </div>
                      </td>
                      <td>
                        <div className="actions-container">
                          <Link 
                            to={`/book/${book._id}`} 
                            className="action-btn view-btn"
                            title="View Details"
                          >
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                            </svg>
                          </Link>
                          {isOwner && (
                            <>
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
                                onClick={() => handleDelete(book._id, book.title)}
                                className="action-btn delete-btn"
                                title="Delete Book"
                              >
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                </svg>
                              </button>
                            </>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}
      
      <ConfirmDialog
        isOpen={dialog.isOpen}
        title={dialog.title}
        message={dialog.message}
        onConfirm={dialog.onConfirm}
        onCancel={cancel}
      />
    </div>
  );
});

export default AllBooks;