import React, { useState, useRef, useEffect } from 'react';
import { HeaderData, ResumeTemplateConfig } from '../types/resume';
import { EditableText } from './EditableText';
import { getHeadingLetterSpacing, getBodyLetterSpacing } from '../utils/typography';
import { Phone, Mail, Linkedin, MapPin, ExternalLink, Link as LinkIcon, Check, X } from 'lucide-react';

interface HeaderProps {
  data: HeaderData;
  config: ResumeTemplateConfig;
  isEditing: boolean;
  onUpdate: (updated: Partial<HeaderData>) => void;
}

export const Header: React.FC<HeaderProps> = ({
  data,
  config,
  isEditing,
  onUpdate,
}) => {
  const { typography, colors, headerSettings } = config;
  const isCentered = headerSettings.alignment === 'center';
  const [isLinkedInModalOpen, setIsLinkedInModalOpen] = useState(false);
  const [tempLabel, setTempLabel] = useState('');
  const [tempUrl, setTempUrl] = useState('');
  const modalRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (modalRef.current && !modalRef.current.contains(e.target as Node)) {
        setIsLinkedInModalOpen(false);
      }
    };
    if (isLinkedInModalOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isLinkedInModalOpen]);

  const openLinkedInModal = () => {
    setTempLabel(data.linkedinLabel || data.linkedin || 'LinkedIn');
    setTempUrl(data.linkedin || '');
    setIsLinkedInModalOpen(true);
  };

  const saveLinkedInModal = (e: React.FormEvent) => {
    e.preventDefault();
    onUpdate({
      linkedin: tempUrl.trim(),
      linkedinLabel: tempLabel.trim(),
    });
    setIsLinkedInModalOpen(false);
  };

  // Build clean clickable URL for LinkedIn
  const rawLinkedIn = data.linkedin || '';
  const cleanLinkedInHref = rawLinkedIn.startsWith('http://') || rawLinkedIn.startsWith('https://')
    ? rawLinkedIn
    : rawLinkedIn.startsWith('linkedin.com')
    ? `https://${rawLinkedIn}`
    : `https://linkedin.com/in/${rawLinkedIn.replace(/^@/, '')}`;

  const linkedInDisplayName = data.linkedinLabel || data.linkedin || 'LinkedIn';

  return (
    <header className="w-full pb-1.5 border-b" style={{ borderColor: colors.dividerColor }}>
      <div className={`flex flex-col ${isCentered ? 'items-center text-center' : 'items-start text-left'}`}>
        {/* Candidate Name */}
        <div className="w-full">
          <EditableText
            tag="h1"
            isEditing={isEditing}
            value={data.name}
            onChange={(name) => onUpdate({ name })}
            placeholder="YOUR NAME"
            className={`leading-tight block ${typography.nameWeight} ${
              headerSettings.nameTransform === 'uppercase' ? 'uppercase' : ''
            }`}
            style={{
              fontSize: `${typography.nameSize}px`,
              color: colors.primaryText,
              letterSpacing: getHeadingLetterSpacing(typography.letterSpacing),
            }}
          />
        </div>

        {/* Compact Horizontal Contact Row */}
        <div
          className={`flex flex-wrap items-center mt-1 leading-none ${
            isCentered ? 'justify-center' : 'justify-start'
          }`}
          style={{
            gap: `${headerSettings.contactSpacing}px`,
            fontSize: `${typography.metadataSize}px`,
            color: colors.secondaryText,
            letterSpacing: getBodyLetterSpacing(typography.letterSpacing),
          }}
        >
          {/* Phone */}
          {(data.phone || isEditing) && (
            <div className="flex items-center gap-1 shrink-0">
              {headerSettings.showIcons && (
                <Phone
                  size={10.5}
                  className="shrink-0"
                  style={{ color: colors.accentColor }}
                  aria-hidden="true"
                />
              )}
              <EditableText
                isEditing={isEditing}
                value={data.phone}
                onChange={(phone) => onUpdate({ phone })}
                placeholder="[Phone]"
              />
            </div>
          )}

          {/* Email */}
          {(data.email || isEditing) && (
            <div className="flex items-center gap-1 shrink-0">
              {headerSettings.showIcons && (
                <Mail
                  size={10.5}
                  className="shrink-0"
                  style={{ color: colors.accentColor }}
                  aria-hidden="true"
                />
              )}
              {isEditing ? (
                <EditableText
                  isEditing={isEditing}
                  value={data.email}
                  onChange={(email) => onUpdate({ email })}
                  placeholder="[Email]"
                />
              ) : (
                <a
                  href={`mailto:${data.email}`}
                  className="hover:underline hover:text-slate-900 transition-colors"
                >
                  {data.email}
                </a>
              )}
            </div>
          )}

          {/* LinkedIn with Customized Name Over Links */}
          {(data.linkedin || isEditing) && (
            <div className="group/link flex items-center gap-1 shrink-0 relative">
              {headerSettings.showIcons && (
                <Linkedin
                  size={10.5}
                  className="shrink-0"
                  style={{ color: colors.accentColor }}
                  aria-hidden="true"
                />
              )}

              {isEditing ? (
                <div className="inline-flex items-center gap-0.5">
                  <EditableText
                    isEditing={isEditing}
                    value={data.linkedinLabel || data.linkedin}
                    onChange={(val) => {
                      onUpdate({
                        linkedinLabel: val,
                        linkedin: data.linkedin || val,
                      });
                    }}
                    placeholder="[LinkedIn Name / Link]"
                    className="underline underline-offset-2 hover:underline font-medium cursor-text"
                    style={{ color: colors.accentColor }}
                  />
                  <ExternalLink
                    size={9}
                    className="shrink-0"
                    style={{ color: colors.accentColor }}
                    aria-hidden="true"
                  />
                  <button
                    type="button"
                    onClick={openLinkedInModal}
                    title="Customize link name & URL"
                    className="opacity-0 group-hover/link:opacity-100 p-0.5 text-blue-600 hover:text-blue-800 rounded transition-opacity no-print ml-0.5"
                  >
                    <LinkIcon size={10} />
                  </button>
                </div>
              ) : (
                <a
                  href={cleanLinkedInHref}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="underline underline-offset-2 hover:underline transition-colors inline-flex items-center gap-0.5 font-medium"
                  style={{ color: colors.accentColor }}
                >
                  <span>{linkedInDisplayName}</span>
                  <ExternalLink
                    size={9}
                    className="shrink-0 opacity-80"
                    style={{ color: colors.accentColor }}
                    aria-hidden="true"
                  />
                </a>
              )}
            </div>
          )}

          {/* Location */}
          {(data.location || isEditing) && (
            <div className="flex items-center gap-1 shrink-0">
              {headerSettings.showIcons && (
                <MapPin
                  size={10.5}
                  className="shrink-0"
                  style={{ color: colors.accentColor }}
                  aria-hidden="true"
                />
              )}
              <EditableText
                isEditing={isEditing}
                value={data.location}
                onChange={(location) => onUpdate({ location })}
                placeholder="[Location]"
              />
            </div>
          )}
        </div>
      </div>

      {/* LinkedIn Customized Name & URL Modal */}
      {isLinkedInModalOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-2xs p-4 no-print"
          onClick={() => setIsLinkedInModalOpen(false)}
        >
          <div
            ref={modalRef}
            className="w-full max-w-sm bg-white rounded-xl shadow-2xl border border-slate-200 overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between px-4 py-2.5 border-b border-slate-200 bg-slate-50">
              <div className="flex items-center gap-1.5 text-xs font-bold text-slate-800">
                <Linkedin size={13} className="text-blue-600" />
                <span>Customize LinkedIn Link</span>
              </div>
              <button
                type="button"
                onClick={() => setIsLinkedInModalOpen(false)}
                className="p-1 text-slate-400 hover:text-slate-700 rounded"
              >
                <X size={14} />
              </button>
            </div>

            <form onSubmit={saveLinkedInModal} className="p-4 space-y-3 text-xs">
              <div>
                <label className="block font-semibold text-slate-800 mb-1">
                  Customized Name Over Link (Visible Text)
                </label>
                <input
                  type="text"
                  value={tempLabel}
                  onChange={(e) => setTempLabel(e.target.value)}
                  placeholder="e.g. LinkedIn, linkedin.com/in/narenkumar, Naren Kumar"
                  className="w-full px-2.5 py-1.5 border border-slate-300 rounded-md focus:outline-blue-500 text-xs"
                />
                <span className="text-[10px] text-slate-400 mt-0.5 block">
                  The custom text that appears on your resume header.
                </span>
              </div>

              <div>
                <label className="block font-semibold text-slate-800 mb-1">
                  LinkedIn URL / Profile Address
                </label>
                <input
                  type="text"
                  value={tempUrl}
                  onChange={(e) => setTempUrl(e.target.value)}
                  placeholder="https://linkedin.com/in/your-profile"
                  className="w-full px-2.5 py-1.5 border border-slate-300 rounded-md focus:outline-blue-500 font-mono text-[11px]"
                />
                <span className="text-[10px] text-slate-400 mt-0.5 block">
                  The full target URL users will visit when clicking.
                </span>
              </div>

              <div className="pt-2 border-t border-slate-200 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsLinkedInModalOpen(false)}
                  className="px-3 py-1.5 border border-slate-200 text-slate-600 hover:bg-slate-50 rounded-md text-xs font-medium"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 bg-blue-600 text-white rounded-md text-xs font-medium hover:bg-blue-700 flex items-center gap-1 shadow-2xs"
                >
                  <Check size={12} /> Save Custom Link
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </header>
  );
};
