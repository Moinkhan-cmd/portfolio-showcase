// Admin dashboard with statistics
import { useEffect, useState } from "react";
import { collection, getDocs } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Loader2, FolderKanban, Award, Briefcase, Code } from "lucide-react";

export const AdminDashboard = () => {
  const [stats, setStats] = useState({
    projects: 0,
    certifications: 0,
    experience: 0,
    skills: 0,
    loading: true,
  });

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const [projectsSnap, certsSnap, expSnap, skillsSnap] = await Promise.all([
          getDocs(collection(db, "projects")),
          getDocs(collection(db, "certifications")),
          getDocs(collection(db, "experience")),
          getDocs(collection(db, "skills")),
        ]);

        setStats({
          projects: projectsSnap.size,
          certifications: certsSnap.size,
          experience: expSnap.size,
          skills: skillsSnap.size,
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
    },
    {
      title: "Certifications",
      value: stats.certifications,
      description: "Total certifications",
      icon: Award,
      color: "text-yellow-500",
      bgColor: "bg-yellow-500/10",
    },
    {
      title: "Experience",
      value: stats.experience,
      description: "Work experience entries",
      icon: Briefcase,
      color: "text-green-500",
      bgColor: "bg-green-500/10",
    },
    {
      title: "Skills",
      value: stats.skills,
      description: "Total skills listed",
      icon: Code,
      color: "text-purple-500",
      bgColor: "bg-purple-500/10",
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

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {statCards.map((stat) => {
          const Icon = stat.icon;
          return (
            <Card key={stat.title} className="card-hover">
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
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            {statCards.map((stat) => {
              const Icon = stat.icon;
              const routes: Record<string, string> = {
                Projects: "/admin/projects",
                Certifications: "/admin/certifications",
                Experience: "/admin/experience",
                Skills: "/admin/skills",
              };
              return (
                <a
                  key={stat.title}
                  href={routes[stat.title] || "/admin"}
                  className="flex items-center gap-3 p-4 rounded-lg border border-border hover:bg-accent transition-colors"
                >
                  <div className={`p-2 rounded-lg ${stat.bgColor}`}>
                    <Icon className={`h-5 w-5 ${stat.color}`} />
                  </div>
                  <span className="font-medium">Manage {stat.title}</span>
                </a>
              );
            })}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

