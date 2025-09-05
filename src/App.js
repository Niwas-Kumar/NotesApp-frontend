import React, { useState, useEffect } from "react";
import {
  getNotes,
  createNote,
  updateNote,
  deleteNote,
  shareNote,
} from "./api";

function App() {
  const [notes, setNotes] = useState([]);
  const [newNote, setNewNote] = useState({ title: "", content: "" });
  const [editingId, setEditingId] = useState(null);
  const [editingNote, setEditingNote] = useState({ title: "", content: "" });

  useEffect(() => {
    getNotes()
      .then(setNotes)
      .catch((err) => console.error("Error loading notes:", err));
  }, []);

  const handleCreate = async () => {
    try {
      const note = await createNote(newNote);
      setNotes([...notes, note]);
      setNewNote({ title: "", content: "" });
    } catch (err) {
      console.error(err);
      alert("Failed to create note");
    }
  };

  const handleUpdate = async (id) => {
    try {
      const updated = await updateNote(id, editingNote);
      setNotes(notes.map((n) => (n.id === id ? updated : n)));
      setEditingId(null);
    } catch (err) {
      console.error(err);
      alert("Failed to update note");
    }
  };

  const handleDelete = async (id) => {
    try {
      await deleteNote(id);
      setNotes(notes.filter((n) => n.id !== id));
    } catch (err) {
      console.error(err);
      alert("Failed to delete note");
    }
  };

  const handleShare = async (id) => {
    try {
      const { publicUrl } = await shareNote(id);
      alert(`Shareable Link: ${publicUrl}`);
    } catch (err) {
      console.error(err);
      alert("Failed to share note");
    }
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
              {editingId === note.id ? (
                <>
                  <input
                    type="text"
                    value={editingNote.title}
                    onChange={(e) =>
                      setEditingNote({ ...editingNote, title: e.target.value })
                    }
                  />
                  <textarea
                    value={editingNote.content}
                    onChange={(e) =>
                      setEditingNote({
                        ...editingNote,
                        content: e.target.value,
                      })
                    }
                  />
                  <button onClick={() => handleUpdate(note.id)}>Save</button>
                  <button onClick={() => setEditingId(null)}>Cancel</button>
                </>
              ) : (
                <>
                  <h3>{note.title}</h3>
                  <p>{note.content}</p>
                  <button
                    onClick={() => {
                      setEditingId(note.id);
                      setEditingNote({ title: note.title, content: note.content });
                    }}
                  >
                    Edit
                  </button>
                  <button onClick={() => handleDelete(note.id)}>Delete</button>
                  <button onClick={() => handleShare(note.id)}>Share</button>
                </>
              )}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default App;
