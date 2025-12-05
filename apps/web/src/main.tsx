// Initialize demo users on app load
const seedDemoUsers = () => {
  const existingUsers = JSON.parse(localStorage.getItem("innovate_users") || "[]");
  if (existingUsers.length === 0) {
    const demoUsers = [
      { id: "demo-1", name: "Demo Student", email: "student@demo.com", password: "demo123", role: "student", createdAt: new Date() },
      { id: "demo-2", name: "Demo Judge", email: "judge@demo.com", password: "demo123", role: "judge", createdAt: new Date() },
      { id: "demo-3", name: "Demo Admin", email: "admin@demo.com", password: "demo123", role: "admin", createdAt: new Date() },
    ];
    localStorage.setItem("innovate_users", JSON.stringify(demoUsers));
  }
};

seedDemoUsers();

import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import "./index.css";

createRoot(document.getElementById("root")!).render(<App />);
