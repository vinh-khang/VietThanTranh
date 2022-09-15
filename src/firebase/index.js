import {
  doc,
  collection,
  addDoc,
  deleteDoc,
  getDocs,
  setDoc,
  query,
  where,
  onSnapshot,
  documentId,
} from "firebase/firestore";

import { db, auth, firebase } from "./config";

export {
  doc,
  collection,
  addDoc,
  deleteDoc,
  getDocs,
  setDoc,
  query,
  where,
  onSnapshot,
  db,
  auth,
  firebase,
  documentId,
};
