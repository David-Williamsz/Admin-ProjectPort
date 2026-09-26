import { auth, onAuthStateChanged, signOut } from "./firebase-init.js";
import { loadProjects } from "./projects.js";
import { loadPayments } from "./payments.js";
import { loadConversations } from "./conversations.js";

// Guard: bounce back to login if not authenticated. This is a UX
// convenience only — the real enforcement is Firestore Security Rules
// and the Railway backend's own auth checks, not this redirect.
onAuthStateChanged(auth, (user) => {
  if (!user) {
    window.location.href = "index.html";
  }
});

document.getElementById("sign-out").addEventListener("click", async () => {
  await signOut(auth);
  window.location.href = "index.html";
});

document.querySelectorAll(".tab-btn").forEach((btn) => {
  btn.addEventListener("click", () => {
    document.querySelectorAll(".tab-btn").forEach((b) => b.classList.remove("active"));
    document.querySelectorAll(".tab-panel").forEach((p) => p.classList.remove("active"));
    btn.classList.add("active");
    document.getElementById(`tab-${btn.dataset.tab}`).classList.add("active");
  });
});

// Initial load — fine to fetch all three up front at this small scale.
loadProjects();
loadPayments();
loadConversations();
