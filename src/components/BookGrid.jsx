import React from "react";
import BookCard from "./BookCard";

const BookGrid = React.memo(({ books }) => {
  if (!books?.length) {
    return <div className="empty">No books yet. Try adding one 😊</div>;
  }
  
  return (
    <div className="book-grid">
      {books.map(book => <BookCard key={book._id} book={book} />)}
    </div>
  );
});

export default BookGrid;