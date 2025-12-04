// client/src/components/BookGrid.jsx
import React from "react";
import BookCard from "./BookCard";

export default function BookGrid({ books }) {
  if (!books || books.length === 0) {
    return <div className="empty">No books yet. Try adding one 😊</div>;
  }
  return (
    <div className="book-grid">
      {books.map(b => <BookCard key={b._id} book={b} />)}
    </div>
  );
}
