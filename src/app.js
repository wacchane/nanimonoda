/* ===== 何者だ — ディライトの役職適性診断（3軸18問） ===== */

/* 診断の種類。qk は QS.t のどの言い回しを使うか */
const MODES = [
  { id: 'self', kind: 'self', qk: 'self',  name: '自分を診断する',  hint: '18問 / 2〜3分' },
  { id: 'peer', kind: 'peer', qk: 'other', name: '他人を診断する',  hint: '結果をリンクで相手に送れます' }
];
const modeOf = id => MODES.find(m => m.id === id);

const SCALE = ['まったく違う', 'あまり違う', 'ややそう', 'とてもそう'];

/* 18問 = 3軸 × 6問。各軸で順3問・逆3問（黙従バイアスの相殺）。
   self / other は主語を移しただけで、facet と dir は完全に同一。
   これがあるから自己評価と他己評価を直接比較できる。
   出典: docs/01-測定設計.md */
const QS = [
  /* ── 陽陰軸: 前に出る ⇔ 引く ── */
  { ax: 'y', dir: 1, facet: '対人接近性', t: {
    self:  '練習に新しく来た人がいたら、自分から声をかけに行く',
    other: 'この人は、練習に新しく来た人がいたら自分から声をかけに行く' } },
  { ax: 'y', dir: -1, facet: '一人時間の選好', t: {
    self:  '練習が急に中止になると、少しホッとする',
    other: 'この人は、練習が急に中止になると少しホッとしていそうだ' } },
  { ax: 'y', dir: 1, facet: '集団での注目志向', t: {
    self:  'コート上やミーティングで自分が中心にいると、テンションが上がる',
    other: 'この人は、コート上やミーティングで自分が中心にいるとテンションが上がる' } },
  { ax: 'y', dir: -1, facet: '社交後の消耗', t: {
    self:  '体を動かした疲れとは別に、人と長く関わった日は、楽しくてもどっと疲れる',
    other: 'この人は、体を動かした疲れとは別に、人と長く関わった日は楽しくても疲れていそうだ' } },
  { ax: 'y', dir: 1, facet: '発信性', t: {
    self:  'サークル全体に関わる話題なら、自分から発言や提案を投稿するほうだ',
    other: 'この人は、サークル全体に関わる話題なら自分から発言や提案を投稿する' } },
  { ax: 'y', dir: -1, facet: '会話の主導性', t: {
    self:  '練習の合間に会話が途切れても、無理に話題を探そうとは思わない',
    other: 'この人は、練習の合間に会話が途切れても無理に話題を探そうとはしない' } },

  /* ── 温冷軸: 情で決める ⇔ 理で決める ── */
  { ax: 'o', dir: 1, facet: '共感的傾聴', t: {
    self:  'メンバーが悩みを話してきたら、解決策より先に気持ちに寄り添う',
    other: 'この人は、メンバーが悩みを話すと解決策より先に気持ちに寄り添う' } },
  { ax: 'o', dir: -1, facet: '公平性 vs 個別配慮', t: {
    self:  '相手が誰であっても、サークルの決まりごとは同じように適用すべきだ',
    other: 'この人は、相手が誰であってもサークルの決まりごとを同じように適用する' } },
  { ax: 'o', dir: 1, facet: '情動伝染', t: {
    self:  'ミスして落ち込んでいるメンバーがいると、自分まで気分が引きずられる',
    other: 'この人は、落ち込んでいるメンバーがいると自分まで気分が引きずられるほうだ' } },
  { ax: 'o', dir: -1, facet: '率直さ vs 配慮', t: {
    self:  '相手が気を悪くする可能性があっても、プレーについて正しいと思うことは言う',
    other: 'この人は、相手が気を悪くする可能性があってもプレーについて正しいと思うことは言う' } },
  { ax: 'o', dir: 1, facet: '意思決定基準', t: {
    self:  '練習メニューや方針を決めるとき、正しさより全員が納得するかを重視する',
    other: 'この人は、練習メニューや方針を決めるとき正しさより全員が納得するかを重視する' } },
  { ax: 'o', dir: -1, facet: '感情への反応スタイル', t: {
    self:  '感情的になっている人がいると、まず落ち着いて事実を整理したくなる',
    other: 'この人は、感情的になっている人がいると、まず落ち着いて事実を整理しようとする' } },

  /* ── 堅緩軸: きっちり ⇔ ゆるい ──
     施設係・会計係に本当に効くのはここ。陽陰でも温冷でもない第3の軸として新設した */
  { ax: 'k', dir: 1, facet: '締切の扱い', t: {
    self:  '出欠の返事や提出物は、期限より早めに出すほうだ',
    other: 'この人は、出欠の返事や提出物を期限より早めに出すほうだ' } },
  { ax: 'k', dir: -1, facet: '先延ばし', t: {
    self:  '気が乗らない連絡や手続きは、つい後回しにしてしまう',
    other: 'この人は、気が乗らない連絡や手続きを後回しにしがちに見える' } },
  { ax: 'k', dir: 1, facet: '手順の一貫性', t: {
    self:  '一度決まったやり方は、毎回同じ手順で進める',
    other: 'この人は、一度決まったやり方を毎回同じ手順で進める' } },
  { ax: 'k', dir: -1, facet: '抜け漏れ', t: {
    self:  '持ち物や連絡を忘れていて、後から気づくことがある',
    other: 'この人は、持ち物や連絡を忘れていることがある' } },
  { ax: 'k', dir: 1, facet: '事前準備', t: {
    self:  '予定が決まったら、早めに段取りを済ませておく',
    other: 'この人は、予定が決まると早めに段取りを済ませておく' } },
  { ax: 'k', dir: -1, facet: '管理の粒度', t: {
    self:  'お金や予定の管理は、だいたい把握できていれば十分だと思う',
    other: 'この人は、お金や予定の管理をだいたいで済ませるほうに見える' } }
];

const AXES = [
  { id: 'y', name: '陽陰', hi: '陽', lo: '陰' },
  { id: 'o', name: '温冷', hi: '温', lo: '冷' },
  { id: 'k', name: '堅緩', hi: '堅', lo: '緩' }
];
const BANDS = {
  y: ['強い陰キャ', 'やや陰キャ', 'やや陽キャ', '強い陽キャ'],
  o: ['強い冷キャ', 'やや冷キャ', 'やや温キャ', '強い温キャ'],
  k: ['強い緩キャ', 'やや緩キャ', 'やや堅キャ', '強い堅キャ']
};

/* ===== 役職 =====
   適性は3軸の重み付き合計で出す。設問は性格を聞き、役職は結果から導く。
   副代表は「仕切り役(冷)」と「盛り上げ役(温)」の2枠あるが、
   表示は `副代表` の1つに畳む（高いほうを採用）。 */
const ROLE_LABELS = ['代表', '副代表', 'イベント係', '施設係', '会計係'];
const ROLES = [
  { label: '代表',       kind: '',           w: { y: 3, o: -2, k: 2 },
    d: 'チームの代表として全体を俯瞰し、決める役。前に立てて、情に流されず、決めたことをやり切れる位置です。' },
  { label: '副代表',     kind: '仕切り役',   w: { y: 2, o: -3, k: 3 },
    d: '実行部隊の仕切り側。練習の中身と時間を締められる位置です。' },
  { label: '副代表',     kind: '盛り上げ役', w: { y: 3, o: 3,  k: 1 },
    d: '実行部隊の盛り上げ側。場を明るくして、人が離れないようにする位置です。' },
  { label: 'イベント係', kind: '',           w: { y: 2, o: 3,  k: 2 },
    d: '皆が楽しめるイベントを企画して運営する役。誰が楽しめていないかに気づける温かさと、段取り力の両方が要ります。' },
  { label: '施設係',     kind: '',           w: { y: -1, o: 0, k: 4 },
    d: '毎月の体育館予約を担う役。欠けると活動が成り立たない要の位置で、必要なのは目立つ力ではなく、淡々と続ける力です。' },
  { label: '会計係',     kind: '',           w: { y: -1, o: -3, k: 4 },
    d: '会費と収支を管理する役。相手が誰でも同じ基準で徴収できる冷静さと、数字を合わせ切る几帳面さが要ります。' }
];

/* 16タイプ（陽陰 × 温冷）。エンタメとしての人物像で、役職適性とは別軸 */
const TYPES = [
  [ /* 強い陰 */
    { n:'完全論理体',      c:'感情の外側で考える人',
      d:'ぶれない判断基準を持ち、周囲が揺れているときほど価値が出ます。伝え方に一手間かけると、その正しい判断が実際に通るようになります。' },
    { n:'孤高の研究者',    c:'一人で深く潜る人',
      d:'集団の力学より、対象そのものへの興味が勝つタイプ。人脈ではなく専門性で信頼を積み上げていきます。' },
    { n:'一途な夢想家',    c:'自分の世界を持っている人',
      d:'広く浅くではなく、狭く深く関わります。数は多くないぶん、合う相手との結びつきは誰よりも強くなります。' },
    { n:'秘めた博愛主義者', c:'静かに気にかけている人',
      d:'表には出しませんが、人のことをよく考えています。伝えないと伝わらないので、言葉にする回数を少し増やすだけで印象が変わります。' }
  ],
  [ /* やや陰 */
    { n:'寡黙な観測者',    c:'見えている人',
      d:'発言は少なくても、場の力学を正確に把握しています。聞かれたときに出す一言の精度が高く、そこで評価が決まります。' },
    { n:'職人肌の分析家',  c:'静かに正解を出す人',
      d:'表に出ないところで筋道を立てるのが得意。前に立つより、決める人の隣で判断材料を作る位置で最も活きます。' },
    { n:'静かな癒し系',    c:'いるだけで空気が緩む人',
      d:'主張は強くありませんが、その場にいる安心感が集団を支えています。存在そのものが機能しているタイプです。' },
    { n:'縁の下の聞き上手', c:'一対一で本音を引き出す人',
      d:'大人数では目立ちませんが、1対1での傾聴力は随一。不満が爆発する前に拾えます。最も過小評価されているタイプです。' }
  ],
  [ /* やや陽 */
    { n:'クールな仕切り役', c:'淡々と回す人',
      d:'感情の起伏に左右されず、決めるべきことを決められます。冷たいと誤解されやすいので、判断の意図を言葉にすると評価が変わります。' },
    { n:'切れ者の交渉人',  c:'筋を通しながら通す人',
      d:'論理で組み立てながら、相手の面子も潰さない。前に立つ役とまとめる役を一人で兼ねられる希少なタイプです。' },
    { n:'愛されいじられ役', c:'誰とでも組める人',
      d:'極端さがないぶん、どのタイプの相手とも噛み合います。目立ちませんが、組織が大きくなるほど効いてくる万能型です。' },
    { n:'世話焼き幹事',    c:'気づいたら手を挙げている人',
      d:'程よい社交性と強い配慮で、集団の潤滑油になります。頼まれごとを断りにくく、抱え込みやすいのが弱点です。' }
  ],
  [ /* 強い陽 */
    { n:'カリスマ司令塔',  c:'決める人',
      d:'迷いのない判断と発信力で場を引っ張ります。危機や立て直しでは最強クラスですが、平時に長く続くと周囲が消耗します。温かい人を横に置くと本領が出ます。' },
    { n:'陽気な策士',      c:'笑いながら決めていく人',
      d:'巻き込む力と、情に流されない判断力の両方を持っています。全員にとって最善ではない選択でも、説明して通せるタイプです。' },
    { n:'ムードメーカー',  c:'空気が重くなると動く人',
      d:'沈黙や気まずさに人一倍敏感で、気づけば場を回しています。盛り上げは得意な一方、対立の調停より雰囲気の維持に流れやすい面があります。' },
    { n:'太陽キャ',        c:'その場の温度を上げる人',
      d:'場を明るくしながら、一人ひとりの機嫌まで見ています。人が自然と集まってくるぶん、気を配りすぎて自分の消耗に気づきにくいので注意。' }
  ]
];

const ROLE_NOTE = 'この結果は「なりやすさ」であって「うまくやれるか」ではありません。外向性はリーダーに選ばれやすさとは相関しますが、成果との相関は弱いことが知られています。適性が低く出た役職は向いていないのではなく、候補に挙がりにくいだけ、という場合が多くあります。';
const PEER_NOTE = '他己評価は、外から見える行動しか拾えません。一人の時間にホッとするか、人と会った後に疲れるかといった内側の項目は、相手には推測でしか答えられません。そのぶんを差し引いて見てください。';

const PEER_MAX = 8;   // 他己評価の保存上限。5件も集まれば平均はほぼ動かず、増やすと座標盤が読めなくなる

/* ===== 保存 =====
   形: { self: {s,at} | null, peers: [ {nick,s,at} ] }
   v1（2軸12問）とは設問構成が非互換なので、キーを分けて読まない */
const store = (() => {
  const KEY = 'nanimonoda.v2';
  let mem = null;
  let ok = false;
  try { localStorage.setItem('__t', '1'); localStorage.removeItem('__t'); ok = true; } catch (e) { ok = false; }
  const shape = o => ({
    self: (o && o.self) || null,
    peers: (o && Array.isArray(o.peers)) ? o.peers.slice(-PEER_MAX) : []
  });
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

/* ===== 配色（自動 / ライト / ダーク） ===== */
const THEMES = [
  { id: 'auto',  icon: '◐', label: '配色: 自動' },
  { id: 'light', icon: '○', label: '配色: ライト' },
  { id: 'dark',  icon: '●', label: '配色: ダーク' }
];
const theme = (() => {
  const KEY = 'nanimonoda.theme';
  let cur = 'auto';
  try { cur = localStorage.getItem(KEY) || 'auto'; } catch (e) {}
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
  if (ratio <= 0.50) return 1;   // 50%ちょうどは陰側・冷側・緩側に含める
  if (ratio <= 0.75) return 2;
  return 3;
}

function score(answers) {
  const out = {};
  AXES.forEach(a => {
    const list = QS.map((q, i) => ({ q, i })).filter(x => x.q.ax === a.id);
    const sum = list.reduce((acc, x) => acc + (x.q.dir === 1 ? answers[x.i] : 3 - answers[x.i]), 0);
    const max = list.length * 3;
    out[a.id] = { n: list.length, sum, max, ratio: sum / max, band: band(sum / max) };
  });
  return out;
}

const typeOf = s => TYPES[s.y.band][s.o.band];

/* 役職適性。各軸を -1〜+1 に直して重み付き合計し、0〜100 に均す */
function fitOf(s, w) {
  let raw = 0, max = 0;
  AXES.forEach(a => {
    const wt = w[a.id] || 0;
    if (!wt) return;
    raw += wt * (s[a.id].ratio * 2 - 1);
    max += Math.abs(wt);
  });
  return max ? Math.round(((raw / max + 1) / 2) * 100) : 50;
}

/* ===== 六角形（6役職のレーダー） =====
   6つの役職はちょうど六角形に収まる。畳まずに副代表を2枠に開いて使う。
   隣り合うスポークが性質の近いものになるよう並び順を決めている。

   注意: 6つの適性値は3軸から導いた合成値なので、互いに独立ではない。
   六角形が取りうる形は3パラメータぶんに限られる。形の比較には使えるが、
   6つの独立した情報が並んでいるわけではない。 */
const HEX_ORDER = ['代表', '副代表:盛り上げ役', 'イベント係', '施設係', '会計係', '副代表:仕切り役'];
const HEX_LABEL = {
  '代表': ['代表'],
  '副代表:盛り上げ役': ['副代表', '盛り上げ'],
  'イベント係': ['イベント係'],
  '施設係': ['施設係'],
  '会計係': ['会計係'],
  '副代表:仕切り役': ['副代表', '仕切り']
};
const keyOf = r => r.label + (r.kind ? ':' + r.kind : '');

/* 畳まない6つぶんの適性を、六角形の並び順で返す */
const hexFits = s => HEX_ORDER.map(k => {
  const r = ROLES.find(x => keyOf(x) === k);
  return { key: k, v: fitOf(s, r.w) };
});

/* series: [{ label, color, s }] */
function hexChart(series) {
  const C = 150, R = 88;
  const at = (i, t) => {
    const a = (-90 + i * 60) * Math.PI / 180;
    return [C + Math.cos(a) * R * t, C + Math.sin(a) * R * t];
  };
  const poly = t => HEX_ORDER.map((_, i) => at(i, t).join(',')).join(' ');

  const grid = [0.25, 0.5, 0.75, 1].map(t =>
    `<polygon class="hx-grid" points="${poly(t)}"/>`).join('')
    + HEX_ORDER.map((_, i) =>
      `<line class="hx-grid" x1="${C}" y1="${C}" x2="${at(i,1)[0]}" y2="${at(i,1)[1]}"/>`).join('');

  const shapes = series.map(sr => {
    const f = hexFits(sr.s);
    const pts = f.map((x, i) => at(i, x.v / 100).join(',')).join(' ');
    return `<polygon points="${pts}" fill="${sr.color}" fill-opacity=".16"
              stroke="${sr.color}" stroke-width="1.8" stroke-linejoin="round"/>`
      + f.map((x, i) => { const [px2, py2] = at(i, x.v / 100);
          return `<circle cx="${px2}" cy="${py2}" r="3" fill="${sr.color}"/>`; }).join('');
  }).join('');

  const labels = HEX_ORDER.map((k, i) => {
    const [lx, ly] = at(i, 1.2);
    const anchor = Math.abs(lx - C) < 6 ? 'middle' : (lx > C ? 'start' : 'end');
    const lines = HEX_LABEL[k];
    return `<text class="hx-lab" x="${lx}" y="${ly}" text-anchor="${anchor}"
              dy="${lines.length > 1 ? '-0.1em' : '0.35em'}">${
      lines.map((t, j) => `<tspan x="${lx}" dy="${j ? '1.15em' : 0}">${t}</tspan>`).join('')}</text>`;
  }).join('');

  return `<svg class="hex" viewBox="0 0 300 300" role="img" aria-label="6役職への適性">
    <style>
      .hx-grid{fill:none;stroke:var(--grid);stroke-width:1}
      .hx-lab{font-family:var(--sans);font-size:10px;font-weight:600;fill:var(--ink-70);letter-spacing:.02em}
    </style>
    ${grid}${shapes}${labels}
  </svg>`;
}

/* 表示用。副代表は2枠を高いほうに畳んでから、適性の高い順に並べる */
function roleFits(s) {
  const all = ROLES.map(r => ({ ...r, v: fitOf(s, r.w) }));
  return ROLE_LABELS
    .map(label => all.filter(r => r.label === label)
                     .reduce((a, b) => (b.v > a.v ? b : a)))
    .sort((a, b) => b.v - a.v);
}

/* ===== 共有リンク =====
   18問 × 2bit = 5バイト + ニックネームのUTF-8 を base64url にして
   URLのフラグメントに載せる。# 以降はサーバーに送信されない。
   設問構成を変えたら必ず LINK_V を上げること（古いリンクの誤読を防ぐ） */
const LINK_V = '2';
const NICK_MAX = 20;
const PACK_BYTES = Math.ceil(QS.length / 4);

const b64uEnc = bytes => {
  let s = '';
  bytes.forEach(b => { s += String.fromCharCode(b); });
  return btoa(s).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
};
const b64uDec = str => Uint8Array.from(
  atob(str.replace(/-/g, '+').replace(/_/g, '/')), c => c.charCodeAt(0));

function packAnswers(a) {
  const b = new Uint8Array(PACK_BYTES);
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
  const blob = new Uint8Array(PACK_BYTES + name.length);
  blob.set(packAnswers(answers), 0);
  blob.set(name, PACK_BYTES);
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
    if (b.length < PACK_BYTES) return null;
    const answers = unpackAnswers(b.subarray(0, PACK_BYTES));
    const nick = new TextDecoder().decode(b.subarray(PACK_BYTES)).trim().slice(0, NICK_MAX);
    return { nick: nick || '名前なし', s: score(answers), at: Date.now() };
  } catch (e) { return null; }
}

/* 他己評価の総合。軸ごとに素点を平均する */
function aggregate(peers) {
  const out = {};
  AXES.forEach(a => {
    const max = peers[0].s[a.id].max;
    const sum = peers.reduce((acc, p) => acc + p.s[a.id].sum, 0) / peers.length;
    out[a.id] = { n: peers[0].s[a.id].n, sum, max, ratio: sum / max, band: band(sum / max) };
  });
  return out;
}

/* ===== 座標盤（陽陰 × 温冷。堅緩は数値とバーで見せる） ===== */
const STARS = [[24,40],[58,16],[97,68],[133,28],[176,54],[213,22],[247,86],[275,44],
               [20,124],[68,163],[117,140],[157,193],[195,129],[234,175],[271,146],
               [42,229],[90,265],[145,241],[188,279],[231,243],[277,219]];

/* bare = true のときは星だけ。立体表示では2次元の軸ラベルと四辺の色が嘘になるので出さない */
function field(id, bare) {
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
    .fx-warm{fill:var(--warm)} .fx-cold{fill:var(--cold)} .fx-firm{fill:var(--cat-b)}
    .fx-star{fill:#FFFFFF;opacity:calc(var(--star) * .5)}
    .map.cube{touch-action:none;cursor:grab} .map.cube:active{cursor:grabbing}
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
    ${bare ? '' : `
    ${edge.map(([k]) => `<rect class="fx-wash" x="0" y="0" width="300" height="300" fill="url(#w${k}-${id})"/>`).join('')}
    ${[75,150,225].map(v => `<line class="fx-grid" x1="${v}" y1="0" x2="${v}" y2="300"/>
       <line class="fx-grid" x1="0" y1="${v}" x2="300" y2="${v}"/>`).join('')}
    <line class="fx-axis" x1="150" y1="0" x2="150" y2="300"/>
    <line class="fx-axis" x1="0" y1="150" x2="300" y2="150"/>`}
  </g>
  ${bare ? '' : `
  <text class="fx-lab fx-warm"  x="150" y="20"  text-anchor="middle">温</text>
  <text class="fx-lab fx-cold"  x="150" y="290" text-anchor="middle">冷</text>
  <text class="fx-lab fx-shade" x="13"  y="155" text-anchor="middle">陰</text>
  <text class="fx-lab fx-sun"   x="287" y="155" text-anchor="middle">陽</text>`}`;
}

const px = y => y.ratio * 250 + 25;        // 陽陰: 右=陽
const py = o => (1 - o.ratio) * 250 + 25;  // 温冷: 上=温

/* 第3軸（堅緩）は点のまわりのリングの埋まり具合で出す。
   pathLength="100" で円周を100に正規化しているので、割合をそのまま dasharray に渡せる。
   上（12時）から時計回りに埋まるよう -90度回している。 */
function ring(x, y, R, color, ratio) {
  const p = Math.max(0, Math.min(1, ratio)) * 100;
  return `
    <circle cx="${x}" cy="${y}" r="${R}" fill="none"
            stroke="var(--ink)" stroke-opacity=".24" stroke-width="2.4"/>
    <circle cx="${x}" cy="${y}" r="${R}" fill="none" stroke="${color}" stroke-width="2.4"
            stroke-linecap="round" pathLength="100" stroke-dasharray="${p} 100"
            transform="rotate(-90 ${x} ${y})"/>`;
}

/* k を渡すと堅緩のリングが付く。渡さなければ従来どおりの薄い輪 */
function dot(x, y, color, r, k) {
  const halo = k === undefined
    ? `<circle cx="${x}" cy="${y}" r="${r * 2.7}" fill="none" stroke="${color}" stroke-opacity=".2"/>`
    : ring(x, y, r * 2.4, color, k);
  return `${halo}
    <circle cx="${x + 1.6}" cy="${y + 1.6}" r="${r}" fill="var(--sd)"/>
    <circle cx="${x - 1.6}" cy="${y - 1.6}" r="${r}" fill="var(--hl)"/>
    <circle cx="${x}" cy="${y}" r="${r}" fill="var(--plate)"/>
    <circle cx="${x}" cy="${y}" r="${r * .52}" fill="${color}"/>`;
}

const COL = { self: 'var(--cat-a)', peer: 'var(--cat-c)' };

/* items: [{ label, color, s, faint }] — faint は個別の他己評価（点だけ薄く打つ） */
function drawFlat(items, id) {
  const pts = items.map(it => ({ ...it, x: px(it.s.y), y: py(it.s.o) }));
  const main = pts.filter(p => !p.faint);
  const line = main.length > 1
    ? `<polyline points="${main.map(p => `${p.x},${p.y}`).join(' ')}" fill="none"
         stroke="var(--ink)" stroke-opacity=".3" stroke-width="1.4" stroke-dasharray="5 4"/>` : '';
  const placed = [];
  return `<svg class="map" viewBox="0 0 300 300" role="img" aria-label="診断結果の位置">
    ${field(id)}
    ${pts.filter(p => p.faint).map(p => `
      <circle cx="${p.x}" cy="${p.y}" r="4.5" fill="${p.color}" opacity=".42"/>`).join('')}
    ${line}
    ${main.map(p => dot(p.x, p.y, p.color, main.length > 1 ? 8 : 9, p.s.k.ratio)).join('')}
    ${main.filter(p => p.label).map(p => {
      /* リングのぶんラベルを外に逃がす */
      const up = Math.max(p.y - 28, 32), down = Math.min(p.y + 36, 292);
      const hits = ly => placed.some(q => Math.abs(q.y - ly) < 15 && Math.abs(q.x - p.x) < 70);
      const ly = hits(up) ? down : up;
      placed.push({ x: p.x, y: ly });
      return `<text class="fx-cat" x="${p.x}" y="${ly}" text-anchor="middle">${esc(p.label)}</text>`;
    }).join('')}
  </svg>`;
}

/* ===== 立体表示 =====
   X=陽陰 / Y=温冷 / Z=堅緩 を軸測投影する。
   静止した3Dは奥行きが読めないので、床への垂線と影を必ず添える。
   それでも一意には決まらないため、ドラッグで回せるようにしてある。 */
const CUBE = { S: 60, cx: 150, cy: 152 };

function proj(x, y, z, yaw, pitch) {
  const a = yaw * Math.PI / 180, b = pitch * Math.PI / 180;
  const sx = x * Math.cos(a) - y * Math.sin(a);
  const sy = -(x * Math.sin(a) + y * Math.cos(a)) * Math.sin(b) - z * Math.cos(b);
  return [CUBE.cx + sx * CUBE.S, CUBE.cy + sy * CUBE.S];
}
/* 手前ほど大きい。重なりの描画順に使う */
const depth = (x, y, yaw) => {
  const a = yaw * Math.PI / 180;
  return -(x * Math.sin(a) + y * Math.cos(a));
};

const axOf = s => [s.y.ratio * 2 - 1, s.o.ratio * 2 - 1, s.k.ratio * 2 - 1];

/* 点が近いとラベルが完全に重なるので、上がふさがっていたら下へ逃がす */
function label3D(top, text, placed) {
  const cand = [top[1] - 17, top[1] - 31, top[1] + 26, top[1] + 40];
  const ly = cand.find(y =>
    !placed.some(q => Math.abs(q.y - y) < 13 && Math.abs(q.x - top[0]) < 72)) ?? cand[0];
  placed.push({ x: top[0], y: ly });
  return `<text class="fx-cat" x="${top[0]}" y="${ly}" text-anchor="middle">${esc(text)}</text>`;
}

function draw3D(items, id, yaw, pitch) {
  const P = (x, y, z) => proj(x, y, z, yaw, pitch);
  const L = (p, q, cls) => `<line class="${cls}" x1="${p[0]}" y1="${p[1]}" x2="${q[0]}" y2="${q[1]}"/>`;

  /* 床（緩の面）の方眼 */
  const floor = [];
  [-1, -0.5, 0, 0.5, 1].forEach(v => {
    floor.push(L(P(v, -1, -1), P(v, 1, -1), v === 0 ? 'fx-axis' : 'fx-grid'));
    floor.push(L(P(-1, v, -1), P(1, v, -1), v === 0 ? 'fx-axis' : 'fx-grid'));
  });

  /* 箱の稜線。上面と垂直の柱だけ引いて、線を増やしすぎない */
  const corners = [[-1,-1],[1,-1],[1,1],[-1,1]];
  const box = corners.map((c, i) => {
    const n = corners[(i + 1) % 4];
    return L(P(c[0], c[1], 1), P(n[0], n[1], 1), 'fx-grid')
         + L(P(c[0], c[1], -1), P(c[0], c[1], 1), 'fx-grid');
  }).join('');

  /* 堅緩のラベルは、いちばん左に来た柱に添える */
  const post = corners.reduce((a, c) =>
    (P(c[0], c[1], 0)[0] < P(a[0], a[1], 0)[0] ? c : a));
  /* 柱から少し外へ逃がさないと、床の軸ラベルとぶつかる */
  const [kx, ky] = [P(post[0] * 1.34, post[1] * 1.34, 1.1),
                    P(post[0] * 1.34, post[1] * 1.34, -1.1)];

  const lab = (p, cls, t) =>
    `<text class="fx-lab ${cls}" x="${p[0]}" y="${p[1]}" text-anchor="middle" dy=".35em">${t}</text>`;

  /* 奥から順に描く */
  const pts = items.map(it => {
    const [x, y, z] = axOf(it.s);
    return { ...it, x, y, z, d: depth(x, y, yaw) };
  }).sort((a, b) => a.d - b.d);

  const placed = [];
  const body = pts.map(p => {
    const top = P(p.x, p.y, p.z), foot = P(p.x, p.y, -1);
    const shadow = `<ellipse cx="${foot[0]}" cy="${foot[1]}" rx="${p.faint ? 3 : 5}" ry="${p.faint ? 1.4 : 2.3}"
        fill="var(--ink)" opacity="${p.faint ? .12 : .22}"/>`;
    if (p.faint)
      return shadow + `<circle cx="${top[0]}" cy="${top[1]}" r="4" fill="${p.color}" opacity=".42"/>`;
    return shadow
      + `<line x1="${top[0]}" y1="${top[1]}" x2="${foot[0]}" y2="${foot[1]}"
              stroke="${p.color}" stroke-opacity=".45" stroke-width="1.2" stroke-dasharray="3 3"/>`
      + dot(top[0], top[1], p.color, 8)
      + (p.label ? label3D(top, p.label, placed) : '');
  }).join('');

  return `<svg class="map cube" viewBox="0 0 300 300" role="img" aria-label="3軸の立体表示">
    ${field(id, true)}
    ${floor.join('')}${box}
    ${lab(P(1.52, 0, -1), 'fx-sun', '陽')}${lab(P(-1.52, 0, -1), 'fx-shade', '陰')}
    ${lab(P(0, 1.52, -1), 'fx-warm', '温')}${lab(P(0, -1.52, -1), 'fx-cold', '冷')}
    ${lab(kx, 'fx-firm', '堅')}${lab(ky, 'fx-firm', '緩')}
    ${body}
  </svg>`;
}

/* ===== 座標盤のマウント（平面 / 立体の切り替えとドラッグ回転） ===== */
const view = (() => {
  const KEY = 'nanimonoda.view';
  let mode = 'flat';
  try { mode = localStorage.getItem(KEY) === 'cube' ? 'cube' : 'flat'; } catch (e) {}
  return {
    get mode() { return mode; },
    set(m) {
      mode = m;
      try { localStorage.setItem(KEY, m); } catch (e) {}
      mounted.forEach(paint);
      syncTools();
    },
    yaw: 38, pitch: 26
  };
})();
const mounted = new Set();

function paint(el) {
  const { items, id } = el._map;
  el.innerHTML = view.mode === 'cube'
    ? draw3D(items, id, view.yaw, view.pitch)
    : drawFlat(items, id);
}

function renderMap(el, items, id) {
  el._map = { items, id };
  mounted.add(el);
  paint(el);
  if (!el._wired) { wireDrag(el); el._wired = true; }
}

/* ドラッグで回す。奥行きは静止画では一意に決まらないので、動かせること自体が読み取りの手段 */
function wireDrag(el) {
  let last = null, raf = 0;
  const move = e => {
    if (!last) return;
    e.preventDefault();
    view.yaw = (view.yaw + (e.clientX - last.x) * 0.6) % 360;
    view.pitch = Math.max(6, Math.min(72, view.pitch + (e.clientY - last.y) * 0.35));
    last = { x: e.clientX, y: e.clientY };
    if (!raf) raf = requestAnimationFrame(() => { raf = 0; mounted.forEach(paint); });
  };
  const up = () => {
    last = null;
    window.removeEventListener('pointermove', move);
    window.removeEventListener('pointerup', up);
  };
  el.addEventListener('pointerdown', e => {
    if (view.mode !== 'cube') return;
    last = { x: e.clientX, y: e.clientY };
    window.addEventListener('pointermove', move, { passive: false });
    window.addEventListener('pointerup', up);
  });
}

const CAP = {
  flat: '位置 = 陽陰 × 温冷／外周リングの埋まり = 堅緩',
  cube: '3軸をそのまま立体に。ドラッグで回せます'
};
function syncTools() {
  document.querySelectorAll('.mapcap').forEach(p => {
    p.textContent = CAP[view.mode] + (p.dataset.extra || '');
  });
  document.querySelectorAll('.viewtog button').forEach(b =>
    b.classList.toggle('on', b.dataset.view === view.mode));
}
document.querySelectorAll('.viewtog button').forEach(b =>
  b.onclick = () => view.set(b.dataset.view));

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
  clearTimeout(t._h); t._h = setTimeout(() => t.classList.remove('on'), 2400);
}

/* ===== 表紙 ===== */
function renderHome() {
  const d = store.load();

  $('menu').innerHTML = MODES.map((m, i) => {
    const done = m.kind === 'self' && d.self;
    return `<button class="btn card ${done ? 'done' : ''}" data-mode="${m.id}">
      <span class="dot"></span>
      <span class="no">${String(i + 1).padStart(2, '0')}</span>
      <span class="nm">${m.name}</span>
      <span class="meta">${done ? typeOf(d.self.s).n : m.hint}</span>
    </button>`;
  }).join('');
  document.querySelectorAll('[data-mode]').forEach(b =>
    b.onclick = () => {
      const id = b.dataset.mode;
      if (id === 'self' && store.load().self) showResult('self');
      else start(id);
    });

  const box = $('inbox');
  box.hidden = !d.peers.length;
  if (d.peers.length) {
    $('inbox-count').textContent = `${d.peers.length} / ${PEER_MAX}`;
    $('inboxlist').innerHTML = d.peers.map((p, i) => `
      <button class="btn card done" data-peer="${i}">
        <span class="dot c"></span>
        <span class="nm">${esc(p.nick)}</span>
        <span class="meta">${typeOf(p.s).n}</span>
      </button>`).join('');
    document.querySelectorAll('[data-peer]').forEach(b =>
      b.onclick = () => showResult('peer', +b.dataset.peer));
  }

  const ready = d.self && d.peers.length;
  const cb = $('btn-compare');
  cb.disabled = !ready;
  cb.classList.toggle('off', !ready);
  cb.classList.toggle('primary', !!ready);
  cb.textContent = ready
    ? `自己評価と他己評価を比べる（${d.peers.length}件）`
    : (d.self ? '他己評価が届くと比べられます' : 'まず自分を診断してください');
}

/* ===== 設問 ===== */
const ADVANCE_MS = 260;
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
  if (modeOf(cur.mode).kind === 'peer') {
    pending = { answers: { ...cur.answers }, s: score(cur.answers) };
    return showPeerSend();
  }
  const d = store.load();
  d.self = { s: score(cur.answers), at: Date.now() };
  store.save(d);
  showResult('self');
}

/* ===== 表示部品 ===== */
const readout = (s, exact = true) => AXES.map(a => `
  <div><div class="k">${a.name}</div><div class="v">${BANDS[a.id][s[a.id].band]}</div>
    <div class="p">${exact ? `${s[a.id].sum}/${s[a.id].max} · ` : ''}${Math.round(s[a.id].ratio * 100)}%</div></div>`
).join('');

const fitBars = fits => fits.map((f, i) => `
  <div class="fitrow ${i === 0 ? 'top' : ''}">
    <span class="fl">${f.label}${f.kind ? `<em>${f.kind}</em>` : ''}</span>
    <span class="fb"><i style="width:${f.v}%"></i></span>
    <span class="fv">${f.v}</span>
  </div>`).join('');

/* ===== 結果 ===== */
function showResult(kind, idx) {
  const d = store.load();
  const rec = kind === 'peer' ? d.peers[idx] : d.self;
  if (!rec) { renderHome(); return show('s-home'); }
  const s = rec.s, t = typeOf(s), isPeer = kind === 'peer';
  const fits = roleFits(s);

  $('r-cat').textContent = isPeer ? `${rec.nick}から見たあなた` : 'あなたの結果';
  $('r-name').textContent = t.n;
  $('r-catch').textContent = t.c;
  renderMap($('r-map'), [{ color: isPeer ? COL.peer : COL.self, s }], 'a');
  $('r-readout').innerHTML = readout(s);
  $('r-body').textContent = t.d;
  $('r-hex').innerHTML = hexChart([{ color: isPeer ? COL.peer : COL.self, s }]);
  $('r-fit').innerHTML = fitBars(fits);
  /* 全部低く出た人に、いちばん高いだけの役職を勧めたように読ませない */
  const head = fits[0].v < 50
    ? `どの役職も高くは出ませんでした。そのなかで比較的近いのは${fits[0].label}${fits[0].kind ? `（${fits[0].kind}）` : ''}です。`
    : `${fits[0].label}${fits[0].kind ? `（${fits[0].kind}）` : ''} — `;
  $('r-fittop').textContent = head + fits[0].d;
  $('r-note').textContent = isPeer ? PEER_NOTE : ROLE_NOTE;

  $('btn-share').hidden = isPeer;
  $('btn-again').hidden = isPeer;
  if (!isPeer) {
    $('btn-share').onclick = () => shareResult(t, s, fits);
    $('btn-again').onclick = () => start('self');
  }
  const bf = $('btn-front');
  bf.hidden = !(d.self && d.peers.length);
  bf.onclick = showCompare;
  $('btn-other').onclick = goHome;
  show('s-result');
}

/* ===== 共有 ===== */
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

function shareResult(t, s, fits) {
  const text = `私は「${t.n}」\n`
    + AXES.map(a => `${a.name} ${BANDS[a.id][s[a.id].band]}`).join(' / ')
    + `\n向いている役職: ${fits[0].label}（${fits[0].v}）\n— 何者だ`;
  shareOut({ title: '何者だ', text }, 'コピーしました');
}

/* ===== 他人を診断した結果を送る ===== */
function showPeerSend() {
  const t = typeOf(pending.s);
  $('p-name').textContent = t.n;
  $('p-catch').textContent = t.c;
  renderMap($('p-map'), [{ color: COL.peer, s: pending.s }], 'p');
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
  renderMap($('i-map'), [{ color: COL.peer, s: peer.s }], 'i');
  $('i-readout').innerHTML = readout(peer.s);
  $('i-note').textContent = PEER_NOTE;
  const d = store.load();
  const bi = $('btn-icompare');
  if (d.self) { bi.textContent = '自分の結果と並べる'; bi.onclick = showCompare; }
  else { bi.textContent = 'まず自分を診断する'; bi.onclick = () => start('self'); }
  $('btn-idetail').onclick = () => showResult('peer', idx);
  show('s-inbox');
}

/* ===== 比較（自己評価 vs 他己評価の総合） ===== */
function showCompare() {
  const d = store.load();
  if (!d.self || !d.peers.length) return;
  const me = d.self.s, agg = aggregate(d.peers);
  const n = d.peers.length;

  renderMap($('c-map'), [
    ...d.peers.map(p => ({ label: p.nick, color: COL.peer, s: p.s, faint: true })),
    { label: '自己評価', color: COL.self, s: me },
    { label: `他己評価(${n})`, color: COL.peer, s: agg }
  ], 'c');

  $('c-legend').innerHTML = `
    <button class="btn lg" data-open="self">
      <span class="sw" style="background:${COL.self}"></span>
      <span class="nm">自己評価</span><span class="ty">${typeOf(me).n}</span><span class="go">›</span></button>
    <div class="lg flat">
      <span class="sw" style="background:${COL.peer}"></span>
      <span class="nm">他己評価 総合</span><span class="ty">${typeOf(agg).n}（${n}件の平均）</span></div>
    ${d.peers.map((p, i) => `
    <button class="btn lg sub" data-open="peer:${i}">
      <span class="sw" style="background:${COL.peer};opacity:.5"></span>
      <span class="nm">${esc(p.nick)}</span><span class="ty">${typeOf(p.s).n}</span><span class="go">›</span></button>`).join('')}`;
  document.querySelectorAll('#c-legend [data-open]').forEach(b =>
    b.onclick = () => {
      const [kind, key] = b.dataset.open.split(':');
      showResult(kind, kind === 'peer' ? +key : undefined);
    });

  $('c-readout').innerHTML = readout(agg, false);
  $('c-cards').innerHTML = gapCard(me, agg, n) + fitCompare(me, agg);
  show('s-compare');
}

const sign = v => (v > 0 ? '+' : v < 0 ? '−' : '±') + Math.abs(v);

function gapCard(me, agg, n) {
  const dy = Math.round((agg.y.ratio - me.y.ratio) * 100);
  const abs = Math.abs(dy), open = dy >= 0;
  const who = n === 1 ? '相手' : `${n}人の平均`;
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
    <div class="delta">${AXES.map(a => `
      <div><span class="dk">${a.name}</span>
        <span class="dv">自己 ${Math.round(me[a.id].ratio * 100)}% → 他己 ${Math.round(agg[a.id].ratio * 100)}%
          <b>${sign(Math.round((agg[a.id].ratio - me[a.id].ratio) * 100))}</b></span></div>`).join('')}</div>
    <p class="sub-note">${PEER_NOTE}</p></div>`;
}

function fitCompare(me, agg) {
  const a = roleFits(me), b = roleFits(agg);
  const same = a[0].label === b[0].label;
  return `<div class="card-x">
    <div class="k">向いている役職の見え方</div>
    ${hexChart([{ color: COL.self, s: me }, { color: COL.peer, s: agg }])}
    <div class="hexleg">
      <span><i style="background:${COL.self}"></i>自己評価</span>
      <span><i style="background:${COL.peer}"></i>他己評価 総合</span>
    </div>
    <div class="v">${same ? '自他で一致' : '自他でずれ'}</div>
    <div class="d">${same
      ? `自分から見ても周りから見ても、最も向いているのは<b>${a[0].label}</b>でした。ここが一致しているのは、その役を任されたときに摩擦が起きにくいという意味です。`
      : `自分では<b>${a[0].label}</b>が最も高く出ましたが、周りからは<b>${b[0].label}</b>に見えています。どちらが正しいという話ではなく、<b>引き受ける前に擦り合わせておくべき差</b>です。`}</div>
    <div class="delta">${ROLE_LABELS.map(label => {
      const x = a.find(r => r.label === label), y = b.find(r => r.label === label);
      return `<div><span class="dk">${label}</span>
        <span class="dv">自己 ${x.v} → 他己 ${y.v} <b>${sign(y.v - x.v)}</b></span></div>`;
    }).join('')}</div></div>`;
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
  store.save({ self: null, peers: [] }); renderHome(); toast('記録を消しました');
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
syncTools();

function boot() {
  const got = readLink(location.hash);
  if (got) {
    const d = store.load();
    /* 同じ人から同じ内容が二重に入らないようにする */
    let idx = d.peers.findIndex(p => p.nick === got.nick
      && AXES.every(a => p.s[a.id].sum === got.s[a.id].sum));
    let full = false;
    if (idx < 0) {
      d.peers.push(got);
      if (d.peers.length > PEER_MAX) { d.peers = d.peers.slice(-PEER_MAX); full = true; }
      idx = d.peers.length - 1;
      store.save(d);
    }
    history.replaceState(null, '', location.pathname + location.search);
    renderHome();
    showInbox(got, idx);
    if (full) toast(`他己評価は${PEER_MAX}件までです。古いものから外しました`);
    return;
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
