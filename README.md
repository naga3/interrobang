# Interrobang (‽) — びっくりはてな言語

[![GitHub Pages](https://img.shields.io/badge/Web_Playground-GitHub_Pages-orange?style=flat-square&logo=github)](https://naga3.github.io/interrobang/)
[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg?style=flat-square)](LICENSE)
[![Node.js](https://img.shields.io/badge/node-%3E%3D16-green?style=flat-square&logo=node.js)](https://nodejs.org/)

> **「！は0、？は1、改行で一文字出力、それ以外の文字は無視」**  
> 叫び声と句読点だけで動く、世界一うるさい難解プログラミング言語（Esolang）。

---

## 🌐 Web プレイグラウンド

ブラウザ上で今すぐ叫び声をコンパイル・実行・生成できます。

👉 **[https://naga3.github.io/interrobang/](https://naga3.github.io/interrobang/)**

- **実行・逆アセンブラ**: コードの実行とビットごとの詳細解析
- **悲鳴エンコーダー**: 任意のテキスト（ASCII / 日本語 / 絵文字）から悲鳴コードを自動生成
- **URL共有**: 生成したコードをワンクリックでX (Twitter) や共有リンクに変換

---

## 📜 言語仕様 (Specification)

| 記号 | ビット値 | 説明 |
| :--- | :--- | :--- |
| `！` または `!` | **0** | 全角・半角どちらも0として扱われます |
| `？` または `?` | **1** | 全角・半角どちらも1として扱われます |
| **その他すべての文字** | **無視** | ひらがな・漢字・アルファベット・記号・空白などはすべて無害な叫び声（コメント）です |
| **改行** | **1文字出力** | 各行に含まれるビット列を2進数（Unicodeコードポイント/ASCII）として解釈し1文字出力 |

- 各行のビット列は上位ビット（MSB）から順に結合されます。
- 記号を含まない行は出力されず無視されます。
- 改行文字自体を出力したい場合は、文字コード `10`（`00001010`）をエンコードします。

---

## 🌟 サンプルプログラム: Hello World!

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

### 実行結果
```text
Hello World!
```

### ビット逆アセンブル詳細

| 行 | 原文コード | 抽出記号 | 2進数 | 16進コード | 出力文字 |
| :-: | :--- | :--- | :---: | :---: | :-: |
| 1 | `わあ！？わ！！あ？！！！` | `！？！！？！！！` | `01001000` | `0x48` | **H** |
| 2 | `えっ！？？あ！！？！？` | `！？？！！？！？` | `01100101` | `0x65` | **e** |
| 3 | `ぎゃあ！？？！あ？？！！` | `！？？！？？！！` | `01101100` | `0x6C` | **l** |
| 4 | `わわわ！？？あ！？？！！` | `！？？！？？！！` | `01101100` | `0x6C` | **l** |
| 5 | `あっ！？？わ！？？？？` | `！？？！？？？？` | `01101111` | `0x6F` | **o** |
| 6 | `ええっ！！？あ！！！！！` | `！！？！！！！！` | `00100000` | `0x20` | *(空白)* |
| 7 | `うわ！？！？あ！？？？` | `！？！？！？？？` | `01010111` | `0x57` | **W** |
| 8 | `わあ！？？あ！？？？？` | `！？？！？？？？` | `01101111` | `0x6F` | **o** |
| 9 | `ぎゃああ！？？？あ！！？！` | `！？？？！１？！` | `01110010` | `0x72` | **r** |
| 10 | `えっ！？？！あ？？！！` | `！？？！？？！！` | `01101100` | `0x6C` | **l** |
| 11 | `うそ！？？あ！！？！！` | `！？？！！？！！` | `01100100` | `0x64` | **d** |
| 12 | `ぎゃあああ！！？あ！！！！？` | `！！？！！！！？` | `00100001` | `0x21` | **!** |

---

## 🛠 CLI ツールとしての使い方

### ファイルを実行する
```bash
node cli.js examples/hello.ib
# => Hello World!
```

### パイプから実行する
```bash
cat examples/hello.ib | node cli.js
# => Hello World!
```

### 詳細逆アセンブル（ビット解析）
```bash
node cli.js --inspect examples/hello.ib
```

### テキストから悲鳴コードを生成
```bash
node cli.js --encode "こんにちは世界！"
node cli.js --encode-pure "Hello"
```

---

## 📦 JavaScript / Node.js API

```javascript
const { run, inspect, encode } = require('./interrobang');

// 1. コードの実行
const output = run(`わあ！？わ！！あ？！！！\nえっ！？？あ！！？！？`);
console.log(output); // "He"

// 2. 詳細解析
const details = inspect(`わあ！？わ！！あ？！！！`);
console.log(details[0]);
// { lineNumber: 1, raw: 'わあ！？わ！！あ？！！！', bits: '01001000', codePoint: 72, char: 'H', valid: true }

// 3. テキストから悲鳴コードを生成
const code = encode('Interrobang', { mode: 'scream' });
console.log(code);
```

---

## 🏷 言語名の由来

「**Interrobang（インテロバング）**」とは、感嘆符（！）と疑問符（？）を一体化させた約物（記号）「**‽**」の正式名称です。  
1962年にアメリカで考案された、驚き（exclamation）と疑問（interrogation）を同時に叫ぶためのタイポグラフィにちなんでいます。

---

## 📄 ライセンス

[MIT License](LICENSE) © 2026 naga3
