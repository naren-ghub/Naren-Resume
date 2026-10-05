import React from 'react';
import { CertificationEntry, ResumeTemplateConfig } from '../../types/resume';
import { EditableText } from '../EditableText';
import { Plus, Trash2, Copy, ChevronUp, ChevronDown } from 'lucide-react';

interface CertificationsSectionProps {
  entries: CertificationEntry[];
  config: ResumeTemplateConfig;
  isEditing: boolean;
  onUpdateEntries: (entries: CertificationEntry[]) => void;
}

export const CertificationsSection: React.FC<CertificationsSectionProps> = ({
  entries,
  config,
  isEditing,
  onUpdateEntries,
}) => {
  const { typography, colors, layout } = config;

  const updateEntry = (index: number, updated: Partial<CertificationEntry>) => {
    const next = [...entries];
    next[index] = { ...next[index], ...updated };
    onUpdateEntries(next);
  };

  const deleteEntry = (index: number) => {
    onUpdateEntries(entries.filter((_, i) => i !== index));
  };

  const duplicateEntry = (index: number) => {
    const itemToClone = entries[index];
    const cloned: CertificationEntry = {
      ...itemToClone,
      id: `cert-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
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
      style={{ gap: `${layout.entrySpacing - 2}px` }}
    >
      {entries.map((entry, index) => (
        <article
          key={entry.id}
          className="group/cert relative resume-entry-avoid-break"
        >
          {/* Action Bar for Entry */}
          {isEditing && (
            <div className="absolute right-0 -top-2 opacity-0 group-hover/cert:opacity-100 transition-opacity flex items-center gap-1 bg-white/95 px-1 py-0.5 rounded shadow-xs border border-slate-200 text-slate-500 z-10 no-print">
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
                title="Duplicate certification"
                className="p-1 hover:text-slate-900 hover:bg-slate-100 rounded"
              >
                <Copy size={11} />
              </button>
              <button
                type="button"
                onClick={() => deleteEntry(index)}
                title="Delete certification"
                className="p-1 hover:text-red-600 hover:bg-slate-100 rounded"
              >
                <Trash2 size={11} />
              </button>
            </div>
          )}

          {/* Certification Name */}
          <div>
            <EditableText
              tag="h4"
              isEditing={isEditing}
              value={entry.name}
              onChange={(name) => updateEntry(index, { name })}
              placeholder="[Certification Name]"
              className="font-bold tracking-tight block"
              style={{
                fontSize: `${typography.bodySize}px`,
                color: colors.primaryText,
              }}
            />
          </div>

          {/* Issuer & Date & Achievement */}
          <div
            className="flex flex-wrap items-baseline gap-x-1.5 mt-0.5 font-normal"
            style={{ fontSize: `${typography.metadataSize}px` }}
          >
            <span className="font-medium" style={{ color: colors.accentColor }}>
              <EditableText
                isEditing={isEditing}
                value={entry.issuer}
                onChange={(issuer) => updateEntry(index, { issuer })}
                placeholder="[Issuing Authority]"
              />
            </span>

            {(entry.date || isEditing) && (
              <>
                <span style={{ color: colors.secondaryText }}>·</span>
                <span style={{ color: colors.secondaryText }}>
                  <EditableText
                    isEditing={isEditing}
                    value={entry.date}
                    onChange={(date) => updateEntry(index, { date })}
                    placeholder="[Year]"
                  />
                </span>
              </>
            )}

            {(entry.achievement || isEditing) && (
              <>
                <span style={{ color: colors.secondaryText }}>·</span>
                <span
                  className="font-medium"
                  style={{ color: colors.primaryText }}
                >
                  <EditableText
                    isEditing={isEditing}
                    value={entry.achievement || ''}
                    onChange={(achievement) => updateEntry(index, { achievement })}
                    placeholder="[Distinction / Level]"
                  />
                </span>
              </>
            )}
          </div>

          {/* Description */}
          {(entry.description || isEditing) && (
            <div
              className="mt-0.5"
              style={{
                fontSize: `${typography.metadataSize}px`,
                color: colors.secondaryText,
              }}
            >
              <EditableText
                multiline
                isEditing={isEditing}
                value={entry.description || ''}
                onChange={(description) => updateEntry(index, { description })}
                placeholder="[Credential ID or credential description]"
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
            const newCert: CertificationEntry = {
              id: `cert-${Date.now()}`,
              name: '[New Certification]',
              issuer: '[Issuing Organization]',
              date: '2024',
              achievement: 'Certified',
            };
            onUpdateEntries([...entries, newCert]);
          }}
          className="flex items-center justify-center gap-1.5 py-1.5 px-3 border border-dashed border-slate-300 rounded text-xs text-slate-500 hover:text-blue-600 hover:border-blue-400 hover:bg-blue-50/20 transition-colors no-print"
        >
          <Plus size={12} /> Add Certification Entry
        </button>
      )}
    </div>
  );
};
