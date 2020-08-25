import React from "react";
import Axios from "axios";
function Book(props) {
  const book = props.book;
  const email = props.email;
  const bookTitle = book.bookTitle;
  const onClick = async (e) => {
    try {
      //   console.log(bookTitle, email);
      // I tried using router.delete as an end route
      // the back end code worked fine, however
      // axios on the frontend with react did not want to
      // work. Even using the docs to create the proper
      // config for the request didnt work
      // so I resorted to just using a post request since
      // thats been working fine
      await Axios.post(
        "/home/library/deleteBook",
        { bookTitle, email: email },
        {
          headers: { "Content-Type": "application/JSON" },
        }
      );
      props.bookRemoved(bookTitle);
    } catch (err) {
      console.log(err);
    }
  };
  return (
    <div className="book-container">
      <img className="book-cover" src={book.bookImg} alt={book.bookName}></img>
      <div className="book-info">
        <p className="book-title">{book.bookTitle}</p>
        <p>{book.bookAuthor}</p>
      </div>
      <div className="button-container">
        <button
          type="button"
          className="btn btn-danger btn-sm"
          onClick={onClick}
        >
          X
        </button>
      </div>
    </div>
  );
}

export default Book;
