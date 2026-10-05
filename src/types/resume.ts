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

export type FieldKey =
  | 'title'
  | 'subtitle'
  | 'date'
  | 'location'
  | 'grade'
  | 'link'
  | 'description'
  | 'bullets'
  | 'proficiency'
  | 'level'
  | 'skills';

export interface SectionFieldConfig {
  showTitle?: boolean;
  showSubtitle?: boolean; // Company / Institution / Technologies / Issuer / Organization
  showDate?: boolean;
  showLocation?: boolean;
  showGrade?: boolean; // GPA / Honors / Distinction / Level
  showLink?: boolean;
  showDescription?: boolean;
  showBullets?: boolean;
  showProficiency?: boolean; // for languages or skills
}

export interface EntryItem {
  id: string;
  title?: string;
  subtitle?: string; // Company / Organization / Institution / Technologies / Issuer
  date?: string;
  location?: string;
  grade?: string; // GPA / Honors / Achievement / Distinction
  link?: string;
  description?: string;
  bullets?: string[];
  skills?: string; // For skill groups: "Skill 1 · Skill 2 · Skill 3"
  proficiency?: string; // For languages: "Native", "Fluent"
  level?: number; // 1-5 rating indicator
  proficiencyStyle?: 'text' | 'dots' | 'tags';
  // Per-entry field configuration overrides:
  enabledFields?: FieldKey[]; // Explicitly enabled for this entry
  disabledFields?: FieldKey[]; // Explicitly disabled for this entry
}

// Backward-compatibility type aliases
export type ExperienceEntry = EntryItem;
export type ProjectEntry = EntryItem;
export type EducationEntry = EntryItem;
export type SkillGroup = EntryItem;
export type LanguageEntry = EntryItem;
export type CertificationEntry = EntryItem;
export type CustomEntry = EntryItem;

export interface HeaderData {
  name: string;
  title: string;
  phone: string;
  email: string;
  linkedin: string;
  website: string;
  location: string;
}

export interface ResumeSection {
  id: string;
  type: SectionType;
  title: string;
  column: ColumnTarget;
  visible: boolean;
  fieldConfig?: SectionFieldConfig;
  entries?: EntryItem[];
  summaryText?: string;
  // Legacy backward-compatibility fields:
  experienceEntries?: any[];
  projectEntries?: any[];
  educationEntries?: any[];
  skillGroups?: any[];
  languageEntries?: any[];
  certificationEntries?: any[];
  customEntries?: any[];
}

export interface ResumeTypography {
  fontFamily: 'Plus Jakarta Sans' | 'Inter' | 'Outfit' | 'DM Sans' | 'Source Serif 4';
  nameSize: number; // 24 to 40 px
  nameWeight: 'font-semibold' | 'font-bold' | 'font-extrabold';
  headingSize: number; // 12 to 16 px
  bodySize: number; // 11 to 14 px
  metadataSize: number; // 10 to 12 px
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
