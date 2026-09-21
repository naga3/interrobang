# Interrobang (‽) — びっくりはてな言語 (UTF-8対応)

[![GitHub Pages](https://img.shields.io/badge/Web_Playground-GitHub_Pages-orange?style=flat-square&logo=github)](https://naga3.github.io/interrobang/)
[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg?style=flat-square)](LICENSE)
[![Node.js](https://img.shields.io/badge/node-%3E%3D16-green?style=flat-square&logo=node.js)](https://nodejs.org/)
[![UTF-8](https://img.shields.io/badge/Encoding-UTF--8_Ready-brightgreen?style=flat-square)](https://naga3.github.io/interrobang/)

> **「！は0、？は1、改行で一文字出力、それ以外の文字は無視」**  
> 叫び声と句読点だけで動く、世界一うるさい難解プログラミング言語（Esolang）。  
> **UTF-8規格に完全対応**し、日本語（ひらがな・カタカナ・漢字）や絵文字（🍣🎉）も叫び声として自在にコンパイル可能です。

---

## 🌐 Web プレイグラウンド

ブラウザ上で今すぐ叫び声をコンパイル・実行・生成できます。

👉 **[https://naga3.github.io/interrobang/](https://naga3.github.io/interrobang/)**

- **実行・逆アセンブラ**: コードの実行とビット／UTF-8バイトごとの詳細解析
- **悲鳴エンコーダー**: 任意のテキスト（ASCII / 日本語 / 絵文字）から悲鳴コードを自動生成（1行1文字 / 1行1バイト / コードポイント対応）
- **URL共有**: 生成したコードをワンクリックでX (Twitter) や共有リンクに変換

---

## 📜 言語仕様 & UTF-8 対応 (Specification)

| 記号 | ビット値 | 説明 |
| :--- | :--- | :--- |
| `！` または `!` | **0** | 全角・半角どちらも0として扱われます |
| `？` または `?` | **1** | 全角・半角どちらも1として扱われます |
| **その他すべての文字** | **無視** | ひらがな・漢字・アルファベット・記号・空白などはすべて無害な叫び声（コメント）です |
| **改行** | **1文字出力** | 各行に含まれるビット列をUTF-8バイト列またはUnicodeコードポイントとして解釈し出力 |

### UTF-8 マルチバイト処理の仕組み
1. **1行1文字形式（標準）**:
   各行に1文字分のUTF-8バイト列（ASCIIなら8bit、日本語なら24bit、絵文字なら32bit）を記述します。改行ごとに対応する文字が1文字出力されます。
2. **1行1バイト形式（ストリーム）**:
   各行を厳格に8bitとし、複数行にわたってUTF-8バイト列をストリーム構成することも可能です。
3. **Unicode コードポイント互換**:
   ビット長が8の倍数でない場合（例: 14bitなど）、直接Unicodeコードポイントとしてフォールバック解釈されます。

### 文字種とUTF-8バイト長
| 文字種別 | UTF-8 バイト数 | 1行のビット数 | 例 |
| :--- | :---: | :---: | :--- |
| **ASCII (英数字・基本記号)** | 1 Byte | 8 bit | `H` = `01001000` |
| **日本語 (ひらがな・漢字)** | 3 Bytes | 24 bit | `あ` = `11100011 10000001 10000010` (`0xE3 0x81 0x82`) |
| **絵文字 (Emoji)** | 4 Bytes | 32 bit | `🎉` = `11110000 10011111 10001110 10001001` (`0xF0 0x9F 0x8E 0x89`) |

---

## 🌟 サンプルプログラム

### 1. Hello World! (ASCII 8-bit)
```text
わあ！？わ！！あ？！！！
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
ぎゃあああ！！？あ！！！！？
```
**出力**: `Hello World!`

### 2. こんにちは世界！ (UTF-8 24-bit lines)
```text
わわわ？？？！！あっ！？？？！！！！！！？？！！？！わ！ひい？？
あ？？？！ええっ！！？きゃー？？！！ぎゃあああ！！ひい！？！？！ひえっ！？！！？？
助けて？？？助けて！ぎゃああ！！？？きゃー？きゃー！！！あっ！！！わあ？？！助けて？！？きゃー！？？
ぎゃあああ？？きゃー？！わ！！？？あっ？わあ！あ！ええっ！！！！？？わあ！？なんだってー！！！うそ！？
わわわ？？ぎゃああ？！わあ！！うそ？？もうだめだ？！！！！ぎゃあああ！！？？ぎゃああ！？！きゃー？？？？
えっ？？うわああ?！！？！なんだってー！？あっ！？？？えっ！！！？！わわわ！？！？？！
ひえっ？？？ぎゃああ！！？もうだめだ？？？ひい！！？ひえっ！？！？？！！！？わあ？ぎゃあああ！！
うわああ！！？？ええっ？？！！うそ？？！ひえっ！！？あ！
```
**出力**: `こんにちは世界！`

---

## 🛠 CLI ツールとしての使い方

### ファイルを実行する
```bash
node cli.js examples/hello.ib
# => Hello World!

node cli.js examples/japan.ib
# => こんにちは世界！
```

### パイプから実行する
```bash
cat examples/hello.ib | node cli.js
```

### 詳細逆アセンブル（UTF-8 バイト解析）
```bash
node cli.js --inspect examples/hello.ib
node cli.js --inspect examples/japan.ib
```

### テキストから悲鳴コードを生成 (UTF-8)
```bash
# 1文字1行形式（推奨）
node cli.js --encode "こんにちは世界！🎉"

# 1行1バイト形式（8-bit stream）
node cli.js --encode-bytes "Hello"

# 記号のみ（！と？のみ）
node cli.js --encode-pure "草"
```

---

## 📦 JavaScript / Node.js API

```javascript
const { run, inspect, encode } = require('./interrobang');

// 1. コードの実行（自動判別）
const output = run(`わあ！？わ！！あ？！！！\nえっ！？？あ！！？！？`);
console.log(output); // "He"

// 2. 日本語・絵文字のUTF-8エンコード
const screamCode = encode('こんにちは世界！🎉', {
  encoding: 'utf-8',
  unit: 'char', // 'char' (1文字1行) または 'byte' (1行1Byte)
  mode: 'scream'
});

// 3. UTF-8バイト詳細解析
const details = inspect(screamCode);
console.log(details[0]);
// {
//   lineNumber: 1,
//   bits: '111000111000000110010011',
//   bitLength: 24,
//   bytes: [227, 129, 147],
//   hex: '0xE3 0x81 0x93',
//   char: 'こ',
//   encoding: 'utf-8',
//   valid: true
// }
```

---

## 🏷 言語名の由来

「**Interrobang（インテロバング）**」とは、感嘆符（！）と疑問符（？）を一体化させた約物（記号）「**‽**」の正式名称です。  
1962年にアメリカで考案された、驚き（exclamation）と疑問（interrogation）を同時に叫ぶためのタイポグラフィにちなんでいます。

---

## 📄 ライセンス

[MIT License](LICENSE) © 2026 naga3
