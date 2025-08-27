import React, { useState, useEffect } from "react";
import ComplaintForm from "../components/ComplaintForm";
import ComplaintList from "../components/ComplaintList";
import "../styles/CitizenDashboard.css"
const CitizenDashboard = () => {
  const [complaints, setComplaints] = useState([]);

  // Get token and userId from localStorage (set these during login)
  const token = localStorage.getItem("token");
  const userId = localStorage.getItem("userId");  

  const fetchComplaints = async () => {
    try {
      if (!userId || !token) return;

      const response = await fetch(
        `http://localhost:8080/api/complaints/citizen/${userId}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            "Authorization": "Bearer " + token,
          },
        }
      );

      if (response.ok) {
        const data = await response.json();
        setComplaints(data);
      } else {
        console.error("Failed to fetch complaints", response.status);
      }
    } catch (error) {
      console.error("Error fetching complaints:", error);
    }
  };

  useEffect(() => {
    fetchComplaints();
  }, []);

  return (
    <div className="citizen-dashboard">
      <h2>Citizen Dashboard</h2>
      <ComplaintForm onComplaintAdded={fetchComplaints} />
      <ComplaintList complaints={complaints} />
    </div>
  );
};

export default CitizenDashboard;
