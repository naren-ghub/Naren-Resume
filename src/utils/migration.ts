import {
  ResumeData,
  ResumeSection,
  EntryItem,
  SectionFieldConfig,
  FieldKey,
  SectionType,
} from '../types/resume';

export const getDefaultFieldConfig = (type: SectionType): SectionFieldConfig => {
  switch (type) {
    case 'experience':
      return {
        showTitle: true,
        showSubtitle: true, // Company
        showDate: true,
        showLocation: true,
        showDescription: true,
        showBullets: true,
        showLink: false,
      };
    case 'projects':
      return {
        showTitle: true,
        showSubtitle: true, // Technologies
        showDate: true,
        showLocation: false,
        showLink: true,
        showDescription: true,
        showBullets: true,
      };
    case 'education':
      return {
        showTitle: true,
        showSubtitle: true, // Institution
        showDate: true,
        showGrade: true,
        showLocation: false,
        showDescription: true,
        showBullets: false,
      };
    case 'certifications':
      return {
        showTitle: true,
        showSubtitle: true, // Issuer
        showDate: true,
        showGrade: true, // Achievement
        showDescription: true,
        showLink: false,
      };
    case 'languages':
      return {
        showTitle: true,
        showSubtitle: true, // Proficiency
        showProficiency: false,
        showDescription: true,
      };
    case 'skills':
      return {
        showTitle: true, // Category
        showSubtitle: false,
        showProficiency: false,
        showDescription: true,
      };
    case 'custom':
    default:
      return {
        showTitle: true,
        showSubtitle: true,
        showDate: true,
        showLocation: false,
        showLink: false,
        showDescription: true,
        showBullets: true,
      };
  }
};

/**
 * Normalizes any legacy or modern section to have a consistent `entries` array and `fieldConfig`.
 */
export const normalizeSection = (section: any): ResumeSection => {
  const type: SectionType = section.type || 'custom';
  const fieldConfig: SectionFieldConfig = {
    ...getDefaultFieldConfig(type),
    ...(section.fieldConfig || {}),
  };

  let entries: EntryItem[] = [];

  if (Array.isArray(section.entries) && section.entries.length > 0) {
    entries = section.entries.map((e: any, idx: number) => {
      const skillsRaw = e.skills ?? '';
      const skillsList = Array.isArray(e.skillsList)
        ? e.skillsList
        : skillsRaw
        ? skillsRaw
            .split(/[\n,·]+/)
            .map((s: string) => s.trim())
            .filter(Boolean)
        : [];

      return {
        id: e.id || `entry-${Date.now()}-${idx}`,
        title: e.title ?? e.name ?? e.degree ?? e.category ?? e.language ?? '',
        subtitle:
          e.subtitle ??
          e.company ??
          e.technologies ??
          e.institution ??
          e.issuer ??
          e.proficiency ??
          '',
        date: e.date ?? '',
        dateRange: e.dateRange,
        location: e.location ?? '',
        grade: e.grade ?? e.achievement ?? '',
        link: e.link ?? '',
        linkLabel: e.linkLabel ?? '',
        description: e.description ?? e.details ?? '',
        bullets: Array.isArray(e.bullets) ? e.bullets : [],
        skills: skillsRaw || skillsList.join(' · '),
        skillsList,
        proficiency: e.proficiency ?? '',
        level: e.level ?? (type === 'languages' ? 5 : undefined),
        proficiencyStyle: e.proficiencyStyle ?? 'text',
        enabledFields: Array.isArray(e.enabledFields) ? e.enabledFields : [],
        disabledFields: Array.isArray(e.disabledFields) ? e.disabledFields : [],
      };
    });
  } else if (Array.isArray(section.experienceEntries)) {
    entries = section.experienceEntries.map((e: any) => ({
      id: e.id || `exp-${Date.now()}`,
      title: e.title || '',
      subtitle: e.company || '',
      date: e.date || '',
      location: e.location || '',
      description: e.description || '',
      bullets: Array.isArray(e.bullets) ? e.bullets : [],
    }));
  } else if (Array.isArray(section.projectEntries)) {
    entries = section.projectEntries.map((e: any) => ({
      id: e.id || `proj-${Date.now()}`,
      title: e.name || '',
      subtitle: e.technologies || '',
      date: e.date || '',
      link: e.link || '',
      description: e.description || '',
      bullets: Array.isArray(e.bullets) ? e.bullets : [],
    }));
  } else if (Array.isArray(section.educationEntries)) {
    entries = section.educationEntries.map((e: any) => ({
      id: e.id || `edu-${Date.now()}`,
      title: e.degree || '',
      subtitle: e.institution || '',
      date: e.date || '',
      grade: e.grade || '',
      description: e.details || '',
      bullets: [],
    }));
  } else if (Array.isArray(section.skillGroups)) {
    entries = section.skillGroups.map((e: any) => ({
      id: e.id || `sg-${Date.now()}`,
      title: e.category || '',
      skills: e.skills || '',
      proficiencyStyle: e.proficiencyStyle || 'text',
      bullets: [],
    }));
  } else if (Array.isArray(section.languageEntries)) {
    entries = section.languageEntries.map((e: any) => ({
      id: e.id || `lang-${Date.now()}`,
      title: e.language || '',
      subtitle: e.proficiency || '',
      proficiency: e.proficiency || '',
      level: e.level ?? 5,
      bullets: [],
    }));
  } else if (Array.isArray(section.certificationEntries)) {
    entries = section.certificationEntries.map((e: any) => ({
      id: e.id || `cert-${Date.now()}`,
      title: e.name || '',
      subtitle: e.issuer || '',
      date: e.date || '',
      grade: e.achievement || '',
      description: e.description || '',
      bullets: [],
    }));
  } else if (Array.isArray(section.customEntries)) {
    entries = section.customEntries.map((e: any) => ({
      id: e.id || `custom-${Date.now()}`,
      title: e.title || '',
      subtitle: e.subtitle || '',
      date: e.date || '',
      location: e.location || '',
      description: e.description || '',
      bullets: Array.isArray(e.bullets) ? e.bullets : [],
    }));
  }

  return {
    id: section.id || `sec-${Date.now()}`,
    type,
    title: section.title || (type === 'custom' ? 'ACHIEVEMENTS' : type.toUpperCase()),
    column: section.column || 'main',
    visible: section.visible !== false,
    fieldConfig,
    entries,
    summaryText: section.summaryText || '',
  };
};

/**
 * Checks whether a given field is active and visible for a specific entry within a section.
 */
export const isFieldActiveForEntry = (
  section: ResumeSection,
  entry: EntryItem,
  field: FieldKey
): boolean => {
  // 1. Entry-level overrides have highest precedence
  if (entry.disabledFields?.includes(field)) {
    return false;
  }
  if (entry.enabledFields?.includes(field)) {
    return true;
  }

  // 2. Section-level configuration
  const config = section.fieldConfig || getDefaultFieldConfig(section.type);

  switch (field) {
    case 'title':
      return config.showTitle !== false;
    case 'subtitle':
      return config.showSubtitle !== false;
    case 'date':
      return config.showDate !== false;
    case 'location':
      return config.showLocation !== false;
    case 'grade':
      return config.showGrade !== false;
    case 'link':
      return config.showLink !== false;
    case 'description':
      return config.showDescription !== false;
    case 'bullets':
      return config.showBullets !== false;
    case 'level':
    case 'proficiency':
      return config.showProficiency !== false;
    case 'skills':
      return true;
    default:
      return true;
  }
};

/**
 * Checks if a section has any visible, renderable content in preview/print mode.
 */
export const hasVisibleContent = (section: ResumeSection): boolean => {
  if (section.type === 'summary') {
    return Boolean(section.summaryText?.trim());
  }

  if (!section.entries || section.entries.length === 0) {
    return false;
  }

  // Check if at least one entry has at least one active non-empty field
  return section.entries.some((entry) => {
    if (section.type === 'skills') {
      return Boolean(entry.title?.trim() || entry.skills?.trim());
    }

    const hasTitle = isFieldActiveForEntry(section, entry, 'title') && Boolean(entry.title?.trim());
    const hasSubtitle = isFieldActiveForEntry(section, entry, 'subtitle') && Boolean(entry.subtitle?.trim());
    const hasDate = isFieldActiveForEntry(section, entry, 'date') && Boolean(entry.date?.trim());
    const hasLocation = isFieldActiveForEntry(section, entry, 'location') && Boolean(entry.location?.trim());
    const hasGrade = isFieldActiveForEntry(section, entry, 'grade') && Boolean(entry.grade?.trim());
    const hasLink = isFieldActiveForEntry(section, entry, 'link') && Boolean(entry.link?.trim());
    const hasDesc = isFieldActiveForEntry(section, entry, 'description') && Boolean(entry.description?.trim());
    const hasBullets = isFieldActiveForEntry(section, entry, 'bullets') && Boolean(entry.bullets && entry.bullets.some((b) => b.trim()));

    return hasTitle || hasSubtitle || hasDate || hasLocation || hasGrade || hasLink || hasDesc || hasBullets;
  });
};

/**
 * Migrates and normalizes the entire ResumeData object.
 */
export const migrateResumeData = (data: any): ResumeData => {
  if (!data) return data;

  const sections = Array.isArray(data.sections)
    ? data.sections.map(normalizeSection)
    : [];

  return {
    ...data,
    header: {
      ...data.header,
      website: '', // Ensure portfolio is removed
    },
    config: {
      ...data.config,
      colors: {
        ...data.config?.colors,
        accentColor:
          data.config?.colors?.accentColor &&
          !['#000', '#000000', '#0f172a', '#1e293b', '#334155'].includes(
            String(data.config.colors.accentColor).toLowerCase()
          )
            ? data.config.colors.accentColor
            : '#1d4ed8',
      },
      typography: {
        ...data.config?.typography,
        companySizeSameAsRole: data.config?.typography?.companySizeSameAsRole !== false,
      },
      layout: {
        ...data.config?.layout,
        pageMargin: data.config?.layout?.pageMargin || '12mm',
      },
    },
    sections,
  };
};
