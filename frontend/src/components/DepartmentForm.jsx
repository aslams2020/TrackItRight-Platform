// src/components/DepartmentForm.jsx
import React, { useState } from "react";
import "../styles//DepartmentForm.css";

export default function DepartmentForm({ onSaved }) {
  const [form, setForm] = useState({ name: "", description: "" });
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState("");

  const onChange = (e) => setForm(prev => ({ ...prev, [e.target.name]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErr(""); setLoading(true);
    try {
      const token = localStorage.getItem("token");
      const res = await fetch("http://localhost:8080/api/admin/departments", {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${token}`,
          "Content-Type": "application/json",
          "Accept": "application/json"
        },
        body: JSON.stringify(form)
      });
      const text = await res.text();
      if (!res.ok) throw new Error(text);
      setForm({ name: "", description: "" });
      onSaved?.();
    } catch (e2) { setErr(e2.message?.slice(0, 500)); }
    finally { setLoading(false); }
  };

  return (
    <form className="dept-form" onSubmit={handleSubmit}>
      <h3>Create / Edit Department</h3>
      {err && <div className="form-error">{err}</div>}

      <label>Name</label>
      <input
        name="name"
        value={form.name}
        onChange={onChange}
        required
        placeholder="Department name"
      />

      <label>Description</label>
      <textarea
        name="description"
        value={form.description}
        onChange={onChange}
        placeholder="Short description"
      />

      <button type="submit" disabled={loading}>
        {loading ? "Saving..." : "Save Department"}
      </button>
    </form>
  );
}
