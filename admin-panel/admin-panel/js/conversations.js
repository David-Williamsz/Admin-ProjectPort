import { db, collection, getDocs, query, orderBy } from "./firebase-init.js";

const listEl = document.getElementById("conversations-list");

async function loadConversations() {
  const snapshot = await getDocs(query(collection(db, "conversations"), orderBy("lastMessageAt", "desc")));
  listEl.innerHTML = "";

  if (snapshot.empty) {
    return; // The "empty until the bot is live" message is already in the HTML.
  }

  snapshot.forEach((docSnap) => {
    const c = { id: docSnap.id, ...docSnap.data() };
    const row = document.createElement("div");
    row.className = "list-row";
    row.innerHTML = `
      <div>
        <strong>${escapeHtml(c.telegramUsername || c.telegramUserId)}</strong>
        <span class="badge ${c.status}">${c.status}</span>
        <div class="muted">Intent: ${escapeHtml(c.currentIntent || "—")}</div>
      </div>
    `;
    listEl.appendChild(row);
  });
}

function escapeHtml(str) {
  const div = document.createElement("div");
  div.textContent = str ?? "";
  return div.innerHTML;
}

export { loadConversations };
