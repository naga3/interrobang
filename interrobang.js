/**
 * Interrobang (‽) - The Esoteric Screaming Programming Language
 *
 * Language Specification:
 * - '!' / '！' = 0
 * - '?' / '？' = 1
 * - All other characters are ignored (screams, comments, whitespace, punctuation)
 * - Each line outputs one character corresponding to the binary data (UTF-8 / Unicode)
 */

const SCREAM_WORDS = [
  'わあ', 'えっ', 'ぎゃあ', 'わわわ', 'あっ', 'ええっ', 'うわ',
  'ぎゃああ', 'うそ', 'ぎゃあああ', 'ひえっ', 'きゃー', 'なんだってー',
  '助けて', 'うわああ', 'あ', 'わ', 'ひい', 'もうだめだ'
];

/**
 * Executes an Interrobang program and returns the decoded string.
 * Supports UTF-8 multibyte lines, 1-byte-per-line UTF-8 streams, and Unicode code points.
 * @param {string} source - Source code
 * @param {Object} [options]
 * @param {'auto'|'utf-8'|'codepoint'} [options.encoding='auto']
 * @returns {string} Decoded output
 */
function run(source, options = {}) {
  const encoding = options.encoding || 'auto';
  const inspection = inspect(source);
  if (inspection.length === 0) return '';

  if (encoding === 'codepoint') {
    return inspection.map(item => item.char).join('');
  }

  // Check if all lines are multiples of 8 bits
  const allMultipleOf8 = inspection.every(item => item.bits.length % 8 === 0);
  if (allMultipleOf8) {
    const allBytes = [];
    inspection.forEach(item => {
      for (let i = 0; i < item.bits.length; i += 8) {
        allBytes.push(parseInt(item.bits.slice(i, i + 8), 2));
      }
    });

    try {
      const decoder = new TextDecoder('utf-8', { fatal: true });
      return decoder.decode(new Uint8Array(allBytes));
    } catch {
      // Fallback if not valid UTF-8
    }
  }

  // Fallback to per-line decoded chars
  return inspection.map(item => item.char).join('');
}

/**
 * Disassembles and inspects each line of source code.
 * @param {string} source - Source code
 * @returns {Array<{
 *   lineNumber: number,
 *   raw: string,
 *   bits: string,
 *   bitLength: number,
 *   bytes: number[]|null,
 *   hex: string,
 *   codePoint: number|null,
 *   char: string,
 *   encoding: string,
 *   valid: boolean
 * }>}
 */
function inspect(source) {
  if (typeof source !== 'string') return [];
  const lines = source.split(/\r?\n/);
  const result = [];

  lines.forEach((raw, idx) => {
    let bits = '';
    for (const ch of raw) {
      if (ch === '！' || ch === '!') {
        bits += '0';
      } else if (ch === '？' || ch === '?') {
        bits += '1';
      }
    }

    if (bits.length > 0) {
      let char = '';
      let bytes = null;
      let hex = '';
      let codePoint = null;
      let encoding = 'codepoint';
      let valid = true;

      // Check if bits length is multiple of 8 (UTF-8 candidate)
      if (bits.length % 8 === 0) {
        bytes = [];
        for (let i = 0; i < bits.length; i += 8) {
          bytes.push(parseInt(bits.slice(i, i + 8), 2));
        }
        hex = bytes.map(b => '0x' + b.toString(16).toUpperCase().padStart(2, '0')).join(' ');

        // Try single-line UTF-8 decoding
        try {
          const utf8Dec = new TextDecoder('utf-8', { fatal: true });
          char = utf8Dec.decode(new Uint8Array(bytes));
          encoding = 'utf-8';
        } catch {
          // Could be a partial byte in a stream, or raw codepoint
          char = '';
        }
      }

      // If UTF-8 didn't yield a character, fallback to codepoint
      if (!char) {
        try {
          codePoint = parseInt(bits, 2);
          if (!isNaN(codePoint) && codePoint >= 0 && codePoint <= 0x10FFFF) {
            char = String.fromCodePoint(codePoint);
            if (!hex) {
              hex = '0x' + codePoint.toString(16).toUpperCase();
            }
          } else {
            valid = false;
          }
        } catch {
          valid = false;
        }
      } else if (codePoint === null && char.length > 0) {
        codePoint = char.codePointAt(0);
      }

      result.push({
        lineNumber: idx + 1,
        raw,
        bits,
        bitLength: bits.length,
        bytes,
        hex,
        codePoint,
        char,
        encoding,
        valid
      });
    }
  });

  return result;
}

/**
 * Encodes plain text into Interrobang code.
 * @param {string} text - Plain text to encode
 * @param {Object} [options]
 * @param {'scream'|'pure'|'stealth'|'custom'} [options.mode='scream'] - Encoding style
 * @param {'utf-8'|'codepoint'} [options.encoding='utf-8'] - Character encoding standard
 * @param {'char'|'byte'} [options.unit='char'] - 'char' = 1 character per line (multibyte UTF-8), 'byte' = 1 byte per line (8-bit)
 * @param {string[]} [options.customWords] - Custom filler words
 * @param {boolean} [options.fullWidth=true] - Use full-width ！ and ？
 * @returns {string} Interrobang source code
 */
function encode(text, options = {}) {
  const mode = options.mode || 'scream';
  const encoding = options.encoding || 'utf-8';
  const unit = options.unit || 'char';
  const fullWidth = options.fullWidth !== false;
  const zero = fullWidth ? '！' : '!';
  const one = fullWidth ? '？' : '?';
  const words = (options.customWords && options.customWords.length > 0)
    ? options.customWords
    : SCREAM_WORDS;

  const lines = [];

  if (encoding === 'utf-8') {
    const textEncoder = new TextEncoder();

    if (unit === 'byte') {
      // 1 byte (8-bit) per line
      const bytes = textEncoder.encode(text);
      bytes.forEach(b => {
        const binary = b.toString(2).padStart(8, '0');
        const symbols = Array.from(binary).map(bit => (bit === '0' ? zero : one));
        lines.push(formatLine(symbols, mode, words));
      });
    } else {
      // 1 character per line (each line has the full UTF-8 byte sequence)
      for (const ch of Array.from(text)) {
        const bytes = textEncoder.encode(ch);
        const binary = Array.from(bytes)
          .map(b => b.toString(2).padStart(8, '0'))
          .join('');
        const symbols = Array.from(binary).map(bit => (bit === '0' ? zero : one));
        lines.push(formatLine(symbols, mode, words));
      }
    }
  } else {
    // Unicode Code Point mode
    for (const ch of Array.from(text)) {
      const codePoint = ch.codePointAt(0);
      let binary = codePoint.toString(2);
      if (codePoint < 128) {
        binary = binary.padStart(8, '0');
      }
      const symbols = Array.from(binary).map(bit => (bit === '0' ? zero : one));
      lines.push(formatLine(symbols, mode, words));
    }
  }

  return lines.join('\n');
}

/**
 * Helper to format symbols according to mode
 */
function formatLine(symbols, mode, words) {
  if (mode === 'pure') {
    return symbols.join('');
  } else if (mode === 'scream' || mode === 'custom') {
    return formatScreamLine(symbols, words);
  } else if (mode === 'stealth') {
    return formatStealthLine(symbols);
  }
  return symbols.join('');
}

/**
 * Formats symbols with random scream words
 */
function formatScreamLine(symbols, words) {
  const pick = arr => arr[Math.floor(Math.random() * arr.length)];
  let line = pick(words);

  let i = 0;
  while (i < symbols.length) {
    const chunkSize = Math.min(symbols.length - i, Math.floor(Math.random() * 3) + 1);
    const chunk = symbols.slice(i, i + chunkSize).join('');
    line += chunk;
    i += chunkSize;

    if (i < symbols.length && Math.random() > 0.4) {
      line += pick(words);
    }
  }

  return line;
}

/**
 * Formats symbols into stealth disguise phrases
 */
function formatStealthLine(symbols) {
  const prefixes = ['本当に', 'まさか', 'え', 'なんだって', '信じられない', 'ちょっと待って'];
  const midFillers = ['そんな', '嘘でしょ', 'まさか', 'ありえない'];
  const pick = arr => arr[Math.floor(Math.random() * arr.length)];

  let line = pick(prefixes);
  let i = 0;
  while (i < symbols.length) {
    const chunkSize = Math.min(symbols.length - i, Math.floor(Math.random() * 2) + 1);
    line += symbols.slice(i, i + chunkSize).join('');
    i += chunkSize;
    if (i < symbols.length && Math.random() > 0.5) {
      line += pick(midFillers);
    }
  }
  return line;
}

/**
 * Compresses an Interrobang program into a compact URL-safe Base64 string.
 * Uses native CompressionStream (deflate-raw) + base64url.
 * @param {string} text
 * @returns {Promise<string>} Base64URL compressed string
 */
async function compress(text) {
  if (typeof CompressionStream === 'undefined') {
    return encodeURIComponent(text);
  }
  const stream = new Blob([text]).stream().pipeThrough(new CompressionStream('deflate-raw'));
  const buffer = await new Response(stream).arrayBuffer();
  const bytes = new Uint8Array(buffer);
  let binary = '';
  for (let i = 0; i < bytes.length; i++) {
    binary += String.fromCharCode(bytes[i]);
  }
  return btoa(binary)
    .replace(/\+/g, '-')
    .replace(/\//g, '_')
    .replace(/=+$/, '');
}

/**
 * Decompresses a Base64URL string back into Interrobang source code.
 * @param {string} b64url
 * @returns {Promise<string>}
 */
async function decompress(b64url) {
  if (!b64url) return '';
  if (typeof DecompressionStream === 'undefined') {
    return decodeURIComponent(b64url);
  }
  try {
    let base64 = b64url.replace(/-/g, '+').replace(/_/g, '/');
    while (base64.length % 4) {
      base64 += '=';
    }
    const binary = atob(base64);
    const bytes = new Uint8Array(binary.length);
    for (let i = 0; i < binary.length; i++) {
      bytes[i] = binary.charCodeAt(i);
    }
    const stream = new Blob([bytes]).stream().pipeThrough(new DecompressionStream('deflate-raw'));
    return await new Response(stream).text();
  } catch (err) {
    console.warn('Decompression failed, fallback to raw decode:', err);
    try {
      return decodeURIComponent(b64url);
    } catch {
      return '';
    }
  }
}

// Export for both Node.js and Browser
if (typeof module !== 'undefined' && module.exports) {
  module.exports = {
    run,
    inspect,
    encode,
    compress,
    decompress,
    SCREAM_WORDS
  };
}
if (typeof window !== 'undefined') {
  window.Interrobang = {
    run,
    inspect,
    encode,
    compress,
    decompress,
    SCREAM_WORDS
  };
}

