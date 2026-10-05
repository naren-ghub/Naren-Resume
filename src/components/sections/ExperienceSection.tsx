import React from 'react';
import { ExperienceEntry, ResumeTemplateConfig } from '../../types/resume';
import { EditableText } from '../EditableText';
import { Plus, Trash2, Copy, ChevronUp, ChevronDown, MapPin, Calendar } from 'lucide-react';

interface ExperienceSectionProps {
  entries: ExperienceEntry[];
  config: ResumeTemplateConfig;
  isEditing: boolean;
  onUpdateEntries: (entries: ExperienceEntry[]) => void;
}

export const ExperienceSection: React.FC<ExperienceSectionProps> = ({
  entries,
  config,
  isEditing,
  onUpdateEntries,
}) => {
  const { typography, colors, layout } = config;

  const updateEntry = (index: number, updated: Partial<ExperienceEntry>) => {
    const next = [...entries];
    next[index] = { ...next[index], ...updated };
    onUpdateEntries(next);
  };

  const deleteEntry = (index: number) => {
    onUpdateEntries(entries.filter((_, i) => i !== index));
  };

  const duplicateEntry = (index: number) => {
    const itemToClone = entries[index];
    const cloned: ExperienceEntry = {
      ...itemToClone,
      id: `exp-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
      title: `${itemToClone.title}`,
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

  const addBullet = (entryIndex: number) => {
    const entry = entries[entryIndex];
    updateEntry(entryIndex, {
      bullets: [...entry.bullets, '[New accomplishment, outcome, or technical contribution]'],
    });
  };

  const updateBullet = (entryIndex: number, bulletIndex: number, text: string) => {
    const entry = entries[entryIndex];
    const nextBullets = [...entry.bullets];
    nextBullets[bulletIndex] = text;
    updateEntry(entryIndex, { bullets: nextBullets });
  };

  const deleteBullet = (entryIndex: number, bulletIndex: number) => {
    const entry = entries[entryIndex];
    updateEntry(entryIndex, {
      bullets: entry.bullets.filter((_, bIdx) => bIdx !== bulletIndex),
    });
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
              <button
                type="button"
                onClick={() => addBullet(index)}
                title="Add bullet"
                className="p-1 hover:text-blue-600 hover:bg-slate-100 rounded text-xs flex items-center gap-0.5"
              >
                <Plus size={11} /> Bullet
              </button>
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
                title="Duplicate position"
                className="p-1 hover:text-slate-900 hover:bg-slate-100 rounded"
              >
                <Copy size={11} />
              </button>
              <button
                type="button"
                onClick={() => deleteEntry(index)}
                title="Delete position"
                className="p-1 hover:text-red-600 hover:bg-slate-100 rounded"
              >
                <Trash2 size={11} />
              </button>
            </div>
          )}

          {/* Job Title */}
          <div>
            <EditableText
              tag="h3"
              isEditing={isEditing}
              value={entry.title}
              onChange={(title) => updateEntry(index, { title })}
              placeholder="[Job Title]"
              className="font-bold tracking-tight block"
              style={{
                fontSize: `${typography.bodySize + 1}px`,
                color: colors.primaryText,
              }}
            />
          </div>

          {/* Company, Date & Location Line */}
          <div
            className="flex flex-wrap items-baseline justify-between gap-x-2 mt-0.5"
            style={{ fontSize: `${typography.metadataSize}px` }}
          >
            {/* Company Name */}
            <div className="font-semibold" style={{ color: colors.accentColor }}>
              <EditableText
                isEditing={isEditing}
                value={entry.company}
                onChange={(company) => updateEntry(index, { company })}
                placeholder="[Company Name]"
              />
            </div>

            {/* Date & Location */}
            <div
              className="flex items-center gap-2 shrink-0 font-normal"
              style={{ color: colors.secondaryText }}
            >
              {(entry.date || isEditing) && (
                <span className="flex items-center gap-1">
                  <Calendar size={10} className="shrink-0" aria-hidden="true" />
                  <EditableText
                    isEditing={isEditing}
                    value={entry.date}
                    onChange={(date) => updateEntry(index, { date })}
                    placeholder="[Dates]"
                  />
                </span>
              )}
              {entry.date && entry.location && <span>·</span>}
              {(entry.location || isEditing) && (
                <span className="flex items-center gap-1">
                  <MapPin size={10} className="shrink-0" aria-hidden="true" />
                  <EditableText
                    isEditing={isEditing}
                    value={entry.location}
                    onChange={(location) => updateEntry(index, { location })}
                    placeholder="[Location]"
                  />
                </span>
              )}
            </div>
          </div>

          {/* Bullets List */}
          {entry.bullets && entry.bullets.length > 0 && (
            <ul className={`mt-1 ${layout.compactBullets ? 'space-y-0.5' : 'space-y-1'}`}>
              {entry.bullets.map((bullet, bIdx) => (
                <li
                  key={bIdx}
                  className="group/bullet relative flex items-start gap-2"
                  style={{
                    fontSize: `${typography.bodySize}px`,
                    lineHeight:
                      typography.lineHeight === 'relaxed'
                        ? '1.6'
                        : typography.lineHeight === 'tight'
                        ? '1.3'
                        : '1.45',
                    color: colors.primaryText,
                  }}
                >
                  {/* Subtle bullet marker */}
                  <span
                    className="select-none mt-1.5 shrink-0 block rounded-full"
                    style={{
                      width: '4px',
                      height: '4px',
                      backgroundColor: colors.accentColor,
                    }}
                    aria-hidden="true"
                  />
                  <div className="flex-grow">
                    <EditableText
                      multiline
                      isEditing={isEditing}
                      value={bullet}
                      onChange={(text) => updateBullet(index, bIdx, text)}
                      placeholder="[Achievement / Responsibility]"
                      className="block"
                    />
                  </div>

                  {isEditing && (
                    <button
                      type="button"
                      onClick={() => deleteBullet(index, bIdx)}
                      title="Remove bullet"
                      className="opacity-0 group-hover/bullet:opacity-100 p-0.5 hover:text-red-600 transition-opacity shrink-0 no-print"
                    >
                      <Trash2 size={10} />
                    </button>
                  )}
                </li>
              ))}
            </ul>
          )}
        </article>
      ))}

      {/* Quick Add Entry in Edit Mode */}
      {isEditing && (
        <button
          type="button"
          onClick={() => {
            const newExp: ExperienceEntry = {
              id: `exp-${Date.now()}`,
              title: '[Job Title / Role]',
              company: '[Company Name]',
              date: '01/2023 – Present',
              location: '[City, Country]',
              bullets: [
                '[Action verb] [key project or achievement] resulting in [quantifiable outcome or metric].',
              ],
            };
            onUpdateEntries([...entries, newExp]);
          }}
          className="flex items-center justify-center gap-1.5 py-1.5 px-3 border border-dashed border-slate-300 rounded text-xs text-slate-500 hover:text-blue-600 hover:border-blue-400 hover:bg-blue-50/20 transition-colors no-print"
        >
          <Plus size={12} /> Add Experience Entry
        </button>
      )}
    </div>
  );
};
