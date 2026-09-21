const assert = require('assert');
const { run, inspect, encode } = require('./interrobang');

console.log('Testing Interrobang language engine...');

// 1. Test Hello World from user prompt
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

const output = run(helloWorldSource);
console.log('Hello World output:', JSON.stringify(output));
assert.strictEqual(output, 'Hello World!', 'Hello World output must match');

// 2. Test inspect details
const details = inspect(helloWorldSource);
assert.strictEqual(details.length, 12, 'Must have 12 lines');
assert.strictEqual(details[0].bits, '01001000', 'First line must be 01001000 (H)');
assert.strictEqual(details[0].char, 'H', 'First line char must be H');
assert.strictEqual(details[11].char, '!', 'Last line char must be !');

// 3. Test half-width characters
const halfWidthSource = `!?!!?!!!\n!??!!?!?\n!??!??!!\n!??!??!!\n!??!????`;
assert.strictEqual(run(halfWidthSource), 'Hello', 'Half-width symbols must work');

// 4. Test Japanese Unicode code points
const japaneseText = 'こんにちは世界！🎉';
const encodedScream = encode(japaneseText, { mode: 'scream' });
const decodedScream = run(encodedScream);
assert.strictEqual(decodedScream, japaneseText, 'Scream mode roundtrip must work for Japanese + Emoji');

const encodedPure = encode('Interrobang', { mode: 'pure' });
assert.strictEqual(run(encodedPure), 'Interrobang', 'Pure mode roundtrip must work');

// 5. Test empty lines and ignored comment lines
const withComments = `
// This is a comment without symbols
わあ！？わ！！あ？！！！
# Another comment line
えっ！？？あ！！？！？
`;
assert.strictEqual(run(withComments), 'He', 'Lines without symbols must be ignored');

console.log('All tests passed successfully! ✨');
