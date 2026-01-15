import { auth } from "./firebase.js";
import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  updateProfile
} from
"https://www.gstatic.com/firebasejs/10.12.0/firebase-auth.js";

export function login(email, password){
  return signInWithEmailAndPassword(auth, email, password);
}

export async function register(username, email, password){
  const cred = await createUserWithEmailAndPassword(auth, email, password);
  await updateProfile(cred.user, { displayName: username });
  return cred.user;
}