export interface Program {
  id: string;
  name: string;
  slug: string;
  category: "School" | "Diploma" | "Undergraduate" | "Postgraduate" | "Professional";
  thumbnail: string;
  description: string;
  duration: string;
  mode: "Online" | "Offline" | "Hybrid";
  eligibility: string;
  fee: string;
  featured: boolean;
}
