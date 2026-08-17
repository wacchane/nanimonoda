/* ===== 何者だ — 2軸16タイプ性格診断 ===== */

/* 診断の種類。qk は QS.t のどの言い回しを使うか */
const MODES = [
  { id: 'general', kind: 'self', qk: 'general', name: '一般向け',      hint: '職場・友人・初対面に共通' },
  { id: 'delight', kind: 'self', qk: 'delight', name: 'ディライト版',  hint: 'バレーサークル「ディライト」' },
  { id: 'peer',    kind: 'peer', qk: 'other',   name: '他人を診断する', hint: '結果をリンクで相手に送れます' }
];
const modeOf = id => MODES.find(m => m.id === id);
const SELF_MODES = MODES.filter(m => m.kind === 'self');

const SCALE = ['まったく違う', 'あまり違う', 'ややそう', 'とてもそう'];

/* 12問 × 3版。facet と dir は3版で完全に同一で、翻訳するのは語彙だけ。
   これがあるから版をまたいでスコアを直接比較できる。
   設問文の出典: docs/01-測定設計.md 第5節・第6節・第6.5節 */
const QS = [
  { ax: 'y', dir: 1, facet: '対人接近性', t: {
    general: '知らない人がいる場でも、自分から話しかけに行くほうだ',
    delight: '練習に新しく来た人がいたら、自分から声をかけに行く',
    other:   'この人は、知らない人がいる場でも自分から話しかけに行くほうだ' } },
  { ax: 'y', dir: -1, facet: '一人時間の選好', t: {
    general: '人と会う予定が急になくなると、少しホッとする',
    delight: '練習が急に中止になると、少しホッとする',
    other:   'この人は、人と会う予定が急になくなると少しホッとしていそうだ' } },
  { ax: 'y', dir: 1, facet: '集団での注目志向', t: {
    general: '自分が話の中心にいると、テンションが上がる',
    delight: 'コート上やミーティングで自分が中心にいると、テンションが上がる',
    other:   'この人は、自分が話の中心にいるとテンションが上がる' } },
  { ax: 'y', dir: -1, facet: '社交後の消耗', t: {
    general: '人と長く関わった日は、楽しくても後でどっと疲れる',
    delight: '体を動かした疲れとは別に、人と長く関わった日は、楽しくてもどっと疲れる',
    other:   'この人は、人と長く関わった日は楽しくても後でどっと疲れていそうだ' } },
  { ax: 'y', dir: 1, facet: '発信性', t: {
    general: '自分に話が振られていなくても、会話に自分から入っていく',
    delight: 'サークル全体に関わる話題なら、自分から発言や提案を投稿するほうだ',
    other:   'この人は、自分に話が振られていなくても会話に自分から入っていく' } },
  { ax: 'y', dir: -1, facet: '会話の主導性', t: {
    general: '会話が途切れても、無理に話題を探そうとは思わない',
    delight: '練習の合間に会話が途切れても、無理に話題を探そうとは思わない',
    other:   'この人は、会話が途切れても無理に話題を探そうとはしない' } },
  { ax: 'o', dir: 1, facet: '共感的傾聴', t: {
    general: '誰かが悩みを話してきたら、解決策より先に気持ちに寄り添う',
    delight: 'メンバーが悩みを話してきたら、解決策より先に気持ちに寄り添う',
    other:   'この人は、誰かが悩みを話すと解決策より先に気持ちに寄り添う' } },
  { ax: 'o', dir: -1, facet: '公平性 vs 個別配慮', t: {
    general: '相手が誰であっても、ルールや基準は同じように適用すべきだ',
    delight: '相手が誰であっても、サークルの決まりごとは同じように適用すべきだ',
    other:   'この人は、相手が誰であってもルールや基準を同じように適用する' } },
  { ax: 'o', dir: 1, facet: '情動伝染', t: {
    general: '落ち込んでいる人がいると、自分まで気分が引きずられる',
    delight: 'ミスして落ち込んでいるメンバーがいると、自分まで気分が引きずられる',
    other:   'この人は、落ち込んでいる人がいると自分まで気分が引きずられるほうだ' } },
  { ax: 'o', dir: -1, facet: '率直さ vs 配慮', t: {
    general: '相手が傷つく可能性があっても、正しいと思うことは言う',
    delight: '相手が気を悪くする可能性があっても、プレーについて正しいと思うことは言う',
    other:   'この人は、相手が傷つく可能性があっても正しいと思うことは言う' } },
  { ax: 'o', dir: 1, facet: '意思決定基準', t: {
    general: '何かを決めるとき、正しさより全員が納得するかを重視する',
    delight: '練習メニューや方針を決めるとき、正しさより全員が納得するかを重視する',
    other:   'この人は、何かを決めるとき正しさより全員が納得するかを重視する' } },
  { ax: 'o', dir: -1, facet: '感情への反応スタイル', t: {
    general: '感情的になっている人がいると、まず落ち着いて事実を整理したくなる',
    delight: '感情的になっている人がいると、まず落ち着いて事実を整理したくなる',
    other:   'この人は、感情的になっている人がいると、まず落ち着いて事実を整理しようとする' } }
];

const BAND_Y = ['強い陰キャ', 'やや陰キャ', 'やや陽キャ', '強い陽キャ'];
const BAND_O = ['強い冷キャ', 'やや冷キャ', 'やや温キャ', '強い温キャ'];

/* TYPES[陽陰バンド][温冷バンド]  0=強い陰/冷 … 3=強い陽/温 */
const TYPES = [
  [ /* 強い陰 */
    { n:'完全論理体',      c:'感情の外側で考える人',   r:['専門職'],
      d:'ぶれない判断基準を持ち、周囲が揺れているときほど価値が出ます。伝え方に一手間かけると、その正しい判断が実際に通るようになります。' },
    { n:'孤高の研究者',    c:'一人で深く潜る人',       r:['専門職'],
      d:'集団の力学より、対象そのものへの興味が勝つタイプ。人脈ではなく専門性で信頼を積み上げていきます。' },
    { n:'一途な夢想家',    c:'自分の世界を持っている人', r:['支援'],
      d:'広く浅くではなく、狭く深く関わります。数は多くないぶん、合う相手との結びつきは誰よりも強くなります。' },
    { n:'秘めた博愛主義者', c:'静かに気にかけている人', r:['支援'],
      d:'表には出しませんが、人のことをよく考えています。伝えないと伝わらないので、言葉にする回数を少し増やすだけで印象が変わります。' }
  ],
  [ /* やや陰 */
    { n:'寡黙な観測者',    c:'見えている人',           r:['参謀'],
      d:'発言は少なくても、場の力学を正確に把握しています。聞かれたときに出す一言の精度が高く、そこで評価が決まります。' },
    { n:'職人肌の分析家',  c:'静かに正解を出す人',     r:['参謀'],
      d:'表に出ないところで筋道を立てるのが得意。前に立つより、決める人の隣で判断材料を作る位置で最も活きます。' },
    { n:'静かな癒し系',    c:'いるだけで空気が緩む人', r:['まとめ役'],
      d:'主張は強くありませんが、その場にいる安心感が集団を支えています。存在そのものが機能しているタイプです。' },
    { n:'縁の下の聞き上手', c:'一対一で本音を引き出す人', r:['まとめ役'],
      d:'大人数では目立ちませんが、1対1での傾聴力は随一。不満が爆発する前に拾えます。まとめ役として最も過小評価されているタイプです。' }
  ],
  [ /* やや陽 */
    { n:'クールな仕切り役', c:'淡々と回す人',          r:['リーダー'],
      d:'感情の起伏に左右されず、決めるべきことを決められます。冷たいと誤解されやすいので、判断の意図を言葉にすると評価が変わります。' },
    { n:'切れ者の交渉人',  c:'筋を通しながら通す人',   r:['リーダー','まとめ役'],
      d:'論理で組み立てながら、相手の面子も潰さない。リーダーとまとめ役を一人で兼ねられる希少なタイプです。' },
    { n:'愛されいじられ役', c:'誰とでも組める人',      r:['リーダー','まとめ役'],
      d:'極端さがないぶん、どのタイプの相手とも噛み合います。目立ちませんが、組織が大きくなるほど効いてくる万能型です。' },
    { n:'世話焼き幹事',    c:'気づいたら手を挙げている人', r:['まとめ役'],
      d:'程よい社交性と強い配慮で、集団の潤滑油になります。頼まれごとを断りにくく、抱え込みやすいのが弱点です。' }
  ],
  [ /* 強い陽 */
    { n:'カリスマ司令塔',  c:'決める人',               r:['リーダー'],
      d:'迷いのない判断と発信力で場を引っ張ります。危機や立て直しでは最強クラスですが、平時に長く続くと周囲が消耗します。温かいまとめ役を横に置くと本領が出ます。' },
    { n:'陽気な策士',      c:'笑いながら決めていく人', r:['リーダー'],
      d:'巻き込む力と、情に流されない判断力の両方を持っています。全員にとって最善ではない選択でも、説明して通せるタイプです。' },
    { n:'ムードメーカー',  c:'空気が重くなると動く人', r:['まとめ役'],
      d:'沈黙や気まずさに人一倍敏感で、気づけば場を回しています。盛り上げは得意な一方、対立の調停より雰囲気の維持に流れやすい面があります。' },
    { n:'太陽キャ',        c:'その場の温度を上げる人', r:['まとめ役'],
      d:'場を明るくしながら、一人ひとりの機嫌まで見ています。人が自然と集まってくるぶん、気を配りすぎて自分の消耗に気づきにくいので注意。' }
  ]
];

const ROLE_NOTE = 'この結果は「なりやすさ」であって「うまくやれるか」ではありません。外向性はリーダーに選ばれやすさとは相関しますが、成果との相関は弱いことが知られています。陰側のタイプは向いていないのではなく、候補に挙がりにくいだけ、という場合が多くあります。';
const PEER_NOTE = '他己評価は、外から見える行動しか拾えません。一人の時間にホッとするか、人と会った後に疲れるかといった内側の項目は、相手には推測でしか答えられません。そのぶんを差し引いて見てください。';

/* ===== 保存（localStorage が使えない環境では自動でメモリに退避） =====
   形: { self: { general:{s,at}, delight:{s,at} }, peers: [ {nick,s,at} ] } */
const store = (() => {
  const KEY = 'nanimonoda.v1';
  const OLD = ['wasser.v2', 'kishitsu-zu.v2'];   // 旧称時代のキー
  let mem = null;
  let ok = false;
  try { localStorage.setItem('__t', '1'); localStorage.removeItem('__t'); ok = true; } catch (e) { ok = false; }

  const shape = o => ({
    self: (o && o.self) || {},
    peers: (o && Array.isArray(o.peers)) ? o.peers : []
  });

  /* 改名前の記録を一度だけ移す。旧形式は self の中身がそのまま入っていた */
  try {
    if (ok && !localStorage.getItem(KEY)) {
      for (const k of OLD) {
        const raw = localStorage.getItem(k);
        if (!raw) continue;
        localStorage.setItem(KEY, JSON.stringify({ self: JSON.parse(raw), peers: [] }));
        OLD.forEach(x => localStorage.removeItem(x));
        break;
      }
    }
  } catch (e) {}

  return {
    load() {
      try { return shape(JSON.parse((ok ? localStorage.getItem(KEY) : mem) || '{}')); }
      catch (e) { return shape(null); }
    },
    save(o) {
      const s = JSON.stringify(shape(o));
      try { ok ? localStorage.setItem(KEY, s) : (mem = s); } catch (e) { mem = s; }
    }
  };
})();

/* ===== 配色（自動 / ライト / ダーク） =====
   auto は OS の設定に従う。data-theme を外すと CSS 側の
   prefers-color-scheme のブロックが効く仕組み。 */
const THEMES = [
  { id: 'auto',  icon: '◐', label: '配色: 自動' },
  { id: 'light', icon: '○', label: '配色: ライト' },
  { id: 'dark',  icon: '●', label: '配色: ダーク' }
];
const theme = (() => {
  const KEY = 'nanimonoda.theme';
  let cur = 'auto';
  try { cur = localStorage.getItem(KEY) || localStorage.getItem('wasser.theme') || 'auto'; } catch (e) {}
  const apply = () => {
    const t = THEMES.find(x => x.id === cur) || THEMES[0];
    if (cur === 'auto') delete document.documentElement.dataset.theme;
    else document.documentElement.dataset.theme = cur;
    const btn = document.getElementById('btn-theme');
    if (btn) { btn.textContent = t.icon; btn.setAttribute('aria-label', t.label); }
    return t;
  };
  return {
    init: apply,
    next() {
      cur = THEMES[(THEMES.findIndex(x => x.id === cur) + 1) % THEMES.length].id;
      try { localStorage.setItem(KEY, cur); } catch (e) {}
      return apply();
    }
  };
})();

/* ===== 採点 ===== */
function band(ratio) {
  if (ratio <= 0.25) return 0;
  if (ratio <= 0.50) return 1;   // 50%ちょうどは陰側・冷側に含める
  if (ratio <= 0.75) return 2;
  return 3;
}

function score(answers) {
  const out = {};
  ['y', 'o'].forEach(ax => {
    const list = QS.map((q, i) => ({ q, i })).filter(x => x.q.ax === ax);
    const sum = list.reduce((a, x) => a + (x.q.dir === 1 ? answers[x.i] : 3 - answers[x.i]), 0);
    const max = list.length * 3;
    out[ax] = { n: list.length, sum, max, ratio: sum / max, band: band(sum / max) };
  });
  return out;
}

const typeOf = s => TYPES[s.y.band][s.o.band];

/* ===== 共有リンク =====
   12問 × 2bit = 3バイト + ニックネームのUTF-8 を base64url にして
   URLのフラグメントに載せる。# 以降はサーバーに送信されないため、
   「保存はローカルのみ」という原則を保ったまま相手に渡せる。 */
const LINK_V = '1';
const NICK_MAX = 20;

function b64uEnc(bytes) {
  let s = '';
  bytes.forEach(b => { s += String.fromCharCode(b); });
  return btoa(s).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
}
function b64uDec(str) {
  const s = atob(str.replace(/-/g, '+').replace(/_/g, '/'));
  return Uint8Array.from(s, c => c.charCodeAt(0));
}

function packAnswers(a) {
  const b = new Uint8Array(3);
  for (let i = 0; i < QS.length; i++) b[i >> 2] |= (a[i] & 3) << ((i % 4) * 2);
  return b;
}
function unpackAnswers(b) {
  const a = {};
  for (let i = 0; i < QS.length; i++) a[i] = (b[i >> 2] >> ((i % 4) * 2)) & 3;
  return a;
}

function makeLink(nick, answers) {
  const name = new TextEncoder().encode(nick.slice(0, NICK_MAX));
  const blob = new Uint8Array(3 + name.length);
  blob.set(packAnswers(answers), 0);
  blob.set(name, 3);
  const base = location.origin === 'null'
    ? location.href.split('#')[0]
    : location.origin + location.pathname;
  return `${base}#r=${LINK_V}.${b64uEnc(blob)}`;
}

function readLink(hash) {
  const m = /^#r=(\d+)\.([A-Za-z0-9_-]+)$/.exec(hash || '');
  if (!m || m[1] !== LINK_V) return null;
  try {
    const b = b64uDec(m[2]);
    if (b.length < 3) return null;
    const answers = unpackAnswers(b.subarray(0, 3));
    const nick = new TextDecoder().decode(b.subarray(3)).trim().slice(0, NICK_MAX);
    return { nick: nick || '名前なし', s: score(answers), at: Date.now() };
  } catch (e) { return null; }
}

/* ===== 座標盤 ===== */
/* 星の位置。暗い配色のときだけ見える（不透明度を --star で殺している） */
const STARS = [[24,40],[58,16],[97,68],[133,28],[176,54],[213,22],[247,86],[275,44],
               [20,124],[68,163],[117,140],[157,193],[195,129],[234,175],[271,146],
               [42,229],[90,265],[145,241],[188,279],[231,243],[277,219]];

/* 盤は面を窪ませた中に置く前提。地の塗りは持たない。
   色と濃さはすべて CSS変数から引くので、配色の切り替えに自動で追従する。
   軸の向き: 陽=右 / 陰=左 / 温=上 / 冷=下 */
function field(id) {
  const edge = [
    ['t', 'warm',  '0', '0', '0', '1'],   // 上 = 温
    ['b', 'cold',  '0', '1', '0', '0'],   // 下 = 冷
    ['l', 'shade', '0', '0', '1', '0'],   // 左 = 陰
    ['r', 'sun',   '1', '0', '0', '0']    // 右 = 陽
  ];
  return `
  <style>
    .fx-grid{stroke:var(--grid);stroke-width:1}
    .fx-axis{stroke:var(--axis);stroke-width:1}
    .fx-lab{font-family:var(--sans);font-size:12.5px;font-weight:600;letter-spacing:1.4px}
    .fx-sun{fill:var(--sun)}   .fx-shade{fill:var(--shade)}
    .fx-warm{fill:var(--warm)} .fx-cold{fill:var(--cold)}
    .fx-star{fill:#FFFFFF;opacity:calc(var(--star) * .5)}
    .fx-cat{font-family:var(--sans);font-size:11px;font-weight:600;fill:var(--ink)}
    .st-sun{stop-color:var(--sun)}   .st-shade{stop-color:var(--shade)}
    .st-warm{stop-color:var(--warm)} .st-cold{stop-color:var(--cold)}
    .st-on{stop-opacity:var(--wash)} .st-off{stop-opacity:0}
    .fx-wash{mix-blend-mode:var(--wash-blend)}
  </style>
  <defs>
    ${edge.map(([k, c, x1, y1, x2, y2]) => `
      <linearGradient id="w${k}-${id}" x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}">
        <stop offset="0%" class="st-${c} st-on"/>
        <stop offset="64%" class="st-${c} st-off"/>
      </linearGradient>`).join('')}
    <clipPath id="clip-${id}"><rect x="0" y="0" width="300" height="300" rx="20"/></clipPath>
  </defs>
  <g clip-path="url(#clip-${id})">
    ${STARS.map(([x, y], i) => `<circle class="fx-star" cx="${x}" cy="${y}" r="${i % 3 ? 0.9 : 1.3}"/>`).join('')}
    ${edge.map(([k]) => `<rect class="fx-wash" x="0" y="0" width="300" height="300" fill="url(#w${k}-${id})"/>`).join('')}
    ${[75,150,225].map(v => `<line class="fx-grid" x1="${v}" y1="0" x2="${v}" y2="300"/>
       <line class="fx-grid" x1="0" y1="${v}" x2="300" y2="${v}"/>`).join('')}
    <line class="fx-axis" x1="150" y1="0" x2="150" y2="300"/>
    <line class="fx-axis" x1="0" y1="150" x2="300" y2="150"/>
  </g>
  <text class="fx-lab fx-warm"  x="150" y="20"  text-anchor="middle">温</text>
  <text class="fx-lab fx-cold"  x="150" y="290" text-anchor="middle">冷</text>
  <text class="fx-lab fx-shade" x="13"  y="155" text-anchor="middle">陰</text>
  <text class="fx-lab fx-sun"   x="287" y="155" text-anchor="middle">陽</text>`;
}

const px = y => y.ratio * 250 + 25;        // 陽陰: 右=陽
const py = o => (1 - o.ratio) * 250 + 25;  // 温冷: 上=温

/* 点も面と同じ理屈で浮かせる。左上に明るい縁、右下に暗い縁 */
function dot(x, y, color, r) {
  return `
    <circle cx="${x}" cy="${y}" r="${r * 2.7}" fill="none" stroke="${color}" stroke-opacity=".2"/>
    <circle cx="${x + 1.6}" cy="${y + 1.6}" r="${r}" fill="var(--sd)"/>
    <circle cx="${x - 1.6}" cy="${y - 1.6}" r="${r}" fill="var(--hl)"/>
    <circle cx="${x}" cy="${y}" r="${r}" fill="var(--plate)"/>
    <circle cx="${x}" cy="${y}" r="${r * .52}" fill="${color}"/>`;
}

const COL = { general: 'var(--cat-a)', delight: 'var(--cat-b)', peer: 'var(--cat-c)' };

function drawSingle(s, color) {
  const x = px(s.y), y = py(s.o);
  return `<svg class="map" viewBox="0 0 300 300" role="img" aria-label="診断結果の位置">
    ${field('a')}
    <g class="pt">${dot(x, y, color, 9)}</g>
    <style>
      .pt{animation:pop .8s cubic-bezier(.22,.61,.36,1) both}
      @keyframes pop{from{opacity:0;transform:scale(.55);transform-origin:${x}px ${y}px}to{opacity:1;transform:none}}
      @media (prefers-reduced-motion:reduce){.pt{animation:none}}
    </style>
  </svg>`;
}

/* items: [{ label, color, s }] */
function drawCompare(items) {
  const pts = items.map(it => ({ ...it, x: px(it.s.y), y: py(it.s.o) }));
  const placed = [];
  const labels = pts.map(p => {
    /* 先に置いたラベルとぶつかるなら点の下へ逃がす */
    const up = Math.max(p.y - 18, 32), down = Math.min(p.y + 28, 292);
    const hits = ly => placed.some(q => Math.abs(q.y - ly) < 15 && Math.abs(q.x - p.x) < 66);
    const ly = hits(up) ? down : up;
    placed.push({ x: p.x, y: ly });
    return `<text class="fx-cat" x="${p.x}" y="${ly}" text-anchor="middle">${esc(p.label)}</text>`;
  });
  return `<svg class="map" viewBox="0 0 300 300" role="img" aria-label="診断結果の比較">
    ${field('b')}
    ${pts.map(p => dot(p.x, p.y, p.color, 8)).join('')}
    ${labels.join('')}
  </svg>`;
}

/* ===== 画面制御 ===== */
const $ = id => document.getElementById(id);
const esc = s => String(s).replace(/[&<>"]/g, c => ({ '&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;' }[c]));
let cur = { mode: null, i: 0, answers: {} };
let pending = null;   // 他人を診断した直後の結果（まだ送っていない）

function show(id) {
  document.querySelectorAll('.screen').forEach(s => s.classList.remove('on'));
  $(id).classList.add('on');
  window.scrollTo(0, 0);
}

function toast(msg) {
  const t = $('toast'); t.textContent = msg; t.classList.add('on');
  clearTimeout(t._h); t._h = setTimeout(() => t.classList.remove('on'), 2200);
}

/* ===== 表紙 ===== */
function renderHome() {
  const d = store.load();

  $('selflist').innerHTML = SELF_MODES.map((m, i) => {
    const rec = d.self[m.id];
    return `<button class="btn card ${rec ? 'done' : ''}" data-open="self:${m.id}">
      <span class="dot"></span>
      <span class="no">${String(i + 1).padStart(2, '0')}</span>
      <span class="nm">${m.name}</span>
      <span class="meta">${rec ? typeOf(rec.s).n : m.hint}</span>
    </button>`;
  }).join('');

  const pm = modeOf('peer');
  $('peerlist').innerHTML = `<button class="btn card" data-start="peer">
      <span class="dot"></span>
      <span class="no">03</span>
      <span class="nm">${pm.name}</span>
      <span class="meta">${pm.hint}</span>
    </button>`;

  const box = $('inbox');
  if (d.peers.length) {
    box.hidden = false;
    $('inboxlist').innerHTML = d.peers.map((p, i) => `
      <button class="btn card done" data-open="peer:${i}">
        <span class="dot c"></span>
        <span class="nm">${esc(p.nick)}</span>
        <span class="meta">${typeOf(p.s).n}</span>
      </button>`).join('');
  } else {
    box.hidden = true;
  }

  document.querySelectorAll('[data-open]').forEach(b =>
    b.onclick = () => {
      const [kind, key] = b.dataset.open.split(':');
      if (kind === 'self' && !store.load().self[key]) start(key);
      else showResult(kind, kind === 'peer' ? +key : key);
    });
  document.querySelectorAll('[data-start]').forEach(b => b.onclick = () => start(b.dataset.start));

  const n = countEntries(d);
  const cb = $('btn-compare');
  cb.disabled = n < 2;
  cb.classList.toggle('off', n < 2);
  cb.classList.toggle('primary', n >= 2);
  cb.textContent = n < 2 ? `2つ以上そろうと比べられます（${n}/2）` : `結果を並べて見る（${n}件）`;
}

const countEntries = d => Object.keys(d.self).length + d.peers.length;

/* ===== 設問 ===== */
const ADVANCE_MS = 280;
let advTimer = null;
function cancelAdvance() { clearTimeout(advTimer); advTimer = null; }

function start(mode) {
  cancelAdvance();
  cur = { mode, i: 0, answers: {} };
  show('s-quiz'); renderQ();
}

function renderQ() {
  const { mode, i, answers } = cur;
  const m = modeOf(mode);
  const picked = answers[i];          // 戻ってきたときは前回の選択を復元する
  $('qmeta').textContent = `${m.name} ${String(i + 1).padStart(2, '0')}/${QS.length}`;
  $('bar').style.width = ((i + 1) / QS.length * 100) + '%';
  $('qno').textContent = `Q${String(i + 1).padStart(2, '0')} — ${QS[i].facet}`;
  $('qtext').textContent = QS[i].t[m.qk];
  $('opts').innerHTML = [3, 2, 1, 0].map(v => `
    <button class="btn opt ${v === picked ? 'sel' : ''}" data-v="${v}"
            aria-pressed="${v === picked}">
      <span class="gauge">${[0,1,2,3].map(k => `<i class="${k <= v ? 'on' : ''}"></i>`).join('')}</span>
      <span>${SCALE[v]}</span>
    </button>`).join('');
  document.querySelectorAll('[data-v]').forEach(b => b.onclick = () => answer(+b.dataset.v));
  $('btn-back').style.visibility = i === 0 ? 'hidden' : 'visible';
}

function answer(v) {
  if (advTimer) return;               // 移行中の二度押しを弾く
  cur.answers[cur.i] = v;
  /* 画面を差し替える前に、選んだ選択肢をその場で沈ませる */
  document.querySelectorAll('#opts .opt').forEach(b => {
    const on = +b.dataset.v === v;
    b.classList.toggle('sel', on);
    b.setAttribute('aria-pressed', on);
  });
  advTimer = setTimeout(() => {
    advTimer = null;
    if (cur.i < QS.length - 1) { cur.i++; renderQ(); }
    else finish();
  }, ADVANCE_MS);
}

function finish() {
  const m = modeOf(cur.mode);
  if (m.kind === 'peer') {
    pending = { answers: { ...cur.answers }, s: score(cur.answers) };
    return showPeerSend();
  }
  const d = store.load();
  d.self[cur.mode] = { s: score(cur.answers), at: Date.now() };
  store.save(d);
  showResult('self', cur.mode);
}

/* ===== 結果 ===== */
function showResult(kind, key) {
  const d = store.load();
  const rec = kind === 'peer' ? d.peers[key] : d.self[key];
  if (!rec) { renderHome(); return show('s-home'); }
  const s = rec.s, t = typeOf(s);
  const isPeer = kind === 'peer';

  $('r-cat').textContent = isPeer ? `${rec.nick}から見たあなた` : `${modeOf(key).name}のあなた`;
  $('r-name').textContent = t.n;
  $('r-catch').textContent = t.c;
  $('r-map').innerHTML = drawSingle(s, isPeer ? COL.peer : COL[key]);
  $('r-readout').innerHTML = readout(s);
  $('r-body').textContent = t.d;
  $('r-roles').innerHTML = ['リーダー', 'まとめ役', '参謀', '専門職', '支援']
    .map(r => `<span class="role ${t.r.includes(r) ? 'hi' : ''}">${r}</span>`).join('');
  $('r-note').textContent = isPeer ? PEER_NOTE : ROLE_NOTE;

  $('btn-share').hidden = isPeer;
  $('btn-again').hidden = isPeer;
  if (!isPeer) {
    $('btn-share').onclick = () => shareResult(modeOf(key).name, t, s);
    $('btn-again').onclick = () => start(key);
  }

  const n = countEntries(d);
  const bf = $('btn-front');
  bf.hidden = n < 2;
  bf.onclick = showCompare;

  /* まだ受けていない自己診断があれば、そちらへの導線を出す */
  const rest = SELF_MODES.find(m => !d.self[m.id]);
  const bo = $('btn-other');
  bo.textContent = rest ? `${rest.name}も受ける` : '表紙にもどる';
  bo.onclick = rest ? () => start(rest.id) : goHome;

  show('s-result');
}

const readout = s => `
  <div><div class="k">陽陰</div><div class="v">${BAND_Y[s.y.band]}</div>
    <div class="p">${s.y.sum}/${s.y.max} · ${Math.round(s.y.ratio * 100)}%</div></div>
  <div><div class="k">温冷</div><div class="v">${BAND_O[s.o.band]}</div>
    <div class="p">${s.o.sum}/${s.o.max} · ${Math.round(s.o.ratio * 100)}%</div></div>`;

/* ===== 共有 ===== */
/* Web Share が使えれば OS の共有シートを開き、無ければクリップボードに退避する */
async function shareOut({ title, text, url }, okMsg) {
  const payload = url ? { title, text, url } : { title, text };
  if (navigator.share) {
    try { await navigator.share(payload); return true; }
    catch (e) { if (e && e.name === 'AbortError') return false; }   // 自分で閉じただけ
  }
  try {
    await navigator.clipboard.writeText(url ? `${text}\n${url}` : text);
    toast(okMsg);
    return true;
  } catch (e) { toast('共有できませんでした'); return false; }
}

function shareResult(modeName, t, s) {
  const text = `【${modeName}】の私は「${t.n}」\n`
    + `陽陰 ${BAND_Y[s.y.band]}（${Math.round(s.y.ratio * 100)}%）`
    + ` / 温冷 ${BAND_O[s.o.band]}（${Math.round(s.o.ratio * 100)}%）\n— 何者だ`;
  shareOut({ title: '何者だ', text }, 'コピーしました');
}

/* ===== 他人を診断した結果を送る ===== */
function showPeerSend() {
  const t = typeOf(pending.s);
  $('p-name').textContent = t.n;
  $('p-catch').textContent = t.c;
  $('p-map').innerHTML = drawSingle(pending.s, COL.peer);
  $('p-link').hidden = true;
  $('p-link').textContent = '';
  $('p-nick').value = '';
  show('s-peer');
}

function peerLink() {
  const nick = $('p-nick').value.trim();
  if (!nick) { toast('ニックネームを入れてください'); $('p-nick').focus(); return null; }
  return { nick, url: makeLink(nick, pending.answers) };
}

/* ===== 受け取り ===== */
function showInbox(peer, idx) {
  const t = typeOf(peer.s);
  $('i-title').textContent = `${peer.nick}から見たあなた`;
  $('i-catch').textContent = `${t.n} — ${t.c}`;
  $('i-map').innerHTML = drawSingle(peer.s, COL.peer);
  $('i-readout').innerHTML = readout(peer.s);
  $('i-note').textContent = PEER_NOTE;
  const d = store.load();
  const bi = $('btn-icompare');
  if (d.self.general) {
    bi.textContent = '自分の結果と並べる';
    bi.onclick = showCompare;
  } else {
    bi.textContent = 'まず自分を診断する';
    bi.onclick = () => start('general');
  }
  $('btn-idetail').onclick = () => showResult('peer', idx);
  show('s-inbox');
}

/* ===== 比較 ===== */
function entries(d) {
  const out = [];
  SELF_MODES.forEach(m => {
    if (d.self[m.id]) out.push({ ref: `self:${m.id}`, label: m.name, short: m.id === 'general' ? '一般' : 'ディライト',
                                 color: COL[m.id], s: d.self[m.id].s, type: typeOf(d.self[m.id].s).n });
  });
  d.peers.forEach((p, i) => out.push({ ref: `peer:${i}`, label: p.nick, short: p.nick,
                                       color: COL.peer, s: p.s, type: typeOf(p.s).n }));
  return out;
}

function showCompare() {
  const d = store.load();
  const list = entries(d);
  if (list.length < 2) return;

  $('c-map').innerHTML = drawCompare(list.map(e => ({ label: e.short, color: e.color, s: e.s })));
  $('c-legend').innerHTML = list.map(e => `
    <button class="btn lg" data-open="${e.ref}">
      <span class="sw" style="background:${e.color}"></span>
      <span class="nm">${esc(e.label)}</span>
      <span class="ty">${e.type}</span>
      <span class="go">›</span>
    </button>`).join('');
  document.querySelectorAll('#c-legend [data-open]').forEach(b =>
    b.onclick = () => {
      const [kind, key] = b.dataset.open.split(':');
      showResult(kind, kind === 'peer' ? +key : key);
    });

  const cards = [];
  if (d.self.general && d.self.delight) cards.push(gapSelf(d.self.general.s, d.self.delight.s));
  if (d.self.general && d.peers.length)  cards.push(gapPeer(d.self.general.s, d.peers));
  $('c-cards').innerHTML = cards.join('');
  show('s-compare');
}

const sign = v => (v > 0 ? '+' : v < 0 ? '−' : '±') + Math.abs(v);

function deltaRows(rows) {
  return `<div class="delta">${rows.map(r => `
    <div><span class="dk">${r.k}</span>
      <span class="dv">${r.a}% → ${r.b}% <b>${sign(r.b - r.a)}</b></span></div>`).join('')}</div>`;
}

/* 普段の自分 vs サークルでの自分 */
function gapSelf(g, dl) {
  const dy = Math.round((dl.y.ratio - g.y.ratio) * 100);
  const abs = Math.abs(dy), open = dy >= 0;
  let verdict, desc;
  if (abs < 15) {
    verdict = 'ほとんど差がない';
    desc = '普段の自分と、ディライトにいるときの自分がほぼ同じです。場によって自分を作り替えないぶん一貫していて信頼されやすい反面、合わない場では消耗しやすくなります。';
  } else if (abs < 35) {
    verdict = 'ゆるやかな差';
    desc = open
      ? 'ディライトでは普段より少し外に開いています。無理のない範囲の調整で、切り替えの負担は小さいはずです。'
      : 'ディライトでは普段より少し内に寄っています。意識的に抑えているというより、場の役割に自然と収まっている状態に近そうです。';
  } else {
    verdict = 'はっきりした差';
    desc = open
      ? 'ディライトでの自分と普段の自分は、別人といっていい差があります。サークルで前に出られる器用さがある一方、切り替えのコストは確実にかかっているので、消耗の自覚は持っておいたほうがよさそうです。'
      : '普段よりディライトでかなり内に寄っています。サークルでの立ち位置が本来の自分と噛み合っていない可能性があります。役割のほうを見直す余地があるかもしれません。';
  }
  return `<div class="card-x">
    <div class="k">普段とディライトの差 — 陽陰軸 ${abs}pt</div>
    <div class="v">${verdict}</div><div class="d">${desc}</div>
    ${deltaRows([
      { k: '陽陰', a: Math.round(g.y.ratio * 100), b: Math.round(dl.y.ratio * 100) },
      { k: '温冷', a: Math.round(g.o.ratio * 100), b: Math.round(dl.o.ratio * 100) }
    ])}</div>`;
}

/* 自己評価 vs 他己評価 */
function gapPeer(g, peers) {
  const avg = ax => peers.reduce((a, p) => a + p.s[ax].ratio, 0) / peers.length;
  const py2 = avg('y'), po2 = avg('o');
  const dy = Math.round((py2 - g.y.ratio) * 100);
  const abs = Math.abs(dy), open = dy >= 0;
  const who = peers.length === 1 ? esc(peers[0].nick) : `他己評価${peers.length}件の平均`;
  let verdict, desc;
  if (abs < 15) {
    verdict = '見え方はほぼ一致';
    desc = `自分の見立てと、${who}から見えているあなたがほぼ重なっています。自己像と外からの印象がずれていない状態です。`;
  } else if (abs < 35) {
    verdict = '少しずれている';
    desc = open
      ? `${who}からは、自分で思っているより外に開いて見えています。自己評価が控えめなだけということもあれば、場に合わせて振る舞えているぶん内側の消耗が見えていないだけ、ということもあります。`
      : `${who}からは、自分で思っているより内に寄って見えています。出しているつもりの部分が、まだ届いていないのかもしれません。`;
  } else {
    verdict = '大きくずれている';
    desc = open
      ? `${who}から見たあなたは、自分の見立てよりかなり外向きです。周囲の期待と、自分が実際に払っている労力の差が大きくなりやすい形です。`
      : `${who}から見たあなたは、自分の見立てよりかなり内向きです。自分では出しているつもりのものが伝わっていない可能性があります。`;
  }
  return `<div class="card-x">
    <div class="k">自己評価と他己評価の差 — 陽陰軸 ${abs}pt</div>
    <div class="v">${verdict}</div><div class="d">${desc}</div>
    ${deltaRows([
      { k: '陽陰', a: Math.round(g.y.ratio * 100), b: Math.round(py2 * 100) },
      { k: '温冷', a: Math.round(g.o.ratio * 100), b: Math.round(po2 * 100) }
    ])}
    <p class="sub-note">${PEER_NOTE}</p></div>`;
}

/* ===== イベント ===== */
const goHome = () => { cancelAdvance(); renderHome(); show('s-home'); };

$('btn-back').onclick = () => { if (!advTimer && cur.i > 0) { cur.i--; renderQ(); } };
$('btn-quit').onclick = goHome;
$('btn-compare').onclick = showCompare;
$('btn-chome').onclick = goHome;
$('btn-phome').onclick = goHome;
$('btn-ihome').onclick = goHome;
$('btn-theme').onclick = () => toast(theme.next().label);
$('btn-reset').onclick = () => {
  store.save({ self: {}, peers: [] }); renderHome(); toast('記録を消しました');
};

$('btn-psend').onclick = async () => {
  const l = peerLink();
  if (!l) return;
  $('p-link').textContent = l.url;
  $('p-link').hidden = false;
  await shareOut({
    title: '何者だ',
    text: `${l.nick}が見たあなたを診断しました。開くと自分の結果と並べて比べられます。`,
    url: l.url
  }, 'リンクをコピーしました');
};
$('btn-pcopy').onclick = () => {
  const l = peerLink();
  if (!l) return;
  $('p-link').textContent = l.url;
  $('p-link').hidden = false;
  navigator.clipboard?.writeText(l.url)
    .then(() => toast('リンクをコピーしました'))
    .catch(() => toast('コピーできませんでした'));
};

/* ===== 起動 ===== */
theme.init();

function boot() {
  const got = readLink(location.hash);
  if (got) {
    const d = store.load();
    /* 同じ人から同じ内容が二重に入らないようにする */
    const same = d.peers.findIndex(p => p.nick === got.nick
      && p.s.y.sum === got.s.y.sum && p.s.o.sum === got.s.o.sum);
    let idx;
    if (same >= 0) { idx = same; }
    else { d.peers.push(got); idx = d.peers.length - 1; store.save(d); }
    /* 再読み込みで二重に取り込まないようフラグメントを落とす */
    history.replaceState(null, '', location.pathname + location.search);
    renderHome();
    return showInbox(got, idx);
  }
  renderHome();
}
boot();

/* すでに開いているところへ別のリンクを踏まれた場合。
   同一ページ内のハッシュ変更ではリロードが走らないので自分で拾う */
window.addEventListener('hashchange', () => { if (readLink(location.hash)) boot(); });

if ('serviceWorker' in navigator && location.protocol.startsWith('http')) {
  window.addEventListener('load', () => navigator.serviceWorker.register('sw.js').catch(() => {}));
}
