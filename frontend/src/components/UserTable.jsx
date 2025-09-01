// src/components/UserTable.jsx
import React, { useState } from "react";
import "../styles/UserTable.css";

export default function UserTable({ users, departments, onChange }) {
  const token = localStorage.getItem("token");
  const [editingId, setEditingId] = useState(null);
  const [draft, setDraft] = useState({ role: "USER", departmentId: "" });
  const [busy, setBusy] = useState(false);

  const startEdit = (u) => {
    setEditingId(u.id);
    setDraft({
      role: u.role ?? "USER",
      departmentId: u.department?.id ?? ""
    });
  };

  const cancelEdit = () => {
    setEditingId(null);
    setDraft({ role: "USER", departmentId: "" });
  };

  const saveEdit = async (id) => {
  setBusy(true);
  try {
    const payload = { role: draft.role };
    if (draft.departmentId !== "") {
      payload.departmentId = Number(draft.departmentId);
    }
    const res = await fetch(`http://localhost:8080/api/admin/users/${id}`, {
      method: "PUT",
      headers: {
        "Authorization": `Bearer ${token}`,
        "Content-Type": "application/json",
        "Accept": "application/json"
      },
      body: JSON.stringify(payload)
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
    if (!window.confirm("Delete this user?")) return;
    setBusy(true);
    try {
      const res = await fetch(`http://localhost:8080/api/admin/users/${id}`, {
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
    <div className="user-table">
      <h4>Users</h4>
      <table>
        <thead>
          <tr>
            <th style={{width:"20%"}}>Name</th>
            <th style={{width:"22%"}}>Email</th>
            <th style={{width:"14%"}}>Role</th>
            <th>Department</th>
            <th style={{width:"18%"}}>Actions</th>
          </tr>
        </thead>
        <tbody>
          {users.length === 0 ? (
            <tr><td colSpan={5} className="muted">No users.</td></tr>
          ) : users.map(u => (
            <tr key={u.id}>
              <td>{u.name}</td>
              <td>{u.email}</td>
              <td>
                {editingId === u.id ? (
                  <select
                    value={draft.role}
                    onChange={e => setDraft(prev => ({ ...prev, role: e.target.value }))}
                  >
                    <option value="USER">USER</option>
                    <option value="AUTHORITY">AUTHORITY</option>
                    <option value="ADMIN">ADMIN</option>
                  </select>
                ) : u.role}
              </td>
              <td>
                {editingId === u.id ? (
                  <select
                    value={draft.departmentId}
                    onChange={e => setDraft(prev => ({ ...prev, departmentId: e.target.value }))}
                  >
                    <option value="">-- none --</option>
                    {departments.map(d => <option key={d.id} value={d.id}>{d.name}</option>)}
                  </select>
                ) : (u.department?.name ?? "-")}
              </td>
              <td>
                <div className="row-actions">
                  {editingId === u.id ? (
                    <>
                      <button disabled={busy} onClick={() => saveEdit(u.id)}>Save</button>
                      <button className="secondary" onClick={cancelEdit}>Cancel</button>
                    </>
                  ) : (
                    <>
                      <button onClick={() => startEdit(u)}>Edit</button>
                      <button className="danger" onClick={() => destroy(u.id)} disabled={busy}>Delete</button>
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
