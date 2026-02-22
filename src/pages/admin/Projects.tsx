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
  CheckCircle2, Info, Star, Sparkles, Folder
} from "lucide-react";
import { getProjects, createProject, updateProject, deleteProject, Project } from "@/lib/admin/projects";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { projectSchema, formatZodError } from "@/lib/admin/validation";
import { Separator } from "@/components/ui/separator";
import { motion, AnimatePresence } from "framer-motion";

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
    skills: [],
    category: "",
    thumbnail: "",
    images: [],
    liveUrl: "",
    githubUrl: "",
    status: "completed",
    featured: false,
  });

  const [techStackInput, setTechStackInput] = useState("");
  const [skillsInput, setSkillsInput] = useState("");
  const [additionalImagesInput, setAdditionalImagesInput] = useState("");
  const scrollableRef = useRef<HTMLDivElement>(null);
  const dialogContentRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    fetchProjects();
  }, []);

  // Handle wheel events to prevent Lenis from intercepting
  useEffect(() => {
    if (!dialogOpen) return;

    const scrollableElement = scrollableRef.current;
    const dialogElement = dialogContentRef.current;

    const handleWheel = (e: WheelEvent) => {
      const target = e.target as Node;
      if (dialogElement && dialogElement.contains(target)) {
        e.stopPropagation();
      }
    };

    document.addEventListener('wheel', handleWheel, { passive: false, capture: true });

    return () => {
      document.removeEventListener('wheel', handleWheel, { capture: true } as any);
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
        skills: project.skills ?? [],
        category: project.category,
        thumbnail: project.thumbnail,
        images: project.images,
        liveUrl: project.liveUrl,
        githubUrl: project.githubUrl,
        status: project.status,
        featured: project.featured,
      });
      setTechStackInput(project.techStack.join(", "));
      setSkillsInput((project.skills ?? []).join(", "));
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
      skills: [],
      category: "",
      thumbnail: "",
      images: [],
      liveUrl: "",
      githubUrl: "",
      status: "completed",
      featured: false,
    });
    setTechStackInput("");
    setSkillsInput("");
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

      const skills = skillsInput
        .split(",")
        .map((s) => s.trim())
        .filter((s) => s.length > 0);

      const imageUrls = additionalImagesInput
        .split("\n")
        .map((url) => url.trim())
        .filter((url) => url.length > 0);

      const projectData = {
        ...formData,
        techStack,
        skills,
        images: imageUrls,
      };

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
      <div className="flex flex-col items-center justify-center min-h-[400px] gap-4">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
        >
          <Loader2 className="w-10 h-10 text-primary" />
        </motion.div>
        <p className="text-muted-foreground">Loading projects...</p>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text text-transparent">
            Projects
          </h1>
          <p className="text-muted-foreground mt-2">Manage your portfolio projects</p>
        </div>
        <Button
          onClick={() => handleOpenDialog()}
          className="bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary/70 shadow-lg shadow-primary/20"
        >
          <Plus className="mr-2 h-4 w-4" />
          Add Project
        </Button>
      </div>

      {/* Projects Grid */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        <AnimatePresence mode="popLayout">
          {projects.map((project, index) => (
            <motion.div
              key={project.id}
              initial={{ opacity: 0, y: 20, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -20, scale: 0.95 }}
              transition={{ duration: 0.3, delay: index * 0.05 }}
            >
              <Card className="group relative overflow-hidden border-primary/10 hover:border-primary/30 transition-all duration-300 hover:shadow-xl hover:shadow-primary/10 bg-gradient-to-br from-card to-card/80">
                {/* Featured badge */}
                {project.featured && (
                  <div className="absolute top-3 right-3 z-10">
                    <Badge className="bg-gradient-to-r from-primary to-primary/80 border-0 shadow-lg shadow-primary/30 flex items-center gap-1">
                      <Star className="w-3 h-3 fill-current" />
                      Featured
                    </Badge>
                  </div>
                )}

                <CardHeader className="pb-3">
                  <CardTitle className="text-lg flex items-center gap-2">
                    <Sparkles className="w-4 h-4 text-primary" />
                    {project.title}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {project.thumbnail ? (
                      <div className="relative overflow-hidden rounded-lg">
                        <img
                          src={project.thumbnail}
                          alt={project.title}
                          className="w-full h-40 object-cover transition-transform duration-500 group-hover:scale-105"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-card/80 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                      </div>
                    ) : (
                      <div className="w-full h-40 rounded-lg bg-gradient-to-br from-primary/10 to-primary/5 flex items-center justify-center border border-dashed border-primary/20">
                        <Folder className="w-10 h-10 text-primary/30" />
                      </div>
                    )}

                    <p className="text-sm text-muted-foreground line-clamp-2">
                      {project.shortDescription}
                    </p>

                    <div className="flex flex-wrap gap-1.5">
                      {project.techStack.slice(0, 3).map((tech) => (
                        <Badge
                          key={tech}
                          variant="outline"
                          className="text-xs border-primary/20 bg-primary/5 hover:bg-primary/10 transition-colors"
                        >
                          {tech}
                        </Badge>
                      ))}
                      {project.techStack.length > 3 && (
                        <Badge variant="outline" className="text-xs bg-muted/50">
                          +{project.techStack.length - 3}
                        </Badge>
                      )}
                    </div>

                    <Separator className="bg-primary/10" />

                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleOpenDialog(project)}
                        className="flex-1 border-primary/20 hover:border-primary/40 hover:bg-primary/10"
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
                        className="flex-1 border-destructive/20 text-destructive hover:text-destructive hover:border-destructive/40 hover:bg-destructive/10"
                      >
                        <Trash2 className="mr-2 h-4 w-4" />
                        Delete
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {projects.length === 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <Card className="border-dashed border-2 border-primary/20 bg-gradient-to-br from-card to-card/50">
            <CardContent className="flex flex-col items-center justify-center py-16">
              <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                <Folder className="w-8 h-8 text-primary/50" />
              </div>
              <p className="text-muted-foreground mb-4 text-lg">No projects yet</p>
              <p className="text-sm text-muted-foreground/60 mb-6">Create your first project to get started</p>
              <Button onClick={() => handleOpenDialog()} className="bg-gradient-to-r from-primary to-primary/80">
                <Plus className="mr-2 h-4 w-4" />
                Add Your First Project
              </Button>
            </CardContent>
          </Card>
        </motion.div>
      )}

      {/* Add/Edit Dialog */}
      <Dialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
      >
        <DialogContent
          ref={dialogContentRef}
          className="max-w-4xl h-[90vh] p-0 flex flex-col gap-0 overflow-hidden border-primary/20 bg-gradient-to-br from-background via-background to-background/95"
          style={{ overflowY: 'hidden', maxHeight: '90vh', height: '90vh' }}
          onInteractOutside={(e) => e.preventDefault()}
          onEscapeKeyDown={(e) => e.preventDefault()}
        >
          {/* Header with gradient */}
          <DialogHeader className="px-6 py-5 border-b border-primary/10 shrink-0 bg-gradient-to-r from-background via-primary/5 to-background">
            <DialogTitle className="flex items-center gap-3 text-xl">
              <div className="p-2 rounded-lg bg-primary/10">
                {selectedProject ? <Edit className="w-5 h-5 text-primary" /> : <Plus className="w-5 h-5 text-primary" />}
              </div>
              {selectedProject ? "Edit Project" : "Add New Project"}
            </DialogTitle>
            <DialogDescription className="text-muted-foreground">
              {selectedProject
                ? "Update the details below. All changes are auto-saved to state until you submit."
                : "Fill in the details to add a new project to your portfolio."}
            </DialogDescription>
          </DialogHeader>

          {/* Scrollable form content */}
          <div
            ref={scrollableRef}
            className="flex-1 min-h-0 overflow-y-auto px-6 py-6 focus:outline-none"
            style={{ scrollbarWidth: 'thin', scrollbarColor: 'hsl(258 90% 66% / 0.3) transparent' }}
            data-lenis-prevent="true"
            tabIndex={-1}
            onMouseEnter={(e) => e.currentTarget.focus()}
          >
            <form id="project-form" onSubmit={handleSubmit} className="space-y-8 pb-6">

              {/* SECTION: CORE DETAILS */}
              <div className="space-y-5 p-5 rounded-xl bg-gradient-to-br from-card/80 to-card/40 border border-primary/10">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-primary/10">
                    <Layout className="w-4 h-4 text-primary" />
                  </div>
                  <h3 className="font-semibold text-foreground">Core Details</h3>
                </div>

                <div className="grid md:grid-cols-2 gap-5">
                  <div className="space-y-2">
                    <Label htmlFor="title" className="text-sm font-medium">Project Title *</Label>
                    <Input
                      id="title"
                      value={formData.title}
                      onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                      maxLength={100}
                      placeholder="e.g. Portfolio v2"
                      required
                      className="border-primary/20 focus:border-primary/50 bg-background/50"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="category" className="text-sm font-medium">Category *</Label>
                    <Input
                      id="category"
                      value={formData.category}
                      onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                      placeholder="e.g. Web App, Mobile, Design System"
                      required
                      className="border-primary/20 focus:border-primary/50 bg-background/50"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="shortDescription" className="text-sm font-medium">Short Description *</Label>
                  <Input
                    id="shortDescription"
                    value={formData.shortDescription}
                    onChange={(e) => setFormData({ ...formData, shortDescription: e.target.value })}
                    placeholder="Brief one-line summary for cards..."
                    maxLength={150}
                    required
                    className="border-primary/20 focus:border-primary/50 bg-background/50"
                  />
                  <p className="text-[11px] text-muted-foreground">Appears in project cards. Max 150 chars.</p>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="fullDescription" className="text-sm font-medium">Full Description *</Label>
                  <Textarea
                    id="fullDescription"
                    value={formData.fullDescription}
                    onChange={(e) => setFormData({ ...formData, fullDescription: e.target.value })}
                    rows={5}
                    placeholder="# Project Details &#10;&#10;Describe the challenges, features, and outcome..."
                    className="font-mono text-sm leading-relaxed border-primary/20 focus:border-primary/50 bg-background/50"
                    required
                  />
                  <p className="text-[11px] text-muted-foreground">Markdown supported. This content appears on the details page.</p>
                </div>
              </div>

              {/* SECTION: TECH STACK */}
              <div className="space-y-5 p-5 rounded-xl bg-gradient-to-br from-card/80 to-card/40 border border-primary/10">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-primary/10">
                    <Code className="w-4 h-4 text-primary" />
                  </div>
                  <h3 className="font-semibold text-foreground">Technical Info</h3>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="techStack" className="text-sm font-medium">Technologies Used *</Label>
                  <Input
                    id="techStack"
                    value={techStackInput}
                    onChange={(e) => setTechStackInput(e.target.value)}
                    placeholder="React, TypeScript, Tailwind CSS, Node.js"
                    required
                    className="border-primary/20 focus:border-primary/50 bg-background/50"
                  />
                  <div className="flex flex-wrap gap-2 mt-3">
                    {techStackInput.split(",").filter(t => t.trim()).map((t, i) => (
                      <Badge key={i} className="bg-primary/10 text-primary border-primary/20 hover:bg-primary/20">
                        {t.trim()}
                      </Badge>
                    ))}
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="skills" className="text-sm font-medium">Skills (Optional)</Label>
                  <Input
                    id="skills"
                    value={skillsInput}
                    onChange={(e) => setSkillsInput(e.target.value)}
                    placeholder="UI/UX, Performance, Animations"
                    className="border-primary/20 focus:border-primary/50 bg-background/50"
                  />
                  <div className="flex flex-wrap gap-2 mt-3">
                    {skillsInput.split(",").filter(t => t.trim()).map((t, i) => (
                      <Badge key={`skill-${i}`} variant="outline" className="border-primary/20">
                        {t.trim()}
                      </Badge>
                    ))}
                  </div>
                </div>
              </div>

              {/* SECTION: MEDIA */}
              <div className="space-y-5 p-5 rounded-xl bg-gradient-to-br from-card/80 to-card/40 border border-primary/10">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-primary/10">
                    <ImageIcon className="w-4 h-4 text-primary" />
                  </div>
                  <h3 className="font-semibold text-foreground">Media & Visuals</h3>
                </div>

                <div className="space-y-3">
                  <Label htmlFor="thumbnail" className="text-sm font-medium">Thumbnail Image URL</Label>
                  <div className="flex gap-4 items-start">
                    <div className="flex-1 space-y-2">
                      <Input
                        id="thumbnail"
                        type="url"
                        value={formData.thumbnail}
                        onChange={(e) => setFormData({ ...formData, thumbnail: e.target.value })}
                        placeholder="https://images.unsplash.com/..."
                        className="border-primary/20 focus:border-primary/50 bg-background/50"
                      />
                      <p className="text-[11px] text-muted-foreground">Main cover image for the project card.</p>
                    </div>
                    {formData.thumbnail && (
                      <div className="w-28 h-20 shrink-0 rounded-lg overflow-hidden border border-primary/20 bg-muted shadow-lg">
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
                  <Label htmlFor="images" className="text-sm font-medium">Additional Screenshots (One per line)</Label>
                  <Textarea
                    id="images"
                    value={additionalImagesInput}
                    onChange={(e) => setAdditionalImagesInput(e.target.value)}
                    placeholder="https://.../screen1.jpg&#10;https://.../screen2.jpg"
                    rows={3}
                    className="font-mono text-xs border-primary/20 focus:border-primary/50 bg-background/50"
                  />
                </div>
              </div>

              {/* SECTION: LINKS & STATUS */}
              <div className="space-y-5 p-5 rounded-xl bg-gradient-to-br from-card/80 to-card/40 border border-primary/10">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-primary/10">
                    <LinkIcon className="w-4 h-4 text-primary" />
                  </div>
                  <h3 className="font-semibold text-foreground">Links & Status</h3>
                </div>

                <div className="grid md:grid-cols-2 gap-5">
                  <div className="space-y-2">
                    <Label htmlFor="liveUrl" className="text-sm font-medium">Live Demo URL</Label>
                    <div className="relative">
                      <ExternalLink className="absolute left-3 top-2.5 w-4 h-4 text-muted-foreground" />
                      <Input
                        id="liveUrl"
                        type="url"
                        value={formData.liveUrl}
                        onChange={(e) => setFormData({ ...formData, liveUrl: e.target.value })}
                        className="pl-10 border-primary/20 focus:border-primary/50 bg-background/50"
                        placeholder="https://myproject.com"
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="githubUrl" className="text-sm font-medium">Source Code URL</Label>
                    <div className="relative">
                      <Github className="absolute left-3 top-2.5 w-4 h-4 text-muted-foreground" />
                      <Input
                        id="githubUrl"
                        type="url"
                        value={formData.githubUrl}
                        onChange={(e) => setFormData({ ...formData, githubUrl: e.target.value })}
                        className="pl-10 border-primary/20 focus:border-primary/50 bg-background/50"
                        placeholder="https://github.com/..."
                      />
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-5">
                  <div className="space-y-2">
                    <Label htmlFor="status" className="text-sm font-medium">Project Status</Label>
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
                        className="flex h-10 w-full rounded-md border border-primary/20 bg-background/50 px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/30 focus:ring-offset-2 focus:border-primary/50"
                      >
                        <option value="completed">Completed</option>
                        <option value="in-progress">In Progress</option>
                      </select>
                      <Info className="absolute right-3 top-2.5 w-4 h-4 text-muted-foreground pointer-events-none" />
                    </div>
                  </div>

                  <div className="flex items-center justify-between rounded-lg p-4 bg-gradient-to-r from-primary/5 to-transparent border border-primary/20">
                    <div className="space-y-0.5">
                      <Label htmlFor="featured" className="text-base font-medium flex items-center gap-2">
                        <Star className="w-4 h-4 text-primary" />
                        Featured
                      </Label>
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

          {/* Footer with gradient */}
          <DialogFooter className="px-6 py-4 border-t border-primary/10 shrink-0 bg-gradient-to-r from-background via-primary/5 to-background gap-3">
            <Button
              type="button"
              variant="outline"
              onClick={() => setDialogOpen(false)}
              className="border-primary/20 hover:border-primary/40"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              form="project-form"
              disabled={isSubmitting}
              className="min-w-[120px] bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary/70 shadow-lg shadow-primary/20"
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

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent className="border-destructive/20 bg-gradient-to-br from-background to-background/95">
          <AlertDialogHeader>
            <AlertDialogTitle className="flex items-center gap-2">
              <div className="p-2 rounded-lg bg-destructive/10">
                <Trash2 className="w-5 h-5 text-destructive" />
              </div>
              Are you sure?
            </AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the project
              <span className="font-medium text-foreground"> "{selectedProject?.title}"</span>.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className="border-primary/20">Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              className="bg-gradient-to-r from-destructive to-destructive/80 hover:from-destructive/90 hover:to-destructive/70 shadow-lg shadow-destructive/20"
            >
              Delete Project
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};
