import { useState, useEffect } from 'react';
import axios from 'axios';
import './App.css';

function App() {
  const [books, setBooks] = useState([]);

  const [title, setTitle] = useState("");
  const [releaseYear, setReleaseYear] = useState("");
  const [editing, setEditing] = useState(false);
  const [bookId, setBookId] = useState(null); // Track which book is being edited

  useEffect(() => {
    fetchBooks();
  }, []);

  // GET: Fetch all books
  const fetchBooks = async () => {
    try {
      const response = await axios.get("https://book-store-django-react.onrender.com/api/books/");
      setBooks(response.data);
    } catch (error) {
      console.error("Error fetching books", error);
    }
  };

  // POST: Add new book
  const addBook = async () => {
    try {
      await axios.post("https://book-store-django-react.onrender.com/api/books/create/", {
        title: title,
        release_year: releaseYear,
      });
      resetForm();
      fetchBooks();
    } catch (error) {
      console.error("Error adding book", error);
    }
  };

  // PUT: Update book
  const updateBook = async () => {
    try {
      await axios.put(`https://book-store-django-react.onrender.com/api/books/${bookId}/`, {
        title: title,
        release_year: releaseYear,
      });
      resetForm();
      fetchBooks();
    } catch (error) {
      console.error("Error updating book", error);
    }
  };

  // DELETE: Delete book
  const deleteBook = async (id) => {
    try {
      await axios.delete(`https://book-store-django-react.onrender.com/api/books/${id}/`);
      fetchBooks();
    } catch (error) {
      console.error("Error deleting book", error);
    }
  };

  // Prefill form for editing
  const startEditing = (book) => {
    setEditing(true);
    setTitle(book.title);
    setReleaseYear(book.release_year);
    setBookId(book.id);
  };

  // Reset form
  const resetForm = () => {
    setTitle("");
    setReleaseYear("");
    setEditing(false);
    setBookId(null);
  };

  return (
    <>
      <h1>📚 Book Website</h1>

      <div>
        <input
          type="text"
          placeholder="Book Title..."
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
        <input
          type="number"
          placeholder="Release Year"
          value={releaseYear}
          onChange={(e) => setReleaseYear(e.target.value)}
        />
        <button onClick={editing ? updateBook : addBook}>
          {editing ? "Update Book" : "Add Book"}
        </button>
        {editing && <button onClick={resetForm}>Cancel Edit</button>}
      </div>

      <div>
        {books.map((book) => (
          <div key={book.id} style={{ borderBottom: "1px solid #ccc", margin: "10px 0" }}>
            <p><strong>Title:</strong> {book.title}</p>
            <p><strong>Release:</strong> {book.release_year}</p>
            <button onClick={() => startEditing(book)}>✏️ Edit</button>
            <button onClick={() => deleteBook(book.id)}>🗑️ Delete</button>
          </div>
        ))}
      </div>
    </>
  );
}

export default App;
