// Certifications CRUD page
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
import { Plus, Edit, Trash2, Loader2, ExternalLink } from "lucide-react";
import {
  getCertifications,
  createCertification,
  updateCertification,
  deleteCertification,
  Certification,
} from "@/lib/admin/certifications";
import { uploadImage, getImagePath, deleteImage } from "@/lib/admin/storage";

export const AdminCertifications = () => {
  const [certs, setCerts] = useState<Certification[]>([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [selectedCert, setSelectedCert] = useState<Certification | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  const [formData, setFormData] = useState<Omit<Certification, "id" | "createdAt" | "updatedAt">>({
    title: "",
    issuer: "",
    issueDate: "",
    credentialUrl: "",
    imageUrl: "",
    description: "",
  });

  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string>("");

  useEffect(() => {
    fetchCerts();
  }, []);

  const fetchCerts = async () => {
    try {
      setLoading(true);
      const data = await getCertifications();
      setCerts(data);
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to fetch certifications",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleOpenDialog = (cert?: Certification) => {
    if (cert) {
      setSelectedCert(cert);
      setFormData({
        title: cert.title,
        issuer: cert.issuer,
        issueDate: cert.issueDate,
        credentialUrl: cert.credentialUrl,
        imageUrl: cert.imageUrl,
        description: cert.description || "",
      });
      setImagePreview(cert.imageUrl);
    } else {
      resetForm();
    }
    setDialogOpen(true);
  };

  const resetForm = () => {
    setSelectedCert(null);
    setFormData({
      title: "",
      issuer: "",
      issueDate: "",
      credentialUrl: "",
      imageUrl: "",
      description: "",
    });
    setImageFile(null);
    setImagePreview("");
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImageFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      let imageUrl = formData.imageUrl;
      if (imageFile) {
        const imagePath = getImagePath("certifications", imageFile.name);
        imageUrl = await uploadImage(imageFile, imagePath);
      }

      const certData = { ...formData, imageUrl };

      if (selectedCert?.id) {
        await updateCertification(selectedCert.id, certData);
        toast({ title: "Success", description: "Certification updated successfully" });
      } else {
        await createCertification(certData);
        toast({ title: "Success", description: "Certification created successfully" });
      }

      setDialogOpen(false);
      resetForm();
      fetchCerts();
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to save certification",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async () => {
    if (!selectedCert?.id) return;

    try {
      if (selectedCert.imageUrl) {
        try {
          await deleteImage(selectedCert.imageUrl);
        } catch (e) {
          console.error("Error deleting image:", e);
        }
      }
      await deleteCertification(selectedCert.id);
      toast({ title: "Success", description: "Certification deleted successfully" });
      setDeleteDialogOpen(false);
      setSelectedCert(null);
      fetchCerts();
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to delete certification",
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
          <h1 className="text-3xl font-bold gradient-text">Certifications</h1>
          <p className="text-muted-foreground mt-2">Manage your certifications</p>
        </div>
        <Button onClick={() => handleOpenDialog()}>
          <Plus className="mr-2 h-4 w-4" />
          Add Certification
        </Button>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {certs.map((cert) => (
          <Card key={cert.id} className="card-hover">
            <CardHeader>
              <CardTitle className="text-lg">{cert.title}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {cert.imageUrl && (
                  <img
                    src={cert.imageUrl}
                    alt={cert.title}
                    className="w-full h-40 object-cover rounded-lg"
                  />
                )}
                <div>
                  <p className="text-sm font-medium text-primary">{cert.issuer}</p>
                  <p className="text-xs text-muted-foreground mt-1">{cert.issueDate}</p>
                </div>
                {cert.description && (
                  <p className="text-sm text-muted-foreground line-clamp-2">
                    {cert.description}
                  </p>
                )}
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleOpenDialog(cert)}
                    className="flex-1"
                  >
                    <Edit className="mr-2 h-4 w-4" />
                    Edit
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      setSelectedCert(cert);
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

      {certs.length === 0 && (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <p className="text-muted-foreground mb-4">No certifications yet</p>
            <Button onClick={() => handleOpenDialog()}>
              <Plus className="mr-2 h-4 w-4" />
              Add Your First Certification
            </Button>
          </CardContent>
        </Card>
      )}

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              {selectedCert ? "Edit Certification" : "Add New Certification"}
            </DialogTitle>
            <DialogDescription>
              {selectedCert
                ? "Update the certification details below"
                : "Fill in the details to add a new certification"}
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="title">Title *</Label>
                <Input
                  id="title"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="issuer">Issuer *</Label>
                <Input
                  id="issuer"
                  value={formData.issuer}
                  onChange={(e) => setFormData({ ...formData, issuer: e.target.value })}
                  required
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="issueDate">Issue Date *</Label>
                <Input
                  id="issueDate"
                  type="date"
                  value={formData.issueDate}
                  onChange={(e) => setFormData({ ...formData, issueDate: e.target.value })}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="credentialUrl">Credential URL</Label>
                <Input
                  id="credentialUrl"
                  type="url"
                  value={formData.credentialUrl}
                  onChange={(e) =>
                    setFormData({ ...formData, credentialUrl: e.target.value })
                  }
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                rows={3}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="image">Certificate Image</Label>
              <Input
                id="image"
                type="file"
                accept="image/*"
                onChange={handleImageChange}
              />
              {imagePreview && (
                <img
                  src={imagePreview}
                  alt="Preview"
                  className="w-full h-40 object-cover rounded-lg mt-2"
                />
              )}
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
                ) : selectedCert ? (
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
              This action cannot be undone. This will permanently delete the certification.
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

