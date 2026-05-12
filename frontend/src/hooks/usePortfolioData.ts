import { useState, useEffect, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";
import {
  emptyPortfolioData,
  defaultContact,
  type PortfolioData,
  type PortfolioProject,
} from "@/lib/portfolioStore";

export const usePortfolioData = () => {
  const [data, setData] = useState<PortfolioData>(emptyPortfolioData);
  const [loading, setLoading] = useState(true);

  const fetchData = useCallback(async () => {
    try {
      // Fetch profile
      const { data: profile } = await supabase
        .from("portfolio_profile")
        .select("*")
        .limit(1)
        .maybeSingle();

      // Fetch projects with images
      const { data: projects } = await supabase
        .from("portfolio_projects")
        .select("*")
        .order("sort_order", { ascending: true });

      const { data: images } = await supabase
        .from("portfolio_project_images")
        .select("*")
        .order("sort_order", { ascending: true });

      const mappedProjects: PortfolioProject[] = (projects || []).map((p) => ({
        id: p.id,
        title: p.title,
        description: p.description,
        tags: p.tags || [],
        live_url: p.live_url,
        github_url: p.github_url,
        images: (images || [])
          .filter((img) => img.project_id === p.id)
          .map((img) => img.image_url),
      }));

      setData({
        heroPhoto: profile?.hero_photo_url || null,
        projects: mappedProjects,
        contact: profile
          ? {
              email: profile.email,
              phone: profile.phone,
              github: profile.github,
              linkedin: profile.linkedin,
            }
          : { ...defaultContact },
      });
    } catch (err) {
      console.error("Failed to fetch portfolio data:", err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();

    // Listen for manual refresh events
    const handler = () => fetchData();
    window.addEventListener("portfolio-updated", handler);
    return () => window.removeEventListener("portfolio-updated", handler);
  }, [fetchData]);

  return { ...data, loading, refetch: fetchData };
};
