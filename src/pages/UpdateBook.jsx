// client/src/pages/UpdateBook.jsx
import React, { useEffect, useState } from "react";
import axios from "../services/axiosInstance";
import { uploadToImgBB } from "../services/imgbb";
import toast from "react-hot-toast";
import { useNavigate, useParams } from "react-router-dom";
import LoadingSpinner from "../components/LoadingSpinner";

export default function UpdateBook() {
  const { id } = useParams();
  const nav = useNavigate();
  const [book, setBook] = useState(null);
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [loading, setLoading] = useState(true);

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
    setLoading(true);
    try {
      let image = book.coverUrl;
      if (file) image = await uploadToImgBB(file);
      const payload = { ...book, coverUrl: image };
      await axios.put(`/books/${id}`, payload);
      toast.success("Book updated successfully");
      nav("/my-books");
    } catch (err) {
      toast.error("Failed to update book");
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <LoadingSpinner />;
  if (!book) return <div className="container"><div className="empty">Book not found</div></div>;

  return (
    <div className="container">
      <h1>Update Book</h1>
      <div className="form" style={{ display: "grid", gridTemplateColumns: "1fr 260px", gap: 16 }}>
        <form onSubmit={submit} style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          <input name="title" className="input" value={book.title} onChange={change} required placeholder="Title" />
          <input name="author" className="input" value={book.author} onChange={change} required placeholder="Author" />
          <input name="genre" className="input" value={book.genre} onChange={change} required placeholder="Genre" />
          <input name="rating" className="input" type="number" min="0" max="5" step="0.1" value={book.rating} onChange={change} />
          <textarea name="summary" className="input" rows="6" value={book.summary} onChange={change} placeholder="Summary" />
          <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
            <input type="file" accept="image/*" onChange={onFile} />
            <button className="btn" type="submit" disabled={loading}>
              {loading ? <LoadingSpinner size={24} /> : "Update"}
            </button>
          </div>
        </form>
        <div>
          <div style={{ fontWeight: 700, marginBottom: 8 }}>Preview</div>
          <div style={{ width: 220, height: 320, borderRadius: 8, background: "#fafafa", display: "flex", alignItems: "center", justifyContent: "center", overflow: "hidden" }}>
            {preview ? <img src={preview} alt="preview" style={{ width: "100%", height: "100%", objectFit: "cover" }} /> : <div style={{ color: "var(--muted)" }}>No image selected</div>}
          </div>
        </div>
      </div>
    </div>
  );
}
