import { ResumeTypography } from '../types/resume';

/**
 * Returns numeric line-height for CSS calculations.
 * - 'tight': compact editorial A4 density (~1.22)
 * - 'normal': balanced professional density (~1.38)
 * - 'relaxed': open, airy readability (~1.65)
 */
export const getLineHeightValue = (lh?: ResumeTypography['lineHeight']): number => {
  switch (lh) {
    case 'tight':
      return 1.22;
    case 'relaxed':
      return 1.65;
    case 'normal':
    default:
      return 1.38;
  }
};

/**
 * Returns letter-spacing for headings (H1 name, H2 section headings, H3 entry titles).
 * - 'normal': 0.01em
 * - 'wide': 0.07em
 * - 'wider': 0.15em
 */
export const getHeadingLetterSpacing = (ls?: ResumeTypography['letterSpacing']): string => {
  switch (ls) {
    case 'wider':
      return '0.15em';
    case 'wide':
      return '0.07em';
    case 'normal':
    default:
      return '0.01em';
  }
};

/**
 * Returns letter-spacing for body copy, descriptions, bullets, and metadata.
 * - 'normal': 0em
 * - 'wide': 0.03em
 * - 'wider': 0.06em
 */
export const getBodyLetterSpacing = (ls?: ResumeTypography['letterSpacing']): string => {
  switch (ls) {
    case 'wider':
      return '0.06em';
    case 'wide':
      return '0.03em';
    case 'normal':
    default:
      return '0em';
  }
};
