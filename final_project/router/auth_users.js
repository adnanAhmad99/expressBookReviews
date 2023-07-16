const express = require("express");
const jwt = require("jsonwebtoken");
let books = require("./booksdb.js");
const regd_users = express.Router();

let users = [];

const isValid = (username) => {
  for (let data of users) {
    if (data.username === username) {
      return true;
    }
  }
  return false;
};

const authenticatedUser = (username, password) => {
  const filterArray = users.filter(
    (data) => data.username === username && data.password === password
  );
  if (filterArray.length > 0) {
    return true;
  } else {
    return false;
  }
};

//only registered users can login
regd_users.post("/login", (req, res) => {
  const username = req.body.username;
  const password = req.body.password;

  if (!username && !password) {
    return res.status(403).json({ message: "incorrect information provided" });
  }

  if (authenticatedUser(username, password)) {
    const jwtAccessToken = jwt.sign({ data: password }, "secretCode", {
      expiresIn: 60 * 60,
    });

    req.session.authorizedData = { jwtAccessToken, username };

    return res
      .status(200)
      .json({ message: `${username} successfully loggedin` });
  } else {
    return res.status(200).json({ message: "invlid login data" });
  }
});

// Add a book review
regd_users.put("/auth/review/:isbn", (req, res) => {
  const bookData = books[req.params.isbn];
  const bookReviewSObject = bookData.reviews;
  const username = req.session.authorizedData["username"];
  const comment = req.query["comment"];

  if (bookReviewSObject[username] == undefined) {
    if (comment) {
      bookReviewSObject[username] = {
        comment,
        date: Date.now(),
      };
    }
  } else {
    if (comment) {
      bookReviewSObject[username]["comment"] = comment;
      bookReviewSObject[username]["date"] = Date.now();
    }
  }

  bookData["reviews"] = bookReviewSObject;
  books[req.params.isbn] = bookData;

  return res.status(200).json({ bookData });
});

// deleting a book review
regd_users.delete("/auth/review/:isbn", (req, res) => {
  const username = req.session.authorizedData["username"];
  const bookData = books[req.params.isbn];
  const bookReviewSObject = bookData.reviews;

  if (bookReviewSObject[username] !== undefined) {
    delete bookReviewSObject[username];

    bookData["reviews"] = bookReviewSObject;
    books[req.params.isbn] = bookData;

    return res
      .status(200)
      .json({ message: `comment posted by ${username} is deleted`, bookData });
  }

  return res.status(200).json({ message: "still implementing" });
});

module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
