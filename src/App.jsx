import React, { useEffect, useState } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import AllBooks from './pages/AllBooks';
import AddBook from './pages/AddBook';
import MyBooks from './pages/MyBooks';
import UpdateBook from './pages/UpdateBook';
import BookDetails from './pages/BookDetails';
import Login from './pages/Login';
import Register from './pages/Register';
import NotFound from './pages/NotFound';
import LoadingSpinner from './components/LoadingSpinner';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from './firebase/firebaseConfig';

export default function App(){
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(()=>{
    const unsub = onAuthStateChanged(auth, u => { setUser(u); setLoading(false); });
    return () => unsub();
  },[]);

  if (loading) return <LoadingSpinner />;

  return (
    <BrowserRouter>
      <Navbar user={user} />
      <Toaster position="top-center" />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/all-books" element={<AllBooks />} />
        <Route path="/add-book" element={user ? <AddBook user={user} /> : <Login />} />
        <Route path="/my-books" element={user ? <MyBooks user={user} /> : <Login />} />
        <Route path="/update-book/:id" element={user ? <UpdateBook user={user} /> : <Login />} />
        <Route path="/book/:id" element={user ? <BookDetails user={user} /> : <Login />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  );
}
