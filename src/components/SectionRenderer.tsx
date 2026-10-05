import React from 'react';
import { ResumeSection, ResumeTemplateConfig, ColumnTarget } from '../types/resume';
import { SectionHeader } from './SectionHeader';
import { EditableText } from './EditableText';
import { ExperienceSection } from './sections/ExperienceSection';
import { ProjectsSection } from './sections/ProjectsSection';
import { EducationSection } from './sections/EducationSection';
import { SkillsSection } from './sections/SkillsSection';
import { LanguagesSection } from './sections/LanguagesSection';
import { CertificationsSection } from './sections/CertificationsSection';
import { CustomSection } from './sections/CustomSection';

interface SectionRendererProps {
  section: ResumeSection;
  column: ColumnTarget;
  config: ResumeTemplateConfig;
  isEditing: boolean;
  canMoveUp: boolean;
  canMoveDown: boolean;
  onUpdateSection: (updated: Partial<ResumeSection>) => void;
  onMoveUp: () => void;
  onMoveDown: () => void;
  onToggleColumn: () => void;
  onDeleteSection: () => void;
}

export const SectionRenderer: React.FC<SectionRendererProps> = ({
  section,
  column,
  config,
  isEditing,
  canMoveUp,
  canMoveDown,
  onUpdateSection,
  onMoveUp,
  onMoveDown,
  onToggleColumn,
  onDeleteSection,
}) => {
  const { typography, colors, layout } = config;

  if (!section.visible && !isEditing) {
    return null;
  }

  return (
    <section
      className={`resume-section-avoid-break w-full ${!section.visible ? 'opacity-40 border border-dashed border-amber-300 p-2 rounded' : ''}`}
      style={{
        marginBottom: `${layout.sectionSpacing}px`,
      }}
    >
      <SectionHeader
        title={section.title}
        column={column}
        config={config}
        isEditing={isEditing}
        canMoveUp={canMoveUp}
        canMoveDown={canMoveDown}
        onUpdateTitle={(title) => onUpdateSection({ title })}
        onMoveUp={onMoveUp}
        onMoveDown={onMoveDown}
        onToggleColumn={onToggleColumn}
        onDelete={onDeleteSection}
      />

      {/* Section Content based on Section Type */}
      <div className="w-full">
        {section.type === 'summary' && (
          <div
            className="font-normal"
            style={{
              fontSize: `${typography.bodySize}px`,
              lineHeight:
                typography.lineHeight === 'relaxed'
                  ? '1.6'
                  : typography.lineHeight === 'tight'
                  ? '1.35'
                  : '1.5',
              color: colors.primaryText,
            }}
          >
            <EditableText
              multiline
              isEditing={isEditing}
              value={section.summaryText || ''}
              onChange={(summaryText) => onUpdateSection({ summaryText })}
              placeholder="[Write your summary or profile narrative here...]"
              className="block leading-relaxed"
            />
          </div>
        )}

        {section.type === 'experience' && (
          <ExperienceSection
            entries={section.experienceEntries || []}
            config={config}
            isEditing={isEditing}
            onUpdateEntries={(experienceEntries) =>
              onUpdateSection({ experienceEntries })
            }
          />
        )}

        {section.type === 'projects' && (
          <ProjectsSection
            entries={section.projectEntries || []}
            config={config}
            isEditing={isEditing}
            onUpdateEntries={(projectEntries) =>
              onUpdateSection({ projectEntries })
            }
          />
        )}

        {section.type === 'education' && (
          <EducationSection
            entries={section.educationEntries || []}
            config={config}
            isEditing={isEditing}
            onUpdateEntries={(educationEntries) =>
              onUpdateSection({ educationEntries })
            }
          />
        )}

        {section.type === 'skills' && (
          <SkillsSection
            groups={section.skillGroups || []}
            config={config}
            isEditing={isEditing}
            onUpdateGroups={(skillGroups) => onUpdateSection({ skillGroups })}
          />
        )}

        {section.type === 'languages' && (
          <LanguagesSection
            entries={section.languageEntries || []}
            config={config}
            isEditing={isEditing}
            onUpdateEntries={(languageEntries) =>
              onUpdateSection({ languageEntries })
            }
          />
        )}

        {section.type === 'certifications' && (
          <CertificationsSection
            entries={section.certificationEntries || []}
            config={config}
            isEditing={isEditing}
            onUpdateEntries={(certificationEntries) =>
              onUpdateSection({ certificationEntries })
            }
          />
        )}

        {section.type === 'custom' && (
          <CustomSection
            entries={section.customEntries || []}
            config={config}
            isEditing={isEditing}
            onUpdateEntries={(customEntries) =>
              onUpdateSection({ customEntries })
            }
          />
        )}
      </div>
    </section>
  );
};
