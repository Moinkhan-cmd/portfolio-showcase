// Projects CRUD page
import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
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
import {
  Plus, Edit, Trash2, Loader2, ExternalLink, Github,
  Layout, Code, Image as ImageIcon, Link as LinkIcon,
  CheckCircle2, Info, Layers
} from "lucide-react";
import { getProjects, createProject, updateProject, deleteProject, Project } from "@/lib/admin/projects";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { projectSchema, formatZodError } from "@/lib/admin/validation";
import { Separator } from "@/components/ui/separator";

export const AdminProjects = () => {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();
  const navigate = useNavigate();

  const [formData, setFormData] = useState<Omit<Project, "id" | "createdAt" | "updatedAt">>({
    title: "",
    shortDescription: "",
    fullDescription: "",
    techStack: [],
    category: "",
    thumbnail: "",
    images: [],
    liveUrl: "",
    githubUrl: "",
    status: "completed",
    featured: false,
  });

  const [techStackInput, setTechStackInput] = useState("");
  const [additionalImagesInput, setAdditionalImagesInput] = useState("");
  const scrollableRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    fetchProjects();
  }, []);

  // Handle wheel events to prevent Lenis from intercepting
  useEffect(() => {
    const scrollableElement = scrollableRef.current;
    if (!scrollableElement || !dialogOpen) return;

    const handleWheel = (e: WheelEvent) => {
      // Always stop propagation to prevent Lenis from handling it
      // This allows the native scroll to work within the modal
      e.stopPropagation();
    };

    scrollableElement.addEventListener('wheel', handleWheel, { passive: false, capture: true });
    
    return () => {
      scrollableElement.removeEventListener('wheel', handleWheel, { capture: true } as any);
    };
  }, [dialogOpen]);

  const fetchProjects = async () => {
    try {
      setLoading(true);
      const data = await getProjects();
      setProjects(data);
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to fetch projects",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleOpenDialog = (project?: Project) => {
    if (project) {
      setSelectedProject(project);
      setFormData({
        title: project.title,
        shortDescription: project.shortDescription,
        fullDescription: project.fullDescription,
        techStack: project.techStack,
        category: project.category,
        thumbnail: project.thumbnail,
        images: project.images,
        liveUrl: project.liveUrl,
        githubUrl: project.githubUrl,
        status: project.status,
        featured: project.featured,
      });
      setTechStackInput(project.techStack.join(", "));
      setAdditionalImagesInput(project.images.join("\n"));
    } else {
      resetForm();
    }
    setDialogOpen(true);
  };

  const resetForm = () => {
    setSelectedProject(null);
    setFormData({
      title: "",
      shortDescription: "",
      fullDescription: "",
      techStack: [],
      category: "",
      thumbnail: "",
      images: [],
      liveUrl: "",
      githubUrl: "",
      status: "completed",
      featured: false,
    });
    setTechStackInput("");
    setAdditionalImagesInput("");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const techStack = techStackInput
        .split(",")
        .map((tech) => tech.trim())
        .filter((tech) => tech.length > 0);

      const imageUrls = additionalImagesInput
        .split("\n")
        .map((url) => url.trim())
        .filter((url) => url.length > 0);

      const projectData = {
        ...formData,
        techStack,
        images: imageUrls,
      };

      // Validate with Zod schema
      const validationResult = projectSchema.safeParse(projectData);
      if (!validationResult.success) {
        toast({
          title: "Validation Error",
          description: formatZodError(validationResult.error),
          variant: "destructive",
        });
        setIsSubmitting(false);
        return;
      }

      if (selectedProject?.id) {
        await updateProject(selectedProject.id, projectData);
        toast({
          title: "Success",
          description: "Project updated successfully",
        });
      } else {
        await createProject(projectData);
        toast({
          title: "Success",
          description: "Project created successfully",
        });
      }

      setDialogOpen(false);
      resetForm();
      fetchProjects();
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to save project",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async () => {
    if (!selectedProject?.id) return;

    try {
      await deleteProject(selectedProject.id);
      toast({
        title: "Success",
        description: "Project deleted successfully",
      });
      setDeleteDialogOpen(false);
      setSelectedProject(null);
      fetchProjects();
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to delete project",
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
          <h1 className="text-3xl font-bold gradient-text">Projects</h1>
          <p className="text-muted-foreground mt-2">Manage your portfolio projects</p>
        </div>
        <Button onClick={() => handleOpenDialog()}>
          <Plus className="mr-2 h-4 w-4" />
          Add Project
        </Button>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {projects.map((project) => (
          <Card key={project.id} className="card-hover">
            <CardHeader>
              <div className="flex items-start justify-between">
                <CardTitle className="text-lg">{project.title}</CardTitle>
                {project.featured && <Badge variant="default">Featured</Badge>}
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {project.thumbnail && (
                  <img
                    src={project.thumbnail}
                    alt={project.title}
                    className="w-full h-40 object-cover rounded-lg"
                  />
                )}
                <p className="text-sm text-muted-foreground line-clamp-2">
                  {project.shortDescription}
                </p>
                <div className="flex flex-wrap gap-1">
                  {project.techStack.slice(0, 3).map((tech) => (
                    <Badge key={tech} variant="outline" className="text-xs">
                      {tech}
                    </Badge>
                  ))}
                  {project.techStack.length > 3 && (
                    <Badge variant="outline" className="text-xs">
                      +{project.techStack.length - 3}
                    </Badge>
                  )}
                </div>
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleOpenDialog(project)}
                    className="flex-1"
                  >
                    <Edit className="mr-2 h-4 w-4" />
                    Edit
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      setSelectedProject(project);
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

      {projects.length === 0 && (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <p className="text-muted-foreground mb-4">No projects yet</p>
            <Button onClick={() => handleOpenDialog()}>
              <Plus className="mr-2 h-4 w-4" />
              Add Your First Project
            </Button>
          </CardContent>
        </Card>
      )}

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        {/* Updated DialogContent with better max-height and fixed padding handles */}
        <DialogContent 
          className="max-w-4xl h-[85vh] p-0 flex flex-col gap-0 overflow-hidden"
          style={{ overflowY: 'hidden', maxHeight: '85vh', height: '85vh' }}
        >
          <DialogHeader className="px-6 py-4 border-b shrink-0 bg-background/95 backdrop-blur z-10">
            <DialogTitle className="flex items-center gap-2 text-xl">
              {selectedProject ? <Edit className="w-5 h-5" /> : <Plus className="w-5 h-5" />}
              {selectedProject ? "Edit Project" : "Add New Project"}
            </DialogTitle>
            <DialogDescription>
              {selectedProject
                ? "Update the details below. All changes are auto-saved to state until you submit."
                : "Fill in the details to add a new project to your portfolio."}
            </DialogDescription>
          </DialogHeader>

          {/* Scrollable form content */}
          <div 
            ref={scrollableRef}
            className="flex-1 min-h-0 overflow-y-auto px-6 py-4" 
            style={{ scrollbarWidth: 'thin', scrollbarColor: 'hsl(175 80% 50%) hsl(222 47% 8%)' }}
            data-lenis-prevent="true"
          >
            <form id="project-form" onSubmit={handleSubmit} className="space-y-8 pb-6">

              {/* SECTION: CORE DETAILS */}
              <div className="space-y-4">
                <div className="flex items-center gap-2 text-primary font-semibold border-b pb-2">
                  <Layout className="w-4 h-4" />
                  <h3>Core Details</h3>
                </div>

                <div className="grid md:grid-cols-2 gap-5">
                  <div className="space-y-2">
                    <Label htmlFor="title">Project Title *</Label>
                    <Input
                      id="title"
                      value={formData.title}
                      onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                      maxLength={100}
                      placeholder="e.g. Portfolio v2"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="category">Category *</Label>
                    <Input
                      id="category"
                      value={formData.category}
                      onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                      placeholder="e.g. Web App, Mobile, Design System"
                      required
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="shortDescription">Short Description (Summary) *</Label>
                  <Input
                    id="shortDescription"
                    value={formData.shortDescription}
                    onChange={(e) => setFormData({ ...formData, shortDescription: e.target.value })}
                    placeholder="Brief one-line summary for cards..."
                    maxLength={150}
                    required
                  />
                  <p className="text-[11px] text-muted-foreground">Appears in project cards. Max 150 chars.</p>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="fullDescription">Full Description *</Label>
                  <Textarea
                    id="fullDescription"
                    value={formData.fullDescription}
                    onChange={(e) => setFormData({ ...formData, fullDescription: e.target.value })}
                    rows={5}
                    placeholder="# Project Details \n\nDescribe the challenges, features, and outcome..."
                    className="font-mono text-sm leading-relaxed"
                    required
                  />
                  <p className="text-[11px] text-muted-foreground">Markdown supported. This content appears on the details page.</p>
                </div>
              </div>

              {/* SECTION: TECH STACK */}
              <div className="space-y-4">
                <div className="flex items-center gap-2 text-primary font-semibold border-b pb-2">
                  <Code className="w-4 h-4" />
                  <h3>Technical Info</h3>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="techStack">Technologies Used *</Label>
                  <Input
                    id="techStack"
                    value={techStackInput}
                    onChange={(e) => setTechStackInput(e.target.value)}
                    placeholder="React, TypeScript, Tailwind CSS, Node.js"
                    required
                  />
                  <div className="flex flex-wrap gap-2 mt-2">
                    {techStackInput.split(",").filter(t => t.trim()).map((t, i) => (
                      <Badge key={i} variant="secondary" className="text-xs">{t.trim()}</Badge>
                    ))}
                  </div>
                </div>
              </div>

              {/* SECTION: MEDIA */}
              <div className="space-y-4">
                <div className="flex items-center gap-2 text-primary font-semibold border-b pb-2">
                  <ImageIcon className="w-4 h-4" />
                  <h3>Media & Visuals</h3>
                </div>

                <div className="space-y-3">
                  <Label htmlFor="thumbnail">Thumbnail Image URL</Label>
                  <div className="flex gap-4 items-start">
                    <div className="flex-1 space-y-2">
                      <Input
                        id="thumbnail"
                        type="url"
                        value={formData.thumbnail}
                        onChange={(e) => setFormData({ ...formData, thumbnail: e.target.value })}
                        placeholder="https://images.unsplash.com/..."
                      />
                      <p className="text-[11px] text-muted-foreground">Main cover image for the project card.</p>
                    </div>
                    {formData.thumbnail && (
                      <div className="w-24 h-16 shrink-0 rounded-md overflow-hidden border bg-muted">
                        <img
                          src={formData.thumbnail}
                          alt="Preview"
                          className="w-full h-full object-cover"
                          onError={(e) => e.currentTarget.style.display = 'none'}
                        />
                      </div>
                    )}
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="images">Additional Screenshots (One per line)</Label>
                  <Textarea
                    id="images"
                    value={additionalImagesInput}
                    onChange={(e) => setAdditionalImagesInput(e.target.value)}
                    placeholder="https://.../screen1.jpg&#10;https://.../screen2.jpg"
                    rows={3}
                    className="font-mono text-xs"
                  />
                </div>
              </div>

              {/* SECTION: LINKS & STATUS */}
              <div className="space-y-4">
                <div className="flex items-center gap-2 text-primary font-semibold border-b pb-2">
                  <LinkIcon className="w-4 h-4" />
                  <h3>Links & Status</h3>
                </div>

                <div className="grid md:grid-cols-2 gap-5">
                  <div className="space-y-2">
                    <Label htmlFor="liveUrl">Live Demo URL</Label>
                    <div className="relative">
                      <ExternalLink className="absolute left-3 top-2.5 w-4 h-4 text-muted-foreground" />
                      <Input
                        id="liveUrl"
                        type="url"
                        value={formData.liveUrl}
                        onChange={(e) => setFormData({ ...formData, liveUrl: e.target.value })}
                        className="pl-9"
                        placeholder="https://myproject.com"
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="githubUrl">Source Code URL</Label>
                    <div className="relative">
                      <Github className="absolute left-3 top-2.5 w-4 h-4 text-muted-foreground" />
                      <Input
                        id="githubUrl"
                        type="url"
                        value={formData.githubUrl}
                        onChange={(e) => setFormData({ ...formData, githubUrl: e.target.value })}
                        className="pl-9"
                        placeholder="https://github.com/..."
                      />
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-5 pt-2">
                  <div className="space-y-2">
                    <Label htmlFor="status">Project Status</Label>
                    <div className="relative">
                      <select
                        id="status"
                        value={formData.status}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            status: e.target.value as "completed" | "in-progress",
                          })
                        }
                        className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
                      >
                        <option value="completed">Completed</option>
                        <option value="in-progress">In Progress</option>
                      </select>
                      <Info className="absolute right-3 top-2.5 w-4 h-4 text-muted-foreground pointer-events-none" />
                    </div>
                  </div>

                  <div className="flex items-center justify-between border rounded-lg p-3 bg-muted/20">
                    <div className="space-y-0.5">
                      <Label htmlFor="featured" className="text-base">Featured</Label>
                      <p className="text-[11px] text-muted-foreground">Show on Home page.</p>
                    </div>
                    <Switch
                      id="featured"
                      checked={formData.featured}
                      onCheckedChange={(checked) => setFormData({ ...formData, featured: checked })}
                    />
                  </div>
                </div>
              </div>

            </form>
          </div>

          <DialogFooter className="px-6 py-4 border-t shrink-0 bg-background/95 backdrop-blur z-10 gap-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => setDialogOpen(false)}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              form="project-form"
              disabled={isSubmitting}
              className="min-w-[100px]"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Saving...
                </>
              ) : (
                <>
                  <CheckCircle2 className="mr-2 h-4 w-4" />
                  {selectedProject ? "Update Project" : "Create Project"}
                </>
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the project.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};
