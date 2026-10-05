import React, { useState } from 'react';
import {
  ResumeSection,
  ResumeTemplateConfig,
  ColumnTarget,
  EntryItem,
} from '../types/resume';
import { SectionHeader } from './SectionHeader';
import { SectionSettingsModal } from './SectionSettingsModal';
import { DynamicEntryRenderer } from './DynamicEntryRenderer';
import { EditableText } from './EditableText';
import { hasVisibleContent } from '../utils/migration';
import { Plus } from 'lucide-react';

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
  dragHandleProps?: {
    draggable?: boolean;
    onDragStart?: (e: React.DragEvent) => void;
    onDragOver?: (e: React.DragEvent) => void;
    onDrop?: (e: React.DragEvent) => void;
    onDragEnd?: () => void;
  };
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
  dragHandleProps,
}) => {
  const { typography, colors, layout } = config;
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [draggedEntryIndex, setDraggedEntryIndex] = useState<number | null>(null);

  // Hidden section handling:
  if (!section.visible && !isEditing) {
    return null;
  }

  // Empty section handling in preview/print:
  if (!isEditing && !hasVisibleContent(section)) {
    return null;
  }

  const entries = section.entries || [];

  const handleUpdateEntry = (index: number, updated: Partial<EntryItem>) => {
    const next = [...entries];
    next[index] = { ...next[index], ...updated };
    onUpdateSection({ entries: next });
  };

  const handleDeleteEntry = (index: number) => {
    const next = entries.filter((_, i) => i !== index);
    onUpdateSection({ entries: next });
  };

  const handleDuplicateEntry = (index: number) => {
    const itemToClone = entries[index];
    const cloned: EntryItem = {
      ...itemToClone,
      id: `entry-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
      bullets: itemToClone.bullets ? [...itemToClone.bullets] : [],
    };
    const next = [...entries];
    next.splice(index + 1, 0, cloned);
    onUpdateSection({ entries: next });
  };

  const handleMoveEntry = (index: number, direction: 'up' | 'down') => {
    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= entries.length) return;
    const next = [...entries];
    const [moved] = next.splice(index, 1);
    next.splice(targetIndex, 0, moved);
    onUpdateSection({ entries: next });
  };

  // Add new entry with default fields
  const handleAddNewEntry = () => {
    const timestamp = Date.now();
    let newEntry: EntryItem = {
      id: `entry-${timestamp}`,
      title: '[New Title / Role]',
    };

    switch (section.type) {
      case 'experience':
        newEntry = {
          id: `exp-${timestamp}`,
          title: '[Job Title / Role]',
          subtitle: '[Company Name]',
          date: '2023 – Present',
          location: '[City, Country]',
          description: '[Summary overview of scope and key responsibilities]',
          bullets: [
            '[Action verb] [key project or achievement] resulting in [quantifiable outcome or metric].',
          ],
        };
        break;
      case 'projects':
        newEntry = {
          id: `proj-${timestamp}`,
          title: '[Project Name]',
          subtitle: '[Technologies: React · TypeScript · Node.js]',
          date: '2024',
          link: 'github.com/project',
          bullets: [
            'Designed and developed [solution] delivering [benefit/performance].',
          ],
        };
        break;
      case 'education':
        newEntry = {
          id: `edu-${timestamp}`,
          title: '[Degree / Program Name]',
          subtitle: '[University / Institution]',
          date: '2019 – 2023',
          grade: 'GPA: 3.8 / 4.0',
        };
        break;
      case 'skills':
        newEntry = {
          id: `sg-${timestamp}`,
          title: '[NEW SKILL GROUP]',
          skills: '[Skill 1] · [Skill 2] · [Skill 3]',
        };
        break;
      case 'certifications':
        newEntry = {
          id: `cert-${timestamp}`,
          title: '[Certification Name]',
          subtitle: '[Issuing Authority]',
          date: '2024',
          grade: 'Certified',
        };
        break;
      case 'languages':
        newEntry = {
          id: `lang-${timestamp}`,
          title: '[Language Name]',
          subtitle: 'Fluent',
          proficiency: 'Fluent',
          level: 4,
        };
        break;
      case 'custom':
      default:
        newEntry = {
          id: `custom-${timestamp}`,
          title: '[Achievement / Item Title]',
          subtitle: '[Organization / Context]',
          date: '2023',
          description: '[Description of achievement, award, or contribution]',
          bullets: ['[Detail outcome or recognition]'],
        };
        break;
    }

    onUpdateSection({ entries: [...entries, newEntry] });
  };

  // Drag and drop for entries within section
  const handleEntryDragStart = (idx: number) => {
    setDraggedEntryIndex(idx);
  };

  const handleEntryDrop = (targetIdx: number) => {
    if (draggedEntryIndex === null || draggedEntryIndex === targetIdx) return;
    const next = [...entries];
    const [moved] = next.splice(draggedEntryIndex, 1);
    next.splice(targetIdx, 0, moved);
    onUpdateSection({ entries: next });
    setDraggedEntryIndex(null);
  };

  return (
    <section
      className={`resume-section-avoid-break w-full ${
        !section.visible ? 'opacity-40 border border-dashed border-amber-300 p-2 rounded' : ''
      }`}
      style={{
        marginBottom: `${layout.sectionSpacing}px`,
      }}
    >
      {/* Section Header */}
      <SectionHeader
        title={section.title}
        column={column}
        config={config}
        isEditing={isEditing}
        canMoveUp={canMoveUp}
        canMoveDown={canMoveDown}
        onUpdateTitle={(title) => onUpdateSection({ title })}
        onOpenSettings={() => setIsSettingsOpen(true)}
        onMoveUp={onMoveUp}
        onMoveDown={onMoveDown}
        onToggleColumn={onToggleColumn}
        onDelete={onDeleteSection}
        onAddItem={section.type !== 'summary' ? handleAddNewEntry : undefined}
        dragHandleProps={dragHandleProps}
      />

      {/* Section Settings Modal */}
      <SectionSettingsModal
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
        section={section}
        onUpdateSection={onUpdateSection}
        onDeleteSection={onDeleteSection}
        onToggleColumn={onToggleColumn}
      />

      {/* Content Area */}
      <div className="w-full">
        {/* SUMMARY / PROFILE SECTION */}
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
              richText
              isEditing={isEditing}
              value={section.summaryText || ''}
              onChange={(summaryText) => onUpdateSection({ summaryText })}
              placeholder="[Write your summary or profile narrative here...]"
              className="block leading-relaxed"
            />
          </div>
        )}

        {/* ALL STRUCTURED & CUSTOM SECTIONS */}
        {section.type !== 'summary' && (
          <div
            className="flex flex-col"
            style={{ gap: `${layout.entrySpacing}px` }}
          >
            {entries.map((entry, idx) => (
              <DynamicEntryRenderer
                key={entry.id}
                entry={entry}
                index={idx}
                totalEntries={entries.length}
                section={section}
                config={config}
                isEditing={isEditing}
                onUpdateEntry={(updated) => handleUpdateEntry(idx, updated)}
                onDeleteEntry={() => handleDeleteEntry(idx)}
                onDuplicateEntry={() => handleDuplicateEntry(idx)}
                onMoveEntry={(dir) => handleMoveEntry(idx, dir)}
                onDragStart={() => handleEntryDragStart(idx)}
                onDragOver={(e) => e.preventDefault()}
                onDrop={() => handleEntryDrop(idx)}
              />
            ))}

            {/* Quick Add Entry in Edit Mode */}
            {isEditing && (
              <button
                type="button"
                onClick={handleAddNewEntry}
                className="flex items-center justify-center gap-1.5 py-1.5 px-3 border border-dashed border-slate-300 rounded text-xs text-slate-500 hover:text-blue-600 hover:border-blue-400 hover:bg-blue-50/20 transition-colors no-print"
              >
                <Plus size={12} /> Add {section.title.toLowerCase().replace(/^\w/, (c) => c.toUpperCase())} Item
              </button>
            )}
          </div>
        )}
      </div>
    </section>
  );
};
