// Firestore operations for Personal Details
import {
  doc,
  getDoc,
  setDoc,
  Timestamp,
} from "firebase/firestore";
import { db } from "../firebase";

export interface SocialLinks {
  github?: string;
  linkedin?: string;
  twitter?: string;
  instagram?: string;
  youtube?: string;
  dribbble?: string;
  behance?: string;
  medium?: string;
  devto?: string;
  codepen?: string;
  stackoverflow?: string;
  discord?: string;
  telegram?: string;
  whatsapp?: string;
  email?: string;
  website?: string;
}

export interface PersonalDetails {
  // Basic Info
  fullName: string;
  displayName: string;
  tagline: string;
  bio: string;
  shortBio: string;
  
  // Contact Info
  email: string;
  phone?: string;
  location?: string;
  
  // Images
  profileImageUrl: string;
  heroImageUrl?: string;
  logoUrl?: string;
  faviconUrl?: string;
  ogImageUrl?: string;
  
  // Social Links
  socialLinks: SocialLinks;
  
  // Professional Info
  roles: string[];
  currentRole?: string;
  yearsOfExperience?: number;
  availabilityStatus: "available" | "busy" | "not-available";
  
  // Resume/CV
  resumeUrl?: string;
  resumeFileName?: string;
  
  // SEO & Meta
  siteTitle?: string;
  siteDescription?: string;
  keywords?: string[];
  
  // Copyright & Legal
  copyrightYear?: number;
  copyrightName?: string;
  
  // Timestamps
  updatedAt?: Date;
}

const PERSONAL_DETAILS_DOC_ID = "main";
const COLLECTION_NAME = "personalDetails";

export const getPersonalDetails = async (): Promise<PersonalDetails | null> => {
  if (!db) return null;
  
  const docRef = doc(db, COLLECTION_NAME, PERSONAL_DETAILS_DOC_ID);
  const docSnap = await getDoc(docRef);
  
  if (docSnap.exists()) {
    const data = docSnap.data();
    return {
      ...data,
      updatedAt: data.updatedAt?.toDate(),
    } as PersonalDetails;
  }
  return null;
};

export const savePersonalDetails = async (details: Omit<PersonalDetails, "updatedAt">): Promise<void> => {
  if (!db) throw new Error("Firebase not initialized");
  
  const docRef = doc(db, COLLECTION_NAME, PERSONAL_DETAILS_DOC_ID);
  await setDoc(docRef, {
    ...details,
    updatedAt: Timestamp.now(),
  });
};

export const defaultPersonalDetails: Omit<PersonalDetails, "updatedAt"> = {
  fullName: "Moinkhan Bhatti",
  displayName: "Moinkhan",
  tagline: "Crafting Digital Experiences",
  bio: "Frontend Web Developer passionate about creating beautiful, functional, and accessible web experiences.",
  shortBio: "Frontend Developer | UI/UX Enthusiast",
  email: "moinbhatti59@gmail.com",
  phone: "",
  location: "",
  profileImageUrl: "",
  heroImageUrl: "",
  logoUrl: "",
  faviconUrl: "",
  ogImageUrl: "",
  socialLinks: {
    github: "https://github.com/Moinkhan-cmd",
    linkedin: "https://www.linkedin.com/in/moinkhan-bhatti-65363a255",
    twitter: "",
    instagram: "",
    youtube: "",
    dribbble: "",
    behance: "",
    medium: "",
    devto: "",
    codepen: "",
    stackoverflow: "",
    discord: "",
    telegram: "",
    whatsapp: "",
    email: "https://mail.google.com/mail/?view=cm&fs=1&to=moinbhatti59%40gmail.com",
    website: "",
  },
  roles: ["Frontend Developer", "UI/UX Designer", "React Specialist", "Creative Coder"],
  currentRole: "Frontend Developer",
  yearsOfExperience: 0,
  availabilityStatus: "available",
  resumeUrl: "",
  resumeFileName: "",
  siteTitle: "Moinkhan Bhatti - Portfolio",
  siteDescription: "Frontend Web Developer passionate about creating beautiful, functional, and accessible web experiences.",
  keywords: ["Frontend Developer", "React", "TypeScript", "Portfolio"],
  copyrightYear: new Date().getFullYear(),
  copyrightName: "Moinkhan Bhatti",
};
