import React from 'react';
import { LanguageEntry, ResumeTemplateConfig } from '../../types/resume';
import { EditableText } from '../EditableText';
import { Plus, Trash2, ChevronUp, ChevronDown } from 'lucide-react';

interface LanguagesSectionProps {
  entries: LanguageEntry[];
  config: ResumeTemplateConfig;
  isEditing: boolean;
  onUpdateEntries: (entries: LanguageEntry[]) => void;
}

export const LanguagesSection: React.FC<LanguagesSectionProps> = ({
  entries,
  config,
  isEditing,
  onUpdateEntries,
}) => {
  const { typography, colors, layout } = config;

  const updateEntry = (index: number, updated: Partial<LanguageEntry>) => {
    const next = [...entries];
    next[index] = { ...next[index], ...updated };
    onUpdateEntries(next);
  };

  const deleteEntry = (index: number) => {
    onUpdateEntries(entries.filter((_, i) => i !== index));
  };

  const moveEntry = (index: number, direction: 'up' | 'down') => {
    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= entries.length) return;
    const next = [...entries];
    const [moved] = next.splice(index, 1);
    next.splice(targetIndex, 0, moved);
    onUpdateEntries(next);
  };

  const toggleLevel = (index: number, newLevel: number) => {
    const current = entries[index].level;
    updateEntry(index, { level: current === newLevel ? 0 : newLevel });
  };

  return (
    <div
      className="flex flex-col"
      style={{ gap: `${layout.entrySpacing - 4}px` }}
    >
      {entries.map((entry, index) => (
        <div
          key={entry.id}
          className="group/lang relative flex items-center justify-between gap-2 resume-entry-avoid-break"
          style={{ fontSize: `${typography.bodySize}px` }}
        >
          {/* Edit controls */}
          {isEditing && (
            <div className="absolute -top-3 right-0 opacity-0 group-hover/lang:opacity-100 transition-opacity flex items-center gap-1 bg-white/95 px-1 py-0.5 rounded shadow-xs border border-slate-200 text-slate-500 z-10 no-print">
              {index > 0 && (
                <button
                  type="button"
                  onClick={() => moveEntry(index, 'up')}
                  title="Move up"
                  className="p-0.5 hover:text-slate-900 rounded"
                >
                  <ChevronUp size={10} />
                </button>
              )}
              {index < entries.length - 1 && (
                <button
                  type="button"
                  onClick={() => moveEntry(index, 'down')}
                  title="Move down"
                  className="p-0.5 hover:text-slate-900 rounded"
                >
                  <ChevronDown size={10} />
                </button>
              )}
              <button
                type="button"
                onClick={() => deleteEntry(index)}
                title="Delete language"
                className="p-0.5 hover:text-red-600 rounded"
              >
                <Trash2 size={10} />
              </button>
            </div>
          )}

          {/* Language Name */}
          <div className="font-medium" style={{ color: colors.primaryText }}>
            <EditableText
              isEditing={isEditing}
              value={entry.language}
              onChange={(language) => updateEntry(index, { language })}
              placeholder="[Language]"
            />
          </div>

          {/* Proficiency / Subtle Rating */}
          <div className="flex items-center gap-2">
            <span
              className="text-right"
              style={{
                fontSize: `${typography.metadataSize}px`,
                color: colors.secondaryText,
              }}
            >
              <EditableText
                isEditing={isEditing}
                value={entry.proficiency}
                onChange={(proficiency) => updateEntry(index, { proficiency })}
                placeholder="[Proficiency]"
              />
            </span>

            {/* Subtle 5-dot rating indicator */}
            {typeof entry.level === 'number' && entry.level > 0 && (
              <div className="flex items-center gap-1" title={`${entry.level}/5`}>
                {[1, 2, 3, 4, 5].map((lvl) => (
                  <button
                    key={lvl}
                    type="button"
                    disabled={!isEditing}
                    onClick={() => isEditing && toggleLevel(index, lvl)}
                    className={`rounded-full transition-all ${
                      isEditing ? 'cursor-pointer hover:scale-125' : 'cursor-default'
                    }`}
                    style={{
                      width: '5px',
                      height: '5px',
                      backgroundColor:
                        lvl <= (entry.level || 0)
                          ? colors.accentColor
                          : colors.dividerColor,
                    }}
                    aria-label={`Level ${lvl}`}
                  />
                ))}
              </div>
            )}
          </div>
        </div>
      ))}

      {isEditing && (
        <button
          type="button"
          onClick={() => {
            const newLang: LanguageEntry = {
              id: `lang-${Date.now()}`,
              language: '[New Language]',
              proficiency: 'Fluent',
              level: 4,
            };
            onUpdateEntries([...entries, newLang]);
          }}
          className="flex items-center justify-center gap-1.5 py-1 px-2 border border-dashed border-slate-300 rounded text-xs text-slate-500 hover:text-blue-600 hover:border-blue-400 hover:bg-blue-50/20 transition-colors no-print"
        >
          <Plus size={11} /> Add Language
        </button>
      )}
    </div>
  );
};
