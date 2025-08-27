import React, { useEffect, useState } from "react";
import "../styles/ComplaintForm.css";

const ComplaintForm = ({ onComplaintAdded }) => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [departmentId, setDepartmentId] = useState("");
  const [departments, setDepartments] = useState([]);
  const [loadingDeps, setLoadingDeps] = useState(false);
  const [errDeps, setErrDeps] = useState("");

  const token = localStorage.getItem("token");

  const loadDepartments = async () => {
    setErrDeps("");
    setLoadingDeps(true);
    try {
      const res = await fetch("http://localhost:8080/api/departments", {
        headers: {
          "Accept": "application/json"
        }
      });
      const text = await res.text();
      if (!res.ok) throw new Error(text || `HTTP ${res.status}`);
      const data = text ? JSON.parse(text) : [];
      setDepartments(Array.isArray(data) ? data : []);
    } catch (e) {
      console.error(e);
      setErrDeps("Failed to load departments. Please try again.");
    } finally {
      setLoadingDeps(false);
    }
  };

  useEffect(() => {
    loadDepartments();
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
      setTitle("");
      setDescription("");
      setDepartmentId("");
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
        required
        disabled={loadingDeps || !!errDeps}
      >
        <option value="">{loadingDeps ? "Loading..." : "Select department"}</option>
        {departments.map((d) => (
          <option key={d.id} value={d.id}>
            {d.name}{d.description ? ` - ${d.description}` : ""}
          </option>
        ))}
      </select>
      {errDeps && <div className="form-error">{errDeps}</div>}

      <button type="submit">Submit Complaint</button>
    </form>
  );
};

export default ComplaintForm;
