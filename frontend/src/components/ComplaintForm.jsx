import React, { useState } from "react";
import "../styles/ComplaintForm.css";

const ComplaintForm = ({ onComplaintAdded }) => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [department, setDepartment] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch("http://localhost:8080/api/complaints", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": "Bearer " + localStorage.getItem("token")
        },
        body: JSON.stringify({
          title,
          description,
          departmentId: Number(department)
        })
      });

      if (response.ok) {
        alert("Complaint registered successfully!");
        setTitle("");
        setDescription("");
        setDepartment("");
        onComplaintAdded(); // refresh list
      } else {
        alert("Failed to register complaint.");
      }
    } catch (error) {
      console.error("Error submitting complaint:", error);
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
      ></textarea>
      <input
        type="text"
        placeholder="Department ID"
        value={department}
        onChange={(e) => setDepartment(e.target.value)}
        required
      />
      <button type="submit">Submit Complaint</button>
    </form>
  );
};

export default ComplaintForm;
