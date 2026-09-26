import { auth } from "./firebase-init.js";
import { RAILWAY_API_BASE_URL } from "../config.js";

/**
 * Every call to the Railway backend attaches the current admin's Firebase
 * ID token. The backend independently re-verifies this token and checks
 * admin status itself — this header is not treated as trusted on its own
 * by the server, per the auth contract.
 */
export async function callBackend(path, options = {}) {
  const user = auth.currentUser;
  if (!user) {
    throw new Error("Not signed in.");
  }

  const idToken = await user.getIdToken();

  const response = await fetch(`${RAILWAY_API_BASE_URL}${path}`, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${idToken}`,
      ...(options.headers || {})
    }
  });

  const body = await response.json().catch(() => ({}));

  if (!response.ok) {
    throw new Error(body.error || `Request failed (${response.status})`);
  }

  return body;
}
