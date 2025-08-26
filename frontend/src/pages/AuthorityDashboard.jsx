import React, { useEffect, useState } from "react";
import ComplaintTable from "../components/ComplaintTable";
import "../styles/AuthorityDashboard.css"
const AuthorityDashboard = () => {
  const [complaints, setComplaints] = useState([]);
  const [error, setError] = useState("");

  const parseJsonSafe = async (response) => {
    // Try JSON first; if it fails, fallback to text (for HTML error pages)
    const text = await response.text();
    try {
      return { data: JSON.parse(text), raw: text };
    } catch {
      return { data: null, raw: text };
    }
  };

  const fetchComplaints = async () => {
    setError("");
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        setError("Missing auth token. Please login again.");
        setComplaints([]);
        return;
      }

      const res = await fetch("http://localhost:8080/api/authority/complaints", {
        method: "GET",
        headers: {
          "Authorization": `Bearer ${token}`,
          "Accept": "application/json"
        }
      });

      const { data, raw } = await parseJsonSafe(res);

      if (!res.ok) {
        console.error("Fetch not OK:", res.status, res.statusText, raw);
        setError(`Failed to fetch complaints (${res.status}).`);
        setComplaints([]);
        return;
      }

      if (!data || !Array.isArray(data)) {
        console.error("Expected JSON array, got:", raw);
        setError("Server returned unexpected format (not JSON array).");
        setComplaints([]);
        return;
      }

      setComplaints(data);
    } catch (e) {
      console.error("Error fetching complaints:", e);
      setError("Network error while fetching complaints.");
      setComplaints([]);
    }
  };

  useEffect(() => {
    fetchComplaints();
  }, []);

  return (
    <div className="authority-dashboard">
      <h2>Authority Dashboard</h2>
      {error && <div className="error-banner">{error}</div>}
      <ComplaintTable complaints={complaints} onUpdate={fetchComplaints} />
    </div>
  );
};

export default AuthorityDashboard;
