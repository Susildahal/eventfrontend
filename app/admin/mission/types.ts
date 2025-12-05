export interface HeroImage {
  id: number;
  url: string;
}

export interface HeroSection {
  title: string;
  mainTitle: string;
  description: string;
  cta: string;
  images: HeroImage[];
}

export interface MissionVisionItem {
  id: number;
  type: 'mission' | 'vision';
  title: string;
  description: string;
  missiondescription?: string;
}

export interface BeliefItem {
  id: number;
  icon: string;
  title: string;
  description: string;
}

export interface MethodItem {
  id: number;
  number: string;
  title: string;
  description: string;
}

export interface SustainabilityItem {
  id: number;
  icon: string;
  title: string;
  description: string;
}

export interface TechPoint {
  id: number;
  point: string;
}

export interface TechnologyItem {
  id: number;
  icon: string;
  title: string;
  description: string;
  points: TechPoint[];
}

export interface BudgetItem {
  id: number;
  icon: string;
  title: string;
  description: string;
  details: string;
}

export interface Sections {
  hero: HeroSection;
  missionVision: MissionVisionItem[];
  missionTitle?: string;
  missionDescription?: string;
  visionTitle?: string;
  visionDescription?: string;
  whatWeBelieve: BeliefItem[];
  theOcMethod: MethodItem[];
  sustainability: SustainabilityItem[];
  technology: TechnologyItem[];
  budgets: BudgetItem[];
  whatWeBelieveTitle?: string;
  theOcMethodTitle?: string;
  sustainabilityTitle?: string;
  technologyTitle?: string;
  budgetsTitle?: string;
}
