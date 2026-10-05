import React, { useState, useRef, useEffect } from 'react';
import {
  EntryItem,
  ResumeSection,
  ResumeTemplateConfig,
  FieldKey,
} from '../types/resume';
import { isFieldActiveForEntry } from '../utils/migration';
import { EditableText } from './EditableText';
import { DateRangePickerModal } from './DateRangePickerModal';
import { SkillsTagEditor } from './SkillsTagEditor';
import { getLineHeightValue, getHeadingLetterSpacing, getBodyLetterSpacing } from '../utils/typography';
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
  MoreHorizontal,
  Link as LinkIcon,
  Check,
  X,
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
  const [isEntryMenuOpen, setIsEntryMenuOpen] = useState(false);
  const [isDatePickerOpen, setIsDatePickerOpen] = useState(false);
  const [isLinkModalOpen, setIsLinkModalOpen] = useState(false);
  const [tempLinkLabel, setTempLinkLabel] = useState('');
  const [tempLinkUrl, setTempLinkUrl] = useState('');
  const menuRef = useRef<HTMLDivElement>(null);
  const linkModalRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleOutsideClick = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setIsEntryMenuOpen(false);
      }
      if (linkModalRef.current && !linkModalRef.current.contains(e.target as Node)) {
        setIsLinkModalOpen(false);
      }
    };
    if (isEntryMenuOpen || isLinkModalOpen) {
      document.addEventListener('mousedown', handleOutsideClick);
    }
    return () => {
      document.removeEventListener('mousedown', handleOutsideClick);
    };
  }, [isEntryMenuOpen, isLinkModalOpen]);

  // Typography sizing:
  // Role / Job title size
  const roleSize = typography.bodySize + (section.column === 'main' ? 1 : 0.5);

  // Company Name sizing (Requirement: Company size = Role size by default)
  const isExperience = section.type === 'experience';
  const isEducation = section.type === 'education';
  const isSkills = section.type === 'skills';
  const companySameAsRole = typography.companySizeSameAsRole !== false;
  const subtitleSize =
    isExperience && companySameAsRole
      ? roleSize
      : isEducation
      ? roleSize
      : typography.metadataSize + 0.5;

  // Field visibility and content resolution
  const showTitle = isFieldActiveForEntry(section, entry, 'title');
  const showBullets = isFieldActiveForEntry(section, entry, 'bullets');

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
      if (field === 'date') {
        updates.dateRange = undefined;
      }
      if (field === 'link') {
        updates.linkLabel = '';
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
      } else if (field === 'date') {
        setIsDatePickerOpen(true);
        updates.date = updates.date || '2024';
      } else if (field === 'link' && !entry.link) {
        updates.link = 'https://github.com/project';
        updates.linkLabel = 'View Project';
        setTempLinkUrl('https://github.com/project');
        setTempLinkLabel('View Project');
        setIsLinkModalOpen(true);
      } else if (field === 'bullets' && (!entry.bullets || entry.bullets.length === 0)) {
        updates.bullets = ['[Key accomplishment or contribution delivering measurable impact.]'];
      } else if (field === 'grade' && !entry.grade) {
        updates.grade = isEducation ? 'CGPA: 8.28' : '[Honors / Level]';
      } else if (field === 'subtitle' && !entry.subtitle) {
        updates.subtitle = isEducation ? '[University / Institution]' : '[Company / Subtitle]';
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

  // Skills tokens resolution
  const currentSkillsList =
    entry.skillsList && entry.skillsList.length > 0
      ? entry.skillsList
      : entry.skills
      ? entry.skills.split('·').map((s) => s.trim()).filter(Boolean)
      : [];

  // Helper to get friendly default label from URL (Section 19 & 20)
  const getDisplayLinkLabel = (url?: string, customLabel?: string) => {
    if (customLabel && customLabel.trim()) return customLabel.trim();
    if (!url) return 'Link';
    const clean = url.trim().toLowerCase();
    if (clean.includes('github.com')) return 'GitHub';
    if (clean.includes('linkedin.com')) return 'LinkedIn';
    if (clean.includes('aws.amazon.com') || clean.includes('s3.amazonaws.com')) return 'View Certificate';
    if (clean.includes('drive.google.com') || clean.includes('docs.google.com')) return 'View Document';
    if (clean.includes('demo') || clean.includes('vercel.app')) return 'Live Demo';
    try {
      const parsed = new URL(url.startsWith('http') ? url : `https://${url}`);
      return parsed.hostname.replace(/^www\./, '');
    } catch {
      return 'View Link';
    }
  };

  const openLinkEditor = () => {
    setTempLinkLabel(entry.linkLabel || getDisplayLinkLabel(entry.link));
    setTempLinkUrl(entry.link || '');
    setIsLinkModalOpen(true);
  };

  const saveLink = (e: React.FormEvent) => {
    e.preventDefault();
    onUpdateEntry({
      link: tempLinkUrl.trim(),
      linkLabel: tempLinkLabel.trim(),
      enabledFields: [...(entry.enabledFields || []), 'link'],
      disabledFields: (entry.disabledFields || []).filter((f) => f !== 'link'),
    });
    setIsLinkModalOpen(false);
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
      (section.type === 'skills' && currentSkillsList.length > 0);

    if (!hasAnyContent) {
      return null;
    }
  }

  // Build secondary metadata items for standard non-education entries
  const metaElements: React.ReactNode[] = [];

  if (!isEducation) {
    if (shouldShowDate) {
      metaElements.push(
        <span
          key="date"
          className="inline-flex items-center gap-1 shrink-0 cursor-pointer"
          onClick={() => isEditing && setIsDatePickerOpen(true)}
          title={isEditing ? 'Click to change month/year date range' : undefined}
        >
          <Calendar size={9} className="shrink-0 text-blue-600" aria-hidden="true" />
          <span className={isEditing ? 'hover:underline text-slate-800' : ''}>
            {entry.date || '[Set Dates]'}
          </span>
        </span>
      );
    }

    if (shouldShowLocation) {
      metaElements.push(
        <span key="location" className="inline-flex items-center gap-1 shrink-0">
          <MapPin size={9} className="shrink-0" aria-hidden="true" />
          <EditableText
            isEditing={isEditing}
            value={entry.location || ''}
            onChange={(location) => onUpdateEntry({ location })}
            placeholder="[Location]"
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
          />
        </span>
      );
    }
  }

  const rawUrl = entry.link || '';
  const cleanHref = rawUrl.startsWith('http://') || rawUrl.startsWith('https://') || rawUrl.startsWith('mailto:')
    ? rawUrl
    : `https://${rawUrl}`;

  return (
    <article
      className="group/entry relative resume-entry-avoid-break transition-all"
      draggable={isEditing && section.type !== 'skills'}
      onDragStart={onDragStart}
      onDragOver={onDragOver}
      onDrop={onDrop}
      style={{
        marginBottom: `${layout.entrySpacing}px`,
      }}
    >
      {/* Date Range Picker Modal */}
      {isDatePickerOpen && (
        <DateRangePickerModal
          isOpen={isDatePickerOpen}
          onClose={() => setIsDatePickerOpen(false)}
          initialRange={entry.dateRange}
          initialDateString={entry.date}
          onSave={(range, formatted) => {
            onUpdateEntry({
              dateRange: range,
              date: formatted,
              enabledFields: [...(entry.enabledFields || []), 'date'],
              disabledFields: (entry.disabledFields || []).filter((f) => f !== 'date'),
            });
          }}
          onClear={() => {
            toggleEntryField('date');
          }}
        />
      )}

      {/* Separate Link Editor Modal (Section 19: Display Label vs Raw URL) */}
      {isLinkModalOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-2xs p-4 no-print"
          onClick={() => setIsLinkModalOpen(false)}
        >
          <div
            ref={linkModalRef}
            className="w-full max-w-sm bg-white rounded-xl shadow-2xl border border-slate-200 overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between px-4 py-2.5 border-b border-slate-200 bg-slate-50">
              <div className="flex items-center gap-1.5 text-xs font-bold text-slate-800">
                <LinkIcon size={13} className="text-blue-600" />
                <span>Edit Link & Display Label</span>
              </div>
              <button
                type="button"
                onClick={() => setIsLinkModalOpen(false)}
                className="p-1 text-slate-400 hover:text-slate-700 rounded"
              >
                <X size={14} />
              </button>
            </div>

            <form onSubmit={saveLink} className="p-4 space-y-3 text-xs">
              <div>
                <label className="block font-semibold text-slate-800 mb-1">
                  Display Label (Visible Text on Resume)
                </label>
                <input
                  type="text"
                  value={tempLinkLabel}
                  onChange={(e) => setTempLinkLabel(e.target.value)}
                  placeholder="e.g. View Certificate, GitHub, Live Demo"
                  className="w-full px-2.5 py-1.5 border border-slate-300 rounded-md focus:outline-blue-500 text-xs"
                />
                <span className="text-[10px] text-slate-400 mt-0.5 block">
                  Short, clean label displayed on the document.
                </span>
              </div>

              <div>
                <label className="block font-semibold text-slate-800 mb-1">
                  Web Address / URL
                </label>
                <input
                  type="text"
                  value={tempLinkUrl}
                  onChange={(e) => setTempLinkUrl(e.target.value)}
                  placeholder="https://example.com/certificate/12345"
                  className="w-full px-2.5 py-1.5 border border-slate-300 rounded-md focus:outline-blue-500 font-mono text-[11px]"
                />
                <span className="text-[10px] text-slate-400 mt-0.5 block">
                  Long S3 / Cloud URLs remain clickable without breaking layout.
                </span>
              </div>

              <div className="pt-2 border-t border-slate-200 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsLinkModalOpen(false)}
                  className="px-3 py-1.5 border border-slate-200 text-slate-600 hover:bg-slate-50 rounded-md text-xs font-medium"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 bg-blue-600 text-white rounded-md text-xs font-medium hover:bg-blue-700 flex items-center gap-1 shadow-2xs"
                >
                  <Check size={12} /> Apply Link
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Discrete Entry Action Trigger & Menu in Edit Mode (Does NOT cover text!) */}
      {isEditing && (
        <div className="absolute right-0 -top-1 opacity-0 group-hover/entry:opacity-100 transition-opacity flex items-center gap-0.5 no-print z-20">
          <span
            className="cursor-grab active:cursor-grabbing p-0.5 text-slate-400 hover:text-slate-700 bg-white/90 border border-slate-200 rounded shadow-2xs"
            title="Drag to reorder entry"
          >
            <GripVertical size={11} />
          </span>

          <div className="relative" ref={menuRef}>
            <button
              type="button"
              onClick={() => setIsEntryMenuOpen(!isEntryMenuOpen)}
              title="Entry options (fields, reorder, delete)"
              className="p-0.5 text-slate-500 hover:text-slate-900 bg-white/90 hover:bg-white border border-slate-200 rounded shadow-2xs transition-colors flex items-center justify-center"
            >
              <MoreHorizontal size={12} />
            </button>

            {isEntryMenuOpen && (
              <div
                className="absolute right-0 top-full mt-1 w-52 bg-white border border-slate-200 rounded-lg shadow-xl p-2 z-40 text-xs space-y-1.5 animate-in fade-in zoom-in-95 duration-75"
                onClick={(e) => e.stopPropagation()}
              >
                {/* Header */}
                <div className="font-semibold text-slate-900 pb-1 border-b border-slate-100 text-[11px] flex justify-between items-center">
                  <span>Entry Fields</span>
                  <span className="text-[9px] text-slate-400">Toggle to add/remove</span>
                </div>

                {/* Field Toggles */}
                <div className="space-y-0.5">
                  {[
                    { key: 'description' as const, label: 'Description / Notes' },
                    { key: 'date' as const, label: 'Date (Month/Year Picker)' },
                    { key: 'location' as const, label: 'Location' },
                    { key: 'bullets' as const, label: 'Bullet Points' },
                    { key: 'link' as const, label: 'Link / URL' },
                    { key: 'grade' as const, label: isEducation ? 'CGPA / Grade' : 'Grade / Honors' },
                    { key: 'subtitle' as const, label: isEducation ? 'Institution Name' : 'Company / Subtitle' },
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
                        className="flex items-center justify-between px-1.5 py-1 rounded hover:bg-slate-50 cursor-pointer select-none text-[11px]"
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

                {/* Entry Actions */}
                <div className="pt-1.5 border-t border-slate-100 space-y-0.5">
                  {showBullets && (
                    <button
                      type="button"
                      onClick={() => {
                        addBullet();
                        setIsEntryMenuOpen(false);
                      }}
                      className="w-full text-left flex items-center gap-1.5 px-1.5 py-1 rounded hover:bg-slate-50 text-slate-700 text-[11px]"
                    >
                      <Plus size={11} className="text-blue-600" />
                      <span>Add Bullet Point</span>
                    </button>
                  )}

                  {!shouldShowDescription && (
                    <button
                      type="button"
                      onClick={() => {
                        toggleEntryField('description');
                        setIsEntryMenuOpen(false);
                      }}
                      className="w-full text-left flex items-center gap-1.5 px-1.5 py-1 rounded hover:bg-slate-50 text-slate-700 text-[11px]"
                    >
                      <FileText size={11} className="text-blue-600" />
                      <span>Add Description</span>
                    </button>
                  )}

                  {shouldShowLink && (
                    <button
                      type="button"
                      onClick={() => {
                        openLinkEditor();
                        setIsEntryMenuOpen(false);
                      }}
                      className="w-full text-left flex items-center gap-1.5 px-1.5 py-1 rounded hover:bg-slate-50 text-slate-700 text-[11px]"
                    >
                      <LinkIcon size={11} className="text-blue-600" />
                      <span>Edit Link & Label</span>
                    </button>
                  )}

                  {index > 0 && (
                    <button
                      type="button"
                      onClick={() => {
                        onMoveEntry('up');
                        setIsEntryMenuOpen(false);
                      }}
                      className="w-full text-left flex items-center gap-1.5 px-1.5 py-1 rounded hover:bg-slate-50 text-slate-700 text-[11px]"
                    >
                      <ChevronUp size={11} />
                      <span>Move Up</span>
                    </button>
                  )}

                  {index < totalEntries - 1 && (
                    <button
                      type="button"
                      onClick={() => {
                        onMoveEntry('down');
                        setIsEntryMenuOpen(false);
                      }}
                      className="w-full text-left flex items-center gap-1.5 px-1.5 py-1 rounded hover:bg-slate-50 text-slate-700 text-[11px]"
                    >
                      <ChevronDown size={11} />
                      <span>Move Down</span>
                    </button>
                  )}

                  <button
                    type="button"
                    onClick={() => {
                      onDuplicateEntry();
                      setIsEntryMenuOpen(false);
                    }}
                    className="w-full text-left flex items-center gap-1.5 px-1.5 py-1 rounded hover:bg-slate-50 text-slate-700 text-[11px]"
                  >
                    <Copy size={11} />
                    <span>Duplicate Entry</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      onDeleteEntry();
                      setIsEntryMenuOpen(false);
                    }}
                    className="w-full text-left flex items-center gap-1.5 px-1.5 py-1 rounded hover:bg-red-50 text-red-600 text-[11px] font-medium"
                  >
                    <Trash2 size={11} />
                    <span>Delete Entry</span>
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* LINE 1: Title (Role / Degree / Project Name) and Link */}
      {(showTitle || shouldShowLink) && (
        <div className="flex items-baseline justify-between gap-2">
          {showTitle && (
            <div className="flex-grow min-w-0">
              <EditableText
                tag="h3"
                isEditing={isEditing}
                value={entry.title || ''}
                onChange={(title) => onUpdateEntry({ title })}
                placeholder={
                  isEducation
                    ? '[Degree / Program Name]'
                    : isSkills
                    ? '[Skill Category / Heading]'
                    : '[Job Title / Program / Name]'
                }
                className={`font-bold block ${
                  isSkills ? 'uppercase !text-blue-600' : ''
                }`}
                style={{
                  fontSize: isSkills ? `${typography.bodySize + 0.5}px` : `${roleSize}px`,
                  color: isSkills ? '#1d4ed8' : colors.primaryText,
                  letterSpacing: getHeadingLetterSpacing(typography.letterSpacing),
                  lineHeight: getLineHeightValue(typography.lineHeight),
                }}
              />
            </div>
          )}

          {/* Section 19 & 20: Customized Name Over Links */}
          {shouldShowLink && (
            <div
              className="group/link inline-flex items-center gap-1 shrink-0 font-normal leading-none"
              style={{ fontSize: `${typography.metadataSize}px` }}
            >
              <a
                href={cleanHref}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-0.5 text-blue-600 hover:text-blue-800 hover:underline max-w-[200px] truncate font-medium"
              >
                <span className="truncate">{getDisplayLinkLabel(entry.link, entry.linkLabel)}</span>
                <ExternalLink size={9} className="shrink-0 opacity-80" aria-hidden="true" />
              </a>

              {isEditing && (
                <button
                  type="button"
                  onClick={openLinkEditor}
                  title="Customize link name & URL"
                  className="p-0.5 text-slate-400 hover:text-blue-600 rounded transition-colors no-print"
                >
                  <LinkIcon size={10} />
                </button>
              )}
            </div>
          )}
        </div>
      )}

      {/* LINE 2: Subtitle (Company / Institution / Tech) - Same size as Role! */}
      {shouldShowSubtitle && (
        <div
          className="font-semibold"
          style={{
            fontSize: `${subtitleSize}px`,
            color: colors.accentColor,
            marginTop: '1px',
            lineHeight: getLineHeightValue(typography.lineHeight),
            letterSpacing: getBodyLetterSpacing(typography.letterSpacing),
          }}
        >
          <EditableText
            isEditing={isEditing}
            value={entry.subtitle || ''}
            onChange={(subtitle) => onUpdateEntry({ subtitle })}
            placeholder={isEducation ? '[University / College Name]' : '[Company / Institution / Tech]'}
            style={{
              lineHeight: getLineHeightValue(typography.lineHeight),
              letterSpacing: getBodyLetterSpacing(typography.letterSpacing),
            }}
          />
        </div>
      )}

      {/* EDUCATION METADATA ROW (Section 12: Dedicated baseline grid row for Date & CGPA) */}
      {isEducation && (shouldShowDate || shouldShowGrade) && (
        <div
          className="grid grid-cols-[minmax(0,1fr)_auto] items-baseline gap-x-2 mt-0.5 font-normal"
          style={{
            fontSize: `${typography.metadataSize}px`,
            color: colors.secondaryText,
            lineHeight: getLineHeightValue(typography.lineHeight),
            letterSpacing: getBodyLetterSpacing(typography.letterSpacing),
          }}
        >
          {/* Left: Date */}
          <div className="min-w-0">
            {shouldShowDate && (
              <span
                className="inline-flex items-center gap-1 cursor-pointer select-none"
                onClick={() => isEditing && setIsDatePickerOpen(true)}
                title={isEditing ? 'Click to change month/year date range' : undefined}
              >
                <Calendar size={9} className="shrink-0 text-blue-600" aria-hidden="true" />
                <span className={isEditing ? 'hover:underline text-slate-700' : ''}>
                  {entry.date || '[Set Dates]'}
                </span>
              </span>
            )}
          </div>

          {/* Right: CGPA / Score / Grade */}
          <div className="text-right shrink-0">
            {shouldShowGrade && (
              <EditableText
                isEditing={isEditing}
                value={entry.grade || ''}
                onChange={(grade) => onUpdateEntry({ grade })}
                placeholder="[CGPA: 8.28]"
                className="font-medium text-right"
                style={{
                  color: colors.secondaryText,
                  lineHeight: getLineHeightValue(typography.lineHeight),
                  letterSpacing: getBodyLetterSpacing(typography.letterSpacing),
                }}
              />
            )}
          </div>
        </div>
      )}

      {/* NON-EDUCATION METADATA ROW: Date, Location, Grade with Dynamic Separators */}
      {!isEducation && metaElements.length > 0 && (
        <div
          className="flex flex-wrap items-center gap-x-2 mt-0.5 font-normal"
          style={{
            fontSize: `${typography.metadataSize}px`,
            color: colors.secondaryText,
            lineHeight: getLineHeightValue(typography.lineHeight),
            letterSpacing: getBodyLetterSpacing(typography.letterSpacing),
          }}
        >
          {metaElements.map((elem, idx) => (
            <React.Fragment key={idx}>
              {idx > 0 && <span aria-hidden="true">·</span>}
              {elem}
            </React.Fragment>
          ))}
        </div>
      )}

      {/* SKILLS SECTION: Individual Skill Tokens with Subtle Light Underlines (Requirement 13-16!) */}
      {section.type === 'skills' && (
        <SkillsTagEditor
          skillsList={currentSkillsList}
          isEditing={isEditing}
          typography={typography}
          colors={colors}
          onChange={(newList) => {
            onUpdateEntry({
              skillsList: newList,
              skills: newList.join(' · '),
            });
          }}
        />
      )}

      {/* Multiline Description with Rich Text - Exact Executive Summary Style (Requirement 1) */}
      {shouldShowDescription && (
        <div
          className="mt-1 font-normal"
          style={{
            fontSize: `${typography.bodySize}px`,
            lineHeight: getLineHeightValue(typography.lineHeight),
            letterSpacing: getBodyLetterSpacing(typography.letterSpacing),
            color: colors.primaryText,
          }}
        >
          <EditableText
            multiline
            richText
            isEditing={isEditing}
            value={entry.description || ''}
            onChange={(description) => onUpdateEntry({ description })}
            placeholder="[Add optional description, project context, or thesis topic...]"
            className="block"
            style={{
              fontSize: `${typography.bodySize}px`,
              lineHeight: getLineHeightValue(typography.lineHeight),
              letterSpacing: getBodyLetterSpacing(typography.letterSpacing),
              color: colors.primaryText,
            }}
          />
        </div>
      )}

      {/* Bullets List with Rich Text - Exact Executive Summary Style (Requirement 1) */}
      {showBullets && entry.bullets && entry.bullets.length > 0 && (
        <ul className="mt-1 space-y-1">
          {entry.bullets.map((bullet, bIdx) => (
            <li
              key={bIdx}
              className="group/bullet relative flex items-start gap-2 font-normal"
              style={{
                fontSize: `${typography.bodySize}px`,
                lineHeight: getLineHeightValue(typography.lineHeight),
                letterSpacing: getBodyLetterSpacing(typography.letterSpacing),
                color: colors.primaryText,
              }}
            >
              {/* Bullet Marker */}
              <span
                className="select-none mt-2 shrink-0 block rounded-full"
                style={{
                  width: '3.5px',
                  height: '3.5px',
                  backgroundColor: colors.accentColor,
                }}
                aria-hidden="true"
              />
              <div className="flex-grow min-w-0">
                <EditableText
                  multiline
                  richText
                  isEditing={isEditing}
                  value={bullet}
                  onChange={(text) => updateBullet(bIdx, text)}
                  placeholder="[Achievement / Contribution]"
                  className="block"
                  style={{
                    fontSize: `${typography.bodySize}px`,
                    lineHeight: getLineHeightValue(typography.lineHeight),
                    letterSpacing: getBodyLetterSpacing(typography.letterSpacing),
                    color: colors.primaryText,
                  }}
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
