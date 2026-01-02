// Skills CRUD page
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";
import { Plus, Edit, Trash2, Loader2 } from "lucide-react";
import { getSkills, getSkill, createSkill, updateSkill, deleteSkill, Skill } from "@/lib/admin/skills";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

// Category enum system - normalized internal values
type SkillCategory = 
  | "frontend_development"
  | "backend_database"
  | "programming_languages"
  | "tools_platform"
  | "soft_skills";

// Category display labels mapping
const CATEGORY_LABELS: Record<SkillCategory, string> = {
  frontend_development: "Frontend Development",
  backend_database: "Backend & Database",
  programming_languages: "Programming Languages",
  tools_platform: "Tools & Platform",
  soft_skills: "Soft Skills",
};

// Level type
type SkillLevel = "beginner" | "intermediate" | "advanced" | "expert";

// Shared SkillCard component - no category-specific logic
interface SkillCardProps {
  skill: Skill;
  onEdit: (skill: Skill) => void;
  onDelete: (skill: Skill) => void;
}

const SkillCard = ({ skill, onEdit, onDelete }: SkillCardProps) => {
  const skillName = (skill.name || "").trim() || "Unnamed Skill";
  const skillIcon = (skill.icon || "").trim();
  const skillLevel = (skill.level || "intermediate") as SkillLevel;
  const hasIcon = skillIcon.length > 0;

  // Level-based badge colors (not category-based)
  const getLevelColor = (level: SkillLevel): string => {
    switch (level) {
      case "beginner":
        return "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300";
      case "intermediate":
        return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300";
      case "advanced":
        return "bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-300";
      case "expert":
        return "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300";
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300";
    }
  };

  return (
    <div className="group relative flex items-center justify-between p-4 border rounded-lg hover:bg-accent/50 transition-colors min-h-[80px] bg-background">
      <div className="flex items-center gap-3 flex-1 min-w-0">
        {/* Icon - always reserves space */}
        <div className="flex-shrink-0 w-8 h-8 flex items-center justify-center">
          {hasIcon ? (
            <span className="text-2xl">{skillIcon}</span>
          ) : (
            <span className="w-6 h-6 rounded bg-muted/50 flex items-center justify-center">
              <span className="text-xs text-muted-foreground">•</span>
            </span>
          )}
        </div>
        {/* Content - always has base styles */}
        <div className="flex-1 min-w-0 flex flex-col gap-1">
          <p className="font-medium truncate text-sm sm:text-base">{skillName}</p>
          {/* Level badge - always renders */}
          <Badge
            variant="outline"
            className={cn("text-xs mt-0 w-fit border-0", getLevelColor(skillLevel))}
          >
            {skillLevel}
          </Badge>
        </div>
      </div>
      {/* Actions */}
      <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0">
        <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => onEdit(skill)}>
          <Edit className="h-4 w-4" />
        </Button>
        <Button
          variant="ghost"
          size="icon"
          className="h-8 w-8 text-destructive hover:text-destructive"
          onClick={() => onDelete(skill)}
        >
          <Trash2 className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
};

export const AdminSkills = () => {
  const [skills, setSkills] = useState<Skill[]>([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [selectedSkill, setSelectedSkill] = useState<Skill | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  const [formData, setFormData] = useState<Omit<Skill, "id" | "createdAt" | "updatedAt">>({
    name: "",
    category: "tools_platform",
    level: "intermediate",
    icon: "",
  });

  useEffect(() => {
    fetchSkills();
  }, []);

  const fetchSkills = async () => {
    try {
      setLoading(true);
      const data = await getSkills();
      // Filter out any invalid skills (missing required fields)
      const validSkills = data.filter(
        (skill) => skill && skill.id && skill.name && skill.category
      );
      // Normalize all skills - migrate old category strings to enum values
      setSkills(
        validSkills.map((skill) => ({
          ...skill,
          name: (skill.name || "").trim(),
          category: normalizeCategory(skill.category), // Convert to enum
          level: normalizeLevel(skill.level),
          icon: (skill.icon || "").trim(),
        }))
      );
    } catch (error: any) {
      console.error("Error fetching skills:", error);
      toast({
        title: "Error",
        description: error.message || "Failed to fetch skills",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  // Normalize category to enum - maps old strings to new enum values
  const normalizeCategory = (category: unknown): SkillCategory => {
    if (typeof category !== "string") return "tools_platform";
    const trimmed = category.trim().toLowerCase();
    if (!trimmed) return "tools_platform";

    // Migration: map old category strings to new enum values
    const migrationMap: Record<string, SkillCategory> = {
      "frontend development": "frontend_development",
      "backend & database": "backend_database",
      "backend and database": "backend_database",
      "programming languages": "programming_languages",
      "tools & platform": "tools_platform",
      "tools and platform": "tools_platform",
      "tools & platforms": "tools_platform",
      "tools and platforms": "tools_platform",
      "soft skills": "soft_skills",
    };

    // Check migration map first
    if (migrationMap[trimmed]) {
      return migrationMap[trimmed];
    }

    // Check if already in enum format
    const enumValues: SkillCategory[] = [
      "frontend_development",
      "backend_database",
      "programming_languages",
      "tools_platform",
      "soft_skills",
    ];
    if (enumValues.includes(trimmed as SkillCategory)) {
      return trimmed as SkillCategory;
    }

    // Default fallback
    return "tools_platform";
  };

  // Normalize level to lowercase enum
  const normalizeLevel = (level: unknown): SkillLevel => {
    const raw = typeof level === "string" ? level.trim().toLowerCase() : "";
    if (raw === "beginner" || raw === "intermediate" || raw === "advanced" || raw === "expert") {
      return raw as SkillLevel;
    }
    return "intermediate";
  };

  // Get display label for category
  const getCategoryLabel = (category: SkillCategory): string => {
    return CATEGORY_LABELS[category] || "Tools & Platform";
  };

  const handleOpenDialog = (skill?: Skill) => {
    if (skill) {
      setSelectedSkill(skill);
      const normalizedCategory = normalizeCategory(skill.category);
      setFormData({
        name: skill.name || "",
        category: normalizedCategory,
        level: normalizeLevel(skill.level),
        icon: skill.icon || "",
      });
    } else {
      resetForm();
    }
    setDialogOpen(true);
  };

  const resetForm = () => {
    setSelectedSkill(null);
    setFormData({
      name: "",
      category: "tools_platform",
      level: "intermediate",
      icon: "",
    });
  };

  const handleDialogOpenChange = (open: boolean) => {
    if (!open && !isSubmitting) {
      // Only reset form if dialog is closing and not submitting
      resetForm();
    }
    setDialogOpen(open);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validate required fields
    if (!formData.name?.trim() || !formData.category?.trim()) {
      toast({
        title: "Error",
        description: "Please fill in all required fields",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);

    try {
      // Normalize and validate data before saving
      const normalizedCategory = normalizeCategory(formData.category);
      const normalizedData = {
        name: formData.name.trim(),
        category: normalizedCategory, // Save as enum value
        level: normalizeLevel(formData.level),
        icon: (formData.icon || "").trim(),
      };

      let savedId: string | undefined = selectedSkill?.id;

      if (savedId) {
        await updateSkill(savedId, normalizedData);
        toast({ title: "Success", description: "Skill updated successfully" });
      } else {
        savedId = await createSkill(normalizedData);
        toast({ title: "Success", description: "Skill created successfully" });
      }

      setDialogOpen(false);
      resetForm();
      setTimeout(() => {
        fetchSkills();
      }, 500);
    } catch (error: any) {
      console.error("Error saving skill:", error);
      toast({
        title: "Error",
        description: error.message || "Failed to save skill",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };
  const handleDelete = async () => {
    if (!selectedSkill?.id) return;

    try {
      await deleteSkill(selectedSkill.id);
      toast({ title: "Success", description: "Skill deleted successfully" });
      setDeleteDialogOpen(false);
      setSelectedSkill(null);
      fetchSkills();
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to delete skill",
        variant: "destructive",
      });
    }
  };

  // Category display order (using enum values)
  const categoryOrder: SkillCategory[] = [
    "frontend_development",
    "backend_database",
    "programming_languages",
    "tools_platform",
    "soft_skills",
  ];

  // Group skills by category (normalized to enum)
  const groupedSkills = skills.reduce((acc, skill) => {
    if (!skill?.id) return acc;

    const category = normalizeCategory(skill.category);
    const normalizedSkill: Skill = {
      ...skill,
      name: (skill.name || "").trim(),
      category, // Store as enum value
      level: normalizeLevel(skill.level),
      icon: (skill.icon || "").trim(),
    };

    if (!acc[category]) {
      acc[category] = [];
    }
    acc[category].push(normalizedSkill);
    return acc;
  }, {} as Record<SkillCategory, Skill[]>);

  // Sort categories according to defined order
  const sortedCategories = Object.keys(groupedSkills).sort((a, b) => {
    const indexA = categoryOrder.indexOf(a as SkillCategory);
    const indexB = categoryOrder.indexOf(b as SkillCategory);
    if (indexA === -1 && indexB === -1) return a.localeCompare(b);
    if (indexA === -1) return 1;
    if (indexB === -1) return -1;
    return indexA - indexB;
  }) as SkillCategory[];

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold gradient-text">Skills</h1>
          <p className="text-muted-foreground mt-2">Manage your skills</p>
        </div>
        <Button onClick={() => handleOpenDialog()}>
          <Plus className="mr-2 h-4 w-4" />
          Add Skill
        </Button>
      </div>

      {Object.keys(groupedSkills).length > 0 ? (
        <div className="space-y-6">
          {sortedCategories.map((category) => {
            const categorySkills = groupedSkills[category] || [];
            const validSkills = categorySkills.filter((skill) => skill && skill.id);
            
            if (validSkills.length === 0) {
              return null;
            }
            
            // Use shared SkillCard component for all categories
            return (
              <Card key={category}>
                <CardHeader>
                  <CardTitle>{getCategoryLabel(category)}</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                    {validSkills.map((skill) => (
                      <SkillCard
                        key={skill.id}
                        skill={skill}
                        onEdit={handleOpenDialog}
                        onDelete={(skill) => {
                          setSelectedSkill(skill);
                          setDeleteDialogOpen(true);
                        }}
                      />
                    ))}
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      ) : (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <p className="text-muted-foreground mb-4">No skills yet</p>
            <Button onClick={() => handleOpenDialog()}>
              <Plus className="mr-2 h-4 w-4" />
              Add Your First Skill
            </Button>
          </CardContent>
        </Card>
      )}

      <Dialog open={dialogOpen} onOpenChange={handleDialogOpenChange}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {selectedSkill ? "Edit Skill" : "Add New Skill"}
            </DialogTitle>
            <DialogDescription>
              {selectedSkill
                ? "Update the skill details below"
                : "Fill in the details to add a new skill"}
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">Skill Name *</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="category">Category *</Label>
              <Select
                value={formData.category || "tools_platform"}
                onValueChange={(value) => setFormData({ ...formData, category: value as SkillCategory })}
              >
                <SelectTrigger id="category">
                  <SelectValue placeholder="Select a category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="frontend_development">Frontend Development</SelectItem>
                  <SelectItem value="backend_database">Backend & Database</SelectItem>
                  <SelectItem value="programming_languages">Programming Languages</SelectItem>
                  <SelectItem value="tools_platform">Tools & Platform</SelectItem>
                  <SelectItem value="soft_skills">Soft Skills</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="level">Skill Level</Label>
              <Select
                value={formData.level || "intermediate"}
                onValueChange={(value) =>
                  setFormData({
                    ...formData,
                    level: value as SkillLevel,
                  })
                }
              >
                <SelectTrigger id="level">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="beginner">Beginner</SelectItem>
                  <SelectItem value="intermediate">Intermediate</SelectItem>
                  <SelectItem value="advanced">Advanced</SelectItem>
                  <SelectItem value="expert">Expert</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="icon">Icon (emoji or text)</Label>
              <Input
                id="icon"
                value={formData.icon}
                onChange={(e) => setFormData({ ...formData, icon: e.target.value })}
                placeholder="🚀 or code icon"
              />
            </div>

            <DialogFooter>
              <Button 
                type="button" 
                variant="outline" 
                onClick={() => handleDialogOpenChange(false)}
                disabled={isSubmitting}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Saving...
                  </>
                ) : selectedSkill ? (
                  "Update"
                ) : (
                  "Create"
                )}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete this skill.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};




