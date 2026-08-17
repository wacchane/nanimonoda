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

  /* ── 係適軸: 担ってやり切る ⇔ 人に任せる ──
     「できるか（漏れなくやれる）」3問 と「やるか（自分から引き受ける）」3問 の複合尺度。
     旧・堅緩軸は前者しか測っておらず、狙っている人材の半分を取りこぼしていた。
     順逆は軸全体で3:3。ブロック単位では揃っていないので、
     2つの下位得点を別々に出してはいけない（詳細は docs/01-測定設計.md 第3節） */
  { ax: 'c', dir: 1, facet: '締切の扱い', t: {
    self:  '出欠の返事や提出物は、期限より早めに出すほうだ',
    other: 'この人は、出欠の返事や提出物を期限より早めに出すほうだ' } },
  { ax: 'c', dir: 1, facet: '継続の確実さ', t: {
    self:  '毎月決まってやることは、忘れずに同じように続けられる',
    other: 'この人は、毎月決まってやることを忘れずに同じように続けられる' } },
  { ax: 'c', dir: -1, facet: '抜け漏れ', t: {
    self:  '持ち物や連絡を忘れていて、後から気づくことがある',
    other: 'この人は、持ち物や連絡を忘れていることがある' } },
  { ax: 'c', dir: 1, facet: '自発的な引き受け', t: {
    self:  '体育館の準備や片づけは、言われる前に手を出すほうだ',
    other: 'この人は、体育館の準備や片づけを言われる前に手を出すほうだ' } },
  { ax: 'c', dir: -1, facet: '役割の引き受け', t: {
    self:  '係の仕事は、やりたい人がやればいいと思う',
    other: 'この人は、係の仕事はやりたい人がやればいいと考えていそうだ' } },
  { ax: 'c', dir: -1, facet: '越境した手助け', t: {
    self:  '頼まれていない仕事は、担当の人の領分だと思って手を出さない',
    other: 'この人は、頼まれていない仕事には手を出さないほうだ' } }
];

const AXES = [
  { id: 'y', name: '陽陰', hi: '陽', lo: '陰' },
  { id: 'o', name: '温冷', hi: '温', lo: '冷' },
  { id: 'c', name: '係適', hi: '担', lo: '任' }
];
const BANDS = {
  y: ['強い陰キャ', 'やや陰キャ', 'やや陽キャ', '強い陽キャ'],
  o: ['強い冷キャ', 'やや冷キャ', 'やや温キャ', '強い温キャ'],
  c: ['強い頼キャ', 'やや頼キャ', 'やや担キャ', '強い担キャ']
};

/* ===== 役職 =====
   適性は3軸の重み付き合計で出す。設問は性格を聞き、役職は結果から導く。
   副代表は「仕切り役(冷)」と「盛り上げ役(温)」の2枠あるが、
   表示は `副代表` の1つに畳む（高いほうを採用）。 */
const ROLE_LABELS = ['代表', '副代表', 'イベント係', '施設係', '会計係'];
const ROLES = [
  { label: '代表',       kind: '',           w: { y: 4, o: -2, c: 1 },
    d: 'チームの代表として全体を俯瞰し、決める役。実務を自分で抱えるのではなく、前に立って方針を決め、情に流されずに判断できることが要ります。' },
  { label: '副代表',     kind: '仕切り役',   w: { y: 2, o: -3, c: 4 },
    d: '実行部隊の仕切り側。練習の中身と時間を締める役で、前に立つ力より現場を回し切る力が要ります。' },
  { label: '副代表',     kind: '盛り上げ役', w: { y: 4, o: 2,  c: 1 },
    d: '実行部隊の盛り上げ側。その場のテンションを上げて、人が離れないようにする役です。' },
  { label: 'イベント係', kind: '',           w: { y: 1, o: 3,  c: 3 },
    d: '皆が楽しめるイベントを企画して運営する役。目立つ力より、誰が楽しめていないかに気づける温かさと、形にする段取り力が要ります。' },
  { label: '施設係',     kind: '',           w: { y: -1, o: 0, c: 4 },
    d: '毎月の体育館予約を担う役。欠けると活動が成り立たない要の位置です。必要なのは目立つ力ではなく、頼まれる前に動けることと、それを毎月切らさないことです。' },
  { label: '会計係',     kind: '',           w: { y: -1, o: -4, c: 4 },
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
   設問構成が変わるたびにキーを上げる。v2（堅緩軸）とは非互換なので読まない */
const store = (() => {
  const KEY = 'nanimonoda.v3';
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
  if (ratio <= 0.50) return 1;   // 50%ちょうどは陰側・冷側・任側に含める
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
const LINK_V = '3';
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

/* ===== 座標盤（陽陰 × 温冷。係適は数値とバーで見せる） ===== */
/* 座標盤の地。四隅の色を直接指定した双一次（バイリニア）の面。
   半透明を4枚重ねる方式は中央が白く抜けて彩度が出ないため、
   下半分の面に上半分の面を縦フェードのマスクで重ねる形にしている。
   四隅の意味: 左上=温×陰 / 右上=温×陽 / 左下=冷×陰 / 右下=冷×陽 */
function field(id) {
  return `
  <style>
    .fx-grid{stroke:var(--grid);stroke-width:1;fill:none}
    .fx-axis{stroke:var(--axis);stroke-width:1.4}
    .fx-lab{font-family:var(--sans);font-size:13px;font-weight:600;
      letter-spacing:1.4px;fill:var(--lab)}
    .fx-cat{font-family:var(--sans);font-size:11px;font-weight:600;fill:var(--ink)}
    .fx-field{opacity:var(--wash)}
    .st-tl{stop-color:var(--c-tl)} .st-tr{stop-color:var(--c-tr)}
    .st-bl{stop-color:var(--c-bl)} .st-br{stop-color:var(--c-br)}
  </style>
  <defs>
    <linearGradient id="top-${id}" x1="0" y1="0" x2="1" y2="0">
      <stop offset="0" class="st-tl"/><stop offset="1" class="st-tr"/></linearGradient>
    <linearGradient id="bot-${id}" x1="0" y1="0" x2="1" y2="0">
      <stop offset="0" class="st-bl"/><stop offset="1" class="st-br"/></linearGradient>
    <linearGradient id="fade-${id}" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0" stop-color="#FFFFFF" stop-opacity="1"/>
      <stop offset="1" stop-color="#FFFFFF" stop-opacity="0"/></linearGradient>
    <mask id="mtop-${id}">
      <rect x="0" y="0" width="300" height="300" fill="url(#fade-${id})"/></mask>
    <clipPath id="clip-${id}"><rect x="0" y="0" width="300" height="300" rx="20"/></clipPath>
  </defs>
  <g clip-path="url(#clip-${id})">
    <g class="fx-field">
      <rect x="0" y="0" width="300" height="300" fill="url(#bot-${id})"/>
      <rect x="0" y="0" width="300" height="300" fill="url(#top-${id})" mask="url(#mtop-${id})"/>
    </g>
    <rect class="fx-grid" x="50" y="50" width="200" height="200"/>
    ${[100,200].map(v => `<line class="fx-grid" x1="${v}" y1="50" x2="${v}" y2="250"/>
       <line class="fx-grid" x1="50" y1="${v}" x2="250" y2="${v}"/>`).join('')}
    <line class="fx-axis" x1="150" y1="50" x2="150" y2="250"/>
    <line class="fx-axis" x1="50" y1="150" x2="250" y2="150"/>
  </g>
  <text class="fx-lab" x="150" y="26"  text-anchor="middle">温</text>
  <text class="fx-lab" x="150" y="283" text-anchor="middle">冷</text>
  <text class="fx-lab" x="22" y="155" text-anchor="middle">陰</text>
  <text class="fx-lab" x="278" y="155" text-anchor="middle">陽</text>`;
}

const px = y => y.ratio * 200 + 50;        // 陽陰: 右=陽
const py = o => (1 - o.ratio) * 200 + 50;  // 温冷: 上=温

/* 点は1点だけ。輪もリングも付けない。影を1枚だけ敷いて面から浮かせる */
function dot(x, y, color, r) {
  return `
    <circle cx="${x}" cy="${y}" r="${r + 2.4}" fill="var(--plate)" opacity=".9"/>
    <circle cx="${x}" cy="${y}" r="${r}" fill="${color}"/>`;
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
    ${main.map(p => dot(p.x, p.y, p.color, main.length > 1 ? 6 : 7)).join('')}
    ${main.filter(p => p.label).map(p => {
      const up = Math.max(p.y - 15, 40), down = Math.min(p.y + 24, 268);
      const hits = ly => placed.some(q => Math.abs(q.y - ly) < 15 && Math.abs(q.x - p.x) < 70);
      const ly = hits(up) ? down : up;
      placed.push({ x: p.x, y: ly });
      return `<text class="fx-cat" x="${p.x}" y="${ly}" text-anchor="middle">${esc(p.label)}</text>`;
    }).join('')}
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
  $('r-map').innerHTML = drawFlat([{ color: isPeer ? COL.peer : COL.self, s }], 'a');
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
  $('p-map').innerHTML = drawFlat([{ color: COL.peer, s: pending.s }], 'p');
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
  $('i-map').innerHTML = drawFlat([{ color: COL.peer, s: peer.s }], 'i');
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

  $('c-map').innerHTML = drawFlat([
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
