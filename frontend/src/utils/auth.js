// utils/auth.js
export const setAuth = (token, role, userId, name, email) => {
  localStorage.setItem("token", token);
  localStorage.setItem("role", role);
  localStorage.setItem("userId", userId);   // 👈 save id
  localStorage.setItem("name", name);
  localStorage.setItem("email", email);
};

export const clearAuth = () => {
  localStorage.removeItem("token");
  localStorage.removeItem("role");
  localStorage.removeItem("userId");
  localStorage.removeItem("name");
  localStorage.removeItem("email");
};

export const getAuth = () => ({
  token: localStorage.getItem("token"),
  role: localStorage.getItem("role"),
  userId: localStorage.getItem("userId"),
  name: localStorage.getItem("name"),
  email: localStorage.getItem("email"),
});

export const getToken = () => localStorage.getItem('token');
export const getRole = () => localStorage.getItem('role');
export const isAuthed = () => Boolean(getToken());
