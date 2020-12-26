import React, { Component } from "react";
import UserContext from "../../context/UserContext";
import Axios from "axios";
import ErrorNotice from "../ErrorNotice";
import WishlistBook from "./WishlistBook";
export default class Wishlist extends Component {
  static contextType = UserContext;
  constructor(props) {
    super(props);
    this.state = {
      isbn: "",
      errorM: "",
      wishlist: [],
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
        wishlist: userData.user.wishlist,
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
    const { userData, setUserData } = this.context;
    let newWishlist = this.state.wishlist.filter((book) => {
      return book.bookTitle !== name;
    });
    this.setState((prevState) => {
      return {
        ...prevState,
        wishlist: newWishlist,
      };
    });
    let user = { ...userData.user, wishlist: newWishlist };
    setUserData({ ...userData, user });
  }
  onSubmit = async (e) => {
    const { userData, setUserData } = this.context;
    e.preventDefault();
    try {
      //   console.log(isbn);
      let getBook = await Axios.post(
        "/home/wishlist/getBook",
        { bookIsbn: this.state.isbn },
        {
          headers: { "Content-Type": "application/JSON" },
        }
      );
      const { book } = getBook.data;

      let wishlist = this.state.wishlist.filter((item) => {
        return item.bookTitle !== book.bookTitle;
      });
      wishlist.push(book);
      this.setState((prevState) => {
        return {
          ...prevState,
          wishlist: wishlist,
        };
      });
      await Axios.post(
        "/home/wishlist/add",
        {
          email: this.state.userEmail,
          book,
        },
        { headers: { "Content-Type": "application/JSON" } }
      );
      let user = { ...userData.user, wishlist: this.state.wishlist };
      setUserData({ ...userData, user });
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
                id="wishlist-add"
                type="text"
                placeholder="Book ISBN-13"
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
          {this.state.wishlist.map((book, index) => {
            return (
              <div key={index}>
                <WishlistBook
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
