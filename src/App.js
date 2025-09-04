import React, { useEffect, useState } from "react";
import { getNotes, createNote, updateNote, deleteNote, shareNote } from "./api";

function App() {
  const [notes, setNotes] = useState([]);
  const [newNote, setNewNote] = useState({ title: "", content: "" });

  useEffect(() => {
    loadNotes();
  }, []);

  const loadNotes = async () => {
    try {
      const data = await getNotes();
      setNotes(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error("Error fetching notes:", error);
      setNotes([]);
    }
  };

  const handleCreate = async (e) => {
    e.preventDefault();
    if (!newNote.title || !newNote.content) return;

    try {
      await createNote(newNote);
      setNewNote({ title: "", content: "" });
      loadNotes();
    } catch (error) {
      console.error("Error creating note:", error);
    }
  };

  const handleUpdate = async (note) => {
    const updatedContent = prompt("Edit note content:", note.content);
    if (!updatedContent) return;

    try {
      await updateNote(note.id, { ...note, content: updatedContent });
      loadNotes();
    } catch (error) {
      console.error("Error updating note:", error);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this note?")) return;
    try {
      await deleteNote(id);
      loadNotes();
    } catch (error) {
      console.error("Error deleting note:", error);
    }
  };

  const handleShare = async (id) => {
    try {
      const result = await shareNote(id);
      navigator.clipboard.writeText(result.publicUrl); // copy to clipboard
      alert(`Shareable link copied to clipboard:\n${result.publicUrl}`);
    } catch (error) {
      console.error("Error sharing note:", error);
      alert("Failed to create shareable link");
    }
  };

  return (
    <div style={{ maxWidth: "600px", margin: "50px auto", fontFamily: "Arial" }}>
      <h1 style={{ textAlign: "center" }}>📝 Notes App</h1>

      {/* Add Note */}
      <form onSubmit={handleCreate} style={{ marginBottom: "30px" }}>
        <input
          type="text"
          placeholder="Title"
          value={newNote.title}
          onChange={(e) => setNewNote({ ...newNote, title: e.target.value })}
          style={{ width: "100%", padding: "10px", marginBottom: "10px" }}
          required
        />
        <textarea
          placeholder="Content"
          value={newNote.content}
          onChange={(e) => setNewNote({ ...newNote, content: e.target.value })}
          style={{ width: "100%", padding: "10px", marginBottom: "10px" }}
          rows={4}
          required
        />
        <button
          type="submit"
          style={{
            padding: "10px 20px",
            background: "#4CAF50",
            color: "white",
            border: "none",
            cursor: "pointer",
          }}
        >
          Add Note
        </button>
      </form>

      {/* Notes List */}
      {notes.length === 0 ? (
        <p style={{ textAlign: "center" }}>No notes yet!</p>
      ) : (
        <ul style={{ listStyle: "none", padding: 0 }}>
          {notes.map((note) => (
            <li
              key={note.id}
              style={{
                border: "1px solid #ccc",
                padding: "15px",
                marginBottom: "15px",
                borderRadius: "5px",
                boxShadow: "1px 1px 5px rgba(0,0,0,0.1)",
              }}
            >
              <h3 style={{ margin: "0 0 10px 0" }}>{note.title}</h3>
              <p>{note.content}</p>
              <div style={{ marginTop: "10px" }}>
                <button onClick={() => handleUpdate(note)} style={{ marginRight: "10px" }}>Edit</button>
                <button onClick={() => handleDelete(note.id)} style={{ marginRight: "10px", background: "#f44336", color: "white", border: "none" }}>Delete</button>
                <button onClick={() => handleShare(note.id)} style={{ background: "#2196F3", color: "white", border: "none" }}>Share</button>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default App;
