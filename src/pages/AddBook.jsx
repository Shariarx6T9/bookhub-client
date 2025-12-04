// client/src/pages/AddBook.jsx
import React, { useState } from "react";
import axios from "../services/axiosInstance";
import { uploadToImgBB } from "../services/imgbb";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import LoadingSpinner from "../components/LoadingSpinner";

export default function AddBook({ user }) {
  const nav = useNavigate();
  const [form, setForm] = useState({ title:'', author:'', genre:'', rating:4, summary:'' });
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [preview, setPreview] = useState(null);

  const change = (e) => setForm({...form, [e.target.name]: e.target.value});

  const onFile = (e) => {
    const f = e.target.files[0];
    setFile(f);
    setPreview(f ? URL.createObjectURL(f) : null);
  };

  const submit = async (e) => {
    e.preventDefault();
    if (!file) { toast.error("Please select a cover image"); return; }
    setLoading(true);
    try {
      const url = await uploadToImgBB(file);      
      const payload = { ...form, rating: Number(form.rating), coverUrl: url, userName: user.displayName || user.email, userEmail: user.email };
      await axios.post("/books", payload);
      toast.success("Book added");
      nav("/my-books");
    } catch (err) {
      toast.error("Failed to add book");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container">
      <h1 className="page-title">Add New Book</h1>
      
      <div className="form-container">
        <div className="form-grid">
          <form onSubmit={submit} className="form-fields ">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <input 
                name="title" 
                className="input" 
                value={form.title} 
                onChange={change} 
                required 
                placeholder="Book Title" 
              />
              <input 
                name="author" 
                className="input" 
                value={form.author} 
                onChange={change} 
                required 
                placeholder="Author Name" 
              />
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <input 
                name="genre" 
                className="input" 
                value={form.genre} 
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
                  value={form.rating} 
                  onChange={change}
                  required 
                />
              </div>
            </div>
            
            <textarea 
              name="summary" 
              className="input" 
              rows="4" 
              value={form.summary} 
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
                required
              />
            </div>
            
            <button 
              className="btn w-full md:w-auto px-8" 
              type="submit" 
              disabled={loading}
            >
              {loading ? (
                <span className="flex items-center gap-2">
                  <LoadingSpinner size={20} />
                  Adding Book...
                </span>
              ) : (
                'Add Book'
              )}
            </button>
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
                  <p>No image selected</p>
                  <p className="text-xs mt-1">Upload a cover image</p>
                </div>
              )}
            </div>
            
            {form.title && (
              <div className="mt-4 p-4 bg-white/5 rounded-lg">
                <h4 className="font-semibold text-white">{form.title}</h4>
                {form.author && <p className="text-white/80 text-sm">by {form.author}</p>}
                {form.genre && <p className="text-white/60 text-xs mt-1">{form.genre}</p>}
                {form.rating && <p className="text-yellow-400 text-sm mt-1">⭐ {form.rating}</p>}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
