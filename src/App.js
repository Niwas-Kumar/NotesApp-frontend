import React, { useEffect, useState } from "react";

// --- API functions ---
const API_BASE_URL = "https://notesapp-backend-2-y9fw.onrender.com/api";


const getNotes = async () => {
  const res = await fetch(BASE_URL);
  return res.json();
};

const createNote = async (note) => {
  const res = await fetch(BASE_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(note),
  });
  return res.json();
};

const updateNote = async (id, note) => {
  const res = await fetch(`${BASE_URL}/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(note),
  });
  return res.json();
};

const deleteNote = async (id) => {
  const res = await fetch(`${BASE_URL}/${id}`, { method: "DELETE" });
  return res.json();
};

const shareNote = async (id) => {
  const res = await fetch(`${BASE_URL}/${id}/share`, { method: "POST" });
  return res.json(); // returns { publicUrl: "http://..." }
};

const getSharedNote = async (token) => {
  const res = await fetch(`http://localhost:8081/api/public/${token}`);
  if (!res.ok) throw new Error("Note not found");
  return res.json();
};

// --- App component ---
function App() {
  const [notes, setNotes] = useState([]);
  const [newNote, setNewNote] = useState({ title: "", content: "" });
  const [sharedNote, setSharedNote] = useState(null);
  const [shareToken, setShareToken] = useState(null);

  useEffect(() => {
    const path = window.location.pathname;
    if (path.startsWith("/n/")) {
      const token = path.split("/n/")[1];
      setShareToken(token);
      fetchSharedNote(token);
    } else {
      loadNotes();
    }
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

  const fetchSharedNote = async (token) => {
    try {
      const note = await getSharedNote(token);
      setSharedNote(note);
    } catch (err) {
      console.error("Shared note not found", err);
      setSharedNote(null);
    }
  };

  const handleCreate = async (e) => {
    e.preventDefault();
    if (!newNote.title || !newNote.content) return;
    try {
      await createNote(newNote);
      setNewNote({ title: "", content: "" });
      loadNotes();
    } catch (err) {
      console.error("Error creating note:", err);
    }
  };

  const handleUpdate = async (note) => {
    const updatedContent = prompt("Edit note content:", note.content);
    if (!updatedContent) return;
    try {
      await updateNote(note.id, { ...note, content: updatedContent });
      loadNotes();
    } catch (err) {
      console.error("Error updating note:", err);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this note?")) return;
    try {
      await deleteNote(id);
      loadNotes();
    } catch (err) {
      console.error("Error deleting note:", err);
    }
  };

  const handleShare = async (id) => {
    try {
      const result = await shareNote(id);
      // Use backend publicUrl directly
      navigator.clipboard.writeText(result.publicUrl);
      alert(`Shareable link copied to clipboard:\n${result.publicUrl}`);
    } catch (err) {
      console.error("Error sharing note:", err);
      alert("Failed to create shareable link");
    }
  };

  // --- Render shared note ---
  if (shareToken && sharedNote) {
    return (
      <div style={{ maxWidth: "600px", margin: "50px auto", fontFamily: "Arial" }}>
        <h1 style={{ textAlign: "center" }}>{sharedNote.title}</h1>
        <pre style={{ whiteSpace: "pre-wrap", fontSize: "16px" }}>{sharedNote.content}</pre>
      </div>
    );
  }

  // --- Render main app ---
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
          style={{ padding: "10px 20px", background: "#4CAF50", color: "white", border: "none", cursor: "pointer" }}
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
                <button onClick={() => handleUpdate(note)} style={{ marginRight: "10px" }}>
                  Edit
                </button>
                <button
                  onClick={() => handleDelete(note.id)}
                  style={{ marginRight: "10px", background: "#f44336", color: "white", border: "none" }}
                >
                  Delete
                </button>
                <button
                  onClick={() => handleShare(note.id)}
                  style={{ background: "#2196F3", color: "white", border: "none" }}
                >
                  Share
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default App;
