import {
  auth,
  db,
  signInWithEmailAndPassword,
  onAuthStateChanged,
  collection,
  getDocs
} from "./firebase-init.js";

const form = document.getElementById("login-form");
const errorEl = document.getElementById("login-error");

/**
 * The client has no way to read /admins/ directly (by design — see
 * firestore.rules). So "am I an admin?" is answered indirectly: try a
 * read that's only allowed for admins (paymentRequests). If it succeeds,
 * proceed. If it's denied, this account isn't authorized here.
 */
async function verifyIsAdmin() {
  try {
    await getDocs(collection(db, "paymentRequests"));
    return true;
  } catch (err) {
    return false;
  }
}

// If already logged in and verified admin, skip straight to the dashboard.
onAuthStateChanged(auth, async (user) => {
  if (user) {
    const isAdmin = await verifyIsAdmin();
    if (isAdmin) {
      window.location.href = "dashboard.html";
    }
  }
});

form.addEventListener("submit", async (e) => {
  e.preventDefault();
  errorEl.hidden = true;

  const email = document.getElementById("email").value;
  const password = document.getElementById("password").value;

  try {
    await signInWithEmailAndPassword(auth, email, password);
    const isAdmin = await verifyIsAdmin();

    if (!isAdmin) {
      errorEl.textContent = "This account is not authorized as an admin.";
      errorEl.hidden = false;
      await auth.signOut();
      return;
    }

    window.location.href = "dashboard.html";
  } catch (err) {
    errorEl.textContent = "Sign-in failed. Check your email and password.";
    errorEl.hidden = false;
  }
});
