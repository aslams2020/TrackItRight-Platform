const BASE_URL = "http://localhost:8080/api/notifications";

export async function fetchNotifications(token) {
  const res = await fetch(BASE_URL, {
    headers: { Authorization: `Bearer ${token}` }
  });
  return res.json();
}

export async function fetchUnreadCount(token) {
  const res = await fetch(`${BASE_URL}/unreadCount`, {
    headers: { Authorization: `Bearer ${token}` }
  });
  const data = await res.json();
  return data.unreadCount;
}

export async function markAllRead(token) {
  await fetch(`${BASE_URL}/markAllRead`, {
    method: "POST",
    headers: { Authorization: `Bearer ${token}` }
  });
}
