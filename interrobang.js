/**
 * Interrobang (‽) - The Esoteric Screaming Programming Language
 *
 * Language Specification:
 * - '!' / '！' = 0
 * - '?' / '？' = 1
 * - All other characters are ignored (screams, comments, whitespace, punctuation)
 * - Each line outputs one character corresponding to the binary code point
 */

const SCREAM_WORDS = [
  'わあ', 'えっ', 'ぎゃあ', 'わわわ', 'あっ', 'ええっ', 'うわ',
  'ぎゃああ', 'うそ', 'ぎゃあああ', 'ひえっ', 'きゃー', 'なんだってー',
  '助けて', 'うわああ', 'あ', 'わ', 'ひい', 'もうだめだ'
];

/**
 * Executes an Interrobang program and returns the decoded string.
 * @param {string} source - Source code
 * @returns {string} Decoded output
 */
function run(source) {
  const inspection = inspect(source);
  return inspection.map(item => item.char).join('');
}

/**
 * Disassembles and inspects each line of source code.
 * @param {string} source - Source code
 * @returns {Array<{lineNumber: number, raw: string, bits: string, codePoint: number|null, char: string}>}
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
      try {
        const codePoint = parseInt(bits, 2);
        let char = '';
        if (!isNaN(codePoint) && codePoint >= 0 && codePoint <= 0x10FFFF) {
          char = String.fromCodePoint(codePoint);
        } else {
          char = '';
        }
        result.push({
          lineNumber: idx + 1,
          raw,
          bits,
          codePoint,
          char,
          valid: true
        });
      } catch {
        result.push({
          lineNumber: idx + 1,
          raw,
          bits,
          codePoint: null,
          char: '',
          valid: false
        });
      }
    }
  });

  return result;
}

/**
 * Encodes plain text into Interrobang code.
 * @param {string} text - Plain text to encode
 * @param {Object} options
 * @param {'scream'|'pure'|'stealth'|'custom'} options.mode - Encoding style
 * @param {string[]} [options.customWords] - Custom filler words
 * @param {boolean} [options.fullWidth=true] - Use full-width ！ and ？
 * @returns {string} Interrobang source code
 */
function encode(text, options = {}) {
  const mode = options.mode || 'scream';
  const fullWidth = options.fullWidth !== false;
  const zero = fullWidth ? '！' : '!';
  const one = fullWidth ? '？' : '?';
  const words = (options.customWords && options.customWords.length > 0)
    ? options.customWords
    : SCREAM_WORDS;

  // Split into Unicode code points correctly
  const characters = Array.from(text);
  const lines = [];

  characters.forEach(ch => {
    const codePoint = ch.codePointAt(0);
    let binary = codePoint.toString(2);
    // Pad ASCII to 8 bits for consistency
    if (codePoint < 128) {
      binary = binary.padStart(8, '0');
    }

    // Convert binary to symbols
    const symbols = Array.from(binary).map(b => (b === '0' ? zero : one));

    if (mode === 'pure') {
      lines.push(symbols.join(''));
    } else if (mode === 'scream') {
      lines.push(formatScreamLine(symbols, words));
    } else if (mode === 'stealth') {
      lines.push(formatStealthLine(symbols));
    } else if (mode === 'custom') {
      lines.push(formatScreamLine(symbols, words));
    } else {
      lines.push(symbols.join(''));
    }
  });

  return lines.join('\n');
}

/**
 * Formats symbols with random scream words
 */
function formatScreamLine(symbols, words) {
  const pick = arr => arr[Math.floor(Math.random() * arr.length)];
  let line = pick(words);

  let i = 0;
  while (i < symbols.length) {
    // Take a chunk of 1 to 3 symbols
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

// Export for both Node.js and Browser
if (typeof module !== 'undefined' && module.exports) {
  module.exports = {
    run,
    inspect,
    encode,
    SCREAM_WORDS
  };
}
if (typeof window !== 'undefined') {
  window.Interrobang = {
    run,
    inspect,
    encode,
    SCREAM_WORDS
  };
}
