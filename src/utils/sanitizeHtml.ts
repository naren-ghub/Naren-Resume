/**
 * HTML Sanitizer & Paste Normalizer for Resume Inline Rich Text
 *
 * Rules:
 * 1. The resume template's typography (font-size, font-family, color, line-height) is authoritative.
 * 2. Only semantic inline tags are permitted: <strong>, <b>, <em>, <i>, <u>, <a>, <br>.
 * 3. ALL inline styles (font-size, color, font-family, background, margin, padding) are stripped.
 * 4. ALL CSS classes and non-whitelisted attributes are stripped.
 */

export const sanitizePastedContent = (rawHtml: string): string => {
  if (!rawHtml || !rawHtml.trim()) return '';

  try {
    const parser = new DOMParser();
    const doc = parser.parseFromString(rawHtml, 'text/html');

    // Remove dangerous and non-content elements
    const dangerousTags = [
      'script',
      'style',
      'meta',
      'link',
      'object',
      'embed',
      'iframe',
      'frame',
      'frameset',
      'svg',
      'canvas',
      'button',
      'input',
      'select',
      'textarea',
      'form',
      'xml',
    ];
    dangerousTags.forEach((tag) => {
      const elements = doc.querySelectorAll(tag);
      elements.forEach((el) => el.remove());
    });

    // Clean an element recursively
    const processNode = (node: Node): Node | null => {
      if (node.nodeType === Node.TEXT_NODE) {
        return node.cloneNode(true);
      }

      if (node.nodeType !== Node.ELEMENT_NODE) {
        return null;
      }

      const el = node as HTMLElement;
      const tagName = el.tagName.toLowerCase();

      // Check inline styles for bold, italic, underline before stripping style
      const inlineStyle = el.getAttribute('style') || '';
      const isBold =
        tagName === 'strong' ||
        tagName === 'b' ||
        /font-weight\s*:\s*(bold|[6-9]00)/i.test(inlineStyle);
      const isItalic =
        tagName === 'em' ||
        tagName === 'i' ||
        /font-style\s*:\s*italic/i.test(inlineStyle);
      const isUnderline =
        tagName === 'u' ||
        /text-decoration\s*:\s*[^;]*underline/i.test(inlineStyle);

      // Process children first
      const fragment = document.createDocumentFragment();
      Array.from(el.childNodes).forEach((child) => {
        const processed = processNode(child);
        if (processed) {
          fragment.appendChild(processed);
        }
      });

      // Special handling for links
      if (tagName === 'a') {
        const href = el.getAttribute('href') || '';
        if (
          href &&
          !href.toLowerCase().startsWith('javascript:') &&
          !href.toLowerCase().startsWith('data:')
        ) {
          const cleanLink = document.createElement('a');
          cleanLink.setAttribute('href', href);
          cleanLink.setAttribute('target', '_blank');
          cleanLink.setAttribute('rel', 'noopener noreferrer');
          cleanLink.appendChild(fragment);
          return wrapSemanticFormatting(cleanLink, isBold, isItalic, isUnderline);
        }
      }

      // Special handling for line breaks
      if (tagName === 'br') {
        return document.createElement('br');
      }

      // Paragraph / Div block: add line break after if there are siblings
      if (tagName === 'p' || tagName === 'div' || tagName === 'li') {
        const container = document.createDocumentFragment();
        container.appendChild(fragment);
        // If it had children, append a break
        if (fragment.childNodes.length > 0) {
          container.appendChild(document.createElement('br'));
        }
        return wrapSemanticFormatting(container, isBold, isItalic, isUnderline);
      }

      // Standard inline formatting wrappers
      let resultNode: Node = fragment;
      if (isBold) {
        const strong = document.createElement('strong');
        strong.appendChild(resultNode);
        resultNode = strong;
      }
      if (isItalic) {
        const em = document.createElement('em');
        em.appendChild(resultNode);
        resultNode = em;
      }
      if (isUnderline) {
        const u = document.createElement('u');
        u.appendChild(resultNode);
        resultNode = u;
      }

      return resultNode;
    };

    const wrapSemanticFormatting = (
      node: Node,
      bold: boolean,
      italic: boolean,
      underline: boolean
    ): Node => {
      let res = node;
      if (bold) {
        const s = document.createElement('strong');
        s.appendChild(res);
        res = s;
      }
      if (italic) {
        const e = document.createElement('em');
        e.appendChild(res);
        res = e;
      }
      if (underline) {
        const u = document.createElement('u');
        u.appendChild(res);
        res = u;
      }
      return res;
    };

    const container = document.createElement('div');
    Array.from(doc.body.childNodes).forEach((child) => {
      const processed = processNode(child);
      if (processed) {
        container.appendChild(processed);
      }
    });

    // Remove trailing <br> tags if any
    let cleanedHtml = container.innerHTML;
    cleanedHtml = cleanedHtml.replace(/(<br\s*\/?>\s*)+$/gi, '');
    return cleanedHtml;
  } catch (err) {
    // Fallback: plain text
    return rawHtml.replace(/<[^>]*>/g, '');
  }
};

/**
 * Normalizes rich text for clean storage, stripping empty tags
 */
export const cleanHtmlForStorage = (html: string): string => {
  if (!html) return '';

  let cleaned = html
    .replace(/<span\s*style="[^"]*">([\s\S]*?)<\/span>/gi, '$1')
    .replace(/<font[^>]*>([\s\S]*?)<\/font>/gi, '$1')
    .replace(/<div><br><\/div>/gi, '<br>')
    .replace(/<div>/gi, '<br>')
    .replace(/<\/div>/gi, '')
    .replace(/<p>/gi, '')
    .replace(/<\/p>/gi, '<br>')
    .replace(/<br\s*\/?>\s*<br\s*\/?>/gi, '<br>')
    .replace(/<strong\s*><\/strong>/gi, '')
    .replace(/<em\s*><\/em>/gi, '')
    .replace(/<u\s*><\/u>/gi, '')
    .replace(/<b\s*><\/b>/gi, '')
    .replace(/<i\s*><\/i>/gi, '');

  return cleaned.trim();
};
