import React from 'react';
import { HeaderData, ResumeTemplateConfig } from '../types/resume';
import { EditableText } from './EditableText';
import { Phone, Mail, Linkedin, MapPin } from 'lucide-react';

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

  return (
    <header className={`w-full pb-3 border-b`} style={{ borderColor: colors.dividerColor }}>
      <div className={`flex flex-col ${isCentered ? 'items-center text-center' : 'items-start text-left'}`}>
        {/* Candidate Name */}
        <div className="w-full">
          <EditableText
            tag="h1"
            isEditing={isEditing}
            value={data.name}
            onChange={(name) => onUpdate({ name })}
            placeholder="YOUR NAME"
            className={`tracking-tight leading-tight block ${typography.nameWeight} ${
              headerSettings.nameTransform === 'uppercase' ? 'uppercase' : ''
            }`}
            style={{
              fontSize: `${typography.nameSize}px`,
              color: colors.primaryText,
              letterSpacing:
                typography.letterSpacing === 'wider'
                  ? '0.06em'
                  : typography.letterSpacing === 'wide'
                  ? '0.03em'
                  : '-0.01em',
            }}
          />
        </div>

        {/* Professional Title / Headline */}
        <div className="mt-1 w-full">
          <EditableText
            tag="p"
            isEditing={isEditing}
            value={data.title}
            onChange={(title) => onUpdate({ title })}
            placeholder="Professional Title / Headline"
            className="font-medium tracking-normal"
            style={{
              fontSize: `${typography.bodySize + 2}px`,
              color: colors.accentColor,
            }}
          />
        </div>

        {/* Compact Horizontal Contact Row */}
        <div
          className={`flex flex-wrap items-center mt-3 pt-1 ${
            isCentered ? 'justify-center' : 'justify-start'
          }`}
          style={{
            gap: `${headerSettings.contactSpacing}px`,
            fontSize: `${typography.metadataSize}px`,
            color: colors.secondaryText,
          }}
        >
          {/* Phone */}
          {(data.phone || isEditing) && (
            <div className="flex items-center gap-1.5 shrink-0">
              {headerSettings.showIcons && (
                <Phone
                  size={12}
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
            <div className="flex items-center gap-1.5 shrink-0">
              {headerSettings.showIcons && (
                <Mail
                  size={12}
                  className="shrink-0"
                  style={{ color: colors.accentColor }}
                  aria-hidden="true"
                />
              )}
              <EditableText
                isEditing={isEditing}
                value={data.email}
                onChange={(email) => onUpdate({ email })}
                placeholder="[Email]"
              />
            </div>
          )}

          {/* LinkedIn */}
          {(data.linkedin || isEditing) && (
            <div className="flex items-center gap-1.5 shrink-0">
              {headerSettings.showIcons && (
                <Linkedin
                  size={12}
                  className="shrink-0"
                  style={{ color: colors.accentColor }}
                  aria-hidden="true"
                />
              )}
              <EditableText
                isEditing={isEditing}
                value={data.linkedin}
                onChange={(linkedin) => onUpdate({ linkedin })}
                placeholder="[LinkedIn]"
              />
            </div>
          )}

          {/* Location */}
          {(data.location || isEditing) && (
            <div className="flex items-center gap-1.5 shrink-0">
              {headerSettings.showIcons && (
                <MapPin
                  size={12}
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
    </header>
  );
};
