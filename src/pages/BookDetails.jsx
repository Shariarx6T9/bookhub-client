// client/src/pages/BookDetails.jsx
import React, { useEffect, useState } from "react";
import axios from "../services/axiosInstance";
import { useParams, Link } from "react-router-dom";
import LoadingSpinner from "../components/LoadingSpinner";
import toast from "react-hot-toast";

export default function BookDetails({ user }) {
  const { id } = useParams();
  const [book, setBook] = useState(null);
  const [loading, setLoading] = useState(true);
  const [imageLoading, setImageLoading] = useState(true);

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
  if (!book) return (
    <div className="container">
      <div className="empty">
        <div className="text-6xl mb-4">📚</div>
        <h3 className="text-xl font-semibold text-white mb-2">Book not found</h3>
        <p className="text-white/60 mb-6">The book you're looking for doesn't exist or has been removed.</p>
        <Link to="/all-books" className="btn">Browse All Books</Link>
      </div>
    </div>
  );

  const isOwner = user && user.email === book.userEmail;

  const getRatingStars = (rating) => {
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 !== 0;
    const emptyStars = 5 - fullStars - (hasHalfStar ? 1 : 0);
    
    return (
      <div className="flex items-center gap-1">
        {[...Array(fullStars)].map((_, i) => (
          <span key={i} className="text-yellow-400 text-lg">★</span>
        ))}
        {hasHalfStar && <span className="text-yellow-400 text-lg">☆</span>}
        {[...Array(emptyStars)].map((_, i) => (
          <span key={i} className="text-white/20 text-lg">★</span>
        ))}
      </div>
    );
  };

  return (
    <div className="container">
      {/* Breadcrumb */}
      <nav className="flex items-center gap-2 text-sm text-white/60 mb-6">
        <Link to="/" className="hover:text-white transition">Home</Link>
        <span>›</span>
        <Link to="/all-books" className="hover:text-white transition">All Books</Link>
        <span>›</span>
        <span className="text-white">{book.title}</span>
      </nav>

      <div className="book-details-container">
        <div className="book-cover-section">
          <div className="book-cover-wrapper">
            {imageLoading && (
              <div className="book-cover-skeleton">
                <LoadingSpinner size={32} />
              </div>
            )}
            <img 
              src={book.coverUrl} 
              alt={book.title} 
              className={`book-detail-cover ${imageLoading ? 'opacity-0' : 'opacity-100'}`}
              onLoad={() => setImageLoading(false)}
              onError={() => setImageLoading(false)}
            />
          </div>
          
          <div className="book-actions-section">
            {isOwner ? (
              <div className="owner-actions">
                <Link 
                  to={`/update-book/${book._id}`} 
                  className="btn w-full flex items-center justify-center gap-2"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                  </svg>
                  Edit Book
                </Link>
                <Link 
                  to="/my-books" 
                  className="btn-outline w-full flex items-center justify-center gap-2"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                  </svg>
                  My Books
                </Link>
              </div>
            ) : (
              <div className="reader-actions">
                <Link 
                  to="/all-books" 
                  className="btn-outline w-full flex items-center justify-center gap-2"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                  </svg>
                  Browse More Books
                </Link>
                {user && (
                  <Link 
                    to="/add-book" 
                    className="btn w-full flex items-center justify-center gap-2"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                    </svg>
                    Add Your Book
                  </Link>
                )}
              </div>
            )}
          </div>
        </div>
        
        <div className="book-content-section">
          <div className="book-header">
            <h1 className="book-detail-title">{book.title}</h1>
            <p className="book-detail-author">by {book.author}</p>
            
            <div className="book-rating-showcase">
              <div className="rating-display">
                {getRatingStars(book.rating)}
                <span className="rating-number">{book.rating}</span>
                <span className="rating-text">out of 5 stars</span>
              </div>
              <span className="genre-tag">{book.genre}</span>
            </div>
          </div>
          
          {book.summary && (
            <div className="book-summary-section">
              <h3 className="section-title">
                <svg className="w-5 h-5 inline mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                About this book
              </h3>
              <p className="book-summary">{book.summary}</p>
            </div>
          )}
          
          <div className="book-meta-section">
            <h3 className="section-title">
              <svg className="w-5 h-5 inline mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              Book Details
            </h3>
            <div className="meta-grid">
              <div className="meta-item">
                <span className="meta-label mr-2">
                  <svg className="w-4 h-4 inline mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                  Added by
                </span>
                <span className="meta-value">{book.userName}</span>
              </div>
              <div className="meta-item">
                <span className="meta-label mr-2">
                  <svg className="w-4 h-4 inline mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
                  </svg>
                  Genre
                </span>
                <span className="meta-value">{book.genre}</span>
              </div>
              <div className="meta-item">
                <span className="meta-label mr-2">
                  <svg className="w-4 h-4 inline mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
                  </svg>
                  Rating
                </span>
                <span className="meta-value">{book.rating}/5</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
