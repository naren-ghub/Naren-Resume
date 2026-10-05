export type SectionType = 
  | 'summary' 
  | 'experience' 
  | 'projects' 
  | 'education' 
  | 'skills' 
  | 'languages' 
  | 'certifications' 
  | 'custom';

export type ColumnTarget = 'main' | 'sidebar';

export interface HeaderData {
  name: string;
  title: string;
  phone: string;
  email: string;
  linkedin: string;
  website: string;
  location: string;
}

export interface ExperienceEntry {
  id: string;
  title: string;
  company: string;
  date: string;
  location: string;
  bullets: string[];
}

export interface ProjectEntry {
  id: string;
  name: string;
  technologies: string;
  date?: string;
  link?: string;
  bullets: string[];
}

export interface EducationEntry {
  id: string;
  degree: string;
  institution: string;
  date: string;
  grade?: string;
  details?: string;
}

export interface SkillGroup {
  id: string;
  category: string;
  skills: string; // e.g. "Skill 1 · Skill 2 · Skill 3"
  proficiencyStyle?: 'text' | 'dots' | 'tags';
  items?: { name: string; level?: number }[]; // optional proficiency 1-5
}

export interface LanguageEntry {
  id: string;
  language: string;
  proficiency: string; // e.g. "Native", "Professional", "Fluent"
  level?: number; // 1-5 optional
}

export interface CertificationEntry {
  id: string;
  name: string;
  issuer: string;
  date: string;
  achievement?: string; // e.g. "Certified", "Distinction"
  description?: string;
}

export interface CustomEntry {
  id: string;
  title: string;
  subtitle?: string;
  date?: string;
  bullets: string[];
}

export interface ResumeSection {
  id: string;
  type: SectionType;
  title: string;
  column: ColumnTarget;
  visible: boolean;
  summaryText?: string;
  experienceEntries?: ExperienceEntry[];
  projectEntries?: ProjectEntry[];
  educationEntries?: EducationEntry[];
  skillGroups?: SkillGroup[];
  languageEntries?: LanguageEntry[];
  certificationEntries?: CertificationEntry[];
  customEntries?: CustomEntry[];
}

export interface ResumeTypography {
  fontFamily: 'Plus Jakarta Sans' | 'Inter' | 'Outfit' | 'DM Sans' | 'Source Serif 4';
  nameSize: number; // 24 to 36 px
  nameWeight: 'font-semibold' | 'font-bold' | 'font-extrabold';
  headingSize: number; // 12 to 16 px
  bodySize: number; // 12 to 14 px
  metadataSize: number; // 11 to 12 px
  letterSpacing: 'normal' | 'wide' | 'wider';
  lineHeight: 'tight' | 'normal' | 'relaxed';
}

export interface ResumeColors {
  primaryText: string;
  secondaryText: string;
  accentColor: string;
  dividerColor: string;
  headingDividerColor: 'accent' | 'neutral';
  sidebarBackground: string;
}

export interface ResumeLayout {
  mainColumnRatio: number; // e.g. 68 for 68% Main, 32% Sidebar
  columnGap: number; // 12 to 32 px
  pageMargin: '12mm' | 'compact' | 'standard' | 'spacious'; // 12mm, 14mm, 18mm, 22mm
  sectionSpacing: number; // 6 to 28 px
  entrySpacing: number; // 4 to 20 px
  showVerticalDivider: boolean;
  compactBullets?: boolean;
}

export interface ResumeHeaderSettings {
  alignment: 'left' | 'center';
  showIcons: boolean;
  contactSpacing: number; // 12 to 24 px
  nameTransform: 'none' | 'uppercase';
}

export interface ResumeTemplateConfig {
  typography: ResumeTypography;
  colors: ResumeColors;
  layout: ResumeLayout;
  headerSettings: ResumeHeaderSettings;
}

export interface ResumeData {
  header: HeaderData;
  sections: ResumeSection[];
  config: ResumeTemplateConfig;
}
