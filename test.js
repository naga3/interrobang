const assert = require('assert');
const { run, inspect, encode } = require('./interrobang');

console.log('Running Interrobang UTF-8 test suite...');

// 1. Test Hello World (original ASCII prompt)
const helloWorldSource = `わあ！？わ！！あ？！！！
えっ！？？あ！！？！？
ぎゃあ！？？！あ？？！！
わわわ！？？あ！？？！！
あっ！？？わ！？？？？
ええっ！！？あ！！！！！
うわ！？！？あ！？？？
わあ！？？あ！？？？？
ぎゃああ！？？？あ！！？！
えっ！？？！あ？？！！
うそ！？？あ！！？！！
ぎゃあああ！！？あ！！！！？`;

const helloOut = run(helloWorldSource);
assert.strictEqual(helloOut, 'Hello World!', 'Hello World must match');
console.log('✓ Hello World ASCII test passed');

// 2. Test UTF-8 Japanese multibyte (1 character per line)
const jaText = 'こんにちは世界！🎉';
const encodedJaChar = encode(jaText, { encoding: 'utf-8', unit: 'char', mode: 'scream' });
const decodedJaChar = run(encodedJaChar);
assert.strictEqual(decodedJaChar, jaText, 'UTF-8 1-character-per-line roundtrip must match');
console.log('✓ UTF-8 1-character-per-line test passed');

// 3. Test UTF-8 Japanese byte stream (1 byte per line)
const encodedJaByte = encode(jaText, { encoding: 'utf-8', unit: 'byte', mode: 'scream' });
const decodedJaByte = run(encodedJaByte);
assert.strictEqual(decodedJaByte, jaText, 'UTF-8 1-byte-per-line stream roundtrip must match');
console.log('✓ UTF-8 1-byte-per-line stream test passed');

// 4. Test Pure symbols mode in UTF-8
const pureEncoded = encode('こんにちは', { encoding: 'utf-8', mode: 'pure' });
assert.strictEqual(run(pureEncoded), 'こんにちは', 'Pure UTF-8 must match');
console.log('✓ UTF-8 pure symbols mode test passed');

// 5. Test Unicode Code Point mode fallback
const cpEncoded = encode('草', { encoding: 'codepoint', mode: 'pure' });
assert.strictEqual(run(cpEncoded), '草', 'Code point fallback must match');
console.log('✓ Code point fallback test passed');

// 6. Test Inspector with UTF-8 details
const inspectResults = inspect(encodedJaChar);
assert.strictEqual(inspectResults.length, Array.from(jaText).length);
assert.strictEqual(inspectResults[0].char, 'こ');
assert.strictEqual(inspectResults[0].encoding, 'utf-8');
assert.strictEqual(inspectResults[0].bytes.length, 3, 'Japanese "こ" must have 3 UTF-8 bytes');
assert.strictEqual(inspectResults[0].bitLength, 24, 'Japanese "こ" must have 24 bits');
console.log('✓ Inspector UTF-8 details test passed');

// 7. Test Reverse conversion (only ！ and ？, no filler characters)
const { reverse } = require('./interrobang');
const revTarget = 'Hello こんにちは 🍣🍺';
const revOutput = reverse(revTarget);
assert.ok(/^[！？\n]+$/.test(revOutput), 'Reverse output must strictly contain only ！, ？, and newlines');
assert.strictEqual(run(revOutput), revTarget, 'Reverse output must roundtrip decode to original text');
console.log('✓ Reverse conversion (pure ！ and ？) test passed');

// 8. Test URL compression and decompression
(async () => {
  const { compress, decompress } = require('./interrobang');
  const compressed = await compress(helloWorldSource);
  const decompressed = await decompress(compressed);
  assert.strictEqual(decompressed, helloWorldSource, 'Compressed source must decompress identically');
  assert(compressed.length < helloWorldSource.length * 2, 'Compression must be compact');
  console.log(`✓ Compression test passed (${helloWorldSource.length} chars -> ${compressed.length} chars, ratio: ${(compressed.length / helloWorldSource.length).toFixed(2)})`);

  console.log('\nAll tests passed successfully! 🎉');
})();


