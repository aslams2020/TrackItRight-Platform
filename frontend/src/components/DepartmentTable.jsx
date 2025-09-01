// src/components/DepartmentTable.jsx
import React, { useState } from "react";
import "../styles/DepartmentTable.css";

export default function DepartmentTable({ departments, onChange }) {
  const token = localStorage.getItem("token");
  const [editingId, setEditingId] = useState(null);
  const [draft, setDraft] = useState({ name: "", description: "" });
  const [busy, setBusy] = useState(false);

  const startEdit = (d) => {
    setEditingId(d.id);
    setDraft({ name: d.name ?? "", description: d.description ?? "" });
  };

  const cancelEdit = () => {
    setEditingId(null);
    setDraft({ name: "", description: "" });
  };
  const saveEdit = async (id) => {
  setBusy(true);
  try {
    // Add both name and description to the payload
    const res = await fetch(`http://localhost:8080/api/admin/departments/${id}`, {
      method: "PUT",
      headers: {
        "Authorization": `Bearer ${token}`,
        "Content-Type": "application/json",
        "Accept": "application/json"
      },
      body: JSON.stringify({
        name: draft.name,
        description: draft.description
      })
    });
      const text = await res.text();
      if (!res.ok) throw new Error(text);
      setEditingId(null);
      onChange?.();
    } catch (e) {
      alert(`Failed to update: ${e.message?.slice(0, 300)}`);
    } finally { setBusy(false); }
  };

  const destroy = async (id) => {
    if (!window.confirm("Delete this department?")) return;
    setBusy(true);
    try {
      const res = await fetch(`http://localhost:8080/api/admin/departments/${id}`, {
        method: "DELETE",
        headers: {
          "Authorization": `Bearer ${token}`,
          "Accept": "application/json"
        }
      });
      const text = await res.text();
      if (!res.ok) throw new Error(text);
      onChange?.();
    } catch (e) {
      alert(`Failed to delete: ${e.message?.slice(0, 300)}`);
    } finally { setBusy(false); }
  };

  return (
    <div className="dept-table">
      <h1>Departments</h1>
      <table>
        <thead>
          <tr>
            <th style={{width: "30%"}}>Name</th>
            <th>Description</th>
            <th style={{width: "18%"}}>Actions</th>
          </tr>
        </thead>
        <tbody>
          {departments.length === 0 ? (
            <tr><td colSpan={3} className="muted">No departments.</td></tr>
          ) : departments.map(d => (
            <tr key={d.id}>
              <td>
                {editingId === d.id ? (
                  <input
                    value={draft.name}
                    onChange={e => setDraft(prev => ({ ...prev, name: e.target.value }))}
                  />
                ) : d.name}
              </td>
              <td>
                {editingId === d.id ? (
                  <input
                    value={draft.description}
                    onChange={e => setDraft(prev => ({ ...prev, description: e.target.value }))}
                  />
                ) : (d.description ?? "-")}
              </td>
              <td>
                <div className="row-actions">
                  {editingId === d.id ? (
                    <>
                      <button disabled={busy} onClick={() => saveEdit(d.id)}>Save</button>
                      <button className="secondary" onClick={cancelEdit}>Cancel</button>
                    </>
                  ) : (
                    <>
                      <button onClick={() => startEdit(d)}>Edit</button>
                      <button className="danger" onClick={() => destroy(d.id)} disabled={busy}>Delete</button>
                    </>
                  )}
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
