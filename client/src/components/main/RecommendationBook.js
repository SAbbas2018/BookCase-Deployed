import React from "react";
function RecommendationBook(props) {
  const book = props.book;
  const { bookLink } = book;
  return (
    <div className="book-container">
      <img className="book-cover" src={book.bookImg} alt={book.bookName}></img>
      <div className="book-info">
        <p className="book-title">{book.bookTitle}</p>
        <p>{book.bookAuthor}</p>
        <a
          href={bookLink}
          target="_blank"
          rel="noopener noreferrer"
          className="book-link"
        >
          <i className="fab fa-google"></i>
        </a>
      </div>
    </div>
  );
}

export default RecommendationBook;
