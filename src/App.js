import React, { useState, useEffect } from "react";

const BASE_URL = "https://notesapp-backend-2-y9fw.onrender.com/api";

function App() {
  const [notes, setNotes] = useState([]);
  const [newNote, setNewNote] = useState({ title: "", content: "" });

  // Fetch notes
  useEffect(() => {
    fetch(`${BASE_URL}/notes`)
      .then((res) => res.json())
      .then((data) => setNotes(data))
      .catch((err) => console.error("Error fetching notes:", err));
  }, []);

  // Create note
  const handleCreate = () => {
    fetch(`${BASE_URL}/notes`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(newNote),
    })
      .then((res) => res.json())
      .then((note) => {
        setNotes([...notes, note]);
        setNewNote({ title: "", content: "" });
      });
  };

  // Update note
  const handleUpdate = (id, updatedNote) => {
    fetch(`${BASE_URL}/notes/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(updatedNote),
    })
      .then((res) => res.json())
      .then((note) => {
        setNotes(notes.map((n) => (n.id === id ? note : n)));
      });
  };

  // Delete note
  const handleDelete = (id) => {
    fetch(`${BASE_URL}/notes/${id}`, { method: "DELETE" }).then(() => {
      setNotes(notes.filter((n) => n.id !== id));
    });
  };

  // Share note
  const handleShare = (id) => {
    fetch(`${BASE_URL}/notes/${id}/share`, { method: "POST" })
      .then((res) => res.json())
      .then((data) => {
        alert(`Shareable Link: ${data.publicUrl}`);
      });
  };

  return (
    <div style={{ maxWidth: "600px", margin: "0 auto" }}>
      <h1>Notes App</h1>

      {/* Create new note */}
      <div style={{ marginBottom: "20px" }}>
        <input
          type="text"
          placeholder="Title"
          value={newNote.title}
          onChange={(e) => setNewNote({ ...newNote, title: e.target.value })}
        />
        <textarea
          placeholder="Content"
          value={newNote.content}
          onChange={(e) => setNewNote({ ...newNote, content: e.target.value })}
        />
        <button onClick={handleCreate}>Add Note</button>
      </div>

      {/* Notes list */}
      {notes.length === 0 ? (
        <p>No notes yet</p>
      ) : (
        <ul style={{ listStyle: "none", padding: 0 }}>
          {notes.map((note) => (
            <li
              key={note.id}
              style={{
                border: "1px solid #ddd",
                padding: "10px",
                marginBottom: "10px",
              }}
            >
              <h3>{note.title}</h3>
              <p>{note.content}</p>
              <button
                onClick={() =>
                  handleUpdate(note.id, {
                    ...note,
                    title: note.title + " (updated)",
                  })
                }
              >
                Update
              </button>
              <button onClick={() => handleDelete(note.id)}>Delete</button>
              <button onClick={() => handleShare(note.id)}>Share</button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default App;
