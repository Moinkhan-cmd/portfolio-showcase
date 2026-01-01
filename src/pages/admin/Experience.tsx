// Experience CRUD page
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
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { Plus, Edit, Trash2, Loader2 } from "lucide-react";
import {
  getExperiences,
  createExperience,
  updateExperience,
  deleteExperience,
  Experience,
} from "@/lib/admin/experience";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";

export const AdminExperience = () => {
  const [experiences, setExperiences] = useState<Experience[]>([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [selectedExp, setSelectedExp] = useState<Experience | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  const [formData, setFormData] = useState<Omit<Experience, "id" | "createdAt" | "updatedAt">>({
    title: "",
    company: "",
    startDate: "",
    endDate: "",
    current: false,
    responsibilities: [],
    skills: [],
  });

  const [responsibilitiesInput, setResponsibilitiesInput] = useState("");
  const [skillsInput, setSkillsInput] = useState("");

  useEffect(() => {
    fetchExperiences();
  }, []);

  const fetchExperiences = async () => {
    try {
      setLoading(true);
      const data = await getExperiences();
      setExperiences(data);
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to fetch experience",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleOpenDialog = (exp?: Experience) => {
    if (exp) {
      setSelectedExp(exp);
      setFormData({
        title: exp.title,
        company: exp.company,
        startDate: exp.startDate,
        endDate: exp.endDate || "",
        current: exp.current,
        responsibilities: exp.responsibilities,
        skills: exp.skills,
      });
      setResponsibilitiesInput(exp.responsibilities.join("\n"));
      setSkillsInput(exp.skills.join(", "));
    } else {
      resetForm();
    }
    setDialogOpen(true);
  };

  const resetForm = () => {
    setSelectedExp(null);
    setFormData({
      title: "",
      company: "",
      startDate: "",
      endDate: "",
      current: false,
      responsibilities: [],
      skills: [],
    });
    setResponsibilitiesInput("");
    setSkillsInput("");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const responsibilities = responsibilitiesInput
        .split("\n")
        .map((r) => r.trim())
        .filter((r) => r.length > 0);
      const skills = skillsInput
        .split(",")
        .map((s) => s.trim())
        .filter((s) => s.length > 0);

      const expData = {
        ...formData,
        responsibilities,
        skills,
        endDate: formData.current ? undefined : formData.endDate,
      };

      if (selectedExp?.id) {
        await updateExperience(selectedExp.id, expData);
        toast({ title: "Success", description: "Experience updated successfully" });
      } else {
        await createExperience(expData);
        toast({ title: "Success", description: "Experience created successfully" });
      }

      setDialogOpen(false);
      resetForm();
      fetchExperiences();
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to save experience",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async () => {
    if (!selectedExp?.id) return;

    try {
      await deleteExperience(selectedExp.id);
      toast({ title: "Success", description: "Experience deleted successfully" });
      setDeleteDialogOpen(false);
      setSelectedExp(null);
      fetchExperiences();
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to delete experience",
        variant: "destructive",
      });
    }
  };

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
          <h1 className="text-3xl font-bold gradient-text">Experience</h1>
          <p className="text-muted-foreground mt-2">Manage your work experience</p>
        </div>
        <Button onClick={() => handleOpenDialog()}>
          <Plus className="mr-2 h-4 w-4" />
          Add Experience
        </Button>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        {experiences.map((exp) => (
          <Card key={exp.id} className="card-hover">
            <CardHeader>
              <div className="flex items-start justify-between">
                <div>
                  <CardTitle className="text-lg">{exp.title}</CardTitle>
                  <p className="text-primary font-medium mt-1">{exp.company}</p>
                </div>
                {exp.current && <Badge variant="default">Current</Badge>}
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <p className="text-sm text-muted-foreground">
                    {exp.startDate} - {exp.current ? "Present" : exp.endDate || "N/A"}
                  </p>
                </div>
                {exp.skills.length > 0 && (
                  <div className="flex flex-wrap gap-1">
                    {exp.skills.slice(0, 5).map((skill) => (
                      <Badge key={skill} variant="outline" className="text-xs">
                        {skill}
                      </Badge>
                    ))}
                    {exp.skills.length > 5 && (
                      <Badge variant="outline" className="text-xs">
                        +{exp.skills.length - 5}
                      </Badge>
                    )}
                  </div>
                )}
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleOpenDialog(exp)}
                    className="flex-1"
                  >
                    <Edit className="mr-2 h-4 w-4" />
                    Edit
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      setSelectedExp(exp);
                      setDeleteDialogOpen(true);
                    }}
                    className="flex-1 text-destructive hover:text-destructive"
                  >
                    <Trash2 className="mr-2 h-4 w-4" />
                    Delete
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {experiences.length === 0 && (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <p className="text-muted-foreground mb-4">No experience entries yet</p>
            <Button onClick={() => handleOpenDialog()}>
              <Plus className="mr-2 h-4 w-4" />
              Add Your First Experience
            </Button>
          </CardContent>
        </Card>
      )}

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              {selectedExp ? "Edit Experience" : "Add New Experience"}
            </DialogTitle>
            <DialogDescription>
              {selectedExp
                ? "Update the experience details below"
                : "Fill in the details to add a new experience entry"}
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="title">Job Title *</Label>
                <Input
                  id="title"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="company">Company *</Label>
                <Input
                  id="company"
                  value={formData.company}
                  onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                  required
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="startDate">Start Date *</Label>
                <Input
                  id="startDate"
                  type="date"
                  value={formData.startDate}
                  onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="endDate">End Date</Label>
                <Input
                  id="endDate"
                  type="date"
                  value={formData.endDate}
                  onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
                  disabled={formData.current}
                />
              </div>
            </div>

            <div className="flex items-center space-x-2">
              <Switch
                id="current"
                checked={formData.current}
                onCheckedChange={(checked) => setFormData({ ...formData, current: checked })}
              />
              <Label htmlFor="current">Current Position</Label>
            </div>

            <div className="space-y-2">
              <Label htmlFor="responsibilities">Responsibilities (one per line) *</Label>
              <Textarea
                id="responsibilities"
                value={responsibilitiesInput}
                onChange={(e) => setResponsibilitiesInput(e.target.value)}
                rows={5}
                placeholder="Responsibility 1&#10;Responsibility 2&#10;Responsibility 3"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="skills">Skills (comma-separated)</Label>
              <Input
                id="skills"
                value={skillsInput}
                onChange={(e) => setSkillsInput(e.target.value)}
                placeholder="React, TypeScript, Node.js"
              />
            </div>

            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setDialogOpen(false)}>
                Cancel
              </Button>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Saving...
                  </>
                ) : selectedExp ? (
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
              This action cannot be undone. This will permanently delete this experience entry.
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

