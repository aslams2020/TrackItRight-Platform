import React, { useEffect, useState, useRef } from "react";
import { fetchUnreadCount, fetchNotifications, markAllRead } from "./NotificationService";
import "./notification.css";

export default function NotificationsIcon() {
  const [unreadCount, setUnreadCount] = useState(0);
  const [showDropdown, setShowDropdown] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const token = localStorage.getItem("token");
  const dropdownRef = useRef(null);

  useEffect(() => {
    if (!token) return;
    fetchUnreadCount(token).then(setUnreadCount);
  }, [token]);

  // Close dropdown if clicked outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowDropdown(false);
      }
    };

    if (showDropdown) {
      document.addEventListener("mousedown", handleClickOutside);
    } else {
      document.removeEventListener("mousedown", handleClickOutside);
    }

    // Cleanup on unmount or showDropdown change
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [showDropdown]);

  const toggleDropdown = () => {
    if (!showDropdown) {
      markAllRead(token).then(() => {
        fetchNotifications(token).then(notifs => {
          setNotifications(notifs);
          setUnreadCount(0);
        });
      });
    }
    setShowDropdown(!showDropdown);
  };

  const getNotificationStyle = (type) => {
    switch(type) {
      case "STATUS": return { backgroundColor: "#dbeafe", color: "#1e40af" };
      case "REMARK": return { backgroundColor: "#dcfce7", color: "#065f46" };
      default: return { backgroundColor: "white", color: "#374151" };
    }
  };

  const handleMarkAllRead = (e) => {
    e.stopPropagation();
    markAllRead(token).then(() => {
      setUnreadCount(0);
      fetchNotifications(token).then(setNotifications);
    });
  };

  return (
    <div className="notifications-container" style={{ position: "relative" }} ref={dropdownRef}>
      <button onClick={toggleDropdown} style={{ fontSize:"20px" }} aria-label="Toggle notifications">
        🔔{unreadCount > 0 && <span className="badge">{unreadCount}</span>}
      </button>

      {showDropdown && (
        <div className="notifications-dropdown" style={{
          position: "absolute", right: 0, top: "100%", width: 320, maxHeight: 400, overflowY: "auto", background: "white",
          border: "1px solid #ddd", borderRadius: 6, zIndex: 1000, boxShadow: "0 2px 8px rgba(0,0,0,0.15)"
        }}>
          <div style={{ padding: "8px 12px", borderBottom: "1px solid #ccc", fontWeight: "bold", display: "flex", justifyContent: "space-between"}}>
            Notifications
            {unreadCount > 0 && <button onClick={handleMarkAllRead} style={{ background: "none", border: "none", color: "#2563eb", cursor: "pointer" }}>Mark all read</button>}
          </div>

          {notifications.length === 0 ? (
            <div style={{ padding: 10, color: "#666" }}>No new notifications</div>
          ) : (
            notifications.map(n => (
              <div
                key={n.id}
                style={{
                  padding: "10px",
                  borderBottom: "1px solid #eee",
                  backgroundColor: !n.seen ? "#eef6ff" : "white",
                  ...getNotificationStyle(n.type),
                  cursor: "default"
                }}
                aria-label={`Notification: ${n.message}`}
              >
                <strong style={{ display: "block" }}>{n.complaintTitle}</strong>
                <div>{n.message}</div>
                <small style={{ color: "#555" }}>{new Date(n.createdAt).toLocaleString()}</small>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
}
