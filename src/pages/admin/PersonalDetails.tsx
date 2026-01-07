// Personal Details admin page
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Loader2, Save, User, Image as ImageIcon,
  Briefcase, Globe, Github, Linkedin, Twitter,
  Instagram, Youtube, Mail, Phone, MapPin,
  Settings, Share2, Download
} from "lucide-react";
import { motion } from "framer-motion";
import { 
  getPersonalDetails, 
  savePersonalDetails, 
  PersonalDetails, 
  defaultPersonalDetails,
  SocialLinks 
} from "@/lib/admin/personalDetails";

export const AdminPersonalDetails = () => {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [formData, setFormData] = useState<Omit<PersonalDetails, "updatedAt">>(defaultPersonalDetails);
  const [rolesInput, setRolesInput] = useState("");
  const [keywordsInput, setKeywordsInput] = useState("");
  const { toast } = useToast();

  useEffect(() => {
    fetchPersonalDetails();
  }, []);

  const fetchPersonalDetails = async () => {
    try {
      setLoading(true);
      const data = await getPersonalDetails();
      if (data) {
        setFormData(data);
        setRolesInput(data.roles?.join(", ") || "");
        setKeywordsInput(data.keywords?.join(", ") || "");
      }
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to fetch personal details",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      const roles = rolesInput
        .split(",")
        .map((r) => r.trim())
        .filter((r) => r.length > 0);

      const keywords = keywordsInput
        .split(",")
        .map((k) => k.trim())
        .filter((k) => k.length > 0);

      const dataToSave = {
        ...formData,
        roles,
        keywords,
      };

      await savePersonalDetails(dataToSave);
      toast({
        title: "Success",
        description: "Personal details saved successfully",
      });
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to save personal details",
        variant: "destructive",
      });
    } finally {
      setSaving(false);
    }
  };

  const updateSocialLink = (key: keyof SocialLinks, value: string) => {
    setFormData((prev) => ({
      ...prev,
      socialLinks: {
        ...prev.socialLinks,
        [key]: value,
      },
    }));
  };

  const socialLinkFields: { key: keyof SocialLinks; label: string; icon: any; placeholder: string }[] = [
    { key: "github", label: "GitHub", icon: Github, placeholder: "https://github.com/username" },
    { key: "linkedin", label: "LinkedIn", icon: Linkedin, placeholder: "https://linkedin.com/in/username" },
    { key: "twitter", label: "Twitter/X", icon: Twitter, placeholder: "https://twitter.com/username" },
    { key: "instagram", label: "Instagram", icon: Instagram, placeholder: "https://instagram.com/username" },
    { key: "youtube", label: "YouTube", icon: Youtube, placeholder: "https://youtube.com/@username" },
    { key: "dribbble", label: "Dribbble", icon: Globe, placeholder: "https://dribbble.com/username" },
    { key: "behance", label: "Behance", icon: Globe, placeholder: "https://behance.net/username" },
    { key: "medium", label: "Medium", icon: Globe, placeholder: "https://medium.com/@username" },
    { key: "devto", label: "Dev.to", icon: Globe, placeholder: "https://dev.to/username" },
    { key: "codepen", label: "CodePen", icon: Globe, placeholder: "https://codepen.io/username" },
    { key: "stackoverflow", label: "Stack Overflow", icon: Globe, placeholder: "https://stackoverflow.com/users/id" },
    { key: "discord", label: "Discord", icon: Globe, placeholder: "Discord invite link or username" },
    { key: "telegram", label: "Telegram", icon: Globe, placeholder: "https://t.me/username" },
    { key: "whatsapp", label: "WhatsApp", icon: Phone, placeholder: "https://wa.me/number" },
    { key: "email", label: "Email Link", icon: Mail, placeholder: "mailto:email@example.com or Gmail compose link" },
    { key: "website", label: "Personal Website", icon: Globe, placeholder: "https://yourwebsite.com" },
  ];

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] gap-4">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
        >
          <Loader2 className="w-8 h-8 text-primary" />
        </motion.div>
        <p className="text-muted-foreground">Loading personal details...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold gradient-text flex items-center gap-2">
            <User className="w-8 h-8" />
            Personal Details
          </h1>
          <p className="text-muted-foreground mt-2">
            Manage your personal information, social links, and branding
          </p>
        </div>
        <Button onClick={handleSave} disabled={saving} className="gap-2">
          {saving ? (
            <Loader2 className="w-4 h-4 animate-spin" />
          ) : (
            <Save className="w-4 h-4" />
          )}
          Save Changes
        </Button>
      </div>

      {/* Tabs */}
      <Tabs defaultValue="basic" className="space-y-6">
        <TabsList className="grid w-full grid-cols-2 md:grid-cols-5 gap-2 h-auto p-2">
          <TabsTrigger value="basic" className="gap-2">
            <User className="w-4 h-4" />
            <span className="hidden sm:inline">Basic Info</span>
          </TabsTrigger>
          <TabsTrigger value="social" className="gap-2">
            <Share2 className="w-4 h-4" />
            <span className="hidden sm:inline">Social Links</span>
          </TabsTrigger>
          <TabsTrigger value="images" className="gap-2">
            <ImageIcon className="w-4 h-4" />
            <span className="hidden sm:inline">Images</span>
          </TabsTrigger>
          <TabsTrigger value="professional" className="gap-2">
            <Briefcase className="w-4 h-4" />
            <span className="hidden sm:inline">Professional</span>
          </TabsTrigger>
          <TabsTrigger value="seo" className="gap-2">
            <Settings className="w-4 h-4" />
            <span className="hidden sm:inline">SEO & Meta</span>
          </TabsTrigger>
        </TabsList>

        {/* Basic Info Tab */}
        <TabsContent value="basic">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <User className="w-5 h-5 text-primary" />
                Basic Information
              </CardTitle>
              <CardDescription>
                Your name, bio, and contact information
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="fullName">Full Name</Label>
                  <Input
                    id="fullName"
                    value={formData.fullName}
                    onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                    placeholder="John Doe"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="displayName">Display Name (Short)</Label>
                  <Input
                    id="displayName"
                    value={formData.displayName}
                    onChange={(e) => setFormData({ ...formData, displayName: e.target.value })}
                    placeholder="John"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="tagline">Tagline</Label>
                <Input
                  id="tagline"
                  value={formData.tagline}
                  onChange={(e) => setFormData({ ...formData, tagline: e.target.value })}
                  placeholder="Crafting Digital Experiences"
                />
                <p className="text-xs text-muted-foreground">
                  A short catchy phrase that appears in the hero section
                </p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="shortBio">Short Bio</Label>
                <Input
                  id="shortBio"
                  value={formData.shortBio}
                  onChange={(e) => setFormData({ ...formData, shortBio: e.target.value })}
                  placeholder="Frontend Developer | UI/UX Enthusiast"
                />
                <p className="text-xs text-muted-foreground">
                  One-liner bio for social cards and compact displays
                </p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="bio">Full Bio</Label>
                <Textarea
                  id="bio"
                  value={formData.bio}
                  onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                  placeholder="Write your full bio here..."
                  rows={4}
                />
              </div>

              <Separator />

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="email" className="flex items-center gap-2">
                    <Mail className="w-4 h-4" />
                    Email
                  </Label>
                  <Input
                    id="email"
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    placeholder="you@example.com"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="phone" className="flex items-center gap-2">
                    <Phone className="w-4 h-4" />
                    Phone (Optional)
                  </Label>
                  <Input
                    id="phone"
                    value={formData.phone || ""}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    placeholder="+1 234 567 890"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="location" className="flex items-center gap-2">
                    <MapPin className="w-4 h-4" />
                    Location (Optional)
                  </Label>
                  <Input
                    id="location"
                    value={formData.location || ""}
                    onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                    placeholder="City, Country"
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Social Links Tab */}
        <TabsContent value="social">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Share2 className="w-5 h-5 text-primary" />
                Social Links
              </CardTitle>
              <CardDescription>
                Connect your social media profiles and other platforms
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {socialLinkFields.map((field) => {
                  const Icon = field.icon;
                  return (
                    <div key={field.key} className="space-y-2">
                      <Label htmlFor={field.key} className="flex items-center gap-2">
                        <Icon className="w-4 h-4" />
                        {field.label}
                      </Label>
                      <Input
                        id={field.key}
                        value={formData.socialLinks[field.key] || ""}
                        onChange={(e) => updateSocialLink(field.key, e.target.value)}
                        placeholder={field.placeholder}
                      />
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Images Tab */}
        <TabsContent value="images">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <ImageIcon className="w-5 h-5 text-primary" />
                Images & Branding
              </CardTitle>
              <CardDescription>
                Profile picture, logo, and other visual assets (use image URLs)
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="profileImageUrl">Profile Image URL</Label>
                  <Input
                    id="profileImageUrl"
                    value={formData.profileImageUrl}
                    onChange={(e) => setFormData({ ...formData, profileImageUrl: e.target.value })}
                    placeholder="https://example.com/profile.jpg"
                  />
                  {formData.profileImageUrl && (
                    <div className="mt-2 rounded-lg border p-2 bg-muted/50">
                      <img
                        src={formData.profileImageUrl}
                        alt="Profile Preview"
                        className="w-24 h-24 rounded-full object-cover mx-auto"
                        onError={(e) => {
                          (e.target as HTMLImageElement).style.display = 'none';
                        }}
                      />
                    </div>
                  )}
                  <p className="text-xs text-muted-foreground">
                    Used in Hero section and about
                  </p>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="heroImageUrl">Hero Image URL (Optional)</Label>
                  <Input
                    id="heroImageUrl"
                    value={formData.heroImageUrl || ""}
                    onChange={(e) => setFormData({ ...formData, heroImageUrl: e.target.value })}
                    placeholder="https://example.com/hero-image.jpg"
                  />
                  {formData.heroImageUrl && (
                    <div className="mt-2 rounded-lg border p-2 bg-muted/50">
                      <img
                        src={formData.heroImageUrl}
                        alt="Hero Preview"
                        className="w-full h-32 object-cover rounded"
                        onError={(e) => {
                          (e.target as HTMLImageElement).style.display = 'none';
                        }}
                      />
                    </div>
                  )}
                  <p className="text-xs text-muted-foreground">
                    Alternative image for hero section (if different from profile)
                  </p>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="logoUrl">Logo URL</Label>
                  <Input
                    id="logoUrl"
                    value={formData.logoUrl || ""}
                    onChange={(e) => setFormData({ ...formData, logoUrl: e.target.value })}
                    placeholder="https://example.com/logo.png"
                  />
                  {formData.logoUrl && (
                    <div className="mt-2 rounded-lg border p-2 bg-muted/50 flex justify-center">
                      <img
                        src={formData.logoUrl}
                        alt="Logo Preview"
                        className="h-12 object-contain"
                        onError={(e) => {
                          (e.target as HTMLImageElement).style.display = 'none';
                        }}
                      />
                    </div>
                  )}
                  <p className="text-xs text-muted-foreground">
                    Your brand logo for navigation
                  </p>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="faviconUrl">Favicon URL</Label>
                  <Input
                    id="faviconUrl"
                    value={formData.faviconUrl || ""}
                    onChange={(e) => setFormData({ ...formData, faviconUrl: e.target.value })}
                    placeholder="https://example.com/favicon.ico"
                  />
                  {formData.faviconUrl && (
                    <div className="mt-2 rounded-lg border p-2 bg-muted/50 flex justify-center">
                      <img
                        src={formData.faviconUrl}
                        alt="Favicon Preview"
                        className="w-8 h-8 object-contain"
                        onError={(e) => {
                          (e.target as HTMLImageElement).style.display = 'none';
                        }}
                      />
                    </div>
                  )}
                  <p className="text-xs text-muted-foreground">
                    Browser tab icon
                  </p>
                </div>

                <div className="space-y-2 md:col-span-2">
                  <Label htmlFor="ogImageUrl">Open Graph Image URL</Label>
                  <Input
                    id="ogImageUrl"
                    value={formData.ogImageUrl || ""}
                    onChange={(e) => setFormData({ ...formData, ogImageUrl: e.target.value })}
                    placeholder="https://example.com/og-image.jpg"
                  />
                  {formData.ogImageUrl && (
                    <div className="mt-2 rounded-lg border p-2 bg-muted/50">
                      <img
                        src={formData.ogImageUrl}
                        alt="OG Image Preview"
                        className="w-full max-w-md h-48 object-cover rounded mx-auto"
                        onError={(e) => {
                          (e.target as HTMLImageElement).style.display = 'none';
                        }}
                      />
                    </div>
                  )}
                  <p className="text-xs text-muted-foreground">
                    Image shown when sharing on social media (recommended: 1200x630px)
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Professional Tab */}
        <TabsContent value="professional">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Briefcase className="w-5 h-5 text-primary" />
                Professional Information
              </CardTitle>
              <CardDescription>
                Your roles, experience, and availability status
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="roles">Roles (comma-separated)</Label>
                <Input
                  id="roles"
                  value={rolesInput}
                  onChange={(e) => setRolesInput(e.target.value)}
                  placeholder="Frontend Developer, UI/UX Designer, React Specialist"
                />
                <p className="text-xs text-muted-foreground">
                  These will rotate in the hero section animation
                </p>
                {rolesInput && (
                  <div className="flex flex-wrap gap-2 mt-2">
                    {rolesInput.split(",").map((role, i) => (
                      role.trim() && (
                        <Badge key={i} variant="secondary">
                          {role.trim()}
                        </Badge>
                      )
                    ))}
                  </div>
                )}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="currentRole">Current Role</Label>
                  <Input
                    id="currentRole"
                    value={formData.currentRole || ""}
                    onChange={(e) => setFormData({ ...formData, currentRole: e.target.value })}
                    placeholder="Senior Frontend Developer"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="yearsOfExperience">Years of Experience</Label>
                  <Input
                    id="yearsOfExperience"
                    type="number"
                    min={0}
                    value={formData.yearsOfExperience || 0}
                    onChange={(e) => setFormData({ ...formData, yearsOfExperience: parseInt(e.target.value) || 0 })}
                    placeholder="5"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="availabilityStatus">Availability Status</Label>
                <Select
                  value={formData.availabilityStatus}
                  onValueChange={(value: "available" | "busy" | "not-available") => 
                    setFormData({ ...formData, availabilityStatus: value })
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="available">
                      <span className="flex items-center gap-2">
                        <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
                        Open to Opportunities
                      </span>
                    </SelectItem>
                    <SelectItem value="busy">
                      <span className="flex items-center gap-2">
                        <span className="w-2 h-2 rounded-full bg-yellow-500"></span>
                        Currently Busy
                      </span>
                    </SelectItem>
                    <SelectItem value="not-available">
                      <span className="flex items-center gap-2">
                        <span className="w-2 h-2 rounded-full bg-red-500"></span>
                        Not Available
                      </span>
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <Separator />

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="resumeUrl" className="flex items-center gap-2">
                    <Download className="w-4 h-4" />
                    Resume/CV URL
                  </Label>
                  <Input
                    id="resumeUrl"
                    value={formData.resumeUrl || ""}
                    onChange={(e) => setFormData({ ...formData, resumeUrl: e.target.value })}
                    placeholder="https://drive.google.com/file/d/..."
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="resumeFileName">Resume File Name</Label>
                  <Input
                    id="resumeFileName"
                    value={formData.resumeFileName || ""}
                    onChange={(e) => setFormData({ ...formData, resumeFileName: e.target.value })}
                    placeholder="John_Doe_Resume.pdf"
                  />
                  <p className="text-xs text-muted-foreground">
                    File name shown when downloading
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* SEO Tab */}
        <TabsContent value="seo">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Settings className="w-5 h-5 text-primary" />
                SEO & Meta Settings
              </CardTitle>
              <CardDescription>
                Search engine optimization and site metadata
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="siteTitle">Site Title</Label>
                <Input
                  id="siteTitle"
                  value={formData.siteTitle || ""}
                  onChange={(e) => setFormData({ ...formData, siteTitle: e.target.value })}
                  placeholder="Your Name - Portfolio"
                />
                <p className="text-xs text-muted-foreground">
                  Browser tab title and search result title
                </p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="siteDescription">Site Description</Label>
                <Textarea
                  id="siteDescription"
                  value={formData.siteDescription || ""}
                  onChange={(e) => setFormData({ ...formData, siteDescription: e.target.value })}
                  placeholder="A brief description of your portfolio..."
                  rows={3}
                />
                <p className="text-xs text-muted-foreground">
                  Meta description for search engines (recommended: 150-160 characters)
                </p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="keywords">Keywords (comma-separated)</Label>
                <Input
                  id="keywords"
                  value={keywordsInput}
                  onChange={(e) => setKeywordsInput(e.target.value)}
                  placeholder="Frontend Developer, React, TypeScript, Portfolio"
                />
                {keywordsInput && (
                  <div className="flex flex-wrap gap-2 mt-2">
                    {keywordsInput.split(",").map((keyword, i) => (
                      keyword.trim() && (
                        <Badge key={i} variant="outline">
                          {keyword.trim()}
                        </Badge>
                      )
                    ))}
                  </div>
                )}
              </div>

              <Separator />

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="copyrightYear">Copyright Year</Label>
                  <Input
                    id="copyrightYear"
                    type="number"
                    value={formData.copyrightYear || new Date().getFullYear()}
                    onChange={(e) => setFormData({ ...formData, copyrightYear: parseInt(e.target.value) })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="copyrightName">Copyright Name</Label>
                  <Input
                    id="copyrightName"
                    value={formData.copyrightName || ""}
                    onChange={(e) => setFormData({ ...formData, copyrightName: e.target.value })}
                    placeholder="Your Name"
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Floating Save Button for Mobile */}
      <div className="fixed bottom-4 right-4 md:hidden z-50">
        <Button onClick={handleSave} disabled={saving} size="lg" className="rounded-full shadow-lg">
          {saving ? (
            <Loader2 className="w-5 h-5 animate-spin" />
          ) : (
            <Save className="w-5 h-5" />
          )}
        </Button>
      </div>
    </div>
  );
};
