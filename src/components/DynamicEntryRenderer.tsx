import React, { useState } from 'react';
import {
  EntryItem,
  ResumeSection,
  ResumeTemplateConfig,
  FieldKey,
} from '../types/resume';
import { isFieldActiveForEntry } from '../utils/migration';
import { EditableText } from './EditableText';
import {
  Plus,
  Trash2,
  Copy,
  ChevronUp,
  ChevronDown,
  ExternalLink,
  MapPin,
  Calendar,
  GripVertical,
  SlidersHorizontal,
  FileText,
} from 'lucide-react';

interface DynamicEntryRendererProps {
  entry: EntryItem;
  index: number;
  totalEntries: number;
  section: ResumeSection;
  config: ResumeTemplateConfig;
  isEditing: boolean;
  onUpdateEntry: (updated: Partial<EntryItem>) => void;
  onDeleteEntry: () => void;
  onDuplicateEntry: () => void;
  onMoveEntry: (direction: 'up' | 'down') => void;
  onDragStart?: (e: React.DragEvent) => void;
  onDragOver?: (e: React.DragEvent) => void;
  onDrop?: (e: React.DragEvent) => void;
}

export const DynamicEntryRenderer: React.FC<DynamicEntryRendererProps> = ({
  entry,
  index,
  totalEntries,
  section,
  config,
  isEditing,
  onUpdateEntry,
  onDeleteEntry,
  onDuplicateEntry,
  onMoveEntry,
  onDragStart,
  onDragOver,
  onDrop,
}) => {
  const { typography, colors, layout } = config;
  const [isFieldMenuOpen, setIsFieldMenuOpen] = useState(false);

  // Field visibility and content resolution
  const showTitle = isFieldActiveForEntry(section, entry, 'title');
  const showBullets = isFieldActiveForEntry(section, entry, 'bullets');
  const showProficiency = isFieldActiveForEntry(section, entry, 'proficiency');

  // Only render an optional field if it has real text OR user explicitly enabled it for this entry
  const shouldShowOptionalField = (field: FieldKey, val?: string): boolean => {
    if (!isFieldActiveForEntry(section, entry, field)) return false;
    if (val && val.trim()) return true;
    if (isEditing && entry.enabledFields?.includes(field)) return true;
    return false;
  };

  const shouldShowSubtitle =
    isFieldActiveForEntry(section, entry, 'subtitle') &&
    (Boolean(entry.subtitle && entry.subtitle.trim()) ||
      (isEditing && entry.enabledFields?.includes('subtitle')) ||
      (isEditing &&
        (section.type === 'experience' ||
          section.type === 'projects' ||
          section.type === 'education' ||
          section.type === 'certifications')));

  const shouldShowDate = shouldShowOptionalField('date', entry.date);
  const shouldShowLocation = shouldShowOptionalField('location', entry.location);
  const shouldShowGrade = shouldShowOptionalField('grade', entry.grade);
  const shouldShowLink = shouldShowOptionalField('link', entry.link);
  const shouldShowDescription = shouldShowOptionalField('description', entry.description);

  // Helper to toggle a field on/off for this entry
  const toggleEntryField = (field: FieldKey) => {
    const isCurrentlyActive = isFieldActiveForEntry(section, entry, field);
    if (isCurrentlyActive && (entry.enabledFields?.includes(field) || entry[field as keyof EntryItem])) {
      // Disable / remove field for this entry
      const currentDisabled = entry.disabledFields || [];
      const currentEnabled = entry.enabledFields || [];
      const updates: Partial<EntryItem> = {
        disabledFields: [...currentDisabled, field],
        enabledFields: currentEnabled.filter((f) => f !== field),
      };
      // Clear field value
      if (field in entry) {
        (updates as any)[field] = field === 'bullets' ? [] : '';
      }
      onUpdateEntry(updates);
    } else {
      // Enable field for this entry
      const currentDisabled = entry.disabledFields || [];
      const currentEnabled = entry.enabledFields || [];
      const updates: Partial<EntryItem> = {
        disabledFields: currentDisabled.filter((f) => f !== field),
        enabledFields: [...currentEnabled, field],
      };
      // Provide default placeholder
      if (field === 'description' && !entry.description) {
        updates.description = '[Optional description, key context, or details...]';
      } else if (field === 'location' && !entry.location) {
        updates.location = '[Location]';
      } else if (field === 'date' && !entry.date) {
        updates.date = '[Date]';
      } else if (field === 'link' && !entry.link) {
        updates.link = 'github.com/project';
      } else if (field === 'bullets' && (!entry.bullets || entry.bullets.length === 0)) {
        updates.bullets = ['[Key accomplishment or contribution delivering measurable impact.]'];
      } else if (field === 'grade' && !entry.grade) {
        updates.grade = '[Honors / Level]';
      } else if (field === 'subtitle' && !entry.subtitle) {
        updates.subtitle = '[Organization / Subtitle]';
      }
      onUpdateEntry(updates);
    }
  };

  // Bullet manipulation
  const addBullet = () => {
    const nextBullets = [...(entry.bullets || []), '[Key accomplishment, metric, or technical contribution]'];
    onUpdateEntry({
      bullets: nextBullets,
      enabledFields: [...(entry.enabledFields || []), 'bullets'],
      disabledFields: (entry.disabledFields || []).filter((f) => f !== 'bullets'),
    });
  };

  const updateBullet = (bIdx: number, text: string) => {
    const nextBullets = [...(entry.bullets || [])];
    nextBullets[bIdx] = text;
    onUpdateEntry({ bullets: nextBullets });
  };

  const deleteBullet = (bIdx: number) => {
    const nextBullets = (entry.bullets || []).filter((_, i) => i !== bIdx);
    onUpdateEntry({ bullets: nextBullets });
  };

  // Check if entry has any visible content in preview/print
  if (!isEditing) {
    const hasAnyContent =
      (showTitle && Boolean(entry.title?.trim())) ||
      (shouldShowSubtitle && Boolean(entry.subtitle?.trim())) ||
      (shouldShowDate && Boolean(entry.date?.trim())) ||
      (shouldShowLocation && Boolean(entry.location?.trim())) ||
      (shouldShowGrade && Boolean(entry.grade?.trim())) ||
      (shouldShowLink && Boolean(entry.link?.trim())) ||
      (shouldShowDescription && Boolean(entry.description?.trim())) ||
      (showBullets && Boolean(entry.bullets && entry.bullets.some((b) => b.trim()))) ||
      (section.type === 'skills' && Boolean(entry.skills?.trim()));

    if (!hasAnyContent) {
      return null;
    }
  }

  // Build secondary metadata items dynamically (dynamic separators: no extra spans!)
  const metaElements: React.ReactNode[] = [];

  if (shouldShowDate) {
    metaElements.push(
      <span key="date" className="inline-flex items-center gap-1 shrink-0">
        <Calendar size={10} className="shrink-0" aria-hidden="true" />
        <EditableText
          isEditing={isEditing}
          value={entry.date || ''}
          onChange={(date) => onUpdateEntry({ date })}
          placeholder="[Dates]"
          onRemove={() => toggleEntryField('date')}
          removeTitle="Remove date"
        />
      </span>
    );
  }

  if (shouldShowLocation) {
    metaElements.push(
      <span key="location" className="inline-flex items-center gap-1 shrink-0">
        <MapPin size={10} className="shrink-0" aria-hidden="true" />
        <EditableText
          isEditing={isEditing}
          value={entry.location || ''}
          onChange={(location) => onUpdateEntry({ location })}
          placeholder="[Location]"
          onRemove={() => toggleEntryField('location')}
          removeTitle="Remove location"
        />
      </span>
    );
  }

  if (shouldShowGrade) {
    metaElements.push(
      <span key="grade" className="inline-flex items-center gap-1 shrink-0 font-medium">
        <EditableText
          isEditing={isEditing}
          value={entry.grade || ''}
          onChange={(grade) => onUpdateEntry({ grade })}
          placeholder="[Honors / Level]"
          onRemove={() => toggleEntryField('grade')}
          removeTitle="Remove grade/honors"
        />
      </span>
    );
  }

  return (
    <article
      className="group/entry relative resume-entry-avoid-break transition-all"
      draggable={isEditing}
      onDragStart={onDragStart}
      onDragOver={onDragOver}
      onDrop={onDrop}
    >
      {/* Action Bar for Entry in Edit Mode */}
      {isEditing && (
        <div className="absolute right-0 -top-2.5 opacity-0 group-hover/entry:opacity-100 transition-opacity flex items-center gap-1 bg-white/95 px-1 py-0.5 rounded shadow-xs border border-slate-200 text-slate-500 z-20 no-print">
          <span
            className="cursor-grab active:cursor-grabbing p-0.5 text-slate-400 hover:text-slate-700 rounded"
            title="Drag to reorder entry"
          >
            <GripVertical size={11} />
          </span>

          {/* Quick Fields Dropdown */}
          <div className="relative">
            <button
              type="button"
              onClick={() => setIsFieldMenuOpen(!isFieldMenuOpen)}
              title="Add or remove optional fields for this entry"
              className="p-1 hover:text-blue-600 hover:bg-slate-100 rounded text-xs flex items-center gap-0.5"
            >
              <SlidersHorizontal size={11} />
              <span className="text-[10px] hidden sm:inline">Fields</span>
            </button>

            {isFieldMenuOpen && (
              <div
                className="absolute right-0 top-full mt-1 w-48 bg-white border border-slate-200 rounded-lg shadow-xl p-2 z-30 text-xs space-y-1"
                onMouseLeave={() => setIsFieldMenuOpen(false)}
              >
                <div className="font-semibold text-slate-900 pb-1 border-b border-slate-100 text-[11px] flex justify-between items-center">
                  <span>Optional Fields</span>
                  <span className="text-[9px] text-slate-400">Toggle to add</span>
                </div>
                {[
                  { key: 'description' as const, label: '+ Description / Notes' },
                  { key: 'date' as const, label: '+ Date / Year' },
                  { key: 'location' as const, label: '+ Location' },
                  { key: 'bullets' as const, label: '+ Bullet Points' },
                  { key: 'link' as const, label: '+ Link / URL' },
                  { key: 'grade' as const, label: '+ Grade / Honors' },
                  { key: 'subtitle' as const, label: '+ Subtitle / Org' },
                ].map(({ key, label }) => {
                  const isActive =
                    key === 'description'
                      ? shouldShowDescription
                      : key === 'date'
                      ? shouldShowDate
                      : key === 'location'
                      ? shouldShowLocation
                      : key === 'grade'
                      ? shouldShowGrade
                      : key === 'link'
                      ? shouldShowLink
                      : isFieldActiveForEntry(section, entry, key);

                  return (
                    <label
                      key={key}
                      className="flex items-center justify-between p-1.5 rounded hover:bg-slate-50 cursor-pointer select-none text-[11px]"
                    >
                      <span className={isActive ? 'text-blue-700 font-medium' : 'text-slate-600'}>
                        {label}
                      </span>
                      <input
                        type="checkbox"
                        checked={Boolean(isActive)}
                        onChange={() => toggleEntryField(key)}
                        className="rounded border-slate-300 text-blue-600 w-3.5 h-3.5 cursor-pointer"
                      />
                    </label>
                  );
                })}
              </div>
            )}
          </div>

          {/* Optional Quick Add Description Button if not active */}
          {!shouldShowDescription && (
            <button
              type="button"
              onClick={() => toggleEntryField('description')}
              title="Add optional description"
              className="p-1 hover:text-blue-600 hover:bg-slate-100 rounded text-xs flex items-center gap-0.5"
            >
              <FileText size={11} />
              <span className="text-[10px] hidden sm:inline">+Desc</span>
            </button>
          )}

          {showBullets && (
            <button
              type="button"
              onClick={addBullet}
              title="Add bullet point"
              className="p-1 hover:text-blue-600 hover:bg-slate-100 rounded text-xs flex items-center gap-0.5"
            >
              <Plus size={11} />
              <span className="text-[10px] hidden sm:inline">+Bullet</span>
            </button>
          )}

          {index > 0 && (
            <button
              type="button"
              onClick={() => onMoveEntry('up')}
              title="Move up"
              className="p-1 hover:text-slate-900 hover:bg-slate-100 rounded"
            >
              <ChevronUp size={11} />
            </button>
          )}

          {index < totalEntries - 1 && (
            <button
              type="button"
              onClick={() => onMoveEntry('down')}
              title="Move down"
              className="p-1 hover:text-slate-900 hover:bg-slate-100 rounded"
            >
              <ChevronDown size={11} />
            </button>
          )}

          <button
            type="button"
            onClick={onDuplicateEntry}
            title="Duplicate entry"
            className="p-1 hover:text-slate-900 hover:bg-slate-100 rounded"
          >
            <Copy size={11} />
          </button>

          <button
            type="button"
            onClick={onDeleteEntry}
            title="Delete entry"
            className="p-1 hover:text-red-600 hover:bg-slate-100 rounded"
          >
            <Trash2 size={11} />
          </button>
        </div>
      )}

      {/* LINE 1: Title and optional Link */}
      {(showTitle || shouldShowLink) && (
        <div className="flex items-baseline justify-between gap-2">
          {showTitle && (
            <div className="flex-grow">
              <EditableText
                tag="h3"
                isEditing={isEditing}
                value={entry.title || ''}
                onChange={(title) => onUpdateEntry({ title })}
                placeholder="[Job Title / Program / Name]"
                className="font-bold tracking-tight block"
                style={{
                  fontSize: `${typography.bodySize + (section.column === 'main' ? 1 : 0)}px`,
                  color: colors.primaryText,
                }}
              />
            </div>
          )}

          {shouldShowLink && (
            <div
              className="flex items-center gap-1 shrink-0 font-normal"
              style={{ fontSize: `${typography.metadataSize}px`, color: colors.secondaryText }}
            >
              <ExternalLink size={10} className="shrink-0" aria-hidden="true" />
              <EditableText
                isEditing={isEditing}
                value={entry.link || ''}
                onChange={(link) => onUpdateEntry({ link })}
                placeholder="[Link / URL]"
                onRemove={() => toggleEntryField('link')}
                removeTitle="Remove link"
              />
            </div>
          )}
        </div>
      )}

      {/* LINE 2: Subtitle (Company / Institution / Tech) and Metadata (Date, Location, Grade) */}
      {(shouldShowSubtitle || metaElements.length > 0) && (
        <div
          className="flex flex-wrap items-baseline justify-between gap-x-2 mt-0.5"
          style={{ fontSize: `${typography.metadataSize}px` }}
        >
          {/* Subtitle in Accent Color */}
          {shouldShowSubtitle && (
            <div className="font-semibold" style={{ color: colors.accentColor }}>
              <EditableText
                isEditing={isEditing}
                value={entry.subtitle || ''}
                onChange={(subtitle) => onUpdateEntry({ subtitle })}
                placeholder="[Company / Institution / Tech]"
                onRemove={() => toggleEntryField('subtitle')}
                removeTitle="Remove subtitle"
              />
            </div>
          )}

          {/* Metadata Items with Dynamic Separators (no empty spans!) */}
          {metaElements.length > 0 && (
            <div
              className="flex flex-wrap items-center gap-x-2 shrink-0 font-normal"
              style={{ color: colors.secondaryText }}
            >
              {metaElements.map((elem, idx) => (
                <React.Fragment key={idx}>
                  {idx > 0 && <span aria-hidden="true">·</span>}
                  {elem}
                </React.Fragment>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Skills Text (For skills groups) */}
      {section.type === 'skills' && (entry.skills || isEditing) && (
        <div
          className="mt-0.5 font-normal"
          style={{
            fontSize: `${typography.bodySize}px`,
            lineHeight: '1.4',
            color: colors.secondaryText,
          }}
        >
          <EditableText
            multiline
            isEditing={isEditing}
            value={entry.skills || ''}
            onChange={(skills) => onUpdateEntry({ skills })}
            placeholder="[Skill 1] · [Skill 2] · [Skill 3]"
            className="block"
          />
        </div>
      )}

      {/* Language Proficiency Dots */}
      {section.type === 'languages' && showProficiency && (
        <div className="flex items-center gap-1.5 mt-0.5">
          <div className="flex items-center gap-1">
            {[1, 2, 3, 4, 5].map((lvl) => (
              <button
                key={lvl}
                type="button"
                disabled={!isEditing}
                onClick={() =>
                  isEditing &&
                  onUpdateEntry({ level: entry.level === lvl ? 0 : lvl })
                }
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
        </div>
      )}

      {/* Multiline Description (Supported for ALL sections: skills, language, education, experience, etc.) */}
      {shouldShowDescription && (
        <div
          className="mt-1 font-normal text-slate-700 leading-normal"
          style={{
            fontSize: `${typography.bodySize - 0.5}px`,
            lineHeight:
              typography.lineHeight === 'tight'
                ? '1.3'
                : typography.lineHeight === 'relaxed'
                ? '1.6'
                : '1.45',
            color: colors.primaryText,
          }}
        >
          <EditableText
            multiline
            richText
            isEditing={isEditing}
            value={entry.description || ''}
            onChange={(description) => onUpdateEntry({ description })}
            placeholder="[Add optional description, project context, or team mission...]"
            className="block"
            onRemove={() => toggleEntryField('description')}
            removeTitle="Remove description"
          />
        </div>
      )}

      {/* Bullets List */}
      {showBullets && entry.bullets && entry.bullets.length > 0 && (
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
              {/* Bullet Marker */}
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
                  richText
                  isEditing={isEditing}
                  value={bullet}
                  onChange={(text) => updateBullet(bIdx, text)}
                  placeholder="[Achievement / Contribution]"
                  className="block"
                />
              </div>

              {isEditing && (
                <button
                  type="button"
                  onClick={() => deleteBullet(bIdx)}
                  title="Remove bullet"
                  className="opacity-0 group-hover/bullet:opacity-100 p-0.5 text-slate-400 hover:text-red-600 transition-opacity shrink-0 no-print"
                >
                  <Trash2 size={10} />
                </button>
              )}
            </li>
          ))}
        </ul>
      )}
    </article>
  );
};
