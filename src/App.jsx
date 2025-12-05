import React, { useEffect, useState, Suspense, lazy } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from './firebase/firebaseConfig';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import LoadingSpinner from './components/LoadingSpinner';

// Lazy load components for better performance
const Home = lazy(() => import('./pages/Home'));
const AllBooks = lazy(() => import('./pages/AllBooks'));
const AddBook = lazy(() => import('./pages/AddBook'));
const MyBooks = lazy(() => import('./pages/MyBooks'));
const UpdateBook = lazy(() => import('./pages/UpdateBook'));
const BookDetails = lazy(() => import('./pages/BookDetails'));
const Profile = lazy(() => import('./pages/Profile'));
const Login = lazy(() => import('./pages/Login'));
const Register = lazy(() => import('./pages/Register'));
const NotFound = lazy(() => import('./pages/NotFound'));

const App = React.memo(() => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setLoading(false);
    });
    return unsubscribe;
  }, []);

  // if (loading) return <LoadingSpinner />;

  return (
    <BrowserRouter future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
      <div className="min-h-screen flex flex-col">
        <Navbar user={user} />
        <main className="flex-1">
          <Toaster position="top-right" toastOptions={{ style: { marginTop: '80px' } }} />
          <Suspense fallback={<LoadingSpinner variant="overlay" text="Loading page..." />}>
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/all-books" element={<AllBooks user={user} />} />
              <Route path="/add-book" element={user ? <AddBook user={user} /> : <Login />} />
              <Route path="/my-books" element={user ? <MyBooks user={user} /> : <Login />} />
              <Route path="/update-book/:id" element={user ? <UpdateBook user={user} /> : <Login />} />
              <Route path="/profile" element={user ? <Profile user={user} /> : <Login />} />
              <Route path="/book/:id" element={<BookDetails user={user} />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </Suspense>
        </main>
        <Footer />
      </div>
    </BrowserRouter>
  );
});

export default App;