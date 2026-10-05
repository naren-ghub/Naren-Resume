import { ResumeData } from '../types/resume';

export const initialResumeData: ResumeData = {
  header: {
    name: 'YOUR NAME',
    title: 'Professional Title / Headline',
    phone: '+1 (555) 000-0000',
    email: 'your.email@example.com',
    linkedin: 'linkedin.com/in/your-profile',
    website: '',
    location: 'City, Country',
  },
  config: {
    typography: {
      fontFamily: 'Plus Jakarta Sans',
      nameSize: 32,
      nameWeight: 'font-bold',
      headingSize: 13,
      bodySize: 13,
      metadataSize: 11,
      letterSpacing: 'wide',
      lineHeight: 'normal',
    },
    colors: {
      primaryText: '#0f172a',
      secondaryText: '#64748b',
      accentColor: '#1d4ed8', // Enhancv classic royal sapphire
      dividerColor: '#e2e8f0',
      headingDividerColor: 'accent',
      sidebarBackground: 'transparent',
    },
    layout: {
      mainColumnRatio: 68,
      columnGap: 20,
      pageMargin: '12mm', // 12mm compact margin
      sectionSpacing: 14,
      entrySpacing: 10,
      showVerticalDivider: true,
      compactBullets: false,
    },
    headerSettings: {
      alignment: 'left',
      showIcons: true,
      contactSpacing: 16,
      nameTransform: 'none',
    },
  },
  sections: [
    {
      id: 'section-summary',
      type: 'summary',
      title: 'SUMMARY',
      column: 'main',
      visible: true,
      summaryText:
        '[A concise 2–3 sentence overview summarizing your professional expertise, high-impact background, and core technical or business competencies. Replace this placeholder with your own executive summary or profile statement.]',
    },
    {
      id: 'section-experience',
      type: 'experience',
      title: 'EXPERIENCE',
      column: 'main',
      visible: true,
      experienceEntries: [
        {
          id: 'exp-1',
          title: '[Job Title / Senior Position]',
          company: '[Company / Organization Name]',
          date: '01/2022 – Present',
          location: '[City, Country / Remote]',
          bullets: [
            '[Action verb] [key initiative or system architecture] delivering [quantifiable metric or high-value business result].',
            'Led cross-functional engineering team of [X] members to design and deploy [core solution] on schedule.',
            'Streamlined [operational process or tech stack], reducing latency by [X%] and saving [$X] annually.',
          ],
        },
        {
          id: 'exp-2',
          title: '[Previous Role / Mid-Level Position]',
          company: '[Previous Company Name]',
          date: '06/2019 – 12/2021',
          location: '[City, Country]',
          bullets: [
            'Spearheaded development of [flagship product or service], driving [X%] increase in user engagement.',
            'Architected scalable backend APIs and automated CI/CD pipelines, boosting deployment velocity by [X%].',
          ],
        },
      ],
    },
    {
      id: 'section-projects',
      type: 'projects',
      title: 'PROJECTS',
      column: 'main',
      visible: true,
      projectEntries: [
        {
          id: 'proj-1',
          name: '[Key Project / Application Name]',
          technologies: '[Technologies: Python · TypeScript · React · Cloud Architecture]',
          date: '2023',
          link: 'github.com/your-username/project',
          bullets: [
            'Designed and launched [key open-source or proprietary tool] serving [X,000+ active users or requests].',
            'Implemented [state-of-the-art technique or pipeline], accelerating throughput by [X%].',
          ],
        },
        {
          id: 'proj-2',
          name: '[Second Project Name]',
          technologies: '[Technologies: PyTorch · Docker · Next.js · PostgreSQL]',
          date: '2022',
          bullets: [
            'Built an end-to-end [analytical model or platform] delivering real-time predictions with [X%] accuracy.',
          ],
        },
      ],
    },
    {
      id: 'section-education',
      type: 'education',
      title: 'EDUCATION',
      column: 'sidebar',
      visible: true,
      educationEntries: [
        {
          id: 'edu-1',
          degree: '[Degree Name, e.g. B.S. in Computer Science]',
          institution: '[University / College Name]',
          date: '2015 – 2019',
          grade: 'GPA: [3.8 / 4.0] · [Honors / Cum Laude]',
          details: '[Relevant Coursework or Thesis Topic]',
        },
      ],
    },
    {
      id: 'section-skills',
      type: 'skills',
      title: 'SKILLS',
      column: 'sidebar',
      visible: true,
      skillGroups: [
        {
          id: 'sg-1',
          category: '[CORE DOMAIN / AI & ML]',
          skills: '[Skill 1] · [Skill 2] · [Skill 3] · [Skill 4]',
          proficiencyStyle: 'text',
        },
        {
          id: 'sg-2',
          category: '[FRAMEWORKS & LIBRARIES]',
          skills: '[Framework A] · [Tool B] · [Library C]',
          proficiencyStyle: 'text',
        },
        {
          id: 'sg-3',
          category: '[PLATFORMS & TOOLS]',
          skills: '[Git / GitHub] · [Docker] · [AWS / GCP] · [Linux]',
          proficiencyStyle: 'text',
        },
      ],
    },
    {
      id: 'section-certifications',
      type: 'certifications',
      title: 'CERTIFICATIONS',
      column: 'sidebar',
      visible: true,
      certificationEntries: [
        {
          id: 'cert-1',
          name: '[Professional Certification Name]',
          issuer: '[Issuing Authority / Cloud Provider]',
          date: '2023',
          achievement: '[Certified / Distinction]',
          description: '[Credential ID or specialization details]',
        },
      ],
    },
    {
      id: 'section-languages',
      type: 'languages',
      title: 'LANGUAGES',
      column: 'sidebar',
      visible: true,
      languageEntries: [
        {
          id: 'lang-1',
          language: '[Language 1]',
          proficiency: 'Native / Bilingual',
          level: 5,
        },
        {
          id: 'lang-2',
          language: '[Language 2]',
          proficiency: 'Professional Working',
          level: 4,
        },
      ],
    },
  ],
};
