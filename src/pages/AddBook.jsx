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
      <h1>Add Book</h1>
      <div className="form" style={{display:'grid',gridTemplateColumns:'1fr 260px',gap:16}}>
        <form onSubmit={submit} style={{display:'flex',flexDirection:'column',gap:12}}>
          <input name="title" className="input" value={form.title} onChange={change} required placeholder="Title" />
          <input name="author" className="input" value={form.author} onChange={change} required placeholder="Author" />
          <input name="genre" className="input" value={form.genre} onChange={change} required placeholder="Genre" />
          <input name="rating" className="input" type="number" min="0" max="5" step="0.1" value={form.rating} onChange={change} />
          <textarea name="summary" className="input" rows="6" value={form.summary} onChange={change} placeholder="Summary" />
          <div style={{display:'flex',gap:10,alignItems:'center'}}>
            <input type="file" accept="image/*" onChange={onFile} />
            <button className="btn" type="submit" disabled={loading}>{loading ? <LoadingSpinner size={24} /> : 'Add Book'}</button>
          </div>
        </form>
        <div>
          <div style={{fontWeight:700, marginBottom:8}}>Preview</div>
          <div style={{width:220, height:320, borderRadius:8, background:'#fafafa', display:'flex',alignItems:'center',justifyContent:'center',overflow:'hidden'}}>
            {preview ? <img src={preview} alt="preview" style={{width:'100%',height:'100%',objectFit:'cover'}}/> : <div style={{color:'var(--muted)'}}>No image selected</div>}
          </div>
        </div>
      </div>
    </div>
  );
}
