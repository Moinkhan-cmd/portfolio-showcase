// Script to seed skills data into Firestore
// Run this once to add your existing skills to the database

import { initializeApp } from "firebase/app";
import { getFirestore, collection, addDoc, Timestamp } from "firebase/firestore";

// Your Firebase configuration (same as in .env)
const firebaseConfig = {
  apiKey: "AIzaSyBc6z77sXLqBIy3nTmhpD2hXUj59nPRzb0",
  authDomain: "portfolio-showcase-9748a.firebaseapp.com",
  projectId: "portfolio-showcase-9748a",
  messagingSenderId: "1013442670098",
  appId: "1:1013442670098:web:19a4887b0df698f2f332cb",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// Skills data that was previously hardcoded
const skillsData = [
  // Frontend Development
  { name: "HTML5 & CSS3", category: "Frontend Development", level: "advanced" },
  { name: "JavaScript", category: "Frontend Development", level: "advanced" },
  { name: "React.js", category: "Frontend Development", level: "intermediate" },
  { name: "Tailwind CSS", category: "Frontend Development", level: "advanced" },
  { name: "Responsive UI Design", category: "Frontend Development", level: "advanced" },
  
  // Backend & Database
  { name: "Node.js", category: "Backend & Database", level: "intermediate" },
  { name: "Express.js", category: "Backend & Database", level: "intermediate" },
  { name: "PHP", category: "Backend & Database", level: "intermediate" },
  { name: "MySQL", category: "Backend & Database", level: "intermediate" },
  
  // Programming Languages
  { name: "JavaScript", category: "Programming Languages", level: "advanced" },
  { name: "Java", category: "Programming Languages", level: "intermediate" },
  { name: "Python", category: "Programming Languages", level: "intermediate" },
  { name: "C / C++", category: "Programming Languages", level: "beginner" },
  
  // Tools & Platforms
  { name: "Git & GitHub", category: "Tools & Platforms", level: "intermediate" },
  { name: "VS Code", category: "Tools & Platforms", level: "advanced" },
  { name: "XAMPP", category: "Tools & Platforms", level: "intermediate" },
  
  // Soft Skills
  { name: "Team Collaboration", category: "Soft Skills", level: "advanced" },
  { name: "Communication", category: "Soft Skills", level: "advanced" },
  { name: "Problem Solving", category: "Soft Skills", level: "advanced" },
  { name: "Time Management", category: "Soft Skills", level: "advanced" },
];

async function seedSkills() {
  try {
    console.log("Starting to seed skills...");
    
    for (const skill of skillsData) {
      await addDoc(collection(db, "skills"), {
        ...skill,
        createdAt: Timestamp.now(),
        updatedAt: Timestamp.now(),
      });
      console.log(`✅ Added: ${skill.name} (${skill.category})`);
    }
    
    console.log("\n🎉 All skills have been added successfully!");
    console.log("You can now see them in your admin panel and website.");
  } catch (error) {
    console.error("❌ Error seeding skills:", error);
  }
}

// Run the seed function
seedSkills()
  .then(() => {
    console.log("\n✅ Done! You can close this script now.");
    process.exit(0);
  })
  .catch((error) => {
    console.error("❌ Failed:", error);
    process.exit(1);
  });







