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
import { Plus, Edit, Trash2, Loader2, Sparkles, Code2, Database, Code, Wrench, Users, Star, TrendingUp, Zap, CheckCircle2 } from "lucide-react";
import { getSkills, createSkill, updateSkill, deleteSkill, Skill } from "@/lib/admin/skills";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { skillSchema, formatZodError } from "@/lib/admin/validation";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";

// Category configuration with icons, colors, and gradients
const categoryConfig: Record<string, { icon: any; color: string; gradient: string }> = {
  "Frontend": {
    icon: Code,
    color: "text-blue-500",
    gradient: "from-blue-500/20 via-blue-400/10 to-cyan-500/20",
  },
  "Backend": {
    icon: Database,
    color: "text-green-500",
    gradient: "from-green-500/20 via-green-400/10 to-emerald-500/20",
  },
  "Database": {
    icon: Database,
    color: "text-purple-500",
    gradient: "from-purple-500/20 via-purple-400/10 to-violet-500/20",
  },
  "DevOps": {
    icon: Wrench,
    color: "text-orange-500",
    gradient: "from-orange-500/20 via-orange-400/10 to-amber-500/20",
  },
  "Tools": {
    icon: Wrench,
    color: "text-yellow-500",
    gradient: "from-yellow-500/20 via-yellow-400/10 to-amber-500/20",
  },
  "Soft Skills": {
    icon: Users,
    color: "text-pink-500",
    gradient: "from-pink-500/20 via-pink-400/10 to-rose-500/20",
  },
  "Languages": {
    icon: Code2,
    color: "text-indigo-500",
    gradient: "from-indigo-500/20 via-indigo-400/10 to-blue-500/20",
  },
  "Frameworks": {
    icon: Code,
    color: "text-cyan-500",
    gradient: "from-cyan-500/20 via-cyan-400/10 to-teal-500/20",
  },
  "Other": {
    icon: Sparkles,
    color: "text-gray-500",
    gradient: "from-gray-500/20 via-gray-400/10 to-slate-500/20",
  },
};

// Level configuration with labels, values, colors, and gradients
const levelConfig: Record<string, { label: string; value: number; color: string; gradient: string }> = {
  beginner: {
    label: "Beginner",
    value: 25,
    color: "text-blue-500",
    gradient: "from-blue-400 to-blue-600",
  },
  intermediate: {
    label: "Intermediate",
    value: 50,
    color: "text-yellow-500",
    gradient: "from-yellow-400 to-yellow-600",
  },
  advanced: {
    label: "Advanced",
    value: 75,
    color: "text-orange-500",
    gradient: "from-orange-400 to-orange-600",
  },
  expert: {
    label: "Expert",
    value: 100,
    color: "text-green-500",
    gradient: "from-green-400 to-green-600",
  },
};

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
    setIsSubmitting(true);

    try {
      const skillData = {
        name: formData.name.trim(),
        category: formData.category.trim(),
        level: formData.level as "beginner" | "intermediate" | "advanced" | "expert",
        icon: formData.icon.trim(),
      };

      // Validate with Zod schema
      const validationResult = skillSchema.safeParse(skillData);
      if (!validationResult.success) {
        toast({
          title: "Validation Error",
          description: formatZodError(validationResult.error),
          variant: "destructive",
        });
        setIsSubmitting(false);
        return;
      }

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
        <DialogContent
          className="max-w-[700px] w-full max-h-[90vh] overflow-y-auto p-0 border-0 bg-transparent shadow-none"
          onInteractOutside={(e) => e.preventDefault()}
          onEscapeKeyDown={(e) => e.preventDefault()}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ duration: 0.3, ease: [0.25, 0.1, 0.25, 1] }}
            className="relative"
          >
            {/* Animated Background Gradient */}
            <motion.div
              className="absolute -inset-4 rounded-3xl bg-gradient-to-br from-primary/20 via-primary/10 to-purple-500/20 blur-2xl opacity-50"
              animate={{
                scale: [1, 1.05, 1],
                opacity: [0.5, 0.7, 0.5],
              }}
              transition={{
                duration: 4,
                repeat: Infinity,
                ease: "easeInOut",
              }}
            />

            {/* Main Content Container */}
            <div className="relative bg-background/95 backdrop-blur-xl rounded-2xl border border-primary/20 shadow-2xl overflow-hidden">
              {/* Animated Header with Gradient */}
              <motion.div
                className={cn(
                  "relative px-6 pt-6 pb-4 bg-gradient-to-r",
                  formData.category && categoryConfig[formData.category]
                    ? categoryConfig[formData.category].gradient
                    : "from-primary/20 via-primary/10 to-primary/20"
                )}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.1 }}
              >
                {/* Shine effect */}
                <motion.div
                  className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent"
                  animate={{
                    x: ["-100%", "200%"],
                  }}
                  transition={{
                    duration: 3,
                    repeat: Infinity,
                    repeatDelay: 2,
                    ease: "linear",
                  }}
                />

                {/* Floating particles */}
                <div className="absolute inset-0 overflow-hidden">
                  {[...Array(6)].map((_, i) => (
                    <motion.div
                      key={i}
                      className="absolute w-1 h-1 bg-primary/40 rounded-full"
                      initial={{
                        x: Math.random() * 100 + "%",
                        y: Math.random() * 100 + "%",
                        opacity: 0,
                      }}
                      animate={{
                        y: [null, "-100%"],
                        opacity: [0, 1, 0],
                      }}
                      transition={{
                        duration: 3 + Math.random() * 2,
                        repeat: Infinity,
                        delay: Math.random() * 2,
                        ease: "linear",
                      }}
                    />
                  ))}
                </div>

                <DialogHeader className="relative z-10">
                  <div className="flex items-center gap-3 mb-2">
                    {formData.category && categoryConfig[formData.category] ? (
                      <motion.div
                        className={cn(
                          "p-2 rounded-xl bg-background/20 backdrop-blur-sm border border-white/10",
                          categoryConfig[formData.category].color
                        )}
                        whileHover={{ scale: 1.1, rotate: 5 }}
                        transition={{ type: "spring", stiffness: 400 }}
                      >
                        {(() => {
                          const Icon = categoryConfig[formData.category].icon;
                          return <Icon className="w-5 h-5" />;
                        })()}
                      </motion.div>
                    ) : (
                      <motion.div
                        className="p-2 rounded-xl bg-background/20 backdrop-blur-sm border border-white/10"
                        animate={{ rotate: [0, 360] }}
                        transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                      >
                        <Sparkles className="w-5 h-5 text-primary" />
                      </motion.div>
                    )}
                    <div className="flex-1">
                      <DialogTitle className="text-2xl font-bold bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text text-transparent">
                        {selectedSkill ? "Edit Skill" : "Add New Skill"}
                      </DialogTitle>
                      <DialogDescription className="text-sm mt-1">
              {selectedSkill
                ? "Update the skill details below"
                : "Fill in the details to add a new skill"}
            </DialogDescription>
                    </div>
                  </div>
          </DialogHeader>
              </motion.div>

              <form onSubmit={handleSubmit} className="p-6 space-y-6">
                {/* Skill Name Field */}
                <motion.div
                  className="space-y-2"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.2 }}
                >
                  <Label htmlFor="name" className="flex items-center gap-2 text-sm font-semibold">
                    <Code2 className="w-4 h-4 text-primary" />
                    Skill Name *
                  </Label>
                  <div className="relative">
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                required
                disabled={isSubmitting}
                      className="pl-10 h-11 bg-background/50 border-primary/20 focus:border-primary/50 transition-all duration-300"
                      placeholder="e.g., React, TypeScript, Node.js"
              />
                    <Sparkles className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-primary/50" />
            </div>
                </motion.div>

                {/* Category Field */}
                <motion.div
                  className="space-y-2"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.3 }}
                >
                  <Label htmlFor="category" className="flex items-center gap-2 text-sm font-semibold">
                    <Database className="w-4 h-4 text-primary" />
                    Category *
                  </Label>
              <Select
                value={formData.category || ""}
                onValueChange={(value) => setFormData({ ...formData, category: value })}
                disabled={isSubmitting}
              >
                    <SelectTrigger 
                      id="category"
                      className="h-11 bg-background/50 border-primary/20 focus:border-primary/50"
                    >
                  <SelectValue placeholder="Select a category" />
                </SelectTrigger>
                <SelectContent>
                      {Object.entries(categoryConfig).map(([category, config]) => {
                        const Icon = config.icon;
                        return (
                          <SelectItem key={category} value={category}>
                            <div className="flex items-center gap-2">
                              <Icon className={cn("w-4 h-4", config.color)} />
                              <span>{category}</span>
                            </div>
                          </SelectItem>
                        );
                      })}
                </SelectContent>
              </Select>
                </motion.div>

                {/* Skill Level with Visual Indicator */}
                <motion.div
                  className="space-y-3"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.4 }}
                >
                  <Label htmlFor="level" className="flex items-center gap-2 text-sm font-semibold">
                    <TrendingUp className="w-4 h-4 text-primary" />
                    Skill Level
                  </Label>
              <Select
                value={formData.level || "intermediate"}
                onValueChange={(value) => setFormData({ ...formData, level: value })}
                disabled={isSubmitting}
              >
                    <SelectTrigger 
                      id="level"
                      className="h-11 bg-background/50 border-primary/20 focus:border-primary/50"
                    >
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                      {Object.entries(levelConfig).map(([value, config]) => (
                        <SelectItem key={value} value={value}>
                          <div className="flex items-center gap-2">
                            <div className={cn("w-2 h-2 rounded-full", `bg-gradient-to-r ${config.gradient}`)} />
                            <span>{config.label}</span>
                          </div>
                        </SelectItem>
                      ))}
                </SelectContent>
              </Select>
                  
                  {/* Visual Progress Bar */}
                  {formData.level && levelConfig[formData.level] && (
                    <motion.div
                      initial={{ opacity: 0, scaleX: 0 }}
                      animate={{ opacity: 1, scaleX: 1 }}
                      transition={{ delay: 0.5, duration: 0.5 }}
                      className="space-y-2"
                    >
                      <div className="flex items-center justify-between text-xs">
                        <span className={cn("font-medium", levelConfig[formData.level].color)}>
                          {levelConfig[formData.level].label}
                        </span>
                        <span className="text-muted-foreground">
                          {levelConfig[formData.level].value}%
                        </span>
                      </div>
                      <div className="h-2 bg-secondary/50 rounded-full overflow-hidden">
                        <motion.div
                          className={cn(
                            "h-full rounded-full bg-gradient-to-r",
                            levelConfig[formData.level].gradient
                          )}
                          initial={{ width: 0 }}
                          animate={{ width: `${levelConfig[formData.level].value}%` }}
                          transition={{ delay: 0.6, duration: 0.8, ease: "easeOut" }}
                        />
            </div>
                    </motion.div>
                  )}
                </motion.div>

                {/* Icon Field with Preview */}
                <motion.div
                  className="space-y-2"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.5 }}
                >
                  <Label htmlFor="icon" className="flex items-center gap-2 text-sm font-semibold">
                    <Star className="w-4 h-4 text-primary" />
                    Icon (Optional)
                  </Label>
                  <div className="flex items-center gap-3">
                    <div className="relative flex-1">
              <Input
                id="icon"
                value={formData.icon}
                onChange={(e) => setFormData({ ...formData, icon: e.target.value })}
                placeholder="🚀 or emoji"
                disabled={isSubmitting}
                        className="h-11 bg-background/50 border-primary/20 focus:border-primary/50"
              />
            </div>
                    {formData.icon && (
                      <motion.div
                        initial={{ scale: 0, rotate: -180 }}
                        animate={{ scale: 1, rotate: 0 }}
                        className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary/20 to-primary/10 border border-primary/30 flex items-center justify-center text-2xl backdrop-blur-sm"
                      >
                        {formData.icon}
                      </motion.div>
                    )}
                  </div>
                  <p className="text-xs text-muted-foreground">
                    Enter an emoji or icon to represent this skill
                  </p>
                </motion.div>

                {/* Preview Card */}
                {formData.name && formData.category && (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="p-4 rounded-xl border border-primary/20 bg-gradient-to-br from-card/50 to-card/30 backdrop-blur-sm"
                  >
                    <p className="text-xs font-medium text-muted-foreground mb-3 flex items-center gap-2">
                      <Zap className="w-3.5 h-3.5" />
                      Preview
                    </p>
                    <div className="flex items-center gap-3">
                      {formData.icon && (
                        <div className="text-2xl">{formData.icon}</div>
                      )}
                      <div className="flex-1">
                        <p className="font-semibold text-foreground">{formData.name}</p>
                        <div className="flex items-center gap-2 mt-1">
                          <Badge variant="outline" className="text-xs">
                            {formData.category}
                          </Badge>
                          {formData.level && (
                            <Badge 
                              variant="secondary"
                              className={cn("text-xs", levelConfig[formData.level].color)}
                            >
                              {levelConfig[formData.level].label}
                            </Badge>
                          )}
                        </div>
                      </div>
                    </div>
                  </motion.div>
                )}

                <DialogFooter className="gap-2 pt-4">
              <Button
                type="button"
                variant="outline"
                onClick={handleCloseDialog}
                disabled={isSubmitting}
                    className="min-w-[100px]"
              >
                Cancel
              </Button>
                  <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                    <Button 
                      type="submit" 
                      disabled={isSubmitting}
                      className="min-w-[120px] bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary/70 shadow-lg shadow-primary/25"
                    >
                {isSubmitting ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Saving...
                  </>
                ) : selectedSkill ? (
                        <>
                          <CheckCircle2 className="mr-2 h-4 w-4" />
                          Update
                        </>
                ) : (
                        <>
                          <Plus className="mr-2 h-4 w-4" />
                          Create
                        </>
                )}
              </Button>
                  </motion.div>
            </DialogFooter>
          </form>
            </div>
          </motion.div>
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
