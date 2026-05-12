// Supabase-based store for admin-editable portfolio data

export interface PortfolioProject {
  id: string;
  title: string;
  description: string;
  tags: string[];
  live_url: string;
  github_url: string;
  images: string[]; // URLs from storage
}

export interface PortfolioContact {
  email: string;
  phone: string;
  github: string;
  linkedin: string;
}

export interface PortfolioData {
  heroPhoto: string | null;
  projects: PortfolioProject[];
  contact: PortfolioContact;
}

export const defaultContact: PortfolioContact = {
  email: "thisisakhilkotyada@gmail.com",
  phone: "8317609312",
  github: "https://github.com/akhilkotyada",
  linkedin: "https://linkedin.com/in/akhilkotyada",
};

export const emptyPortfolioData: PortfolioData = {
  heroPhoto: null,
  projects: [],
  contact: { ...defaultContact },
};
