import React, { Component } from "react";
import UserContext from "../../context/UserContext";
import Axios from "axios";
import ErrorNotice from "../ErrorNotice";
import Book from "./Book";
export default class LibraryClass extends Component {
  static contextType = UserContext;
  constructor(props) {
    super(props);
    this.state = {
      isbn: "",
      errorM: "",
      lib: [],
      userEmail: "",
    };
    this.setError = this.setError.bind(this);
    this.setIsbn = this.setIsbn.bind(this);
    this.onSubmit = this.onSubmit.bind(this);
    this.bookRemoved = this.bookRemoved.bind(this);
  }
  componentDidMount() {
    const { userData } = this.context;
    this.setState((prevState) => {
      return {
        ...prevState,
        lib: userData.user.library,
        userEmail: userData.user.email,
      };
    });
  }
  setError(e) {
    this.setState((prevState) => {
      return {
        ...prevState,
        errorM: e,
      };
    });
  }
  setIsbn(e) {
    this.setState((prevState) => {
      return {
        ...prevState,
        isbn: e,
      };
    });
  }

  bookRemoved(name) {
    let newLib = this.state.lib.filter((book) => {
      return book.bookTitle !== name;
    });
    this.setState((prevState) => {
      return {
        ...prevState,
        lib: newLib,
      };
    });
  }
  onSubmit = async (e) => {
    e.preventDefault();
    try {
      //   console.log(isbn);
      let getBook = await Axios.post(
        "/home/library/getBook",
        { bookIsbn: this.state.isbn },
        {
          headers: { "Content-Type": "application/JSON" },
        }
      );
      const { book } = getBook.data;
      // Add book to userData.user.library and make post req to add to db
      let library = this.state.lib.filter((item) => {
        return item.bookTitle !== book.bookTitle;
      });
      library.push(book);
      this.setState((prevState) => {
        return {
          ...prevState,
          lib: library,
        };
      });
      //   this.userData.user.library.push(book);
      await Axios.post(
        "/home/library/add",
        {
          email: this.state.userEmail,
          book,
        },
        { headers: { "Content-Type": "application/JSON" } }
      );
    } catch (err) {
      this.setError("Incorrect ISBN entered or Book Not Found");
      console.log(err);
    }
  };
  render() {
    return (
      <div className="library-container">
        {this.state.errorM && (
          <ErrorNotice
            message={this.state.errorM}
            clearError={() => this.setError(undefined)}
          />
        )}
        <div className="form-container">
          <form className="register-form" onSubmit={this.onSubmit}>
            <div className="form-group">
              <input
                id="library-add"
                type="text"
                placeholder="Book ISBN"
                className="form-control"
                onChange={(e) => this.setIsbn(e.target.value)}
              />
            </div>
            <div className="form-group">
              <input
                className="btn btn-primary btn-sm btn-block"
                type="submit"
                value="Add Book"
              />
            </div>
          </form>
        </div>
        <div className="books-container bg-light">
          {this.state.lib.map((book, index) => {
            return (
              <div key={index}>
                <Book
                  book={book}
                  email={this.state.userEmail}
                  bookRemoved={this.bookRemoved}
                />
              </div>
            );
          })}
        </div>
      </div>
    );
  }
}
