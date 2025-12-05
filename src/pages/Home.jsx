import React, { useEffect, useState, useMemo } from "react";
import { Link } from "react-router-dom";
import axios from "../services/axiosInstance";
import LoadingSpinner from "../components/LoadingSpinner";
import BookGrid from "../components/BookGrid";
import toast from "react-hot-toast";

const Home = React.memo(() => {
  const [topBooks, setTopBooks] = useState([]);
  const [latestBooks, setLatestBooks] = useState([]);
  const [loading, setLoading] = useState(true);

  const genres = useMemo(() => [
    { name: "Fiction", image: "https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=400", count: "120+" },
    { name: "Mystery", image: "https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=400", count: "85+" },
    { name: "Romance", image: "https://images.unsplash.com/photo-1474552226712-ac0f0961a954?w=400", count: "95+" },
    { name: "Sci-Fi", image: "https://images.unsplash.com/photo-1446776877081-d282a0f896e2?w=400", count: "70+" }
  ], []);

  const features = useMemo(() => [
    {
      icon: "M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253",
      title: "Discover Books",
      desc: "Find your next favorite read from our curated collection",
      color: "text-purple-400"
    },
    {
      icon: "M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z",
      title: "Rate & Review",
      desc: "Share your thoughts and help others discover great books",
      color: "text-blue-400"
    },
    {
      icon: "M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10",
      title: "Manage Collection",
      desc: "Organize your personal library with ease",
      color: "text-green-400"
    }
  ], []);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [topRes, latestRes] = await Promise.all([
          axios.get("/books?sort=rating&order=desc&limit=6"),
          axios.get("/books?sort=createdAt&order=desc&limit=6")
        ]);
        setTopBooks(topRes.data);
        setLatestBooks(latestRes.data);
      } catch (err) {
        toast.error("Failed to load books");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  return (
    <div className="min-h-screen">
      <section className="banner-section">
        <div className="banner-content">
          <div className="banner-text">
            <h1 className="banner-title">
              Welcome to <span className="text-gradient">BookHub</span>
            </h1>
            <p className="banner-subtitle">
              Your digital sanctuary for discovering, reviewing, and managing your favorite books
            </p>
            <div className="banner-buttons">
              <Link to="/all-books" className="btn-primary">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                </svg>
                Explore All Books
              </Link>
              <Link to="/add-book" className="btn-secondary">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                </svg>
                Add Your Book
              </Link>
            </div>
          </div>
          <div className="banner-image">
            <div className="floating-books">
              <img src="https://images.unsplash.com/photo-1512820790803-83ca734da794?w=400" alt="Books" className="book-float-1" loading="lazy" />
              <img src="https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=400" alt="Books" className="book-float-2" loading="lazy" />
              <img src="https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=400" alt="Books" className="book-float-3" loading="lazy" />
              <img src="https://images.unsplash.com/photo-1515879218367-8466d910aaa4?w=400" alt="Books" className="book-float-4" loading="lazy" />
              <img src="https://images.unsplash.com/photo-1474552226712-ac0f0961a954?w=400" alt="Books" className="book-float-5" loading="lazy" />
              <img src="https://images.unsplash.com/photo-1507842217343-583bb7270b66?w=400" alt="Books" className="book-float-6" loading="lazy" />
            </div>
          </div>
        </div>
      </section>

      <div className="container">
        <section className="section">
          <div className="section-header">
            <h2 className="section-title">Latest Additions</h2>
            <p className="section-subtitle">Discover the newest books added to our collection</p>
          </div>
          {loading ? <LoadingSpinner /> : <BookGrid books={latestBooks} />}
        </section>

        <section className="section">
          <div className="section-header">
            <h2 className="section-title">Popular Genres</h2>
            <p className="section-subtitle">Explore books by your favorite genres</p>
          </div>
          <div className="genres-grid">
            {genres.map((genre, index) => (
              <div key={genre.name} className="genre-card">
                <img src={genre.image} alt={genre.name} className="genre-image" loading="lazy" />
                <div className="genre-overlay">
                  <h3 className="genre-name">{genre.name}</h3>
                  <p className="genre-count">{genre.count} books</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        <section className="section">
          <div className="about-section">
            <div className="about-content">
              <h2 className="section-title">About BookHub</h2>
              <p className="about-text">
                BookHub is your personal digital library where book lovers come together to discover, 
                review, and share their favorite reads. Whether you're looking for your next great adventure 
                or want to share your thoughts on a recent page-turner, BookHub provides the perfect platform 
                to connect with fellow bibliophiles.
              </p>
              <div className="about-features">
                {features.map((feature) => (
                  <div key={feature.title} className="feature-item">
                    <svg className={`w-8 h-8 ${feature.color}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={feature.icon} />
                    </svg>
                    <div>
                      <h4 className="feature-title">{feature.title}</h4>
                      <p className="feature-desc">{feature.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <div className="about-image">
              <img src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=600" alt="Reading" className="rounded-2xl shadow-2xl" loading="lazy" />
            </div>
          </div>
        </section>

        <section className="section">
          <div className="section-header">
            <h2 className="section-title">Top Rated Books</h2>
            <p className="section-subtitle">Highly recommended by our community</p>
          </div>
          {loading ? <LoadingSpinner /> : <BookGrid books={topBooks} />}
        </section>
      </div>
    </div>
  );
});

export default Home;