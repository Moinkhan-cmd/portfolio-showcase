// Firestore operations for Projects
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

export interface Project {
  id?: string;
  title: string;
  shortDescription: string;
  fullDescription: string;
  techStack: string[];
  category: string;
  thumbnail: string;
  images: string[];
  liveUrl: string;
  githubUrl: string;
  status: "completed" | "in-progress";
  featured: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}

export const getProjects = async (): Promise<Project[]> => {
  const q = query(collection(db, "projects"), orderBy("createdAt", "desc"));
  const querySnapshot = await getDocs(q);
  return querySnapshot.docs.map((doc) => ({
    id: doc.id,
    ...doc.data(),
    createdAt: doc.data().createdAt?.toDate(),
    updatedAt: doc.data().updatedAt?.toDate(),
  })) as Project[];
};

export const getProject = async (id: string): Promise<Project | null> => {
  const docRef = doc(db, "projects", id);
  const docSnap = await getDoc(docRef);
  if (docSnap.exists()) {
    return {
      id: docSnap.id,
      ...docSnap.data(),
      createdAt: docSnap.data().createdAt?.toDate(),
      updatedAt: docSnap.data().updatedAt?.toDate(),
    } as Project;
  }
  return null;
};

export const createProject = async (project: Omit<Project, "id" | "createdAt" | "updatedAt">): Promise<string> => {
  const docRef = await addDoc(collection(db, "projects"), {
    ...project,
    createdAt: Timestamp.now(),
    updatedAt: Timestamp.now(),
  });
  return docRef.id;
};

export const updateProject = async (id: string, project: Partial<Project>): Promise<void> => {
  const docRef = doc(db, "projects", id);
  await updateDoc(docRef, {
    ...project,
    updatedAt: Timestamp.now(),
  });
};

export const deleteProject = async (id: string): Promise<void> => {
  await deleteDoc(doc(db, "projects", id));
};














