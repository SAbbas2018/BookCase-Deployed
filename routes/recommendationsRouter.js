const router = require("express").Router();
const User = require("../models/userModel");
const Axios = require("axios");
const path = require("path");
require("dotenv").config({ path: "../config/config.env" });

/*
    ReqType: POST URL: /home/recommendations/getBooks
    Access: Public
    Desc: Get Book info from google books api
    /home/recomendations/getBooks
*/
router.post("/getBooks", async (req, res) => {
  try {
    let authorList = [];
    let books = [];
    // let toReturn = [];
    let alreadyAddedBooks = new Set();
    const { email } = req.body;
    // Check user with this email exists,
    // because we need their wishlist and library
    const user = await User.findOne({ email: email });
    if (!user) {
      return res
        .status(400)
        .json({ message: "No user with this email exists" });
    }
    // Now if library is not empty, add the authors, add the title of the books
    // to the alreadyAddedBooks set so we dont recommend a book user already
    // has in wishlist or library
    if (user.library !== []) {
      user.library.forEach((book) => {
        if (!authorList.includes(book.bookAuthor)) {
          authorList.push(book.bookAuthor);
        }
        alreadyAddedBooks.add(book.bookTitle);
      });
    }
    // Repeat for wishlist
    if (user.wishlist !== []) {
      user.wishlist.forEach((book) => {
        if (!authorList.includes(book.bookAuthor)) {
          authorList.push(book.bookAuthor);
        }
        alreadyAddedBooks.add(book.bookTitle);
      });
    }

    // If authorList is empty now, it means there were no books
    // in the library or wishlist
    if (authorList.length == 0) {
      res.status(200).json({
        message:
          "There are no books in your library or wishlist yet, please add books to get recommendations",
      });
    }

    // loop through authorList and make api calls to google books to books by the authors
    for (let i = 0; i < authorList.length; i = i + 1) {
      let author = authorList[i];
      console.log(author);
      let apiRes = await Axios.get(
        `https://www.googleapis.com/books/v1/volumes?q=inauthor:${author}&key=${process.env.API_KEY}`
      );
      let bookData = { ...apiRes.data };
      let bookTitle;
      let bookAuthor;
      let bookImg;
      let bookLink;
      for (let i = 0; i < 2; i = i + 1) {
        bookTitle = bookData.items[i].volumeInfo.title;
        bookAuthor = author;
        bookImg = bookData.items[i].volumeInfo.imageLinks.smallThumbnail;
        bookLink = bookData.items[0].volumeInfo.previewLink;
        // console.log(!alreadyAddedBooks.has(bookTitle));
        if (!alreadyAddedBooks.has(bookTitle)) {
          books.push({ bookTitle, bookAuthor, bookImg, bookLink });
        }
        // console.log({ bookTitle, bookAuthor, bookImg, bookLink });
      }
    }
    // console.log(books);
    res.status(200).json({ books });
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
