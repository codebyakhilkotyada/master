import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Upload, Plus, Trash2, Save, Image as ImageIcon } from "lucide-react";
import { type PortfolioProject, type PortfolioContact } from "@/lib/portfolioStore";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { usePortfolioData } from "@/hooks/usePortfolioData";

interface AdminPanelProps {
  isOpen: boolean;
  onClose: () => void;
}

const AdminPanel = ({ isOpen, onClose }: AdminPanelProps) => {
  const portfolioData = usePortfolioData();
  const [heroPhoto, setHeroPhoto] = useState<string | null>(portfolioData.heroPhoto);
  const [heroFile, setHeroFile] = useState<File | null>(null);
  const [projects, setProjects] = useState<PortfolioProject[]>(portfolioData.projects);
  const [contact, setContact] = useState<PortfolioContact>(portfolioData.contact);
  const [activeTab, setActiveTab] = useState<"hero" | "projects" | "contact">("hero");
  const heroFileRef = useRef<HTMLInputElement>(null);
  const [saving, setSaving] = useState(false);
  const [synced, setSynced] = useState(false);

  // Sync local state with loaded portfolio data (only once data is loaded, and only when panel opens)
  useEffect(() => {
    if (isOpen && !portfolioData.loading && !synced) {
      setHeroPhoto(portfolioData.heroPhoto);
      setProjects(portfolioData.projects);
      setContact(portfolioData.contact);
      setSynced(true);
    }
    if (!isOpen) {
      setSynced(false);
      setHeroFile(null);
    }
  }, [isOpen, portfolioData.loading, portfolioData.heroPhoto, portfolioData.projects, portfolioData.contact, synced]);

  const handleHeroUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 5 * 1024 * 1024) {
      toast.error("Image must be under 5MB");
      return;
    }
    setHeroFile(file);
    setHeroPhoto(URL.createObjectURL(file));
  };

  const addProject = () => {
    setProjects([
      ...projects,
      {
        id: Date.now().toString(),
        title: "",
        description: "",
        tags: [],
        live_url: "#",
        github_url: "#",
        images: [],
      },
    ]);
  };

  const updateProject = (id: string, field: string, value: any) => {
    setProjects(projects.map((p) => (p.id === id ? { ...p, [field]: value } : p)));
  };

  const removeProject = (id: string) => {
    setProjects(projects.filter((p) => p.id !== id));
  };

  const addProjectImages = async (id: string, files: FileList) => {
    const project = projects.find((p) => p.id === id);
    if (!project) return;
    const newImageUrls: string[] = [];
    for (let i = 0; i < Math.min(files.length, 5 - project.images.length); i++) {
      const file = files[i];
      if (file.size > 5 * 1024 * 1024) continue;
      const fileName = `projects/${id}/${Date.now()}_${i}_${file.name}`;
      const { data, error } = await supabase.storage.from("portfolio").upload(fileName, file);
      if (error) { console.error("Upload error:", error); continue; }
      const { data: urlData } = supabase.storage.from("portfolio").getPublicUrl(data.path);
      newImageUrls.push(urlData.publicUrl);
    }
    updateProject(id, "images", [...project.images, ...newImageUrls]);
  };

  const removeProjectImage = (projectId: string, imgIndex: number) => {
    const project = projects.find((p) => p.id === projectId);
    if (!project) return;
    updateProject(projectId, "images", project.images.filter((_, i) => i !== imgIndex));
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      // Upload hero photo if changed
      let heroPhotoUrl = portfolioData.heroPhoto;
      if (heroFile) {
        const fileName = `hero/${Date.now()}_${heroFile.name}`;
        const { data: uploadData, error } = await supabase.storage.from("portfolio").upload(fileName, heroFile);
        if (error) throw error;
        const { data: urlData } = supabase.storage.from("portfolio").getPublicUrl(uploadData.path);
        heroPhotoUrl = urlData.publicUrl;
      } else if (!heroPhoto) {
        heroPhotoUrl = null;
      }

      // Update profile
      const { data: existingProfile } = await supabase.from("portfolio_profile").select("id").limit(1).maybeSingle();
      if (existingProfile) {
        await supabase.from("portfolio_profile").update({
          hero_photo_url: heroPhotoUrl,
          email: contact.email,
          phone: contact.phone,
          github: contact.github,
          linkedin: contact.linkedin,
        }).eq("id", existingProfile.id);
      } else {
        await supabase.from("portfolio_profile").insert({
          hero_photo_url: heroPhotoUrl,
          email: contact.email,
          phone: contact.phone,
          github: contact.github,
          linkedin: contact.linkedin,
        });
      }

      // Sync projects: delete all existing, re-insert
      await supabase.from("portfolio_project_images").delete().neq("id", "00000000-0000-0000-0000-000000000000");
      await supabase.from("portfolio_projects").delete().neq("id", "00000000-0000-0000-0000-000000000000");

      for (let i = 0; i < projects.length; i++) {
        const p = projects[i];
        const title = p.title?.trim() || "Untitled Project";
        const { data: inserted } = await supabase.from("portfolio_projects").insert({
          title,
          description: p.description,
          tags: p.tags,
          live_url: p.live_url,
          github_url: p.github_url,
          sort_order: i,
        }).select("id").single();

        if (inserted && p.images.length > 0) {
          await supabase.from("portfolio_project_images").insert(
            p.images.map((url, idx) => ({
              project_id: inserted.id,
              image_url: url,
              sort_order: idx,
            }))
          );
        }
      }

      window.dispatchEvent(new Event("portfolio-updated"));
      toast.success("Portfolio updated! Changes saved to database.");
      onClose();
    } catch (err) {
      console.error("Save error:", err);
      toast.error("Failed to save. Please try again.");
    } finally {
      setSaving(false);
    }
  };

  const tabs = [
    { key: "hero" as const, label: "Hero Photo" },
    { key: "projects" as const, label: "Projects" },
    { key: "contact" as const, label: "Contact" },
  ];

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[10000] flex items-center justify-center bg-background/90 backdrop-blur-md p-4"
          onClick={onClose}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 30 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 30 }}
            className="glass rounded-2xl w-full max-w-2xl max-h-[85vh] overflow-hidden flex flex-col"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="flex items-center justify-between p-4 sm:p-6 border-b border-border">
              <h2 className="text-xl font-bold text-foreground">Admin Panel</h2>
              <button onClick={onClose} className="text-muted-foreground hover:text-foreground transition-colors">
                <X size={20} />
              </button>
            </div>

            {/* Tabs */}
            <div className="flex border-b border-border px-4 sm:px-6">
              {tabs.map((tab) => (
                <button
                  key={tab.key}
                  onClick={() => setActiveTab(tab.key)}
                  className={`px-4 py-3 text-sm font-medium transition-colors relative ${
                    activeTab === tab.key ? "text-primary" : "text-muted-foreground hover:text-foreground"
                  }`}
                >
                  {tab.label}
                  {activeTab === tab.key && (
                    <motion.div layoutId="admin-tab" className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary" />
                  )}
                </button>
              ))}
            </div>

            {/* Content */}
            <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-6">
              {activeTab === "hero" && (
                <div className="space-y-4">
                  <p className="text-sm text-muted-foreground">Upload your photo to display in the hero section beside your name.</p>
                  <div className="flex flex-col items-center gap-4">
                    {heroPhoto && (
                      <div className="relative">
                        <img src={heroPhoto} alt="Hero" className="w-32 h-32 sm:w-40 sm:h-40 rounded-full object-cover border-2 border-primary/30" />
                        <button
                          onClick={() => setHeroPhoto(null)}
                          className="absolute -top-2 -right-2 w-7 h-7 rounded-full bg-destructive text-destructive-foreground flex items-center justify-center text-xs"
                        >
                          <X size={14} />
                        </button>
                      </div>
                    )}
                    <input ref={heroFileRef} type="file" accept="image/*" onChange={handleHeroUpload} className="hidden" />
                    <button
                      onClick={() => heroFileRef.current?.click()}
                      className="btn-outline-glow text-sm px-6 py-2 flex items-center gap-2"
                    >
                      <Upload size={16} /> {heroPhoto ? "Change Photo" : "Upload Photo"}
                    </button>
                  </div>
                </div>
              )}

              {activeTab === "projects" && (
                <div className="space-y-6">
                  <p className="text-sm text-muted-foreground">Add or manage your portfolio projects. These will appear alongside existing projects.</p>
                  {projects.map((project) => (
                    <div key={project.id} className="glass rounded-xl p-4 space-y-3">
                      <div className="flex items-center justify-between">
                        <input
                          value={project.title}
                          onChange={(e) => updateProject(project.id, "title", e.target.value)}
                          placeholder="Project title"
                          className="bg-transparent text-foreground font-semibold text-base focus:outline-none flex-1 min-w-0"
                        />
                        <button onClick={() => removeProject(project.id)} className="text-destructive hover:text-destructive/80 ml-2 shrink-0">
                          <Trash2 size={16} />
                        </button>
                      </div>
                      <textarea
                        value={project.description}
                        onChange={(e) => updateProject(project.id, "description", e.target.value)}
                        placeholder="Project description..."
                        rows={2}
                        className="w-full bg-secondary/50 rounded-lg px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground/50 focus:outline-none resize-none"
                      />
                      <input
                        value={project.tags.join(", ")}
                        onChange={(e) => updateProject(project.id, "tags", e.target.value.split(",").map((t) => t.trim()).filter(Boolean))}
                        placeholder="Tags (comma separated)"
                        className="w-full bg-secondary/50 rounded-lg px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground/50 focus:outline-none"
                      />
                      <div className="grid grid-cols-2 gap-2">
                        <input
                          value={project.live_url}
                          onChange={(e) => updateProject(project.id, "live_url", e.target.value)}
                          placeholder="Live URL"
                          className="bg-secondary/50 rounded-lg px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground/50 focus:outline-none"
                        />
                        <input
                          value={project.github_url}
                          onChange={(e) => updateProject(project.id, "github_url", e.target.value)}
                          placeholder="GitHub URL"
                          className="bg-secondary/50 rounded-lg px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground/50 focus:outline-none"
                        />
                      </div>
                      {/* Project Images */}
                      <div>
                        <p className="text-xs text-muted-foreground mb-2">Project Images (max 5 each, max 5MB)</p>
                        <div className="flex flex-wrap gap-2">
                          {project.images.map((img, idx) => (
                            <div key={idx} className="relative w-16 h-16 sm:w-20 sm:h-20 rounded-lg overflow-hidden">
                              <img src={img} alt="" className="w-full h-full object-cover" />
                              <button
                                onClick={() => removeProjectImage(project.id, idx)}
                                className="absolute top-0.5 right-0.5 w-5 h-5 rounded-full bg-destructive/80 text-white flex items-center justify-center"
                              >
                                <X size={10} />
                              </button>
                            </div>
                          ))}
                          {project.images.length < 5 && (
                            <label className="w-16 h-16 sm:w-20 sm:h-20 rounded-lg border-2 border-dashed border-border flex items-center justify-center cursor-pointer hover:border-primary/50 transition-colors">
                              <ImageIcon size={18} className="text-muted-foreground" />
                              <input
                                type="file"
                                accept="image/*"
                                multiple
                                className="hidden"
                                onChange={(e) => e.target.files && addProjectImages(project.id, e.target.files)}
                              />
                            </label>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                  <button onClick={addProject} className="btn-outline-glow text-sm px-4 py-2 flex items-center gap-2 w-full justify-center">
                    <Plus size={16} /> Add New Project
                  </button>
                </div>
              )}

              {activeTab === "contact" && (
                <div className="space-y-4">
                  <p className="text-sm text-muted-foreground">Update your contact details shown on the site.</p>
                  {[
                    { key: "email" as const, label: "Email", placeholder: "your@email.com" },
                    { key: "phone" as const, label: "Phone", placeholder: "+1 234 567 890" },
                    { key: "github" as const, label: "GitHub URL", placeholder: "https://github.com/..." },
                    { key: "linkedin" as const, label: "LinkedIn URL", placeholder: "https://linkedin.com/in/..." },
                  ].map((field) => (
                    <div key={field.key}>
                      <label className="block text-sm font-medium text-foreground mb-1.5">{field.label}</label>
                      <input
                        value={contact[field.key]}
                        onChange={(e) => setContact({ ...contact, [field.key]: e.target.value })}
                        placeholder={field.placeholder}
                        className="w-full px-4 py-3 rounded-lg bg-secondary border border-border text-foreground placeholder:text-muted-foreground/50 focus:outline-none focus:ring-2 focus:ring-primary/40 transition-all text-sm"
                      />
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Footer */}
            <div className="p-4 sm:p-6 border-t border-border flex justify-end gap-3">
              <button onClick={onClose} className="px-4 py-2 text-sm text-muted-foreground hover:text-foreground transition-colors">
                Cancel
              </button>
              <button onClick={handleSave} disabled={saving} className="btn-primary text-sm px-6 py-2 flex items-center gap-2 disabled:opacity-60">
                <Save size={16} /> {saving ? "Saving..." : "Save Changes"}
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default AdminPanel;
