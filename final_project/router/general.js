const express = require("express");
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();

public_users.post("/register", (req, res) => {
  const username = req.body.username;
  const password = req.body.password;

  if (username && password) {
    if (!isValid(username)) {
      users.push({ username, password });
      return res
        .status(200)
        .json({ message: `new user ${username} registered` });
    } else {
      return res
        .status(404)
        .json({ message: `user ${username} already exist` });
    }
  }

  if (!username) {
    return res.status(404).json({ message: "please provide username" });
  }
  if (!password) {
    return res.status(404).json({ message: "please provide password" });
  }

  return res.status(404).json({ message: "unable to register new user" });
});

// Get the book list available in the shop
public_users.get("/", function (req, res) {
  return res.status(200).send(JSON.stringify(books, null, 0));
});

// Get book details based on ISBN
public_users.get("/isbn/:isbn", function (req, res) {
  const isbnNumber = req.params.isbn;

  if (isbnNumber) {
    for (let data in Object.keys(books)) {
      if (data === isbnNumber) {
        return res.status(200).json({ bookData: books[data] });
      }
    }
  }

  return res.status(200).json({ message: "requested book is not avalible" });
});

// Get book details based on author
public_users.get("/author/:author", function (req, res) {
  const authorName = req.params.author;

  if (authorName) {
    for (let data in books) {
      if (books[data].author === authorName) {
        return res.status(200).json({ bookData: books[data] });
      }
    }
  }

  return res
    .status(200)
    .json({ message: "requested author book is not avalible" });
});

// Get all books based on title
public_users.get("/title/:title", function (req, res) {
  const titleName = req.params.title;

  if (titleName) {
    for (let data in books) {
      if (books[data].title === titleName) {
        return res.status(200).json({ bookData: books[data] });
      }
    }
  }

  return res.status(200).json({ message: "requested book is not avalible" });
});

//  Get book review
public_users.get("/review/:isbn", function (req, res) {
  const isbnNumber = req.params.isbn;

  if (isbnNumber) {
    for (let data in books) {
      if (data === isbnNumber) {
        return res.status(200).json({ reviews: books[data].reviews });
      }
    }
  }

  return res.status(200).json({
    message: `reviews is not avalible for request isbn ${isbnNumber}`,
  });
});

// following code relate to task 10 , 11 , 12 and 13
const axios = require("axios");

// getting all books data using async await with axios
const allBooksDataFunction = async (url) => {
  try {
    const bookRequest = await axios.get(url);
    const booksData = bookRequest.data;

    console.log("all books Data", booksData);
  } catch (err) {
    console.log(err.message);
  }
};
// allBooksDataFunction("http://127.0.0.1:5030/");

// getting all book data by isbn using async await with axios
const isbnBasedSearchFunction = async (url) => {
  try {
    const bookRequest = await axios.get(url);
    const bookData = bookRequest.data;

    console.log("isbn based book Data", bookData);
  } catch (err) {
    console.log(err.message);
  }
};
// isbnBasedSearchFunction("http://127.0.0.1:5030/isbn/1");

// getting all book data by author using async await with axios
const authorBasedSearchFunction = async (url) => {
  try {
    const bookRequest = await axios.get(url);
    const bookData = bookRequest.data;

    console.log("author based book Data", bookData);
  } catch (err) {
    console.log(err.message);
  }
};
// authorBasedSearchFunction("http://127.0.0.1:5030/author/Jane Austen");

// getting all book data by title using async await with axios
const titleBasedSearchFunction = async (url) => {
  try {
    const bookRequest = await axios.get(url);
    const bookData = bookRequest.data;

    console.log("title based book Data", bookData);
  } catch (err) {
    console.log(err.message);
  }
};
// titleBasedSearchFunction("http://127.0.0.1:5030/title/Fairy tales");

module.exports.general = public_users;
