import React, { useEffect, useState } from "react";
import "../styles/ComplaintForm.css";

const ComplaintForm = ({ onComplaintAdded }) => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [departmentId, setDepartmentId] = useState("");
  const [departments, setDepartments] = useState([]);
  const [depsLoading, setDepsLoading] = useState(false);
  const [depsErr, setDepsErr] = useState("");
  const token = localStorage.getItem("token");

  useEffect(() => {
    const loadDeps = async () => {
      setDepsLoading(true);
      setDepsErr("");
      try {
        const res = await fetch("http://localhost:8080/api/departments", {
          headers: { "Accept": "application/json" }
        });
        const text = await res.text();
        if (!res.ok) throw new Error(text || `HTTP ${res.status}`);
        const data = text ? JSON.parse(text) : [];
        setDepartments(Array.isArray(data) ? data : []);
      } catch (e) {
        console.error(e);
        setDepsErr("Failed to load departments.");
      } finally {
        setDepsLoading(false);
      }
    };
    loadDeps();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!departmentId) {
      alert("Please select a department");
      return;
    }
    try {
      const res = await fetch("http://localhost:8080/api/complaints", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`,
          "Accept": "application/json"
        },
        body: JSON.stringify({
          title,
          description,
          departmentId: Number(departmentId)
        })
      });
      if (!res.ok) {
        const text = await res.text();
        throw new Error(text || `HTTP ${res.status}`);
      }
      alert("Complaint registered successfully!");
      setTitle(""); setDescription(""); setDepartmentId("");
      onComplaintAdded?.();
    } catch (error) {
      console.error("Error submitting complaint:", error);
      alert("Failed to register complaint.");
    }
  };

  return (
    <form className="complaint-form" onSubmit={handleSubmit}>
      <h3>Register a Complaint</h3>

      <input
        type="text"
        placeholder="Complaint Title"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        required
      />

      <textarea
        placeholder="Complaint Description"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        required
      />

      <label style={{ fontSize: "0.9rem", color: "#374151", marginBottom: 4 }}>
        Department
      </label>
      <select
        value={departmentId}
        onChange={(e) => setDepartmentId(e.target.value)}
        disabled={depsLoading || !!depsErr}
        required
      >
        <option value="">{depsLoading ? "Loading..." : "Select department"}</option>
        {departments.map(d => (
          <option key={d.id} value={d.id}>
            {d.name}{d.description ? ` — ${d.description}` : ""}
          </option>
        ))}
      </select>
      {depsErr && <div className="form-error">{depsErr}</div>}

      <button type="submit">Submit Complaint</button>
    </form>
  );
};

export default ComplaintForm;