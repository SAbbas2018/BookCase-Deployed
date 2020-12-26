import Axios from "axios";

export const updateTestAcc = async (userData) => {
  if (userData.user.name === "Test Account") {
    // Set library
    const library = [
      {
        bookTitle:
          "Percy Jackson and the Olympians, Book One: Lightning Thief, The (Movie Tie-In Edition)",
        bookAuthor: "Rick Riordan",
        bookImg:
          "http://books.google.com/books/content?id=sAOJngEACAAJ&printsec=frontcover&img=1&zoom=5&source=gbs_api",
      },
      {
        bookTitle: "The Fall",
        bookAuthor: "Albert Camus",
        bookImg:
          "http://books.google.com/books/content?id=OqEOMA-X0EkC&printsec=frontcover&img=1&zoom=5&edge=curl&source=gbs_api",
      },
    ];
    const wishlist = [
      {
        bookTitle: "Harry Potter and the Prisoner of Azkaban",
        bookAuthor: "J.K. Rowling",
        bookImg:
          "http://books.google.com/books/content?id=wHlDzHnt6x0C&printsec=frontcover&img=1&zoom=5&source=gbs_api",
        bookLink:
          "http://books.google.com/books?id=wHlDzHnt6x0C&dq=isbn:9781781100233&hl=&cd=1&source=gbs_api",
      },
      {
        bookTitle: "Harry Potter and the Philosopher's Stone",
        bookAuthor: "J.K. Rowling",
        bookImg:
          "http://books.google.com/books/content?id=39iYWTb6n6cC&printsec=frontcover&img=1&zoom=5&source=gbs_api",
        bookLink:
          "http://books.google.com/books?id=39iYWTb6n6cC&dq=isbn:9781781100219&hl=&cd=1&source=gbs_api",
      },
    ];
    try {
      console.log("hey");
      await Axios.post("/users/updateTestAcc", {
        email: userData.user.email,
        library,
        wishlist,
      });
    } catch (error) {
      if (error.response.data.message) {
        console.log(error.response.data.message);
      }
    }
  }
};
