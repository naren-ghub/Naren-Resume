import React from 'react';
import { EducationEntry, ResumeTemplateConfig } from '../../types/resume';
import { EditableText } from '../EditableText';
import { Plus, Trash2, Copy, ChevronUp, ChevronDown } from 'lucide-react';

interface EducationSectionProps {
  entries: EducationEntry[];
  config: ResumeTemplateConfig;
  isEditing: boolean;
  onUpdateEntries: (entries: EducationEntry[]) => void;
}

export const EducationSection: React.FC<EducationSectionProps> = ({
  entries,
  config,
  isEditing,
  onUpdateEntries,
}) => {
  const { typography, colors, layout } = config;

  const updateEntry = (index: number, updated: Partial<EducationEntry>) => {
    const next = [...entries];
    next[index] = { ...next[index], ...updated };
    onUpdateEntries(next);
  };

  const deleteEntry = (index: number) => {
    onUpdateEntries(entries.filter((_, i) => i !== index));
  };

  const duplicateEntry = (index: number) => {
    const itemToClone = entries[index];
    const cloned: EducationEntry = {
      ...itemToClone,
      id: `edu-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
    };
    const next = [...entries];
    next.splice(index + 1, 0, cloned);
    onUpdateEntries(next);
  };

  const moveEntry = (index: number, direction: 'up' | 'down') => {
    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= entries.length) return;
    const next = [...entries];
    const [moved] = next.splice(index, 1);
    next.splice(targetIndex, 0, moved);
    onUpdateEntries(next);
  };

  return (
    <div
      className="flex flex-col"
      style={{ gap: `${layout.entrySpacing}px` }}
    >
      {entries.map((entry, index) => (
        <article
          key={entry.id}
          className="group/entry relative resume-entry-avoid-break"
        >
          {/* Action Bar for Entry */}
          {isEditing && (
            <div className="absolute right-0 -top-2 opacity-0 group-hover/entry:opacity-100 transition-opacity flex items-center gap-1 bg-white/95 px-1 py-0.5 rounded shadow-xs border border-slate-200 text-slate-500 z-10 no-print">
              {index > 0 && (
                <button
                  type="button"
                  onClick={() => moveEntry(index, 'up')}
                  title="Move up"
                  className="p-1 hover:text-slate-900 hover:bg-slate-100 rounded"
                >
                  <ChevronUp size={11} />
                </button>
              )}
              {index < entries.length - 1 && (
                <button
                  type="button"
                  onClick={() => moveEntry(index, 'down')}
                  title="Move down"
                  className="p-1 hover:text-slate-900 hover:bg-slate-100 rounded"
                >
                  <ChevronDown size={11} />
                </button>
              )}
              <button
                type="button"
                onClick={() => duplicateEntry(index)}
                title="Duplicate entry"
                className="p-1 hover:text-slate-900 hover:bg-slate-100 rounded"
              >
                <Copy size={11} />
              </button>
              <button
                type="button"
                onClick={() => deleteEntry(index)}
                title="Delete entry"
                className="p-1 hover:text-red-600 hover:bg-slate-100 rounded"
              >
                <Trash2 size={11} />
              </button>
            </div>
          )}

          {/* Degree */}
          <div>
            <EditableText
              tag="h3"
              isEditing={isEditing}
              value={entry.degree}
              onChange={(degree) => updateEntry(index, { degree })}
              placeholder="[Degree / Program]"
              className="font-bold tracking-tight block"
              style={{
                fontSize: `${typography.bodySize}px`,
                color: colors.primaryText,
              }}
            />
          </div>

          {/* Institution in Accent Color */}
          <div
            className="font-medium mt-0.5"
            style={{
              fontSize: `${typography.metadataSize}px`,
              color: colors.accentColor,
            }}
          >
            <EditableText
              isEditing={isEditing}
              value={entry.institution}
              onChange={(institution) => updateEntry(index, { institution })}
              placeholder="[Institution Name]"
            />
          </div>

          {/* Dates & Grade Metadata */}
          <div
            className="flex items-center gap-2 mt-0.5"
            style={{
              fontSize: `${typography.metadataSize}px`,
              color: colors.secondaryText,
            }}
          >
            {(entry.date || isEditing) && (
              <EditableText
                isEditing={isEditing}
                value={entry.date}
                onChange={(date) => updateEntry(index, { date })}
                placeholder="[Date Range]"
              />
            )}
            {entry.date && entry.grade && <span>·</span>}
            {(entry.grade || isEditing) && (
              <EditableText
                isEditing={isEditing}
                value={entry.grade || ''}
                onChange={(grade) => updateEntry(index, { grade })}
                placeholder="[GPA / Honors]"
              />
            )}
          </div>

          {/* Optional Details */}
          {(entry.details || isEditing) && (
            <div
              className="mt-1 font-normal"
              style={{
                fontSize: `${typography.metadataSize}px`,
                color: colors.secondaryText,
              }}
            >
              <EditableText
                multiline
                isEditing={isEditing}
                value={entry.details || ''}
                onChange={(details) => updateEntry(index, { details })}
                placeholder="[Relevant Coursework or Project Details]"
                className="block"
              />
            </div>
          )}
        </article>
      ))}

      {isEditing && (
        <button
          type="button"
          onClick={() => {
            const newEdu: EducationEntry = {
              id: `edu-${Date.now()}`,
              degree: '[Degree Name, e.g. M.S. in Computer Science]',
              institution: '[University Name]',
              date: '2020 – 2022',
              grade: 'GPA: 3.9',
            };
            onUpdateEntries([...entries, newEdu]);
          }}
          className="flex items-center justify-center gap-1.5 py-1.5 px-3 border border-dashed border-slate-300 rounded text-xs text-slate-500 hover:text-blue-600 hover:border-blue-400 hover:bg-blue-50/20 transition-colors no-print"
        >
          <Plus size={12} /> Add Education Entry
        </button>
      )}
    </div>
  );
};
