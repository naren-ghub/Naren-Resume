import React, { useState } from 'react';
import {
  ResumeTemplateConfig,
  ResumeSection,
  ColumnTarget,
  SectionType,
} from '../types/resume';
import {
  X,
  Type,
  Palette,
  LayoutGrid,
  AlignLeft,
  Layers,
  Plus,
  Eye,
  EyeOff,
  ChevronUp,
  ChevronDown,
  ArrowLeftRight,
  Trash2,
  Check,
} from 'lucide-react';

interface CustomizerDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  config: ResumeTemplateConfig;
  onUpdateConfig: (updated: Partial<ResumeTemplateConfig>) => void;
  sections: ResumeSection[];
  onUpdateSection: (sectionId: string, updated: Partial<ResumeSection>) => void;
  onMoveSection: (sectionId: string, direction: 'up' | 'down') => void;
  onToggleSectionColumn: (sectionId: string) => void;
  onDeleteSection: (sectionId: string) => void;
  onAddSection: (column: ColumnTarget, type: SectionType) => void;
}

type TabType = 'typography' | 'colors' | 'layout' | 'header' | 'sections';

export const CustomizerDrawer: React.FC<CustomizerDrawerProps> = ({
  isOpen,
  onClose,
  config,
  onUpdateConfig,
  sections,
  onUpdateSection,
  onMoveSection,
  onToggleSectionColumn,
  onDeleteSection,
  onAddSection,
}) => {
  const [activeTab, setActiveTab] = useState<TabType>('typography');
  const [newSectionTitle, setNewSectionTitle] = useState('');
  const [newSectionType, setNewSectionType] = useState<SectionType>('custom');
  const [newSectionColumn, setNewSectionColumn] = useState<ColumnTarget>('main');

  if (!isOpen) return null;

  const { typography, colors, layout, headerSettings } = config;

  const updateTypography = (updated: Partial<typeof typography>) => {
    onUpdateConfig({
      typography: { ...typography, ...updated },
    });
  };

  const updateColors = (updated: Partial<typeof colors>) => {
    onUpdateConfig({
      colors: { ...colors, ...updated },
    });
  };

  const updateLayout = (updated: Partial<typeof layout>) => {
    onUpdateConfig({
      layout: { ...layout, ...updated },
    });
  };

  const updateHeader = (updated: Partial<typeof headerSettings>) => {
    onUpdateConfig({
      headerSettings: { ...headerSettings, ...updated },
    });
  };

  // Color preset palette matching Enhancv Modern signature options
  const colorPresets = [
    { name: 'Royal Sapphire', hex: '#1d4ed8' },
    { name: 'Deep Navy', hex: '#0f172a' },
    { name: 'Ocean Cyan', hex: '#0284c7' },
    { name: 'Emerald Forest', hex: '#047857' },
    { name: 'Crimson Wine', hex: '#9f1239' },
    { name: 'Amethyst Violet', hex: '#6d28d9' },
    { name: 'Warm Bronze', hex: '#b45309' },
    { name: 'Charcoal Slate', hex: '#334155' },
  ];

  const handleAddNewSectionSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onAddSection(newSectionColumn, newSectionType);
    setNewSectionTitle('');
  };

  return (
    <aside
      className="fixed inset-y-0 right-0 z-50 w-full sm:w-96 bg-white shadow-2xl border-l border-slate-200 flex flex-col no-print transition-all duration-300"
      aria-label="Resume Customizer"
    >
      {/* Drawer Header */}
      <div className="flex items-center justify-between px-5 py-3.5 border-b border-slate-200">
        <div>
          <h2 className="text-sm font-bold text-slate-900">Customize Template</h2>
          <p className="text-xs text-slate-500">Enhancv Modern styling & structure</p>
        </div>
        <button
          type="button"
          onClick={onClose}
          className="p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-lg transition-colors"
          title="Close panel"
        >
          <X size={18} />
        </button>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-slate-200 bg-slate-50 px-2 pt-1 gap-1 overflow-x-auto text-xs">
        <button
          type="button"
          onClick={() => setActiveTab('typography')}
          className={`flex items-center gap-1.5 px-3 py-2 font-medium border-b-2 transition-colors whitespace-nowrap ${
            activeTab === 'typography'
              ? 'border-blue-600 text-blue-600 bg-white'
              : 'border-transparent text-slate-600 hover:text-slate-900'
          }`}
        >
          <Type size={13} /> Typography
        </button>
        <button
          type="button"
          onClick={() => setActiveTab('colors')}
          className={`flex items-center gap-1.5 px-3 py-2 font-medium border-b-2 transition-colors whitespace-nowrap ${
            activeTab === 'colors'
              ? 'border-blue-600 text-blue-600 bg-white'
              : 'border-transparent text-slate-600 hover:text-slate-900'
          }`}
        >
          <Palette size={13} /> Colors
        </button>
        <button
          type="button"
          onClick={() => setActiveTab('layout')}
          className={`flex items-center gap-1.5 px-3 py-2 font-medium border-b-2 transition-colors whitespace-nowrap ${
            activeTab === 'layout'
              ? 'border-blue-600 text-blue-600 bg-white'
              : 'border-transparent text-slate-600 hover:text-slate-900'
          }`}
        >
          <LayoutGrid size={13} /> Layout
        </button>
        <button
          type="button"
          onClick={() => setActiveTab('header')}
          className={`flex items-center gap-1.5 px-3 py-2 font-medium border-b-2 transition-colors whitespace-nowrap ${
            activeTab === 'header'
              ? 'border-blue-600 text-blue-600 bg-white'
              : 'border-transparent text-slate-600 hover:text-slate-900'
          }`}
        >
          <AlignLeft size={13} /> Header
        </button>
        <button
          type="button"
          onClick={() => setActiveTab('sections')}
          className={`flex items-center gap-1.5 px-3 py-2 font-medium border-b-2 transition-colors whitespace-nowrap ${
            activeTab === 'sections'
              ? 'border-blue-600 text-blue-600 bg-white'
              : 'border-transparent text-slate-600 hover:text-slate-900'
          }`}
        >
          <Layers size={13} /> Sections
        </button>
      </div>

      {/* Tab Content */}
      <div className="flex-1 overflow-y-auto p-5 space-y-6 text-xs text-slate-700">
        {/* TYPOGRAPHY TAB */}
        {activeTab === 'typography' && (
          <div className="space-y-5">
            {/* Font Family */}
            <div>
              <label className="block font-semibold text-slate-900 mb-1.5">
                Font Family
              </label>
              <div className="grid grid-cols-1 gap-1.5">
                {(
                  [
                    'Plus Jakarta Sans',
                    'Inter',
                    'Outfit',
                    'DM Sans',
                    'Source Serif 4',
                  ] as const
                ).map((font) => (
                  <button
                    key={font}
                    type="button"
                    onClick={() => updateTypography({ fontFamily: font })}
                    className={`flex items-center justify-between px-3 py-2 rounded-lg border text-left transition-colors ${
                      typography.fontFamily === font
                        ? 'border-blue-600 bg-blue-50 text-blue-900 font-medium'
                        : 'border-slate-200 hover:bg-slate-50'
                    }`}
                  >
                    <span>{font}</span>
                    {typography.fontFamily === font && (
                      <Check size={14} className="text-blue-600" />
                    )}
                  </button>
                ))}
              </div>
            </div>

            {/* Candidate Name Font Size */}
            <div>
              <div className="flex justify-between items-center mb-1">
                <label className="font-semibold text-slate-900">Name Size</label>
                <span className="font-mono text-slate-500">{typography.nameSize}px</span>
              </div>
              <input
                type="range"
                min="24"
                max="40"
                step="2"
                value={typography.nameSize}
                onChange={(e) => updateTypography({ nameSize: Number(e.target.value) })}
                className="w-full accent-blue-600 cursor-pointer"
              />
            </div>

            {/* Name Weight */}
            <div>
              <label className="block font-semibold text-slate-900 mb-1.5">
                Name Weight
              </label>
              <div className="grid grid-cols-3 gap-2">
                {[
                  { label: 'Semibold', value: 'font-semibold' },
                  { label: 'Bold', value: 'font-bold' },
                  { label: 'ExtraBold', value: 'font-extrabold' },
                ].map((wt) => (
                  <button
                    key={wt.value}
                    type="button"
                    onClick={() =>
                      updateTypography({ nameWeight: wt.value as typeof typography.nameWeight })
                    }
                    className={`py-1.5 px-2 rounded-md border text-center transition-colors ${
                      typography.nameWeight === wt.value
                        ? 'border-blue-600 bg-blue-50 text-blue-900 font-semibold'
                        : 'border-slate-200 hover:bg-slate-50 text-slate-600'
                    }`}
                  >
                    {wt.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Section Heading Size */}
            <div>
              <div className="flex justify-between items-center mb-1">
                <label className="font-semibold text-slate-900">Heading Size</label>
                <span className="font-mono text-slate-500">{typography.headingSize}px</span>
              </div>
              <input
                type="range"
                min="12"
                max="16"
                step="1"
                value={typography.headingSize}
                onChange={(e) =>
                  updateTypography({ headingSize: Number(e.target.value) })
                }
                className="w-full accent-blue-600 cursor-pointer"
              />
            </div>

            {/* Body Text Size */}
            <div>
              <div className="flex justify-between items-center mb-1">
                <label className="font-semibold text-slate-900">Body Text Size</label>
                <span className="font-mono text-slate-500">{typography.bodySize}px</span>
              </div>
              <input
                type="range"
                min="11"
                max="14"
                step="0.5"
                value={typography.bodySize}
                onChange={(e) =>
                  updateTypography({ bodySize: Number(e.target.value) })
                }
                className="w-full accent-blue-600 cursor-pointer"
              />
            </div>

            {/* Line Height */}
            <div>
              <label className="block font-semibold text-slate-900 mb-1.5">
                Line Spacing
              </label>
              <div className="grid grid-cols-3 gap-2">
                {(['tight', 'normal', 'relaxed'] as const).map((lh) => (
                  <button
                    key={lh}
                    type="button"
                    onClick={() => updateTypography({ lineHeight: lh })}
                    className={`capitalize py-1.5 px-2 rounded-md border text-center transition-colors ${
                      typography.lineHeight === lh
                        ? 'border-blue-600 bg-blue-50 text-blue-900 font-semibold'
                        : 'border-slate-200 hover:bg-slate-50 text-slate-600'
                    }`}
                  >
                    {lh}
                  </button>
                ))}
              </div>
            </div>

            {/* Letter Spacing */}
            <div>
              <label className="block font-semibold text-slate-900 mb-1.5">
                Heading Tracking (Letter Spacing)
              </label>
              <div className="grid grid-cols-3 gap-2">
                {(['normal', 'wide', 'wider'] as const).map((track) => (
                  <button
                    key={track}
                    type="button"
                    onClick={() => updateTypography({ letterSpacing: track })}
                    className={`capitalize py-1.5 px-2 rounded-md border text-center transition-colors ${
                      typography.letterSpacing === track
                        ? 'border-blue-600 bg-blue-50 text-blue-900 font-semibold'
                        : 'border-slate-200 hover:bg-slate-50 text-slate-600'
                    }`}
                  >
                    {track}
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* COLORS TAB */}
        {activeTab === 'colors' && (
          <div className="space-y-5">
            {/* Accent Color Presets */}
            <div>
              <label className="block font-semibold text-slate-900 mb-1.5">
                Accent Color (Company, Links, Bullet Dots)
              </label>
              <div className="grid grid-cols-4 gap-2 mb-3">
                {colorPresets.map((preset) => (
                  <button
                    key={preset.hex}
                    type="button"
                    onClick={() => updateColors({ accentColor: preset.hex })}
                    className="flex flex-col items-center gap-1 group/color p-1 rounded-lg border border-slate-100 hover:border-slate-300"
                    title={preset.name}
                  >
                    <span
                      className="w-7 h-7 rounded-full flex items-center justify-center shadow-2xs"
                      style={{ backgroundColor: preset.hex }}
                    >
                      {colors.accentColor.toLowerCase() === preset.hex.toLowerCase() && (
                        <Check size={14} className="text-white" />
                      )}
                    </span>
                    <span className="text-[10px] text-slate-500 truncate w-full text-center">
                      {preset.name.split(' ')[0]}
                    </span>
                  </button>
                ))}
              </div>

              {/* Custom Accent Color Picker */}
              <div className="flex items-center gap-2 mt-2">
                <input
                  type="color"
                  value={colors.accentColor}
                  onChange={(e) => updateColors({ accentColor: e.target.value })}
                  className="w-8 h-8 rounded border border-slate-300 cursor-pointer p-0"
                />
                <input
                  type="text"
                  value={colors.accentColor}
                  onChange={(e) => updateColors({ accentColor: e.target.value })}
                  className="flex-1 px-2.5 py-1.5 rounded border border-slate-300 font-mono text-xs"
                />
              </div>
            </div>

            {/* Primary Text Color */}
            <div>
              <label className="block font-semibold text-slate-900 mb-1">
                Primary Text Color (Titles, Name, Body)
              </label>
              <div className="flex items-center gap-2">
                <input
                  type="color"
                  value={colors.primaryText}
                  onChange={(e) => updateColors({ primaryText: e.target.value })}
                  className="w-8 h-8 rounded border border-slate-300 cursor-pointer p-0"
                />
                <input
                  type="text"
                  value={colors.primaryText}
                  onChange={(e) => updateColors({ primaryText: e.target.value })}
                  className="flex-1 px-2.5 py-1.5 rounded border border-slate-300 font-mono text-xs"
                />
              </div>
            </div>

            {/* Secondary Text Color */}
            <div>
              <label className="block font-semibold text-slate-900 mb-1">
                Secondary Text Color (Dates, Locations, Details)
              </label>
              <div className="flex items-center gap-2">
                <input
                  type="color"
                  value={colors.secondaryText}
                  onChange={(e) => updateColors({ secondaryText: e.target.value })}
                  className="w-8 h-8 rounded border border-slate-300 cursor-pointer p-0"
                />
                <input
                  type="text"
                  value={colors.secondaryText}
                  onChange={(e) => updateColors({ secondaryText: e.target.value })}
                  className="flex-1 px-2.5 py-1.5 rounded border border-slate-300 font-mono text-xs"
                />
              </div>
            </div>

            {/* Heading Underline Accent Style */}
            <div>
              <label className="block font-semibold text-slate-900 mb-1.5">
                Section Divider Line Color
              </label>
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => updateColors({ headingDividerColor: 'accent' })}
                  className={`py-1.5 px-3 rounded-md border text-center transition-colors ${
                    colors.headingDividerColor === 'accent'
                      ? 'border-blue-600 bg-blue-50 text-blue-900 font-medium'
                      : 'border-slate-200 hover:bg-slate-50 text-slate-600'
                  }`}
                >
                  Accent Color
                </button>
                <button
                  type="button"
                  onClick={() => updateColors({ headingDividerColor: 'neutral' })}
                  className={`py-1.5 px-3 rounded-md border text-center transition-colors ${
                    colors.headingDividerColor === 'neutral'
                      ? 'border-blue-600 bg-blue-50 text-blue-900 font-medium'
                      : 'border-slate-200 hover:bg-slate-50 text-slate-600'
                  }`}
                >
                  Neutral Subtle Line
                </button>
              </div>
            </div>

            {/* Sidebar Subtle Background Tint */}
            <div>
              <label className="block font-semibold text-slate-900 mb-1.5">
                Sidebar Background Tint
              </label>
              <div className="grid grid-cols-3 gap-2">
                {[
                  { label: 'None (Clean)', val: 'transparent' },
                  { label: 'Soft Slate', val: '#f8fafc' },
                  { label: 'Warm Light', val: '#fcfbf9' },
                ].map((bg) => (
                  <button
                    key={bg.val}
                    type="button"
                    onClick={() => updateColors({ sidebarBackground: bg.val })}
                    className={`py-1.5 px-2 rounded-md border text-center transition-colors ${
                      colors.sidebarBackground === bg.val
                        ? 'border-blue-600 bg-blue-50 text-blue-900 font-medium'
                        : 'border-slate-200 hover:bg-slate-50 text-slate-600'
                    }`}
                  >
                    {bg.label}
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* LAYOUT & SPACING TAB */}
        {activeTab === 'layout' && (
          <div className="space-y-5">
            {/* Quick Compact Preset Banner */}
            <div className="p-3 bg-blue-50/70 border border-blue-200 rounded-lg flex items-center justify-between">
              <div>
                <span className="font-semibold text-blue-950 block text-xs">
                  1-Page Compact Preset
                </span>
                <span className="text-[11px] text-blue-700">
                  Sets 12mm margins, 10px section & 6px entry spacing
                </span>
              </div>
              <button
                type="button"
                onClick={() => {
                  updateLayout({
                    pageMargin: '12mm',
                    sectionSpacing: 10,
                    entrySpacing: 6,
                    columnGap: 16,
                    compactBullets: true,
                  });
                  updateTypography({
                    lineHeight: 'tight',
                  });
                }}
                className="px-2.5 py-1.5 bg-blue-600 text-white rounded text-xs font-medium hover:bg-blue-700 transition-colors shadow-2xs whitespace-nowrap"
              >
                Apply Compact
              </button>
            </div>

            {/* Page Margins */}
            <div>
              <div className="flex justify-between items-center mb-1.5">
                <label className="font-semibold text-slate-900">
                  Page Margins (A4)
                </label>
                <span className="font-mono text-slate-500">
                  {layout.pageMargin === '12mm' ? '12mm' : layout.pageMargin}
                </span>
              </div>
              <div className="grid grid-cols-2 gap-1.5 sm:grid-cols-4">
                {[
                  { label: '12mm', sub: 'Ultra', val: '12mm' },
                  { label: '14mm', sub: 'Compact', val: 'compact' },
                  { label: '18mm', sub: 'Standard', val: 'standard' },
                  { label: '22mm', sub: 'Spacious', val: 'spacious' },
                ].map((m) => (
                  <button
                    key={m.val}
                    type="button"
                    onClick={() =>
                      updateLayout({ pageMargin: m.val as typeof layout.pageMargin })
                    }
                    className={`py-1.5 px-1.5 rounded-md border text-center transition-colors ${
                      layout.pageMargin === m.val
                        ? 'border-blue-600 bg-blue-50 text-blue-900 font-semibold'
                        : 'border-slate-200 hover:bg-slate-50 text-slate-600'
                    }`}
                  >
                    <div className="text-xs leading-none">{m.label}</div>
                    <div className="text-[10px] text-slate-400 mt-0.5 leading-none">{m.sub}</div>
                  </button>
                ))}
              </div>
            </div>

            {/* Section Spacing */}
            <div>
              <div className="flex justify-between items-center mb-1">
                <label className="font-semibold text-slate-900">
                  Section Vertical Spacing
                </label>
                <span className="font-mono text-slate-500">{layout.sectionSpacing}px</span>
              </div>
              <input
                type="range"
                min="6"
                max="28"
                step="1"
                value={layout.sectionSpacing}
                onChange={(e) =>
                  updateLayout({ sectionSpacing: Number(e.target.value) })
                }
                className="w-full accent-blue-600 cursor-pointer"
              />
              <div className="flex justify-between text-[10px] text-slate-400 mt-0.5">
                <span>Ultra-tight (6px)</span>
                <span>Compact (12px)</span>
                <span>Airy (28px)</span>
              </div>
            </div>

            {/* Entry Spacing */}
            <div>
              <div className="flex justify-between items-center mb-1">
                <label className="font-semibold text-slate-900">
                  Entry Vertical Spacing
                </label>
                <span className="font-mono text-slate-500">{layout.entrySpacing}px</span>
              </div>
              <input
                type="range"
                min="4"
                max="20"
                step="1"
                value={layout.entrySpacing}
                onChange={(e) =>
                  updateLayout({ entrySpacing: Number(e.target.value) })
                }
                className="w-full accent-blue-600 cursor-pointer"
              />
              <div className="flex justify-between text-[10px] text-slate-400 mt-0.5">
                <span>Tight (4px)</span>
                <span>Compact (8px)</span>
                <span>Standard (14px)</span>
              </div>
            </div>

            {/* Column Gap */}
            <div>
              <div className="flex justify-between items-center mb-1">
                <label className="font-semibold text-slate-900">Column Gap</label>
                <span className="font-mono text-slate-500">{layout.columnGap}px</span>
              </div>
              <input
                type="range"
                min="12"
                max="32"
                step="2"
                value={layout.columnGap}
                onChange={(e) =>
                  updateLayout({ columnGap: Number(e.target.value) })
                }
                className="w-full accent-blue-600 cursor-pointer"
              />
            </div>

            {/* Compact Bullets Toggle */}
            <div className="flex items-center justify-between pt-1">
              <div>
                <span className="font-semibold text-slate-900 block">
                  Compact Bullet List Spacing
                </span>
                <span className="text-[11px] text-slate-500">
                  Tighten gap between bullet points for single-page fit
                </span>
              </div>
              <button
                type="button"
                onClick={() =>
                  updateLayout({ compactBullets: !layout.compactBullets })
                }
                className={`w-11 h-6 flex items-center rounded-full p-1 transition-colors ${
                  layout.compactBullets ? 'bg-blue-600 justify-end' : 'bg-slate-300 justify-start'
                }`}
              >
                <span className="w-4 h-4 rounded-full bg-white shadow-xs" />
              </button>
            </div>

            {/* Main Column Width Ratio */}
            <div>
              <div className="flex justify-between items-center mb-1">
                <label className="font-semibold text-slate-900">
                  Main Column Ratio ({layout.mainColumnRatio}% / {100 - layout.mainColumnRatio}%)
                </label>
              </div>
              <input
                type="range"
                min="60"
                max="75"
                step="1"
                value={layout.mainColumnRatio}
                onChange={(e) =>
                  updateLayout({ mainColumnRatio: Number(e.target.value) })
                }
                className="w-full accent-blue-600 cursor-pointer"
              />
              <div className="flex justify-between text-[11px] text-slate-400 mt-1">
                <span>Balanced (60%)</span>
                <span>Enhancv Standard (68%)</span>
                <span>Wide Narrative (75%)</span>
              </div>
            </div>

            {/* Vertical Divider Line Toggle */}
            <div className="pt-2 border-t border-slate-200 flex items-center justify-between">
              <div>
                <span className="font-semibold text-slate-900 block">
                  Column Hairline Divider
                </span>
                <span className="text-[11px] text-slate-500">
                  Thin vertical separator between columns
                </span>
              </div>
              <button
                type="button"
                onClick={() =>
                  updateLayout({ showVerticalDivider: !layout.showVerticalDivider })
                }
                className={`w-11 h-6 flex items-center rounded-full p-1 transition-colors ${
                  layout.showVerticalDivider ? 'bg-blue-600 justify-end' : 'bg-slate-300 justify-start'
                }`}
              >
                <span className="w-4 h-4 rounded-full bg-white shadow-xs" />
              </button>
            </div>
          </div>
        )}

        {/* HEADER TAB */}
        {activeTab === 'header' && (
          <div className="space-y-5">
            {/* Header Alignment */}
            <div>
              <label className="block font-semibold text-slate-900 mb-1.5">
                Header Alignment
              </label>
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => updateHeader({ alignment: 'left' })}
                  className={`py-1.5 px-3 rounded-md border text-center transition-colors ${
                    headerSettings.alignment === 'left'
                      ? 'border-blue-600 bg-blue-50 text-blue-900 font-medium'
                      : 'border-slate-200 hover:bg-slate-50 text-slate-600'
                  }`}
                >
                  Left-Aligned (Classic)
                </button>
                <button
                  type="button"
                  onClick={() => updateHeader({ alignment: 'center' })}
                  className={`py-1.5 px-3 rounded-md border text-center transition-colors ${
                    headerSettings.alignment === 'center'
                      ? 'border-blue-600 bg-blue-50 text-blue-900 font-medium'
                      : 'border-slate-200 hover:bg-slate-50 text-slate-600'
                  }`}
                >
                  Centered
                </button>
              </div>
            </div>

            {/* Show Line Icons in Contact Bar */}
            <div className="flex items-center justify-between">
              <div>
                <span className="font-semibold text-slate-900 block">
                  Contact Line Icons
                </span>
                <span className="text-[11px] text-slate-500">
                  Display subtle icons before phone, email, etc.
                </span>
              </div>
              <button
                type="button"
                onClick={() =>
                  updateHeader({ showIcons: !headerSettings.showIcons })
                }
                className={`w-11 h-6 flex items-center rounded-full p-1 transition-colors ${
                  headerSettings.showIcons ? 'bg-blue-600 justify-end' : 'bg-slate-300 justify-start'
                }`}
              >
                <span className="w-4 h-4 rounded-full bg-white shadow-xs" />
              </button>
            </div>

            {/* Contact Items Spacing */}
            <div>
              <div className="flex justify-between items-center mb-1">
                <label className="font-semibold text-slate-900">
                  Contact Item Spacing
                </label>
                <span className="font-mono text-slate-500">{headerSettings.contactSpacing}px</span>
              </div>
              <input
                type="range"
                min="12"
                max="24"
                step="2"
                value={headerSettings.contactSpacing}
                onChange={(e) =>
                  updateHeader({ contactSpacing: Number(e.target.value) })
                }
                className="w-full accent-blue-600 cursor-pointer"
              />
            </div>

            {/* Name Capitalization */}
            <div>
              <label className="block font-semibold text-slate-900 mb-1.5">
                Name Transform
              </label>
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => updateHeader({ nameTransform: 'none' })}
                  className={`py-1.5 px-3 rounded-md border text-center transition-colors ${
                    headerSettings.nameTransform === 'none'
                      ? 'border-blue-600 bg-blue-50 text-blue-900 font-medium'
                      : 'border-slate-200 hover:bg-slate-50 text-slate-600'
                  }`}
                >
                  As Typed
                </button>
                <button
                  type="button"
                  onClick={() => updateHeader({ nameTransform: 'uppercase' })}
                  className={`py-1.5 px-3 rounded-md border text-center transition-colors ${
                    headerSettings.nameTransform === 'uppercase'
                      ? 'border-blue-600 bg-blue-50 text-blue-900 font-medium'
                      : 'border-slate-200 hover:bg-slate-50 text-slate-600'
                  }`}
                >
                  UPPERCASE
                </button>
              </div>
            </div>
          </div>
        )}

        {/* SECTIONS MANAGER TAB */}
        {activeTab === 'sections' && (
          <div className="space-y-6">
            <div>
              <h3 className="font-bold text-slate-900 mb-2">Manage Sections</h3>
              <p className="text-xs text-slate-500 mb-3">
                Toggle visibility, reorder, or move sections between Main and Sidebar columns.
              </p>

              {/* Sections List */}
              <div className="space-y-2">
                {sections.map((sec, idx) => (
                  <div
                    key={sec.id}
                    className="flex items-center justify-between p-2.5 rounded-lg border border-slate-200 bg-slate-50 hover:bg-white transition-colors"
                  >
                    <div className="flex items-center gap-2 overflow-hidden">
                      <button
                        type="button"
                        onClick={() =>
                          onUpdateSection(sec.id, { visible: !sec.visible })
                        }
                        title={sec.visible ? 'Hide section' : 'Show section'}
                        className={`p-1 rounded ${
                          sec.visible
                            ? 'text-blue-600 hover:bg-blue-50'
                            : 'text-slate-400 hover:bg-slate-200'
                        }`}
                      >
                        {sec.visible ? <Eye size={15} /> : <EyeOff size={15} />}
                      </button>
                      <div className="truncate">
                        <span className="font-semibold text-slate-900 truncate block">
                          {sec.title}
                        </span>
                        <span className="text-[10px] text-slate-500 capitalize">
                          {sec.column} column · {sec.type}
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center gap-1 shrink-0">
                      <button
                        type="button"
                        onClick={() => onMoveSection(sec.id, 'up')}
                        disabled={idx === 0}
                        title="Move Up"
                        className="p-1 text-slate-500 hover:text-slate-900 disabled:opacity-30 rounded"
                      >
                        <ChevronUp size={14} />
                      </button>
                      <button
                        type="button"
                        onClick={() => onMoveSection(sec.id, 'down')}
                        disabled={idx === sections.length - 1}
                        title="Move Down"
                        className="p-1 text-slate-500 hover:text-slate-900 disabled:opacity-30 rounded"
                      >
                        <ChevronDown size={14} />
                      </button>
                      <button
                        type="button"
                        onClick={() => onToggleSectionColumn(sec.id)}
                        title={`Move to ${sec.column === 'main' ? 'Sidebar' : 'Main'} column`}
                        className="p-1 text-slate-500 hover:text-indigo-600 rounded"
                      >
                        <ArrowLeftRight size={14} />
                      </button>
                      <button
                        type="button"
                        onClick={() => onDeleteSection(sec.id)}
                        title="Delete section"
                        className="p-1 text-slate-500 hover:text-red-600 rounded"
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Add New Section Form */}
            <form
              onSubmit={handleAddNewSectionSubmit}
              className="p-3.5 border border-dashed border-slate-300 rounded-lg bg-slate-50/50 space-y-3"
            >
              <h4 className="font-semibold text-slate-900 flex items-center gap-1.5">
                <Plus size={14} /> Add New Section
              </h4>

              <div>
                <label className="block text-[11px] text-slate-600 mb-1">
                  Section Type
                </label>
                <select
                  value={newSectionType}
                  onChange={(e) => setNewSectionType(e.target.value as SectionType)}
                  className="w-full px-2.5 py-1.5 border border-slate-300 rounded bg-white text-xs"
                >
                  <option value="custom">Custom Section (Flexible)</option>
                  <option value="experience">Experience</option>
                  <option value="projects">Projects</option>
                  <option value="education">Education</option>
                  <option value="skills">Skills</option>
                  <option value="certifications">Certifications</option>
                  <option value="languages">Languages</option>
                  <option value="summary">Summary</option>
                </select>
              </div>

              <div>
                <label className="block text-[11px] text-slate-600 mb-1">
                  Target Column
                </label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => setNewSectionColumn('main')}
                    className={`py-1 px-2 rounded border text-center text-xs ${
                      newSectionColumn === 'main'
                        ? 'border-blue-600 bg-blue-50 text-blue-900 font-medium'
                        : 'border-slate-200 bg-white text-slate-600'
                    }`}
                  >
                    Main Column
                  </button>
                  <button
                    type="button"
                    onClick={() => setNewSectionColumn('sidebar')}
                    className={`py-1 px-2 rounded border text-center text-xs ${
                      newSectionColumn === 'sidebar'
                        ? 'border-blue-600 bg-blue-50 text-blue-900 font-medium'
                        : 'border-slate-200 bg-white text-slate-600'
                    }`}
                  >
                    Sidebar Column
                  </button>
                </div>
              </div>

              <button
                type="submit"
                className="w-full py-2 bg-blue-600 text-white rounded font-medium hover:bg-blue-700 transition-colors shadow-xs"
              >
                Add Section
              </button>
            </form>
          </div>
        )}
      </div>
    </aside>
  );
};
