# 何者だ

**公開URL: https://wacchane.github.io/nanimonoda/**

バレーボール社会人サークル「ディライト」の役職適性診断PWA。18問に答えると、3つの軸での位置と、**代表・副代表・イベント係・施設係・会計係**への向きが出ます。

| 軸 | 高い側 ⇔ 低い側 |
|---|---|
| 陽陰 | 前に出る ⇔ 引く |
| 温冷 | 情で決める ⇔ 理で決める |
| 堅緩 | きっちり ⇔ ゆるい |

診断は2種類。**自分を診断する**と、**他人を診断する**（同じ18問の三人称訳）。
他人を診断した結果はリンクで相手に送れて、受け取った側は自己評価と他己評価（最大8件の総合）のずれを見られます。
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
