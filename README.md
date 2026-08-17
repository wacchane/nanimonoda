# 何者だ

**公開URL: https://wacchane.github.io/nanimonoda/**

2軸の性格診断PWA。陽キャ⇔陰キャ（横軸・右が陽）、温キャ⇔冷キャ（縦軸・上が温）の座標上に、結果を1点としてプロットします。

診断は3種類。

| | 内容 |
|---|---|
| 自分を診断する — 一般向け | 職場・友人・初対面に共通する共通版 |
| 自分を診断する — ディライト版 | バレーボール社会人サークル「ディライト」特化 |
| 他人を診断する | 同じ設問を三人称に訳した他者評価版。結果をリンクで相手に送れる |

送られたリンクを開くと、自分の2つの結果と他己評価が1枚に並び、自己評価とのずれが出ます。
**リンクはURLの `#` 以降にデータを載せているだけで、サーバーには何も送られません。**

UIはニューモーフィズム（面から浮き出す影だけで立体を作る表現）。書体はヒラギノ角ゴシック W3/W6。
配色はライト（白）とダーク（ミッドナイトブルー）の2つで、OSの設定に追従しつつ右上のトグルで手動指定もできます。

## 構成

```
CLAUDE.md              Claude Code が自動で読む前提コンテキスト
docs/
  01-測定設計.md        軸・設問・採点の全仕様（最重要）
  02-決定ログ.md        なぜ今の形なのか、却下した案
  03-次のタスク.md      これからやること
src/
  index.html  app.js  manifest.webmanifest  sw.js  icon-*.png
```

## 動かす

```bash
cd src && python3 -m http.server 8000
# → http://localhost:8000
```

Service Worker と Web Share API は https か localhost でのみ有効です。

## 公開

`main` に push すると `.github/workflows/pages.yml` が走り、`src/` の中身がそのまま GitHub Pages に出ます。ビルドはありません。

**ファイルを更新したら `src/sw.js` の `CACHE` の版を上げること。** cache-first なので、上げないと利用者の端末に古い版がキャッシュから出続けます。

## Claude Code で作業を続ける

```bash
cd LEADER
claude
```

`docs/03-次のタスク.md` の内容から着手してください。
