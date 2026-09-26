import { db, collection, doc, getDocs, addDoc, setDoc, query, orderBy } from "./firebase-init.js";

const form = document.getElementById("project-form");
const listEl = document.getElementById("projects-list");
const cancelBtn = document.getElementById("project-cancel-edit");

function readForm() {
  return {
    title: document.getElementById("p-title").value.trim(),
    slug: document.getElementById("p-slug").value.trim(),
    status: document.getElementById("p-status").value,
    summary: document.getElementById("p-summary").value.trim(),
    problem: document.getElementById("p-problem").value.trim(),
    solution: document.getElementById("p-solution").value.trim(),
    outcome: document.getElementById("p-outcome").value.trim() || null,
    technologies: document.getElementById("p-technologies").value
      .split(",")
      .map((t) => t.trim())
      .filter(Boolean),
    thumbnail: document.getElementById("p-thumbnail").value.trim() || null,
    updatedAt: new Date()
  };
}

function fillForm(project) {
  document.getElementById("project-id").value = project.id;
  document.getElementById("p-title").value = project.title || "";
  document.getElementById("p-slug").value = project.slug || "";
  document.getElementById("p-status").value = project.status || "draft";
  document.getElementById("p-summary").value = project.summary || "";
  document.getElementById("p-problem").value = project.problem || "";
  document.getElementById("p-solution").value = project.solution || "";
  document.getElementById("p-outcome").value = project.outcome || "";
  document.getElementById("p-technologies").value = (project.technologies || []).join(", ");
  document.getElementById("p-thumbnail").value = project.thumbnail || "";
  cancelBtn.hidden = false;
}

function resetForm() {
  form.reset();
  document.getElementById("project-id").value = "";
  cancelBtn.hidden = true;
}

cancelBtn.addEventListener("click", resetForm);

form.addEventListener("submit", async (e) => {
  e.preventDefault();
  const id = document.getElementById("project-id").value;
  const data = readForm();

  // Slug changes are allowed but not silently — this UI doesn't add a
  // confirmation step yet (v1), but the field is at least visible and
  // deliberate rather than auto-generated on every save.
  if (id) {
    await setDoc(doc(db, "projects", id), data, { merge: true });
  } else {
    await addDoc(collection(db, "projects"), { ...data, createdAt: new Date() });
  }

  resetForm();
  await loadProjects();
});

async function loadProjects() {
  const snapshot = await getDocs(query(collection(db, "projects"), orderBy("updatedAt", "desc")));
  listEl.innerHTML = "";

  if (snapshot.empty) {
    listEl.innerHTML = `<p class="muted">No projects yet.</p>`;
    return;
  }

  snapshot.forEach((docSnap) => {
    const project = { id: docSnap.id, ...docSnap.data() };
    const row = document.createElement("div");
    row.className = "list-row";
    row.innerHTML = `
      <div>
        <strong>${escapeHtml(project.title)}</strong>
        <span class="badge ${project.status}">${project.status}</span>
        <div class="muted">/${escapeHtml(project.slug)}</div>
      </div>
      <button data-id="${project.id}" class="edit-btn">Edit</button>
    `;
    row.querySelector(".edit-btn").addEventListener("click", () => fillForm(project));
    listEl.appendChild(row);
  });
}

function escapeHtml(str) {
  const div = document.createElement("div");
  div.textContent = str ?? "";
  return div.innerHTML;
}

export { loadProjects };
