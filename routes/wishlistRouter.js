const router = require("express").Router();
const User = require("../models/userModel");
const Axios = require("axios");
const path = require("path");
require("dotenv").config({ path: "../config/config.env" });
/*
    ReqType: POST URL: /home/wishlist/add
    Access: Public
    Desc: add new book to user wishlist list in db
*/
router.post("/add", async (req, res) => {
  try {
    const { email, book } = req.body;

    const user = await User.findOne({ email: email });
    if (!user) {
      return res
        .status(400)
        .json({ message: "No user with this email exists" });
    }
    await User.updateOne({ email: email }, { $addToSet: { wishlist: book } });
    res.status(200).json({ message: "success" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

/*
    ReqType: POST URL: /home/wishlist/getBook
    Access: Public
    Desc: Get Book info from google books api
*/
router.post("/getBook", async (req, res) => {
  try {
    const { bookIsbn } = req.body;
    let apiRes = await Axios.get(
      `https://www.googleapis.com/books/v1/volumes?q=isbn:${bookIsbn}&key=${process.env.API_KEY}`
    );
    // console.log(req.body);
    let bookData = { ...apiRes.data };
    let bookTitle = bookData.items[0].volumeInfo.title;
    let bookAuthor;
    let bookLink = bookData.items[0].volumeInfo.previewLink;
    bookData.items[0].volumeInfo.authors
      ? (bookAuthor = bookData.items[0].volumeInfo.authors[0])
      : (bookAuthor = "No Author Found");
    let bookImg = bookData.items[0].volumeInfo.imageLinks.smallThumbnail;
    let book = { bookTitle, bookAuthor, bookImg, bookLink };
    res.status(200).json({ book });
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: err.message });
  }
});

/*
    ReqType: POST URL: /home/library/deleteBook
    Access: Public
    Desc: delete book from library
    I tried using router.delete as an end route
    the back end code worked fine, however
    axios on the frontend with react did not want to 
    work. Even using the docs to create the proper
    config for the request didnt work
    so I resorted to just using a post request since 
    thats been working fine
*/
router.post("/deleteBook", async (req, res) => {
  try {
    const { bookTitle, email } = req.body;
    // console.log(req.body);
    const user = await User.findOne({ email: email });
    if (!user) {
      return res
        .status(400)
        .json({ message: "No user with this email exists" });
    }
    await User.updateOne(
      { email: email },
      { $pull: { wishlist: { bookTitle: bookTitle } } }
    );
    res.status(200).json({ message: "success" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
