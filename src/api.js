// api.js
const BASE_URL = "https://notesapp-backend-2-y9fw.onrender.com/api";

// --- CRUD ---
export const getNotes = async () => {
  const res = await fetch(`${BASE_URL}/notes`);
  if (!res.ok) throw new Error("Failed to fetch notes");
  return res.json();
};

export const createNote = async (note) => {
  const res = await fetch(`${BASE_URL}/notes`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(note),
  });
  if (!res.ok) throw new Error("Failed to create note");
  return res.json();
};

export const updateNote = async (id, note) => {
  const res = await fetch(`${BASE_URL}/notes/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(note),
  });
  if (!res.ok) throw new Error("Failed to update note");
  return res.json();
};

export const deleteNote = async (id) => {
  const res = await fetch(`${BASE_URL}/notes/${id}`, { method: "DELETE" });
  if (!res.ok) throw new Error("Failed to delete note");
  return true;
};

// --- Share ---
export const shareNote = async (id) => {
  const res = await fetch(`${BASE_URL}/notes/${id}/share`, { method: "POST" });
  if (!res.ok) throw new Error("Failed to share note");
  return res.json(); // { publicUrl: "..." }
};

export const getSharedNote = async (token) => {
  const res = await fetch(`${BASE_URL}/public/${token}`);
  if (!res.ok) throw new Error("Note not found");
  return res.json();
};
