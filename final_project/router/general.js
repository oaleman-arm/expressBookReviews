const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const axios = require('axios');
const public_users = express.Router();


public_users.post("/register", (req,res) => {
  const username = req.body.username;
    const password = req.body.password;
    // Check if both username and password are provided
    if (username && password) {
        // Check if the user does not already exist
        if (!isValid(username)) {
            // Add the new user to the users array
            users.push({"username": username, "password": password});
            return res.status(200).json({message: "User successfully registered. Now you can login"});
        } else {
            return res.status(404).json({message: "User already exists!"});
        }
    }
    // Return error if username or password is missing
    return res.status(404).json({message: "Unable to register user."});
});

// Internal route: return raw books data without HTTP client
public_users.get('/data', function (req, res) {
  return res.status(200).json(books);
});

// Get the book list available in the shop (uses Axios async/await to fetch internal data)
public_users.get('/', async function (req, res) {
  try {
    const base = `${req.protocol}://${req.get('host')}`;
    const response = await axios.get(`${base}/data`);
    return res.status(200).json(response.data);
  } catch (error) {
    return res.status(500).json({ message: "Error fetching books", error: error.message });
  }
});

// Get the book list using Axios with Promise callbacks
public_users.get('/books/promise', (req, res) => {
  const base = `${req.protocol}://${req.get('host')}`;
  axios.get(`${base}/data`)
    .then(response => {
      return res.status(200).json(response.data);
    })
    .catch(error => {
      return res.status(500).json({ message: 'Error fetching books', error: error.message });
    });
});

// Get the book list using Axios with async/await
public_users.get('/books/async', async (req, res) => {
  try {
    const base = `${req.protocol}://${req.get('host')}`;
    const response = await axios.get(`${base}/data`);
    return res.status(200).json(response.data);
  } catch (error) {
    return res.status(500).json({ message: 'Error fetching books', error: error.message });
  }
});

// Get book details based on ISBN
public_users.get('/isbn/:isbn', async function (req, res) {
  const isbn = req.params.isbn;
  try {
    const base = `${req.protocol}://${req.get('host')}`;
    const response = await axios.get(`${base}/data`);
    const book = Object.values(response.data).find(b => b.isbn === isbn);
    if (book) {
      return res.status(200).json(book);
    } else {
      return res.status(404).json({ message: "Book not found" });
    }
  } catch (error) {
    return res.status(500).json({ message: "Error fetching book", error: error.message });
  }
});

// ISBN lookup using Axios with Promise callbacks
public_users.get('/isbn/promise/:isbn', (req, res) => {
  const isbn = req.params.isbn;
  const base = `${req.protocol}://${req.get('host')}`;
  axios.get(`${base}/data`)
    .then(response => {
      const book = Object.values(response.data).find(b => b.isbn === isbn);
      if (book) {
        return res.status(200).json(book);
      } else {
        return res.status(404).json({ message: 'Book not found' });
      }
    })
    .catch(error => {
      return res.status(500).json({ message: 'Error fetching book', error: error.message });
    });
});
  
// Get book details based on author (async/await via Axios)
public_users.get('/author/:author', async function (req, res) {
  const author = req.params.author;
  try {
    const base = `${req.protocol}://${req.get('host')}`;
    const response = await axios.get(`${base}/data`);
    const booksByAuthor = Object.values(response.data).filter(b => b.author === author);
    if (booksByAuthor.length > 0) {
      return res.status(200).json(booksByAuthor);
    } else {
      return res.status(404).json({ message: "No books found for the given author" });
    }
  } catch (error) {
    return res.status(500).json({ message: 'Error fetching books by author', error: error.message });
  }
});

// Author lookup using Axios with Promise callbacks
public_users.get('/author/promise/:author', (req, res) => {
  const author = req.params.author;
  const base = `${req.protocol}://${req.get('host')}`;
  axios.get(`${base}/data`)
    .then(response => {
      const booksByAuthor = Object.values(response.data).filter(b => b.author === author);
      if (booksByAuthor.length > 0) {
        return res.status(200).json(booksByAuthor);
      } else {
        return res.status(404).json({ message: 'No books found for the given author' });
      }
    })
    .catch(error => {
      return res.status(500).json({ message: 'Error fetching books by author', error: error.message });
    });
});

// Get all books based on title (async/await via Axios)
public_users.get('/title/:title', async function (req, res) {
  const title = req.params.title;
  try {
    const base = `${req.protocol}://${req.get('host')}`;
    const response = await axios.get(`${base}/data`);
    const booksByTitle = Object.values(response.data).filter(b => b.title === title);
    if (booksByTitle.length > 0) {
      return res.status(200).json(booksByTitle);
    } else {
      return res.status(404).json({ message: "No books found for the given title" });
    }
  } catch (error) {
    return res.status(500).json({ message: 'Error fetching books by title', error: error.message });
  }
});

// Title lookup using Axios with Promise callbacks
public_users.get('/title/promise/:title', (req, res) => {
  const title = req.params.title;
  const base = `${req.protocol}://${req.get('host')}`;
  axios.get(`${base}/data`)
    .then(response => {
      const booksByTitle = Object.values(response.data).filter(b => b.title === title);
      if (booksByTitle.length > 0) {
        return res.status(200).json(booksByTitle);
      } else {
        return res.status(404).json({ message: 'No books found for the given title' });
      }
    })
    .catch(error => {
      return res.status(500).json({ message: 'Error fetching books by title', error: error.message });
    });
});

//  Get book review
public_users.get('/review/:isbn',function (req, res) {
  const isbn = req.params.isbn;
  const book = Object.values(books).find(b => b.isbn === isbn);
  if (book) {
    return res.status(200).json(book.reviews);
  } else {
    return res.status(404).json({message: "Book not found"});
  }
});

module.exports.general = public_users;
