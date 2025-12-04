// client/src/pages/UpdateBook.jsx
import React, { useEffect, useState } from "react";
import axios from "../services/axiosInstance";
import { uploadToImgBB } from "../services/imgbb";
import toast from "react-hot-toast";
import { useNavigate, useParams, Link } from "react-router-dom";
import LoadingSpinner from "../components/LoadingSpinner";

export default function UpdateBook({ user }) {
  const { id } = useParams();
  const nav = useNavigate();
  const [book, setBook] = useState(null);
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    (async () => {
      try {
        const res = await axios.get(`/books/${id}`);
        setBook(res.data);
        setPreview(res.data.coverUrl);
      } catch (err) {
        toast.error("Failed to load book");
      } finally {
        setLoading(false);
      }
    })();
  }, [id]);

  const change = (e) => setBook({ ...book, [e.target.name]: e.target.value });

  const onFile = (e) => {
    const f = e.target.files[0];
    setFile(f);
    setPreview(f ? URL.createObjectURL(f) : book.coverUrl);
  };

  const submit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      let image = book.coverUrl;
      if (file) {
        console.log('Uploading new image...');
        image = await uploadToImgBB(file);
      }
      const payload = { ...book, rating: Number(book.rating), coverUrl: image };
      await axios.put(`/books/${id}`, payload);
      toast.success("Book updated successfully");
      nav(`/book/${id}`);
    } catch (err) {
      console.error('Update error:', err);
      toast.error("Failed to update book");
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) return <LoadingSpinner />;
  if (!book) return <div className="container"><div className="empty">Book not found</div></div>;

  return (
    <div className="container">
      {/* Breadcrumb */}
      <nav className="flex items-center gap-2 text-sm text-white/60 mb-6">
        <Link to="/" className="hover:text-white transition">Home</Link>
        <span>›</span>
        <Link to="/my-books" className="hover:text-white transition">My Books</Link>
        <span>›</span>
        <span className="text-white">Edit {book.title}</span>
      </nav>

      <h1 className="page-title">Update Book</h1>
      
      <div className="form-container">
        <div className="form-grid">
          <form onSubmit={submit} className="form-fields">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <input 
                name="title" 
                className="input" 
                value={book.title || ''} 
                onChange={change} 
                required 
                placeholder="Book Title" 
              />
              <input 
                name="author" 
                className="input" 
                value={book.author || ''} 
                onChange={change} 
                required 
                placeholder="Author Name" 
              />
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <input 
                name="genre" 
                className="input" 
                value={book.genre || ''} 
                onChange={change} 
                required 
                placeholder="Genre (e.g., Fiction, Mystery)" 
              />
              <div>
                <label className="block text-white/80 text-sm mb-2">Rating (0-5)</label>
                <input 
                  name="rating" 
                  className="input" 
                  type="number" 
                  min="0" 
                  max="5" 
                  step="0.1" 
                  value={book.rating || 0} 
                  onChange={change}
                  required 
                />
              </div>
            </div>
            
            <textarea 
              name="summary" 
              className="input" 
              rows="4" 
              value={book.summary || ''} 
              onChange={change} 
              placeholder="Book summary or description..." 
            />
            
            <div className="space-y-4">
              <label className="block text-white/80 text-sm">Cover Image</label>
              <input 
                type="file" 
                accept="image/*" 
                onChange={onFile} 
                className="file-input"
              />
              <p className="text-white/50 text-xs">Leave empty to keep current cover image</p>
            </div>
            
            <div className="flex gap-3">
              <button 
                className="btn flex-1 md:flex-none md:px-8" 
                type="submit" 
                disabled={submitting}
              >
                {submitting ? (
                  <span className="flex items-center gap-2">
                    <LoadingSpinner size={20} />
                    Updating...
                  </span>
                ) : (
                  'Update Book'
                )}
              </button>
              <Link 
                to={`/book/${id}`} 
                className="btn-outline flex-1 md:flex-none md:px-8 flex items-center justify-center"
              >
                Cancel
              </Link>
            </div>
          </form>
          
          <div className="preview-section">
            <h3 className="text-lg font-semibold text-white mb-4">Cover Preview</h3>
            <div className="preview-box">
              {preview ? (
                <img 
                  src={preview} 
                  alt="Book cover preview" 
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="text-center text-white/40">
                  <svg className="w-16 h-16 mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                  <p>Current cover</p>
                  <p className="text-xs mt-1">Upload new image to change</p>
                </div>
              )}
            </div>
            
            {book.title && (
              <div className="mt-4 p-4 bg-white/5 rounded-lg">
                <h4 className="font-semibold text-white">{book.title}</h4>
                {book.author && <p className="text-white/80 text-sm">by {book.author}</p>}
                {book.genre && <p className="text-white/60 text-xs mt-1">{book.genre}</p>}
                {book.rating && <p className="text-yellow-400 text-sm mt-1">⭐ {book.rating}</p>}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
