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
import { Plus, Edit, Trash2, Loader2 } from "lucide-react";
import { getSkills, createSkill, updateSkill, deleteSkill, Skill } from "@/lib/admin/skills";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export const AdminSkills = () => {
  const [skills, setSkills] = useState<Skill[]>([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [selectedSkill, setSelectedSkill] = useState<Skill | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  const [formData, setFormData] = useState({
    name: "",
    category: "",
    level: "intermediate",
    icon: "",
  });

  useEffect(() => {
    loadSkills();
  }, []);

  const loadSkills = async () => {
    try {
      setLoading(true);
      const data = await getSkills();
      setSkills(data.filter((skill) => skill && skill.id && skill.name));
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to fetch skills",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleOpenDialog = (skill?: Skill) => {
    if (skill) {
      setSelectedSkill(skill);
      setFormData({
        name: skill.name || "",
        category: skill.category || "",
        level: skill.level || "intermediate",
        icon: skill.icon || "",
      });
    } else {
      setSelectedSkill(null);
      setFormData({
        name: "",
        category: "",
        level: "intermediate",
        icon: "",
      });
    }
    setDialogOpen(true);
  };

  const handleCloseDialog = () => {
    if (!isSubmitting) {
      setDialogOpen(false);
      setSelectedSkill(null);
      setFormData({
        name: "",
        category: "",
        level: "intermediate",
        icon: "",
      });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.name.trim() || !formData.category.trim()) {
      toast({
        title: "Error",
        description: "Please fill in all required fields",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);

    try {
      const skillData = {
        name: formData.name.trim(),
        category: formData.category.trim(),
        level: formData.level as "beginner" | "intermediate" | "advanced" | "expert",
        icon: formData.icon.trim(),
      };

      if (selectedSkill?.id) {
        await updateSkill(selectedSkill.id, skillData);
        toast({ title: "Success", description: "Skill updated successfully" });
      } else {
        await createSkill(skillData);
        toast({ title: "Success", description: "Skill created successfully" });
      }

      handleCloseDialog();
      await loadSkills();
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to save skill",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteClick = (skill: Skill) => {
    setSelectedSkill(skill);
    setDeleteDialogOpen(true);
  };

  const handleDelete = async () => {
    if (!selectedSkill?.id) return;

    try {
      await deleteSkill(selectedSkill.id);
      toast({ title: "Success", description: "Skill deleted successfully" });
      setDeleteDialogOpen(false);
      setSelectedSkill(null);
      await loadSkills();
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to delete skill",
        variant: "destructive",
      });
    }
  };

  // Group skills by category
  const groupedSkills = skills.reduce((acc, skill) => {
    const category = skill.category || "Other";
    if (!acc[category]) {
      acc[category] = [];
    }
    acc[category].push(skill);
    return acc;
  }, {} as Record<string, Skill[]>);

  const categories = Object.keys(groupedSkills).sort();

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
          <h1 className="text-3xl font-bold">Skills</h1>
          <p className="text-muted-foreground mt-2">Manage your skills</p>
        </div>
        <Button onClick={() => handleOpenDialog()}>
          <Plus className="mr-2 h-4 w-4" />
          Add Skill
        </Button>
      </div>

      {categories.length > 0 ? (
        <div className="space-y-6">
          {categories.map((category) => (
            <Card key={category}>
              <CardHeader>
                <CardTitle>{category}</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                  {groupedSkills[category].map((skill) => (
                    <div
                      key={skill.id}
                      className="flex items-center justify-between p-4 border rounded-lg"
                    >
                      <div className="flex items-center gap-3 flex-1">
                        {skill.icon && <span className="text-2xl">{skill.icon}</span>}
                        <div>
                          <p className="font-medium">{skill.name}</p>
                          {skill.level && (
                            <Badge variant="outline" className="text-xs mt-1">
                              {skill.level}
                            </Badge>
                          )}
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleOpenDialog(skill)}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleDeleteClick(skill)}
                          className="text-destructive"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          ))}
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

      <Dialog open={dialogOpen} onOpenChange={(open) => !open && handleCloseDialog()}>
        <DialogContent className="max-w-[600px] w-full max-h-[85vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{selectedSkill ? "Edit Skill" : "Add New Skill"}</DialogTitle>
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
                disabled={isSubmitting}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="category">Category *</Label>
              <Select
                value={formData.category || ""}
                onValueChange={(value) => setFormData({ ...formData, category: value })}
                disabled={isSubmitting}
              >
                <SelectTrigger id="category">
                  <SelectValue placeholder="Select a category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Frontend Development">Frontend Development</SelectItem>
                  <SelectItem value="Backend & Database">Backend & Database</SelectItem>
                  <SelectItem value="Programming Languages">Programming Languages</SelectItem>
                  <SelectItem value="Tools & Platforms">Tools & Platforms</SelectItem>
                  <SelectItem value="Soft Skills">Soft Skills</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="level">Skill Level</Label>
              <Select
                value={formData.level || "intermediate"}
                onValueChange={(value) => setFormData({ ...formData, level: value })}
                disabled={isSubmitting}
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
              <Label htmlFor="icon">Icon (Optional)</Label>
              <Input
                id="icon"
                value={formData.icon}
                onChange={(e) => setFormData({ ...formData, icon: e.target.value })}
                placeholder="🚀 or emoji"
                disabled={isSubmitting}
              />
            </div>

            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={handleCloseDialog}
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
