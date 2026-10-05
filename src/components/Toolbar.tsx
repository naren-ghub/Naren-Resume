import React, { useRef } from 'react';
import {
  Printer,
  Sliders,
  Eye,
  Edit3,
  RotateCcw,
  Download,
  Upload,
  ZoomIn,
  ZoomOut,
} from 'lucide-react';

interface ToolbarProps {
  isEditing: boolean;
  onToggleEdit: () => void;
  isCustomizerOpen: boolean;
  onToggleCustomizer: () => void;
  onPrint: () => void;
  onReset: () => void;
  onExportJson: () => void;
  onImportJson: (file: File) => void;
  zoom: number;
  onZoomChange: (newZoom: number) => void;
}

export const Toolbar: React.FC<ToolbarProps> = ({
  isEditing,
  onToggleEdit,
  isCustomizerOpen,
  onToggleCustomizer,
  onPrint,
  onReset,
  onExportJson,
  onImportJson,
  zoom,
  onZoomChange,
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      onImportJson(file);
      e.target.value = '';
    }
  };

  return (
    <header className="sticky top-0 z-40 w-full bg-white/90 backdrop-blur-md border-b border-slate-200 shadow-2xs no-print">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 h-14 flex items-center justify-between gap-4">
        {/* Left: App Branding & Status */}
        <div className="flex items-center gap-3">
          <div className="flex items-baseline gap-2">
            <span className="font-bold text-slate-900 tracking-tight text-sm sm:text-base">
              Enhancv Modern
            </span>
            <span className="text-xs text-slate-500 hidden sm:inline">
              · A4 Resume Template
            </span>
          </div>

          <span
            className={`hidden md:inline-flex items-center text-xs px-2 py-0.5 rounded-md font-medium ${
              isEditing
                ? 'bg-blue-50 text-blue-700 border border-blue-200'
                : 'bg-emerald-50 text-emerald-700 border border-emerald-200'
            }`}
          >
            {isEditing ? 'Editing Mode' : 'Print Preview Mode'}
          </span>
        </div>

        {/* Center: Zoom controls */}
        <div className="hidden lg:flex items-center gap-1.5 bg-slate-100 p-1 rounded-lg text-slate-600">
          <button
            type="button"
            onClick={() => onZoomChange(Math.max(0.6, zoom - 0.1))}
            title="Zoom Out"
            className="p-1 hover:text-slate-900 hover:bg-white rounded transition-colors"
          >
            <ZoomOut size={14} />
          </button>
          <span className="text-xs font-mono font-medium px-1.5 tabular-nums min-w-[42px] text-center">
            {Math.round(zoom * 100)}%
          </span>
          <button
            type="button"
            onClick={() => onZoomChange(Math.min(1.3, zoom + 0.1))}
            title="Zoom In"
            className="p-1 hover:text-slate-900 hover:bg-white rounded transition-colors"
          >
            <ZoomIn size={14} />
          </button>
          <button
            type="button"
            onClick={() => onZoomChange(1.0)}
            title="Reset Zoom to 100%"
            className="text-[11px] px-2 py-0.5 hover:text-slate-900 hover:bg-white rounded font-medium transition-colors ml-1"
          >
            100%
          </button>
        </div>

        {/* Right: Actions */}
        <div className="flex items-center gap-2">
          {/* Edit / Preview Toggle */}
          <button
            type="button"
            onClick={onToggleEdit}
            className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-lg transition-colors ${
              isEditing
                ? 'bg-blue-600 text-white hover:bg-blue-700 shadow-xs'
                : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
            }`}
            title={isEditing ? 'Switch to clean view mode' : 'Click to enable editing'}
          >
            {isEditing ? <Eye size={14} /> : <Edit3 size={14} />}
            <span className="hidden sm:inline">
              {isEditing ? 'Preview' : 'Edit Text'}
            </span>
          </button>

          {/* Customize Drawer Toggle */}
          <button
            type="button"
            onClick={onToggleCustomizer}
            className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-lg border transition-colors ${
              isCustomizerOpen
                ? 'border-blue-600 text-blue-700 bg-blue-50/50'
                : 'border-slate-300 text-slate-700 hover:bg-slate-50'
            }`}
            title="Customize fonts, colors, spacing, and sections"
          >
            <Sliders size={14} />
            <span className="hidden sm:inline">Customize</span>
          </button>

          {/* Print / Export PDF */}
          <button
            type="button"
            onClick={onPrint}
            className="flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-medium bg-slate-900 text-white rounded-lg hover:bg-slate-800 transition-colors shadow-xs"
            title="Print or Save as PDF"
          >
            <Printer size={14} />
            <span>Print / PDF</span>
          </button>

          {/* More options: Data Export/Import */}
          <div className="hidden sm:flex items-center gap-1 pl-2 border-l border-slate-200">
            <button
              type="button"
              onClick={onExportJson}
              title="Save resume data as JSON file"
              className="p-1.5 text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-lg transition-colors"
            >
              <Download size={15} />
            </button>
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              title="Load saved resume JSON file"
              className="p-1.5 text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-lg transition-colors"
            >
              <Upload size={15} />
            </button>
            <input
              ref={fileInputRef}
              type="file"
              accept=".json"
              className="hidden"
              onChange={handleFileChange}
            />

            <button
              type="button"
              onClick={onReset}
              title="Reset all content to standard placeholders"
              className="p-1.5 text-slate-600 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
            >
              <RotateCcw size={15} />
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};
