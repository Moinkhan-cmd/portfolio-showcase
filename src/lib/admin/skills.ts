// Firestore operations for Skills
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

export interface Skill {
  id?: string;
  name: string;
  category: string;
  level?: "beginner" | "intermediate" | "advanced" | "expert";
  icon?: string;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface SkillCategory {
  id?: string;
  title: string;
  icon?: string;
  skills: Skill[];
}

export const getSkills = async (): Promise<Skill[]> => {
  const q = query(collection(db, "skills"), orderBy("name", "asc"));
  const querySnapshot = await getDocs(q);
  return querySnapshot.docs.map((doc) => ({
    id: doc.id,
    ...doc.data(),
    createdAt: doc.data().createdAt?.toDate(),
    updatedAt: doc.data().updatedAt?.toDate(),
  })) as Skill[];
};

export const getSkill = async (id: string): Promise<Skill | null> => {
  const docRef = doc(db, "skills", id);
  const docSnap = await getDoc(docRef);
  if (docSnap.exists()) {
    return {
      id: docSnap.id,
      ...docSnap.data(),
      createdAt: docSnap.data().createdAt?.toDate(),
      updatedAt: docSnap.data().updatedAt?.toDate(),
    } as Skill;
  }
  return null;
};

export const createSkill = async (
  skill: Omit<Skill, "id" | "createdAt" | "updatedAt">
): Promise<string> => {
  const docRef = await addDoc(collection(db, "skills"), {
    ...skill,
    createdAt: Timestamp.now(),
    updatedAt: Timestamp.now(),
  });
  return docRef.id;
};

export const updateSkill = async (id: string, skill: Partial<Skill>): Promise<void> => {
  const docRef = doc(db, "skills", id);
  await updateDoc(docRef, {
    ...skill,
    updatedAt: Timestamp.now(),
  });
};

export const deleteSkill = async (id: string): Promise<void> => {
  await deleteDoc(doc(db, "skills", id));
};

