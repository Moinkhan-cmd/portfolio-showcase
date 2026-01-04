// Firestore operations for Certifications
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

export interface Certification {
  id?: string;
  title: string;
  issuer: string;
  issueDate: string;
  credentialUrl: string;
  imageUrl: string;
  description?: string;
  createdAt?: Date;
  updatedAt?: Date;
}

export const getCertifications = async (): Promise<Certification[]> => {
  const q = query(collection(db, "certifications"), orderBy("issueDate", "desc"));
  const querySnapshot = await getDocs(q);
  return querySnapshot.docs.map((doc) => ({
    id: doc.id,
    ...doc.data(),
    createdAt: doc.data().createdAt?.toDate(),
    updatedAt: doc.data().updatedAt?.toDate(),
  })) as Certification[];
};

export const getCertification = async (id: string): Promise<Certification | null> => {
  const docRef = doc(db, "certifications", id);
  const docSnap = await getDoc(docRef);
  if (docSnap.exists()) {
    return {
      id: docSnap.id,
      ...docSnap.data(),
      createdAt: docSnap.data().createdAt?.toDate(),
      updatedAt: docSnap.data().updatedAt?.toDate(),
    } as Certification;
  }
  return null;
};

export const createCertification = async (
  cert: Omit<Certification, "id" | "createdAt" | "updatedAt">
): Promise<string> => {
  const docRef = await addDoc(collection(db, "certifications"), {
    ...cert,
    createdAt: Timestamp.now(),
    updatedAt: Timestamp.now(),
  });
  return docRef.id;
};

export const updateCertification = async (
  id: string,
  cert: Partial<Certification>
): Promise<void> => {
  const docRef = doc(db, "certifications", id);
  await updateDoc(docRef, {
    ...cert,
    updatedAt: Timestamp.now(),
  });
};

export const deleteCertification = async (id: string): Promise<void> => {
  await deleteDoc(doc(db, "certifications", id));
};












