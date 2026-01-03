# Admin Panel Overview

This portfolio includes a complete, production-ready admin panel that allows you to manage all portfolio content dynamically without touching code.

## 🎯 Features

- **Authentication**: Secure email/password login using Firebase Authentication
- **Dashboard**: Overview with statistics (Projects, Certifications, Experience, Skills counts)
- **Projects Management**: Full CRUD operations with image upload support
- **Certifications Management**: Add/edit/delete certifications with images
- **Experience Management**: Manage work experience entries
- **Skills Management**: Organize skills by category
- **Dynamic Portfolio**: All portfolio sections fetch data from Firestore in real-time

## 📁 Project Structure

```
src/
├── components/
│   └── admin/
│       ├── AdminLayout.tsx      # Admin layout with sidebar
│       └── ProtectedRoute.tsx   # Route protection component
├── contexts/
│   └── AuthContext.tsx          # Authentication context
├── hooks/
│   ├── useProjects.ts           # Hook to fetch projects
│   ├── useCertifications.ts     # Hook to fetch certifications
│   ├── useExperience.ts         # Hook to fetch experience
│   └── useSkills.ts             # Hook to fetch skills
├── lib/
│   ├── firebase.ts              # Firebase initialization
│   └── admin/
│       ├── projects.ts          # Projects Firestore operations
│       ├── certifications.ts    # Certifications Firestore operations
│       ├── experience.ts        # Experience Firestore operations
│       ├── skills.ts            # Skills Firestore operations
│       └── storage.ts           # Firebase Storage operations
└── pages/
    └── admin/
        ├── Login.tsx            # Admin login page
        ├── Dashboard.tsx        # Admin dashboard
        ├── Projects.tsx         # Projects CRUD page
        ├── Certifications.tsx   # Certifications CRUD page
        ├── Experience.tsx       # Experience CRUD page
        └── Skills.tsx           # Skills CRUD page
```

## 🚀 Quick Start

1. **Set up Firebase** - Follow the [Firebase Setup Guide](./FIREBASE_SETUP.md)
2. **Configure environment variables** - Add Firebase config to `.env` and Netlify
3. **Deploy** - Your admin panel will be available at `/admin`

## 🔐 Accessing the Admin Panel

- **URL**: `https://your-site.netlify.app/admin` or `http://localhost:8080/admin`
- **Login**: Use the admin email and password you created in Firebase Authentication

## 📝 Managing Content

### Projects
- Add projects with title, descriptions, tech stack, images, and URLs
- Mark projects as featured
- Upload multiple images per project
- Set project status (completed/in-progress)

### Certifications
- Add certifications with issuer, issue date, and credential URL
- Upload certificate images
- Add descriptions

### Experience
- Add work experience entries
- Mark current positions
- Add responsibilities and skills used
- Set start and end dates

### Skills
- Add skills with name, category, and skill level
- Skills are automatically grouped by category on the portfolio
- Add icons (emoji or text) to skills

## 🔄 How It Works

1. **Admin Panel** (`/admin`): Authenticated admin users can create, update, and delete content
2. **Portfolio Pages** (`/`): Public pages fetch and display content from Firestore
3. **Real-time Updates**: Changes in the admin panel are immediately reflected on the portfolio

## 🛡️ Security

- **Authentication**: Firebase Authentication handles secure login
- **Authorization**: Only the admin email (set in `VITE_ADMIN_EMAIL`) can access the admin panel
- **Firestore Rules**: Public read, authenticated write
- **Storage Rules**: Public read, authenticated write

## 📚 Documentation

- [Firebase Setup Guide](./FIREBASE_SETUP.md) - Complete setup instructions
- `firestore.rules` - Firestore security rules
- `storage.rules` - Storage security rules

## 🐛 Troubleshooting

See the [Firebase Setup Guide](./FIREBASE_SETUP.md) for troubleshooting tips.

## 💡 Tips

- **First Time**: When you first log in, the database will be empty. Add your content through the admin panel.
- **Images**: Images are automatically uploaded to Firebase Storage and optimized.
- **Categories**: For skills, use consistent category names (e.g., "Frontend Development", "Backend & Database") for better grouping.
- **Featured Projects**: Mark your best projects as "Featured" to highlight them on the portfolio.

---

**Need Help?** Check the [Firebase Setup Guide](./FIREBASE_SETUP.md) or review the code comments for implementation details.










