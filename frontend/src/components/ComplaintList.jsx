import React from "react";
import "../styles/ComplaintList.css";

const ComplaintList = ({ complaints }) => {
  return (
    <div className="complaint-list">
      <h3>Your Complaints</h3>
      {complaints.length === 0 ? (
        <p>No complaints registered yet.</p>
      ) : (
        <ul>
          {complaints.map((c) => (
            <li key={c.id}>
              <strong>{c.title}</strong> - {c.status} <br />
              {c.description}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default ComplaintList;
