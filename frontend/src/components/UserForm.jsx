import React, { useState } from "react";
import "../styles/UserForm.css";

export default function UserForm({ departments, onSaved }) {
  const [form, setForm] = useState({
    name: "", email: "", password: "", role: "USER", departmentId: ""
  });
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState("");

  const onChange = (e) => setForm(prev => ({ ...prev, [e.target.name]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErr(""); setLoading(true);
    try {
      const token = localStorage.getItem("token");
      const payload = {
        name: form.name,
        email: form.email,
        password: form.password,
        role: form.role,
        departmentId: form.departmentId ? Number(form.departmentId) : null
      };
      const res = await fetch("http://localhost:8080/api/admin/users", {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${token}`,
          "Content-Type": "application/json",
          "Accept": "application/json"
        },
        body: JSON.stringify(payload)
      });
      const text = await res.text();
      if (!res.ok) throw new Error(text);
      setForm({ name: "", email: "", password: "", role: "USER", departmentId: "" });
      onSaved?.();
    } catch (e2) { setErr(e2.message?.slice(0, 500)); }
    finally { setLoading(false); }
  };

  return (
    <form className="user-form" onSubmit={handleSubmit}>
      <h4>Create User</h4>
      {err && <div className="form-error">{err}</div>}

      <label>Name</label>
      <input name="name" value={form.name} onChange={onChange} required />

      <label>Email</label>
      <input type="email" name="email" value={form.email} onChange={onChange} required />

      <label>Password</label>
      <input type="password" name="password" value={form.password} onChange={onChange} required minLength={6} />

      <label>Role</label>
      <select name="role" value={form.role} onChange={onChange}>
        <option value="USER">USER</option>
        <option value="AUTHORITY">AUTHORITY</option>
        <option value="ADMIN">ADMIN</option>
      </select>

      <label>Department (optional)</label>
      <select name="departmentId" value={form.departmentId} onChange={onChange}>
        <option value="">-- none --</option>
        {departments.map(d => <option key={d.id} value={d.id}>{d.name}</option>)}
      </select>

      <button type="submit" disabled={loading}>
        {loading ? "Creating..." : "Create User"}
      </button>
    </form>
  );
}
