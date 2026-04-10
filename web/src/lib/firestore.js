// Firestore CRUD wrappers. All paths are scoped to the current user
// (users/{uid}/...) and the security rules in firebase.rules enforce
// that no user can read or write outside their own subtree.

import {
  doc,
  collection,
  setDoc,
  getDoc,
  getDocs,
  addDoc,
  updateDoc,
  deleteDoc,
  serverTimestamp,
  orderBy,
  query,
} from 'firebase/firestore'
import { db } from './firebase'

// ── PROFILE ───────────────────────────────────────────────────────────
// One document at users/{uid}/profile/main containing the contact card
// and Yes/No work-authorization answers.

const profileRef = (uid) => doc(db, 'users', uid, 'profile', 'main')

export async function getProfile(uid) {
  const snap = await getDoc(profileRef(uid))
  return snap.exists() ? snap.data() : null
}

export async function saveProfile(uid, data) {
  await setDoc(
    profileRef(uid),
    { ...data, updatedAt: serverTimestamp() },
    { merge: true }
  )
}

// ── EXPERIENCE ────────────────────────────────────────────────────────

const experienceCol = (uid) => collection(db, 'users', uid, 'experience')

export async function listExperience(uid) {
  const q = query(experienceCol(uid), orderBy('order', 'asc'))
  const snap = await getDocs(q)
  return snap.docs.map((d) => ({ id: d.id, ...d.data() }))
}

export async function addExperience(uid, entry) {
  const ref = await addDoc(experienceCol(uid), {
    ...entry,
    createdAt: serverTimestamp(),
  })
  return ref.id
}

export async function updateExperience(uid, id, entry) {
  await updateDoc(doc(db, 'users', uid, 'experience', id), entry)
}

export async function deleteExperience(uid, id) {
  await deleteDoc(doc(db, 'users', uid, 'experience', id))
}

// ── EDUCATION ─────────────────────────────────────────────────────────

const educationCol = (uid) => collection(db, 'users', uid, 'education')

export async function listEducation(uid) {
  const q = query(educationCol(uid), orderBy('order', 'asc'))
  const snap = await getDocs(q)
  return snap.docs.map((d) => ({ id: d.id, ...d.data() }))
}

export async function addEducation(uid, entry) {
  const ref = await addDoc(educationCol(uid), {
    ...entry,
    createdAt: serverTimestamp(),
  })
  return ref.id
}

export async function updateEducation(uid, id, entry) {
  await updateDoc(doc(db, 'users', uid, 'education', id), entry)
}

export async function deleteEducation(uid, id) {
  await deleteDoc(doc(db, 'users', uid, 'education', id))
}

// ── ROLE TEMPLATES ────────────────────────────────────────────────────
// One doc per target role (e.g. "marketing-director").

const roleCol = (uid) => collection(db, 'users', uid, 'roleTemplates')
const roleRef = (uid, key) => doc(db, 'users', uid, 'roleTemplates', key)

export async function listRoleTemplates(uid) {
  const snap = await getDocs(roleCol(uid))
  return snap.docs.map((d) => ({ key: d.id, ...d.data() }))
}

export async function getRoleTemplate(uid, key) {
  const snap = await getDoc(roleRef(uid, key))
  return snap.exists() ? { key: snap.id, ...snap.data() } : null
}

export async function saveRoleTemplate(uid, key, data) {
  await setDoc(
    roleRef(uid, key),
    { ...data, updatedAt: serverTimestamp() },
    { merge: true }
  )
}

export async function deleteRoleTemplate(uid, key) {
  await deleteDoc(roleRef(uid, key))
}

// ── TARGET COMPANIES ──────────────────────────────────────────────────

const companyCol = (uid) => collection(db, 'users', uid, 'targetCompanies')

export async function listCompanies(uid) {
  const snap = await getDocs(companyCol(uid))
  return snap.docs.map((d) => ({ id: d.id, ...d.data() }))
}

export async function addCompany(uid, entry) {
  const ref = await addDoc(companyCol(uid), {
    ...entry,
    createdAt: serverTimestamp(),
  })
  return ref.id
}

export async function updateCompany(uid, id, entry) {
  await updateDoc(doc(db, 'users', uid, 'targetCompanies', id), entry)
}

export async function deleteCompany(uid, id) {
  await deleteDoc(doc(db, 'users', uid, 'targetCompanies', id))
}
