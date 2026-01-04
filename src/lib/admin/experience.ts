// Firestore operations for Experience
import {
  collection,
  doc,
  getDocs,
  getDoc,
  addDoc,
  updateDoc,
  deleteDoc,
  query,
  orderBy,
  Timestamp,
} from "firebase/firestore";
import { db } from "../firebase";

export interface Experience {
  id?: string;
  title: string;
  company: string;
  startDate: string; // Format: "YYYY-MM" (month and year only)
  endDate?: string; // Format: "YYYY-MM" (month and year only)
  current: boolean;
  workType: "remote" | "onsite" | "hybrid";
  location?: string; // Required if workType is "onsite" or "hybrid"
  responsibilities: string[];
  skills: string[];
  createdAt?: Date;
  updatedAt?: Date;
}

export const getExperiences = async (): Promise<Experience[]> => {
  const q = query(collection(db, "experience"), orderBy("startDate", "desc"));
  const querySnapshot = await getDocs(q);
  return querySnapshot.docs.map((doc) => ({
    id: doc.id,
    ...doc.data(),
    createdAt: doc.data().createdAt?.toDate(),
    updatedAt: doc.data().updatedAt?.toDate(),
  })) as Experience[];
};

export const getExperience = async (id: string): Promise<Experience | null> => {
  const docRef = doc(db, "experience", id);
  const docSnap = await getDoc(docRef);
  if (docSnap.exists()) {
    return {
      id: docSnap.id,
      ...docSnap.data(),
      createdAt: docSnap.data().createdAt?.toDate(),
      updatedAt: docSnap.data().updatedAt?.toDate(),
    } as Experience;
  }
  return null;
};

export const createExperience = async (
  exp: Omit<Experience, "id" | "createdAt" | "updatedAt">
): Promise<string> => {
  const docRef = await addDoc(collection(db, "experience"), {
    ...exp,
    createdAt: Timestamp.now(),
    updatedAt: Timestamp.now(),
  });
  return docRef.id;
};

export const updateExperience = async (
  id: string,
  exp: Partial<Experience>
): Promise<void> => {
  const docRef = doc(db, "experience", id);
  await updateDoc(docRef, {
    ...exp,
    updatedAt: Timestamp.now(),
  });
};

export const deleteExperience = async (id: string): Promise<void> => {
  await deleteDoc(doc(db, "experience", id));
};















