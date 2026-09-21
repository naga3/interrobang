#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const { run, inspect, encode } = require('./interrobang');

function printUsage() {
  console.log(`
Interrobang (‽) - The Esoteric Screaming Programming Language (UTF-8 Supported)

Usage:
  node cli.js <file.ib>              Run an Interrobang program
  node cli.js --inspect <file.ib>    Inspect / disassemble with UTF-8 byte breakdown
  node cli.js --encode "text"        Encode text into UTF-8 Interrobang scream code
  node cli.js --encode-bytes "text"  Encode text with 1 byte (8-bit) per line
  node cli.js --encode-pure "text"   Encode text into pure ! and ? symbols
  cat <file.ib> | node cli.js        Run code from stdin

Options:
  --encoding <utf-8|codepoint|auto>  Set decoding standard (default: auto)
  -h, --help                         Show this help
  -v, --version                      Show version
`);
}

const args = process.argv.slice(2);

if (args.length === 0) {
  if (!process.stdin.isTTY) {
    let input = '';
    process.stdin.setEncoding('utf8');
    process.stdin.on('data', chunk => { input += chunk; });
    process.stdin.on('end', () => {
      process.stdout.write(run(input) + '\n');
    });
    return;
  }
  printUsage();
  process.exit(0);
}

if (args[0] === '-h' || args[0] === '--help') {
  printUsage();
  process.exit(0);
}

if (args[0] === '-v' || args[0] === '--version') {
  console.log('Interrobang v1.1.0 (UTF-8 edition)');
  process.exit(0);
}

if (args[0] === '--encode' || args[0] === '-e') {
  const text = args.slice(1).join(' ') || '';
  console.log(encode(text, { encoding: 'utf-8', unit: 'char', mode: 'scream' }));
  process.exit(0);
}

if (args[0] === '--encode-bytes') {
  const text = args.slice(1).join(' ') || '';
  console.log(encode(text, { encoding: 'utf-8', unit: 'byte', mode: 'scream' }));
  process.exit(0);
}

if (args[0] === '--encode-pure') {
  const text = args.slice(1).join(' ') || '';
  console.log(encode(text, { encoding: 'utf-8', unit: 'char', mode: 'pure' }));
  process.exit(0);
}

if (args[0] === '--inspect' || args[0] === '-i') {
  const filePath = args[1];
  if (!filePath) {
    console.error('Error: file path required for --inspect');
    process.exit(1);
  }
  const content = fs.readFileSync(filePath, 'utf8');
  const details = inspect(content);
  console.log('Line | Bits                  | Format  | Hex Bytes       | Char | Raw');
  console.log('-----+-----------------------+---------+-----------------+------+-----------------------------');
  details.forEach(item => {
    const lno = String(item.lineNumber).padStart(4, ' ');
    const bits = (item.bits.length > 21 ? item.bits.slice(0, 18) + '...' : item.bits).padEnd(21, ' ');
    const fmt = (item.encoding === 'utf-8' ? `UTF-8 (${item.bytes.length}B)` : 'CodePoint').padEnd(7, ' ');
    const hex = (item.hex || '').padEnd(15, ' ');
    const ch = (item.char === '\n' ? '\\n' : (item.char === '' ? '(buf)' : item.char)).padEnd(4, ' ');
    console.log(`${lno} | ${bits} | ${fmt} | ${hex} | ${ch} | ${item.raw}`);
  });
  console.log('\nResult: ' + run(content));
  process.exit(0);
}

// Treat argument as file
const filePath = args[0];
try {
  const content = fs.readFileSync(filePath, 'utf8');
  process.stdout.write(run(content) + '\n');
} catch (err) {
  console.error(`Error reading file "${filePath}":`, err.message);
  process.exit(1);
}
