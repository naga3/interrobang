#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const { run, inspect, encode } = require('./interrobang');

function printUsage() {
  console.log(`
Interrobang (‽) - The Esoteric Screaming Programming Language

Usage:
  node cli.js <file.ib>              Run an Interrobang program
  node cli.js --inspect <file.ib>    Inspect / disassemble an Interrobang program
  node cli.js --encode "text"        Encode text into Interrobang scream code
  node cli.js --encode-pure "text"   Encode text into pure ! and ? symbols
  cat <file.ib> | node cli.js        Run code from stdin

Options:
  -h, --help     Show this help
  -v, --version  Show version
`);
}

const args = process.argv.slice(2);

if (args.length === 0) {
  // Check if stdin has data
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
  console.log('Interrobang v1.0.0');
  process.exit(0);
}

if (args[0] === '--encode' || args[0] === '-e') {
  const text = args.slice(1).join(' ') || '';
  console.log(encode(text, { mode: 'scream' }));
  process.exit(0);
}

if (args[0] === '--encode-pure') {
  const text = args.slice(1).join(' ') || '';
  console.log(encode(text, { mode: 'pure' }));
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
  console.log('Line | Bits       | CodePoint | Char | Raw');
  console.log('-----+------------+-----------+------+------------------------');
  details.forEach(item => {
    const lno = String(item.lineNumber).padStart(4, ' ');
    const bits = item.bits.padEnd(10, ' ');
    const cp = item.codePoint !== null ? ('0x' + item.codePoint.toString(16).toUpperCase()).padStart(9, ' ') : '         ';
    const ch = (item.char === '\n' ? '\\n' : item.char).padEnd(4, ' ');
    console.log(`${lno} | ${bits} | ${cp} | ${ch} | ${item.raw}`);
  });
  console.log('\nResult: ' + details.map(d => d.char).join(''));
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
