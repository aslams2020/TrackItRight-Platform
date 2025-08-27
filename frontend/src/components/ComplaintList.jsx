import React, { useState } from "react";
import "../styles/ComplaintList.css";


const ComplaintList = ({ complaints, onUpdated }) => {
  const token = localStorage.getItem("token");
  const userId = Number(localStorage.getItem("userId"));
  const [openRatingFor, setOpenRatingFor] = useState(null);
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState("");

  const canRate = (c) => c.status === "RESOLVED" && !c.feedback;

  const submitRating = async (id) => {
    try {
      const res = await fetch(`http://localhost:8080/api/feedback/complaints/${id}`, {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${token}`,
          "Content-Type": "application/json",
          "Accept": "application/json",
          // if backend still needs explicit user id, remove this once JWT wired in controller:
          "X-User-Id": String(userId)
        },
        body: JSON.stringify({ rating: Number(rating), comment })
      });
      const text = await res.text();
      if (!res.ok) {
        console.error("Rating failed", res.status, text);
        alert(text || `Failed to submit rating (${res.status})`);
        return;
      }
      alert("Thanks for the feedback!");
      setOpenRatingFor(null);
      setRating(5); setComment("");
      onUpdated?.(); // refresh list to reflect feedback
    } catch (e) {
      console.error(e);
      alert("Network error while submitting feedback.");
    }
  };

  return (
    <div className="complaint-list">
      <h3>Your Complaints</h3>
      {complaints.length === 0 ? (
        <p>No complaints registered yet.</p>
      ) : (
        <ul>
          {complaints.map((c) => (
            <li key={c.id}>
              <strong>{c.title}</strong> — {c.status} <br />
              {c.description}
              {c.status === "RESOLVED" && (
                <div style={{ marginTop: 6, color: "#374151" }}>
                  {c.feedback ? (
                    <span>
                      Rated: {c.feedback.rating}/5 {c.feedback.comment ? `— “${c.feedback.comment}”` : ""}
                    </span>
                  ) : (
                    <>
                      {openRatingFor === c.id ? (
                        <div style={{ marginTop: 8, display: "flex", gap: 8, alignItems: "center", flexWrap: "wrap" }}>
                          <label>Rating</label>
                          <select value={rating} onChange={(e) => setRating(e.target.value)}>
                            {[1,2,3,4,5].map(n => <option key={n} value={n}>{n}</option>)}
                          </select>
                          <input
                            type="text"
                            value={comment}
                            onChange={(e) => setComment(e.target.value)}
                            placeholder="Optional comment"
                            style={{ minWidth: 220 }}
                          />
                          <button onClick={() => submitRating(c.id)}>Submit</button>
                          <button className="secondary" onClick={() => setOpenRatingFor(null)}>Cancel</button>
                        </div>
                      ) : (
                        <div style={{ marginTop: 6 }}>
                          <button onClick={() => setOpenRatingFor(c.id)}>Rate resolution</button>
                        </div>
                      )}
                    </>
                  )}
                </div>
              )}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default ComplaintList;