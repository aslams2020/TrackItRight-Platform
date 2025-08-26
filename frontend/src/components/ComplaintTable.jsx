import React, { useMemo, useState } from "react";
import "../styles/ComplaintTable.css"

const ComplaintTable = ({ complaints, onUpdate }) => {
  const [updating, setUpdating] = useState(false);
  const [statusMap, setStatusMap] = useState({});
  const [remarkMap, setRemarkMap] = useState({});

  const token = useMemo(() => localStorage.getItem("token"), []);

  const handleChangeStatus = (id, value) => {
    setStatusMap(prev => ({ ...prev, [id]: value }));
  };

  const handleChangeRemark = (id, value) => {
    setRemarkMap(prev => ({ ...prev, [id]: value }));
  };

  const parseJsonSafe = async (response) => {
    const text = await response.text();
    try {
      return { data: JSON.parse(text), raw: text };
    } catch {
      return { data: null, raw: text };
    }
  };

  const requireToken = () => {
    if (!token) {
      alert("Missing auth token. Please login again.");
      return false;
    }
    return true;
  };

  const updateStatus = async (id) => {
    if (!requireToken()) return;
    const statusUpdate = (statusMap[id] || "").trim();
    if (!statusUpdate) {
      alert("Enter a new status before updating.");
      return;
    }
    setUpdating(true);
    try {
      const url = `http://localhost:8080/api/complaints/${id}/status?status=${encodeURIComponent(statusUpdate)}`;
      const res = await fetch(url, {
        method: "PUT",
        headers: {
          "Authorization": `Bearer ${token}`,
          "Accept": "application/json"
        }
      });
      const { data, raw } = await parseJsonSafe(res);
      if (!res.ok) {
        console.error("Update status failed:", res.status, raw);
        alert(`Failed to update status (${res.status}).`);
        return;
      }
      alert("Status updated!");
      setStatusMap(prev => ({ ...prev, [id]: "" }));
      onUpdate?.();
    } catch (e) {
      console.error(e);
      alert("Network error while updating status.");
    } finally {
      setUpdating(false);
    }
  };

  const addRemark = async (id) => {
    if (!requireToken()) return;
    const remark = (remarkMap[id] || "").trim();
    if (!remark) {
      alert("Enter a remark before submitting.");
      return;
    }
    setUpdating(true);
    try {
      const res = await fetch(`http://localhost:8080/api/authority/complaints/${id}/remark`, {
        method: "PUT",
        headers: {
          "Authorization": `Bearer ${token}`,
          "Content-Type": "application/json",
          "Accept": "application/json"
        },
        body: JSON.stringify({ remark })
      });
      const { data, raw } = await parseJsonSafe(res);
      if (!res.ok) {
        console.error("Add remark failed:", res.status, raw);
        alert(`Failed to add remark (${res.status}).`);
        return;
      }
      alert("Remark added!");
      setRemarkMap(prev => ({ ...prev, [id]: "" }));
      onUpdate?.();
    } catch (e) {
      console.error(e);
      alert("Network error while adding remark.");
    } finally {
      setUpdating(false);
    }
  };

  const assignSelf = async (id) => {
    if (!requireToken()) return;
    setUpdating(true);
    try {
      const res = await fetch(`http://localhost:8080/api/authority/complaints/${id}/assign-self`, {
        method: "PUT",
        headers: {
          "Authorization": `Bearer ${token}`,
          "Accept": "application/json"
        }
      });
      const { data, raw } = await parseJsonSafe(res);
      if (!res.ok) {
        console.error("Assign self failed:", res.status, raw);
        alert(`Failed to assign complaint (${res.status}).`);
        return;
      }
      alert("Complaint assigned to you!");
      onUpdate?.();
    } catch (e) {
      console.error(e);
      alert("Network error while assigning complaint.");
    } finally {
      setUpdating(false);
    }
  };

  return (
    <div className="complaint-table">
      <h3>Department Complaints</h3>
      <table>
        <thead>
          <tr>
            <th style={{ width: "18%" }}>Title</th>
            <th style={{ width: "32%" }}>Description</th>
            <th style={{ width: "12%" }}>Status</th>
            <th style={{ width: "38%" }}>Actions</th>
          </tr>
        </thead>
        <tbody>
          {complaints.length === 0 ? (
            <tr>
              <td colSpan={4} style={{ textAlign: "center", color: "#6b7280" }}>
                No complaints to display.
              </td>
            </tr>
          ) : complaints.map((c) => (
            <tr key={c.id}>
              <td>{c.title}</td>
              <td>{c.description}</td>
              <td>{c.status}</td>
              <td>
                <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                  <input
                    type="text"
                    placeholder="New Status"
                    value={statusMap[c.id] || ""}
                    onChange={(e) => handleChangeStatus(c.id, e.target.value)}
                    disabled={updating}
                    style={{ minWidth: 120 }}
                  />
                  <button onClick={() => updateStatus(c.id)} disabled={updating}>
                    Update Status
                  </button>

                  <input
                    type="text"
                    placeholder="Remark"
                    value={remarkMap[c.id] || ""}
                    onChange={(e) => handleChangeRemark(c.id, e.target.value)}
                    disabled={updating}
                    style={{ minWidth: 160 }}
                  />
                  <button onClick={() => addRemark(c.id)} disabled={updating}>
                    Add Remark
                  </button>

                  <button onClick={() => assignSelf(c.id)} disabled={updating}>
                    Assign to Me
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ComplaintTable;
