// Thin wrappers around Firebase Auth so the UI never imports the SDK
// directly. Adding a new auth provider becomes a one-file change.

import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signInWithPopup,
  signOut,
  GoogleAuthProvider,
  onAuthStateChanged,
} from 'firebase/auth'
import { auth } from './firebase'

const googleProvider = new GoogleAuthProvider()

export function signupWithEmail(email, password) {
  return createUserWithEmailAndPassword(auth, email, password)
}

export function loginWithEmail(email, password) {
  return signInWithEmailAndPassword(auth, email, password)
}

export function loginWithGoogle() {
  return signInWithPopup(auth, googleProvider)
}

export function logout() {
  return signOut(auth)
}

export function watchAuth(callback) {
  return onAuthStateChanged(auth, callback)
}
