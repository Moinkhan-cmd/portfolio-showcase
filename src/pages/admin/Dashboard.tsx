// Admin dashboard with statistics
import { useEffect, useState } from "react";
import { collection, getDocs, doc, getDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Loader2, FolderKanban, Award, Briefcase, Code, User, CheckCircle, AlertCircle } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Badge } from "@/components/ui/badge";

export const AdminDashboard = () => {
  const navigate = useNavigate();
  const [stats, setStats] = useState({
    projects: 0,
    certifications: 0,
    experience: 0,
    skills: 0,
    personalDetailsConfigured: false,
    loading: true,
  });

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const [projectsSnap, certsSnap, expSnap, skillsSnap, personalDetailsSnap] = await Promise.all([
          getDocs(collection(db, "projects")),
          getDocs(collection(db, "certifications")),
          getDocs(collection(db, "experience")),
          getDocs(collection(db, "skills")),
          getDoc(doc(db, "personalDetails", "main")),
        ]);

        setStats({
          projects: projectsSnap.size,
          certifications: certsSnap.size,
          experience: expSnap.size,
          skills: skillsSnap.size,
          personalDetailsConfigured: personalDetailsSnap.exists(),
          loading: false,
        });
      } catch (error) {
        console.error("Error fetching stats:", error);
        setStats((prev) => ({ ...prev, loading: false }));
      }
    };

    fetchStats();
  }, []);

  const statCards = [
    {
      title: "Projects",
      value: stats.projects,
      description: "Total projects in portfolio",
      icon: FolderKanban,
      color: "text-blue-500",
      bgColor: "bg-blue-500/10",
      route: "/admin/projects",
    },
    {
      title: "Certifications",
      value: stats.certifications,
      description: "Total certifications",
      icon: Award,
      color: "text-yellow-500",
      bgColor: "bg-yellow-500/10",
      route: "/admin/certifications",
    },
    {
      title: "Experience",
      value: stats.experience,
      description: "Work experience entries",
      icon: Briefcase,
      color: "text-green-500",
      bgColor: "bg-green-500/10",
      route: "/admin/experience",
    },
    {
      title: "Skills",
      value: stats.skills,
      description: "Total skills listed",
      icon: Code,
      color: "text-purple-500",
      bgColor: "bg-purple-500/10",
      route: "/admin/skills",
    },
  ];

  if (stats.loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold gradient-text">Dashboard</h1>
        <p className="text-muted-foreground mt-2">
          Welcome to your admin panel. Manage your portfolio content from here.
        </p>
      </div>

      {/* Personal Details Status Card */}
      <Card 
        className="cursor-pointer hover:border-primary/50 transition-colors"
        onClick={() => navigate("/admin/personal-details")}
      >
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-primary/10">
              <User className="h-5 w-5 text-primary" />
            </div>
            <div>
              <CardTitle className="text-lg">Personal Details</CardTitle>
              <CardDescription>Your profile, social links, and branding</CardDescription>
            </div>
          </div>
          {stats.personalDetailsConfigured ? (
            <Badge variant="outline" className="gap-1 text-emerald-500 border-emerald-500/50">
              <CheckCircle className="h-3 w-3" />
              Configured
            </Badge>
          ) : (
            <Badge variant="outline" className="gap-1 text-amber-500 border-amber-500/50">
              <AlertCircle className="h-3 w-3" />
              Not Set Up
            </Badge>
          )}
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">
            {stats.personalDetailsConfigured 
              ? "Click to update your name, bio, social links, images, and SEO settings."
              : "Set up your profile information, social media links, and branding to personalize your portfolio."}
          </p>
        </CardContent>
      </Card>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {statCards.map((stat) => {
          const Icon = stat.icon;
          return (
            <Card 
              key={stat.title} 
              className="card-hover cursor-pointer"
              onClick={() => navigate(stat.route)}
            >
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">{stat.title}</CardTitle>
                <div className={`p-2 rounded-lg ${stat.bgColor}`}>
                  <Icon className={`h-4 w-4 ${stat.color}`} />
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stat.value}</div>
                <p className="text-xs text-muted-foreground mt-1">
                  {stat.description}
                </p>
              </CardContent>
            </Card>
          );
        })}
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Quick Actions</CardTitle>
          <CardDescription>
            Common tasks to manage your portfolio
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-5">
            <button
              onClick={() => navigate("/admin/personal-details")}
              className="flex items-center gap-3 p-4 rounded-lg border border-border hover:bg-accent transition-colors text-left"
            >
              <div className="p-2 rounded-lg bg-primary/10">
                <User className="h-5 w-5 text-primary" />
              </div>
              <span className="font-medium">Edit Profile</span>
            </button>
            {statCards.map((stat) => {
              const Icon = stat.icon;
              return (
                <button
                  key={stat.title}
                  onClick={() => navigate(stat.route)}
                  className="flex items-center gap-3 p-4 rounded-lg border border-border hover:bg-accent transition-colors text-left"
                >
                  <div className={`p-2 rounded-lg ${stat.bgColor}`}>
                    <Icon className={`h-5 w-5 ${stat.color}`} />
                  </div>
                  <span className="font-medium">Manage {stat.title}</span>
                </button>
              );
            })}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
