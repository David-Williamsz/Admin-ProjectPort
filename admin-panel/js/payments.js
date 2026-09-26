import { db, collection, getDocs, query, orderBy } from "./firebase-init.js";
import { callBackend } from "./api.js";

const form = document.getElementById("payment-form");
const listEl = document.getElementById("payments-list");
const errorEl = document.getElementById("payment-error");
const successEl = document.getElementById("payment-success");

form.addEventListener("submit", async (e) => {
  e.preventDefault();
  errorEl.hidden = true;
  successEl.hidden = true;

  const clientName = document.getElementById("pay-client").value.trim();
  const description = document.getElementById("pay-description").value.trim();
  const amount = parseFloat(document.getElementById("pay-amount").value);

  try {
    const result = await callBackend("/api/admin/payment-requests", {
      method: "POST",
      body: JSON.stringify({ clientName, description, amount, currency: "usd" })
    });

    successEl.textContent = `Invoice created: ${result.invoiceUrl}`;
    successEl.hidden = false;
    form.reset();
    await loadPayments();
  } catch (err) {
    errorEl.textContent = err.message;
    errorEl.hidden = false;
  }
});

async function markFulfilled(id, buttonEl) {
  buttonEl.disabled = true;
  try {
    await callBackend(`/api/admin/payment-requests/${id}/fulfill`, { method: "POST" });
    await loadPayments();
  } catch (err) {
    alert(err.message); // simple v1 feedback — replace with inline UI later
    buttonEl.disabled = false;
  }
}

async function loadPayments() {
  const snapshot = await getDocs(query(collection(db, "paymentRequests"), orderBy("createdAt", "desc")));
  listEl.innerHTML = "";

  if (snapshot.empty) {
    listEl.innerHTML = `<p class="muted">No payment requests yet.</p>`;
    return;
  }

  snapshot.forEach((docSnap) => {
    const p = { id: docSnap.id, ...docSnap.data() };
    const row = document.createElement("div");
    row.className = "list-row";
    row.innerHTML = `
      <div>
        <strong>${escapeHtml(p.clientName)}</strong> — $${p.amount} ${p.currency?.toUpperCase()}
        <div class="muted">${escapeHtml(p.description)}</div>
        <span class="badge ${p.status}">${p.status}</span>
        <span class="badge ${p.fulfillmentStatus}">${p.fulfillmentStatus}</span>
        ${p.requiresReview ? '<span class="badge review">needs review</span>' : ""}
        ${p.invoiceUrl ? `<div><a href="${p.invoiceUrl}" target="_blank" rel="noopener">Invoice link</a></div>` : ""}
      </div>
      <button class="fulfill-btn" data-id="${p.id}" ${p.fulfillmentStatus === "fulfilled" ? "disabled" : ""}>
        Mark fulfilled
      </button>
    `;
    row.querySelector(".fulfill-btn").addEventListener("click", (e) => markFulfilled(p.id, e.target));
    listEl.appendChild(row);
  });
}

function escapeHtml(str) {
  const div = document.createElement("div");
  div.textContent = str ?? "";
  return div.innerHTML;
}

export { loadPayments };
