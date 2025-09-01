import React, { useMemo, useState } from "react";
import "../styles/ComplaintTable.css";

const ComplaintTable = ({ complaints, onUpdate }) => {
  const [updating, setUpdating] = useState(false);
  const [statusMap, setStatusMap] = useState({});
  const [remarkMap, setRemarkMap] = useState({});

  const token = useMemo(() => localStorage.getItem("token"), []);
  const currentUserId = useMemo(() => Number(localStorage.getItem("userId")), []);

  const isResolved = (c) => c.status === "RESOLVED";
  const isAssignedToMe = (c) => c.authority && c.authority.id === currentUserId;
  const isUnassigned = (c) => !c.authority;

  const handleChangeStatus = (id, value) => setStatusMap((prev) => ({ ...prev, [id]: value }));
  const handleChangeRemark = (id, value) => setRemarkMap((prev) => ({ ...prev, [id]: value }));

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
    if (!statusUpdate) { alert("Enter a new status before updating."); return; }
    setUpdating(true);
    try {
      const url = `http://localhost:8080/api/complaints/${id}/status?status=${encodeURIComponent(statusUpdate)}`;
      const res = await fetch(url, {
        method: "PUT",
        headers: {
          "Authorization": `Bearer ${token}`,
          "Accept": "application/json",
        },
      });
      const { raw } = await parseJsonSafe(res);
      if (!res.ok) {
        console.error("Update status failed:", res.status, raw);
        alert(`Failed to update status (${res.status}). ${raw?.slice(0, 200)}`);
        return;
      }
      alert("Status updated!");
      setStatusMap((prev) => ({ ...prev, [id]: "" }));
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
    if (!remark) { alert("Enter a remark before submitting."); return; }
    setUpdating(true);
    try {
      const url = `http://localhost:8080/api/authority/complaints/${id}/remark`;
      const res = await fetch(url, {
        method: "PUT",
        headers: {
          "Authorization": `Bearer ${token}`,
          "Content-Type": "application/json",
          "Accept": "application/json",
        },
        body: JSON.stringify({ remark }),
      });
      const { raw } = await parseJsonSafe(res);
      if (!res.ok) {
        console.error("Add remark failed:", res.status, raw);
        alert(`Failed to add remark (${res.status}). ${raw?.slice(0, 200)}`);
        return;
      }
      alert("Remark added!");
      setRemarkMap((prev) => ({ ...prev, [id]: "" }));
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
      const url = `http://localhost:8080/api/authority/complaints/${id}/assign-self`;
      const res = await fetch(url, {
        method: "PUT",
        headers: {
          "Authorization": `Bearer ${token}`,
          "Accept": "application/json",
        },
      });
      const { raw } = await parseJsonSafe(res);
      if (!res.ok) {
        console.error("Assign self failed:", res.status, raw);
        alert(`Failed to assign complaint (${res.status}). ${raw?.slice(0, 200)}`);
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
      <h3>Department <span className="complainttable-span">Complaints</span></h3>
      <table>
        <thead>
          <tr>
            <th style={{ width: "17%" }}>Title</th>
            <th style={{ width: "37%" }}>Description</th>
            <th style={{ width: "16%" }}>Status</th>
            <th style={{ width: "15%" }}>Citizen</th>
            <th style={{ width: "12%" }}>Actions</th>
          </tr>
        </thead>
        <tbody>
          {complaints.length === 0 ? (
            <tr>
              <td colSpan={5} style={{ textAlign: "center", color: "#6b7280" }}>
                No complaints to display.
              </td>
            </tr>
          ) : (
            complaints.map((c) => {
              const assignedTo = c.authority ? (c.authority.name || "-") : "Unassigned";
              const canAssign = isUnassigned(c) && !isResolved(c);
              const canMutate = isAssignedToMe(c) && !isResolved(c);

              return (
                <tr key={c.id}>
                  <td>{c.title}</td>
                  <td>{c.description}</td>
                  <td>
                    <span className={`status-chip ${c.status?.toLowerCase() || ""}`}>
                      {c.status}
                    </span>
                    <div style={{ fontSize: ".8rem", color: "#6b7280", marginTop: 4 }}>
                      Assigned to: {assignedTo}
                    </div>
                  </td>
                  <td>
                    {c.citizen
                      ? <>
                          <span>{c.citizen.name}</span>
                          <br />
                          <a href={`mailto:${c.citizen.email}`}>{c.citizen.email}</a>
                        </>
                      : "-"}
                  </td>
                  <td>
                    <div className="actions">
                      {canAssign && (
                        <button onClick={() => assignSelf(c.id)} disabled={updating}>
                          Assign to Me
                        </button>
                      )}

                      {canMutate && (
                        <>
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
                        </>
                      )}
                    </div>
                  </td>
                </tr>
              );
            })
          )}
        </tbody>
      </table>
    </div>
  );
};

export default ComplaintTable;