/* ===== 何者か — ディライトの役職適性診断（3軸18問） ===== */

/* 診断の種類。qk は QS.t のどの言い回しを使うか */
const MODES = [
  { id: 'self', kind: 'self', qk: 'self',  name: '自分を診断する',  hint: '35問 / 3〜4分' },
  { id: 'peer', kind: 'peer', qk: 'other', name: '他人を診断する',  hint: '結果をリンクで相手に送れます' }
];
const modeOf = id => MODES.find(m => m.id === id);

/* ===== ビッグファイブ 35問 =====
   5因子 × 7問。すべて二択（強制選択）。

   なぜ二択か:
   - 「そう / 違う」の軸が無いので、黙従バイアス（内容によらず肯定しがちな癖）が原理的に起きない
   - 1因子7問＝奇数なので、合計 0〜7 の中央 3.5 に到達できない。**中央値が構造的に出ない**
   - 合計がそのまま4段階に割れる（0-1 / 2-3 / 4-5 / 6-7）ので、引き伸ばし計算も要らない

   hi = 高い側（外向的・協調的・きっちり・動じない・好奇心旺盛）の選択肢の番号。
   **hi を 0 と 1 に散らすこと。** 片側に寄せると「同じ側を押し続ける」癖が出て、
   二択にした意味が消える。

   self / other は主語を移しただけで、facet も hi も完全に同一。
   これがあるから自己評価と他己評価を直接比較できる。
   出典と設計原則: docs/01-測定設計.md */
const QS = [
  /* ── 外向性 ── */
  { f:'e', facet:'社交性', hi:0,
    self:['休みの日は、人と会う予定が入っているほうが元気になる',
          '休みの日は、予定がないほうが元気になる'],
    other:['休みの日に人と会う予定が入っているほうが元気そうだ',
           '休みの日は予定がないほうが元気そうだ'] },
  { f:'e', facet:'自己主張性', hi:1,
    self:['話し合いで意見が割れたとき、まとまるまで黙って見ている',
          '話し合いで意見が割れたとき、自分から口を開いて整理する'],
    other:['話し合いで意見が割れたとき、まとまるまで黙って見ている',
           '話し合いで意見が割れたとき、自分から口を開いて整理する'] },
  { f:'e', facet:'活動性', hi:0,
    self:['予定がぎっしり詰まっているほうが調子がいい',
          '予定に余白があるほうが調子がいい'],
    other:['予定がぎっしり詰まっているほうが調子が良さそうだ',
           '予定に余白があるほうが調子が良さそうだ'] },
  { f:'e', facet:'刺激希求', hi:1,
    self:['知らない人が多い集まりは、できれば避けたい',
          '知らない人が多い集まりは、行ってみたくなる'],
    other:['知らない人が多い集まりは、できれば避けたそうだ',
           '知らない人が多い集まりでも、進んで行くほうだ'] },
  { f:'e', facet:'感情の表出', hi:0,
    self:['うれしいことがあると、周りにすぐ話す',
          'うれしいことがあっても、自分の中にしまっておくことが多い'],
    other:['うれしいことがあると、周りにすぐ話す',
           'うれしいことがあっても、自分の中にしまっているほうだ'] },
  { f:'e', facet:'社交後の消耗', hi:1,
    self:['大勢と長く過ごした日は、後でどっと疲れる',
          '大勢と長く過ごした日でも、そのまま次の予定に行ける'],
    other:['大勢と長く過ごした日は、後でどっと疲れていそうだ',
           '大勢と長く過ごした日でも、そのまま動けそうだ'] },
  { f:'e', facet:'注目志向', hi:1,
    self:['集まりで自分に注目が集まると、居心地が悪い',
          '集まりで自分に注目が集まると、気分が乗る'],
    other:['注目が集まると、居心地が悪そうだ',
           '注目が集まると、気分が乗っている'] },

  /* ── 協調性 ── */
  { f:'a', facet:'信頼', hi:0,
    self:['初対面の人は、まず信用してみるほうだ',
          '初対面の人は、様子を見てから判断する'],
    other:['初対面の人を、まず信用してみるほうだ',
           '初対面の人は、様子を見てから判断するほうだ'] },
  { f:'a', facet:'率直さ vs 配慮', hi:1,
    self:['相手が傷つきそうでも、正しいと思うことははっきり言う',
          '相手が傷つきそうなら、言い方を変えてでも角を立てない'],
    other:['相手が傷つきそうでも、正しいと思うことははっきり言う',
           '相手が傷つきそうなら、言い方を変えてでも角を立てない'] },
  { f:'a', facet:'利他性', hi:0,
    self:['困っている人がいたら、頼まれなくても声をかける',
          '困っている人がいても、本人から言われるまでは踏み込まない'],
    other:['困っている人がいたら、頼まれなくても声をかける',
           '困っている人がいても、本人から言われるまでは踏み込まない'] },
  { f:'a', facet:'対立の回避', hi:0,
    self:['意見が対立したら、まず自分が折れて場を収める',
          '意見が対立したら、納得いくまで話し合う'],
    other:['意見が対立したら、まず自分が折れて場を収める',
           '意見が対立したら、納得いくまで話し合う'] },
  { f:'a', facet:'謙虚さ', hi:1,
    self:['うまくいったときは、自分がやったこととして話す',
          'うまくいったときは、周りのおかげとして話す'],
    other:['うまくいったときは、自分がやったこととして話す',
           'うまくいったときは、周りのおかげとして話す'] },
  { f:'a', facet:'共感性', hi:0,
    self:['相談されたら、まず相手の気持ちを聞く',
          '相談されたら、まず何をすべきかを話す'],
    other:['相談されたら、まず相手の気持ちを聞く',
           '相談されたら、まず何をすべきかを話す'] },
  { f:'a', facet:'競争場面での態度', hi:1,
    self:['勝ち負けがかかると、相手に厳しくなる',
          '勝ち負けがかかっても、相手への態度は変えない'],
    other:['勝ち負けがかかると、相手に厳しくなる',
           '勝ち負けがかかっても、相手への態度は変わらない'] },

  /* ── 誠実性 ── */
  { f:'c', facet:'秩序', hi:1,
    self:['持ち物や部屋は、その時々で置き場所が変わる',
          '持ち物や部屋は、だいたい決まった場所に収まっている'],
    other:['持ち物は、その時々で置き場所が変わるほうだ',
           '持ち物は、だいたい決まった場所に収まっているほうだ'] },
  { f:'c', facet:'責任遂行', hi:0,
    self:['引き受けたことは、多少無理をしてでも期限内に終わらせる',
          '引き受けたことでも、間に合わなければ事情を話して延ばす'],
    other:['引き受けたことは、多少無理をしてでも期限内に終わらせる',
           '引き受けたことでも、間に合わなければ事情を話して延ばす'] },
  { f:'c', facet:'慎重さ', hi:1,
    self:['思いついたら、まず動いてみる',
          '思いついても、段取りを決めてから動く'],
    other:['思いついたら、まず動いてみるほうだ',
           '思いついても、段取りを決めてから動くほうだ'] },
  { f:'c', facet:'勤勉さ', hi:0,
    self:['気が乗らない用事でも、決めた時間には手をつける',
          '気が乗らない用事は、乗るまで後回しにする'],
    other:['気が乗らない用事でも、決めた時間には手をつける',
           '気が乗らない用事は、後回しにしがちだ'] },
  { f:'c', facet:'達成追求', hi:1,
    self:['そこそこできていれば、それで十分だと思う',
          'そこそこできていても、もっと良くできないか考える'],
    other:['そこそこできていれば十分と考えていそうだ',
           'そこそこできていても、もっと良くしようとする'] },
  { f:'c', facet:'継続の確実さ', hi:1,
    self:['毎月決まってやることでも、うっかり抜けることがある',
          '毎月決まってやることは、忘れずに続けられる'],
    other:['毎月決まってやることが、うっかり抜けることがある',
           '毎月決まってやることを、忘れずに続けている'] },
  { f:'c', facet:'計画性', hi:0,
    self:['予定が決まったら、早めに段取りを済ませる',
          '予定が決まっても、直前になってから動く'],
    other:['予定が決まると、早めに段取りを済ませる',
           '予定が決まっても、直前になってから動く'] },

  /* ── 情緒安定性 ── */
  { f:'s', facet:'不安', hi:1,
    self:['先のことを考えて不安になることが多い',
          '先のことは、なるようになると思える'],
    other:['先のことを考えて不安になることが多そうだ',
           '先のことは、なるようになると考えていそうだ'] },
  { f:'s', facet:'いらだちの表出', hi:0,
    self:['思いどおりにいかなくても、態度には出にくい',
          '思いどおりにいかないと、いらだちが表に出る'],
    other:['思いどおりにいかなくても、態度には出ない',
           '思いどおりにいかないと、いらだちが表に出る'] },
  { f:'s', facet:'切り替え', hi:1,
    self:['失敗すると、しばらく引きずる',
          '失敗しても、切り替えが早い'],
    other:['失敗すると、しばらく引きずっていそうだ',
           '失敗しても、切り替えが早い'] },
  { f:'s', facet:'自意識', hi:0,
    self:['人にどう見られているかは、あまり気にならない',
          '人にどう見られているかが気になる'],
    other:['人にどう見られているかを、あまり気にしていない',
           '人にどう見られているかを気にしていそうだ'] },
  { f:'s', facet:'衝動の統制', hi:1,
    self:['疲れているときほど、余計なものを買ったり食べたりする',
          '疲れているときでも、自分をコントロールできる'],
    other:['疲れているときは、行動が雑になりそうだ',
           '疲れているときでも、自分をコントロールできている'] },
  { f:'s', facet:'ストレス耐性', hi:0,
    self:['急なトラブルが起きても、落ち着いて対処できる',
          '急なトラブルが起きると、頭が真っ白になる'],
    other:['急なトラブルが起きても、落ち着いて対処する',
           '急なトラブルが起きると、慌てるほうだ'] },
  { f:'s', facet:'気分の安定', hi:1,
    self:['一日の中で気分の波が大きい',
          '一日を通して気分はだいたい一定している'],
    other:['一日の中で気分の波が大きそうだ',
           '一日を通して気分はだいたい一定している'] },

  /* ── 開放性 ── */
  { f:'o', facet:'好奇心', hi:0,
    self:['知らない分野の話も、面白がって聞ける',
          '知らない分野の話は、あまり入ってこない'],
    other:['知らない分野の話も、面白がって聞いている',
           '知らない分野の話には、あまり乗ってこない'] },
  { f:'o', facet:'新奇な行動', hi:1,
    self:['店に入ったら、だいたい同じものを頼む',
          '店に入ったら、食べたことのないものを試す'],
    other:['店では、だいたい同じものを頼むほうだ',
           '店では、食べたことのないものを試すほうだ'] },
  { f:'o', facet:'想像', hi:0,
    self:['頭の中であれこれ想像している時間が多い',
          '頭の中は、目の前のことでだいたい埋まっている'],
    other:['あれこれ想像をめぐらせているほうだ',
           '目の前のことに集中しているほうだ'] },
  { f:'o', facet:'美的感受性', hi:0,
    self:['音楽や景色に、強く心を動かされることがある',
          '音楽や景色で、心が大きく動くことはあまりない'],
    other:['音楽や景色に、強く心を動かされることがありそうだ',
           '音楽や景色で心が大きく動くことは、あまりなさそうだ'] },
  { f:'o', facet:'価値観の柔軟性', hi:1,
    self:['昔からのやり方には、それなりの理由があると思う',
          '昔からのやり方でも、合わなければ変えていい'],
    other:['昔からのやり方を尊重するほうだ',
           '昔からのやり方でも、合わなければ変えるほうだ'] },
  { f:'o', facet:'抽象への関心', hi:0,
    self:['答えの出ない問いについて考えるのは楽しい',
          '答えの出ない問いを考えるのは、時間がもったいない'],
    other:['答えの出ない問いを考えるのが好きそうだ',
           '答えの出ない問いには、あまり関心がなさそうだ'] },
  { f:'o', facet:'変化への構え', hi:1,
    self:['生活のやり方は、できるだけ変えたくない',
          '生活のやり方は、ときどき変えたくなる'],
    other:['生活のやり方は、あまり変えないほうだ',
           '生活のやり方を、ときどき変えるほうだ'] }
];

/* 5因子。lo / hi はどちらも肯定的に読める言葉にする。
   低い側が欠点に見えると、全員が高い側に寄る（社会的望ましさ） */
const FACTORS = [
  { id:'e', name:'外向性', lo:'内向的',     hi:'外向的',
    d:'人と関わることでエネルギーが増えるか、減るか。' },
  { id:'a', name:'協調性', lo:'率直',       hi:'協調的',
    d:'人に合わせるか、思ったことをそのまま出すか。' },
  { id:'c', name:'誠実性', lo:'おおらか',   hi:'きっちり',
    d:'決めたことを計画どおりに運ぶか、その場で柔軟に動くか。' },
  { id:'s', name:'情緒安定性', lo:'感じやすい', hi:'動じない',
    d:'揺さぶられやすいか、平静を保てるか。' },
  { id:'o', name:'開放性', lo:'現実的',     hi:'好奇心旺盛',
    d:'新しいものへ向かうか、慣れたやり方を守るか。' }
];
const FCT = id => FACTORS.find(f => f.id === id);
/* 合計 0〜7 を4段階に割る。ちょうど2つずつ入る */
const BAND_OF = sum => sum <= 1 ? 0 : sum <= 3 ? 1 : sum <= 5 ? 2 : 3;
const bandName = (f, b) => ['とても', 'やや', 'やや', 'とても'][b] + (b < 2 ? f.lo : f.hi);

/* ===== 結果の言葉 =====
   **口調はデスマス調で統一する。** 言い切りと混ぜないこと。

   **書き方の約束: ちょっと辛口に入って、必ず最後は認めて終わる。**
   低い側を欠点として言い切らない。どの因子も「高い側が良い」という意味ではない。 */

/* ===== 4文字タイプ =====
   ビッグファイブの4因子は、4つの二分法とよく対応することが知られている。
     E/I ← 外向性 ・ S/N ← 開放性 ・ T/F ← 協調性 ・ J/P ← 誠実性

   **情緒安定性だけは対応する二分法がない。** 4文字には反映されないので、
   5角形と一言のほうで必ず見せること。ここを黙って落とすと1因子が消える。

   名前はこのアプリ独自のもの。よく知られた和名は別サービスの商標なので使わない。 */
const CODE_NAME = {
  /* 前半は座標盤の象限の言い換え。孤高=陰冷 / 和み=陰温 / 先陣=陽冷 / 宴=陽温 */
  INTJ: '孤高の設計者',    INTP: '孤高の理屈屋',
  ISTJ: '孤高の実務家',    ISTP: '孤高の職人',
  INFJ: '和みの理想家',    INFP: '和みの夢職人',
  ISFJ: '和みの守り手',    ISFP: '和みの風来坊',
  ENTJ: '先陣の司令塔',    ENTP: '先陣の発明家',
  ESTJ: '先陣の現場監督',  ESTP: '先陣の突撃隊長',
  ENFJ: '宴の旗振り役',    ENFP: '宴の火付け役',
  ESFJ: '宴の世話人',      ESFP: '宴の主役'
};
/* band 2以上を高い側とみなす */
const codeOf = s =>
    (s.e.band >= 2 ? 'E' : 'I')
  + (s.o.band >= 2 ? 'N' : 'S')
  + (s.a.band >= 2 ? 'F' : 'T')
  + (s.c.band >= 2 ? 'J' : 'P');

/* 見出しの下の一言。辛口 → 肯定 の順で必ず閉じる */
const QUIP = {
  e: ['誘いを断る言い訳のストックだけは豊富です。その代わり、あなたが「行く」と言った場には本当の関心があります。',
      '盛り上がっている輪の外側で、そろそろ帰りたいと思っているタイプ。それでも必要な場面には必ずいるので、信用はされています。',
      '誰とでもそこそこうまくやる器用さがあります。器用貧乏とも言えますが、それで救われている人が確実にいます。',
      '黙っていられない性分で、たまに一人で喋りすぎています。ただ、その場を開けるのは他でもないあなたです。'],
  a: ['正論で人を黙らせがちです。ただ、あなたが言わなければ誰も言わないまま終わっていた話も多いはずです。',
      '言うべきことは言いますが、たまに言い方が雑になります。それでも裏表がないぶん、長い目で見れば信用されます。',
      '角を立てずに済ませる技術があります。少し飲み込みすぎる場面もありますが、そのおかげで壊れずに済んだ関係があります。',
      'いい人と言われ続けて、本音を言うタイミングを逃してきたはずです。それでも人が集まるのは、あなたが安全だからです。'],
  c: ['締切は目安、持ち物は運任せ。ただ、崩れた場をその場の機転で立て直せるのはこのタイプだけです。',
      'やる気になれば動けますが、その「やる気」の到着が遅いのが難点。それでも土壇場の集中力は本物です。',
      '決めたことは守りますし、無理な約束もしません。地味ですが、この安定感に何度も助けられている人がいます。',
      '抜け漏れがないぶん、他人のゆるさが気になって仕方ありません。それでも任せれば必ず終わっているのは、あなたのおかげです。'],
  s: ['些細なことで消耗し、寝る前に会話を再生してしまうタイプ。その感度があるから、人の不調に最初に気づけます。',
      '引きずるときは引きずりますが、翌日には持ち直します。その振れ幅が、人の気持ちを想像できる根拠になっています。',
      'たいていのことでは動じないので、慌てている人からは他人事に見えます。それでも、いてくれると場が落ち着きます。',
      '動じなさすぎて、周りが焦っていることに気づきません。それでも本当にまずい場面で頼れるのは、この落ち着きです。'],
  o: ['新しいものに興味を示さず、同じ店で同じものを頼みます。その一貫性が、ぶれない判断につながっています。',
      '試してみるより確実なほうを選びます。冒険しないぶん、大きく外すこともありません。',
      '面白そうなものには乗りますが、全部は追いかけません。この加減がちょうどいいところです。',
      '興味が次々に移り、始めたものが積み上がっているはずです。それでも新しい風を持ち込めるのはあなただけです。']
};

/* 因子ごとの読み。同じく 辛口 → 肯定 で閉じる */
const READ = {
  e: ['一人の時間がないと回復しません。誘いを断ってばかりだと思われがちですが、少人数の場でこそ深い話ができる人です。',
      'にぎやかな場も嫌ではないのに、長引くと急に無口になります。それでも自分のペースを崩さないので、無理がありません。',
      '人と関わると元気が出るほうです。前に出すぎないぶん物足りなく見えることもありますが、場に合わせて動ける強みがあります。',
      '人がいるほど調子が上がります。喋りすぎて後で反省しがちですが、あなたがいないと始まらない場が確実にあります。'],
  a: ['思ったことをそのまま言うので、たまに空気が凍ります。ただ判断は速く、あなたの率直さを信頼している人は少なくありません。',
      '必要なら遠慮なく言えます。言い方が足りない場面もありますが、相手を見て加減できる分別も持っています。',
      '相手の気持ちを考えて言葉を選べます。持ち帰って悩みすぎるきらいはありますが、そのおかげで守られた関係があります。',
      '波風を立てないことを優先します。言うべきことを飲み込みがちですが、あなたの周りが穏やかなのは偶然ではありません。'],
  c: ['締切も持ち物も、だいたいで進みます。だらしないと言われることもありますが、崩れた場を機転で立て直す力は本物です。',
      'やるべき場面では合わせられますが、放っておくとゆるみます。裏を返せば、力の抜きどころを知っているということです。',
      '決めたことは守り、無理な約束もしません。派手さはありませんが、この安定感が周りの前提になっています。',
      '段取りも期限も確実です。他人のゆるさに苛立ちがちですが、任せれば必ず終わるという信頼はここから来ています。'],
  s: ['出来事に強く反応し、後から一人で反芻します。消耗は大きいですが、人の不調に最初に気づけるのはこの感度のおかげです。',
      '気になることは引きずりますが、翌日には戻ってきます。この揺れがあるから、人の気持ちを想像できます。',
      'たいていのことでは動じません。冷たく見えることもありますが、慌ただしい場面ほど頼りになります。',
      '何が起きても平静です。周りの動揺に気づかないことがある一方、本当にまずい場面で崩れないのは大きな強みです。'],
  o: ['慣れたやり方を守り、実際に役立つかで判断します。頭が固いと言われることもありますが、その一貫性が判断のぶれなさになっています。',
      '新しいものにも触れますが、基本は確実なほうを選びます。地味ですが、大きく外さない選び方です。',
      '知らないことに興味を持ち、ひとまず試します。全部は追いかけない加減の良さがあります。',
      '新しいものへ次々に向かいます。飽きるのも早く、やりかけが積み上がりがちですが、新しい風を入れられるのはあなたです。']
};

/* 10段階の表示値。0〜7 を 1〜10 に写す。
   **「2/10」のような分母つきで出さないこと。** 劣っているように見える。
   単に「協調性 2」と置く。 */
const ten = s10 => Math.round(s10.ratio * 9) + 1;

/* 際立っている因子から並べる。中央（3.5/7）からの距離で測る */
const standout = s => FACTORS.slice()
  .sort((x, y) => Math.abs(s[y.id].ratio - .5) - Math.abs(s[x.id].ratio - .5));
const hiSide = (s, f) => s[f.id].band >= 2 ? 1 : 0;

/* 名前は4文字タイプ + このアプリ独自の和名 */
const archName = s => CODE_NAME[codeOf(s)];
/* 4群 = 開放性(N/S) × 協調性(T/F)。4文字コードの文字色をこれで決める。
   NT=紫 / ST=青 / SF=黄 / NF=緑。色は index.html の --g-* に置いてある */
const groupOf = s => codeOf(s).slice(1, 3);
/* 見出しの4文字。色は画面に付けた data-grp から降ってくる */
const codeTag = s => `<span class="code">${codeOf(s)}</span>`;
/* 画面ごとに群を宣言する。ここに付けた色を子孫がまとめて継ぐ */
const paintGroup = (id, s) => $(id).setAttribute('data-grp', groupOf(s));
/* 見出しの下の一言。段階の言葉 + 辛口の一言 */
function quipLine(s) {
  const [a, b] = standout(s);
  return `${bandName(a, s[a.id].band)}で、${bandName(b, s[b.id].band)}。`
       + QUIP[a.id][s[a.id].band];
}
/* 一覧用の短いラベル */
const shortLabel = s => `${codeOf(s)} ${archName(s)}`;

const ROLE_NOTE = 'どの因子も「高い側が良い」という意味ではありません。同じ性質が、ある場面では強みに、別の場面では弱みになります。またこの結果は傾向であって、能力や成果を測ったものではありません。なお4文字のタイプには情緒安定性が入りません。5角形のほうもあわせて見てください。';
const PEER_NOTE = '他己評価は、外から見える行動しか拾えません。一人の時間にホッとするか、人と会った後に疲れるかといった内側の項目は、相手には推測でしか答えられません。そのぶんを差し引いて見てください。';

const PEER_MAX = 8;   // 他己評価の保存上限。5件も集まれば平均はほぼ動かず、増やすと座標盤が読めなくなる

/* ===== 保存 =====
   形: { self: {s,at} | null, peers: [ {nick,s,at} ] }
   設問構成が変わるたびにキーを上げる。v2（堅緩軸）とは非互換なので読まない */
const store = (() => {
  const KEY = 'nanimonoda.v4';
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

/* ===== 採点 =====
   高い側（hi）を選んだ数を因子ごとに数える。1因子7問なので 0〜7。
   奇数なので中央 3.5 に到達できず、**中央値が構造的に出ない。**
   合計をそのまま4段階に割るので、引き伸ばしのような補正も要らない。 */
function score(answers) {
  const out = {};
  FACTORS.forEach(f => {
    const list = QS.map((q, i) => ({ q, i })).filter(x => x.q.f === f.id);
    const sum = list.reduce((n, x) => n + (answers[x.i] === x.q.hi ? 1 : 0), 0);
    const max = list.length;
    out[f.id] = { sum, max, ratio: sum / max, band: BAND_OF(sum) };
  });
  return out;
}

/* ===== 五角形（ビッグファイブのレーダー） =====
   5因子はちょうど正五角形に収まる。**因子どうしは互いに独立**なので、
   6役職を並べていた頃と違って、形がそのまま5つの情報を表す。

   ただしレーダーは面積が値の2乗で効き、差を実際より大きく見せる。
   **数値のバー（readout）を必ず併記すること。** */
function radarChart(series) {
  const C = 150, R = 84, N = FACTORS.length;
  const at = (i, t) => {
    const a = (-90 + i * (360 / N)) * Math.PI / 180;
    return [C + Math.cos(a) * R * t, C + Math.sin(a) * R * t];
  };
  const poly = t => FACTORS.map((_, i) => at(i, t).join(',')).join(' ');

  const grid = [0.25, 0.5, 0.75, 1].map(t =>
    `<polygon class="rd-grid" points="${poly(t)}"/>`).join('')
    + FACTORS.map((_, i) =>
      `<line class="rd-grid" x1="${C}" y1="${C}" x2="${at(i,1)[0]}" y2="${at(i,1)[1]}"/>`).join('');

  const shapes = series.map(sr => {
    const pts = FACTORS.map((f, i) => at(i, sr.s[f.id].ratio).join(',')).join(' ');
    return `<polygon points="${pts}" fill-opacity=".18" stroke-width="2"
              stroke-linejoin="round" style="fill:${sr.color};stroke:${sr.color}"/>`
      + FACTORS.map((f, i) => { const [x, y] = at(i, sr.s[f.id].ratio);
          return `<circle cx="${x}" cy="${y}" r="3.4" style="fill:${sr.color}"/>`; }).join('');
  }).join('');

  /* 頂点のラベル。因子名の下に10段階の数値を大きく置く。
     分母は出さない（「2/10」だと劣って見えるため） */
  const first = series[0];
  const labels = FACTORS.map((f, i) => {
    const [lx, ly] = at(i, 1.26);
    const anchor = Math.abs(lx - C) < 6 ? 'middle' : (lx > C ? 'start' : 'end');
    const num = first ? `<tspan class="rd-num" x="${lx}" dy="1.25em">${ten(first.s[f.id])}</tspan>` : '';
    return `<text class="rd-lab" x="${lx}" y="${ly}" text-anchor="${anchor}">
      <tspan x="${lx}">${f.name}</tspan>${num}</text>`;
  }).join('');

  return `<svg class="hex" viewBox="0 0 300 300" role="img" aria-label="5因子のかたち">
    <style>
      .rd-grid{fill:none;stroke:var(--ac-web);stroke-width:1}
      .rd-lab{font-family:var(--sans);font-size:10.5px;font-weight:600;
        fill:var(--ink-70);letter-spacing:.02em}
      .rd-num{font-size:15px;font-weight:600;fill:var(--ac)}
    </style>
    ${grid}${shapes}${labels}
  </svg>`;
}

/* ===== 共有リンク =====
   18問 × 2bit = 5バイト + ニックネームのUTF-8 を base64url にして
   URLのフラグメントに載せる。# 以降はサーバーに送信されない。
   設問構成を変えたら必ず LINK_V を上げること（古いリンクの誤読を防ぐ） */
const LINK_V = '4';
const NICK_MAX = 20;
const PACK_BYTES = Math.ceil(QS.length / 8);

const b64uEnc = bytes => {
  let s = '';
  bytes.forEach(b => { s += String.fromCharCode(b); });
  return btoa(s).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
};
const b64uDec = str => Uint8Array.from(
  atob(str.replace(/-/g, '+').replace(/_/g, '/')), c => c.charCodeAt(0));

/* 二択なので1問1ビット。35問 = 5バイト */
function packAnswers(a) {
  const b = new Uint8Array(PACK_BYTES);
  for (let i = 0; i < QS.length; i++) b[i >> 3] |= (a[i] & 1) << (i % 8);
  return b;
}
function unpackAnswers(b) {
  const a = {};
  for (let i = 0; i < QS.length; i++) a[i] = (b[i >> 3] >> (i % 8)) & 1;
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

/* 他己評価の総合。因子ごとに素点を平均する */
function aggregate(peers) {
  const out = {};
  FACTORS.forEach(f => {
    const max = peers[0].s[f.id].max;
    const sum = peers.reduce((n, p) => n + p.s[f.id].sum, 0) / peers.length;
    out[f.id] = { sum, max, ratio: sum / max, band: BAND_OF(Math.round(sum)) };
  });
  return out;
}

/* ===== 座標盤（外向性 × 協調性。残る3因子はバーとレーダーで見せる） ===== */
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
    .fx-dot circle{fill:var(--dcore);
      filter:drop-shadow(0 0 3px var(--dnear))
             drop-shadow(0 0 8px var(--dnear))
             drop-shadow(0 0 17px var(--dc))
             drop-shadow(0 0 30px var(--dc))}
    .fx-dot.faint circle{opacity:.6;
      filter:drop-shadow(0 0 2px var(--dnear)) drop-shadow(0 0 7px var(--dc))}
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
    <rect class="fx-grid" x="28" y="28" width="244" height="244"/>
    ${[89,211].map(v => `<line class="fx-grid" x1="${v}" y1="28" x2="${v}" y2="272"/>
       <line class="fx-grid" x1="28" y1="${v}" x2="272" y2="${v}"/>`).join('')}
    <line class="fx-axis" x1="150" y1="28" x2="150" y2="272"/>
    <line class="fx-axis" x1="28" y1="150" x2="272" y2="150"/>
  </g>
  <text class="fx-lab" x="150" y="19"  text-anchor="middle">温</text>
  <text class="fx-lab" x="150" y="291" text-anchor="middle">冷</text>
  <text class="fx-lab" x="22" y="155" text-anchor="middle">陰</text>
  <text class="fx-lab" x="278" y="155" text-anchor="middle">陽</text>`;
}

/* プロットは 28〜272。四辺に残した28は軸ラベルの居場所で、これ以上は詰められない */
const PLOT = { o: 28, w: 244 };
const px = e => e.ratio * PLOT.w + PLOT.o;        // 外向性: 右=外向
const py = a => (1 - a.ratio) * PLOT.w + PLOT.o;  // 協調性: 上=協調

/* 点は1点だけ。輪もリングも付けない */
/* 印は小さな白い光点。芯は白のまま、グローの外側だけ系統色を混ぜて、
   比較画面で自己評価と他己評価を見分けられるようにしている */
function dot(x, y, col, r) {
  return `<g class="fx-dot" style="--dc:${col.glow};--dnear:${col.near};--dcore:${col.core}">
    <circle cx="${x}" cy="${y}" r="${r}"/></g>`;
}

/* 自己評価はパープル、他己評価は白。大きさは同じで、色だけで分ける。
   near は芯のすぐ外のにじみ。ここを白にすると芯まで白っぽく見える。

   **グローにテーマ変数（--cat-b 等）を使わないこと。**
   ライト配色では濃い紫になり、光ではなく影として描かれて沈む。
   発光する色は配色に依らず固定値で持つ。 */
const COL = {
  self: { core: '#C79BFF', near: 'rgba(190,140,255,1)', glow: '#8A4DFF', glowSolid: '#A56BFF' },
  peer: { core: '#FFFFFF', near: 'rgba(255,255,255,.95)', glow: '#FFFFFF' }
};
/* 自己評価の点も4群で色を変える。
   **発光色に配色変数を使わないこと。** ライト配色で濃色になり、光ではなく
   影として沈む。ここは配色に依存しない固定値で持つ（--ac は文字と線だけ）。 */
const SELF_COL = {
  NT: { core: '#C79BFF', near: 'rgba(190,140,255,1)', glow: '#8A4DFF' },
  ST: { core: '#9ED2FF', near: 'rgba(120,190,255,1)', glow: '#2E8FE8' },
  SF: { core: '#FFE39A', near: 'rgba(255,206,110,1)', glow: '#E0A317' },
  NF: { core: '#9CF0CE', near: 'rgba(100,225,175,1)', glow: '#16A96F' }
};
const selfCol = s => SELF_COL[groupOf(s)];

/* items: [{ color, s, faint }] — faint は個別の他己評価（点だけ薄く打つ）
   点の脇に名前は出さない。どれがどれかは色と、盤の下の凡例で示す */
function drawFlat(items, id) {
  const pts = items.map(it => ({ ...it, x: px(it.s.e), y: py(it.s.a) }));
  const main = pts.filter(p => !p.faint);
  const line = main.length > 1
    ? `<polyline points="${main.map(p => `${p.x},${p.y}`).join(' ')}" fill="none"
         stroke="var(--ink)" stroke-opacity=".3" stroke-width="1.4" stroke-dasharray="5 4"/>` : '';
  return `<svg class="map" viewBox="0 0 300 300" role="img" aria-label="診断結果の位置">
    ${field(id)}
    ${pts.filter(p => p.faint).map(p => `
      <g class="fx-dot faint" style="--dc:${p.color.glow};--dnear:${p.color.near};--dcore:${p.color.core}">
        <circle cx="${p.x}" cy="${p.y}" r="1.4"/></g>`).join('')}
    ${line}
    ${main.map(p => dot(p.x, p.y, p.color, main.length > 1 ? 2.25 : 2.6)).join('')}
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
      <span class="meta">${done ? shortLabel(d.self.s) : m.hint}</span>
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
        <span class="meta">${shortLabel(p.s)}</span>
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
  const q = QS[i];
  const picked = answers[i];
  $('qmeta').textContent = `${m.name} ${String(i + 1).padStart(2, '0')}/${QS.length}`;
  $('bar').style.width = ((i + 1) / QS.length * 100) + '%';
  $('qno').textContent = `Q${String(i + 1).padStart(2, '0')}`;
  $('qtext').textContent = m.kind === 'peer' ? 'この人に近いのはどちら？' : '自分に近いのはどちら？';
  $('opts').innerHTML = q[m.qk].map((t, v) => `
    <button class="btn opt ${v === picked ? 'sel' : ''}" data-v="${v}"
            aria-pressed="${v === picked}">
      <span class="ab">${'AB'[v]}</span><span class="ot">${t}</span>
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
/* 5因子ぶんのバー。数値は素点の分数だけ出す */
const readout = (s, exact = true) => FACTORS.map(f => `
  <div class="fct">
    <span class="fl">${f.name}</span>
    <span class="fb"><i style="width:${s[f.id].ratio * 100}%"></i></span>
    <span class="fv">${bandName(f, s[f.id].band)}</span>
    <span class="fn">${exact ? s[f.id].sum : s[f.id].sum.toFixed(1)}/${s[f.id].max}</span>
  </div>`).join('');

/* ===== 結果 ===== */
function showResult(kind, idx) {
  const d = store.load();
  const rec = kind === 'peer' ? d.peers[idx] : d.self;
  if (!rec) { renderHome(); return show('s-home'); }
  const s = rec.s, isPeer = kind === 'peer';

  $('r-cat').textContent = isPeer ? `${rec.nick}から見たあなた` : 'あなたの結果';
  $('r-name').innerHTML = codeTag(s) + esc(archName(s));
  $('r-catch').textContent = quipLine(s);
  paintGroup('s-result', s);
  $('r-hex').innerHTML = radarChart([{ color: 'var(--ac)', s }]);
  $('r-map').innerHTML = drawFlat([{ color: isPeer ? COL.peer : selfCol(s), s }], 'a');
  /* 際立っている順に、因子ごとの読みを並べる */
  $('r-body').innerHTML = standout(s).map(f => `
    <div class="fread">
      <div class="fh"><b>${f.name}</b><span>${bandName(f, s[f.id].band)}</span>
        <i>${ten(s[f.id])}</i></div>
      <p>${READ[f.id][s[f.id].band]}</p>
    </div>`).join('');
  $('r-note').textContent = isPeer ? PEER_NOTE : ROLE_NOTE;

  $('btn-share').hidden = isPeer;
  $('btn-again').hidden = isPeer;
  if (!isPeer) {
    $('btn-share').onclick = () => shareResult(s);
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

function shareResult(s) {
  const text = `私は「${codeOf(s)} ${archName(s)}」\n`
    + FACTORS.map(f => `${f.name} ${ten(s[f.id])}`).join(' / ')
    + `\n— 何者か`;
  shareOut({ title: '何者か', text }, 'コピーしました');
}

/* ===== 他人を診断した結果を送る ===== */
function showPeerSend() {
  $('p-name').innerHTML = codeTag(pending.s) + esc(archName(pending.s));
  $('p-catch').textContent = 'この人はこう見えました';
  paintGroup('s-peer', pending.s);
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
  $('i-title').textContent = `${peer.nick}から見たあなた`;
  $('i-catch').textContent = quipLine(peer.s);
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

  paintGroup('s-compare', me);
  $('c-map').innerHTML = drawFlat([
    ...d.peers.map(p => ({ color: COL.peer, s: p.s, faint: true })),
    { color: selfCol(me), s: me },
    { color: COL.peer, s: agg }
  ], 'c');

  $('c-legend').innerHTML = `
    <button class="btn lg" data-open="self">
      <span class="sw" style="background:${selfCol(me).core}"></span>
      <span class="nm">自己評価</span><span class="ty">${shortLabel(me)}</span><span class="go">›</span></button>
    <div class="lg flat">
      <span class="sw" style="background:${COL.peer.core}"></span>
      <span class="nm">他己評価 総合</span><span class="ty">${shortLabel(agg)}（${n}件の平均）</span></div>
    ${d.peers.map((p, i) => `
    <button class="btn lg sub" data-open="peer:${i}">
      <span class="sw" style="background:${COL.peer.core};opacity:.5"></span>
      <span class="nm">${esc(p.nick)}</span><span class="ty">${shortLabel(p.s)}</span><span class="go">›</span></button>`).join('')}`;
  document.querySelectorAll('#c-legend [data-open]').forEach(b =>
    b.onclick = () => {
      const [kind, key] = b.dataset.open.split(':');
      showResult(kind, kind === 'peer' ? +key : undefined);
    });

  $('c-readout').innerHTML = readout(agg, false);
  $('c-cards').innerHTML = gapCard(me, agg, n);
  show('s-compare');
}

const sign = v => (v > 0 ? '+' : v < 0 ? '−' : '±') + Math.abs(v);

function gapCard(me, agg, n) {
  const dy = Math.round((agg.e.ratio - me.e.ratio) * 100);
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
    <div class="k">自己評価と他己評価の差 — 外向性 ${abs}pt</div>
    <div class="v">${verdict}</div><div class="d">${desc}</div>
    ${radarChart([{ color: 'var(--ac)', s: me }, { color: 'var(--peer-line)', s: agg }])}
    <div class="hexleg">
      <span><i style="background:var(--ac)"></i>自己評価</span>
      <span><i style="background:var(--peer-line)"></i>他己評価 総合</span>
    </div>
    <div class="delta">${FACTORS.map(f => `
      <div><span class="dk">${f.name}</span>
        <span class="dv">自己 ${Math.round(me[f.id].ratio * 100)}% → 他己 ${Math.round(agg[f.id].ratio * 100)}%
          <b>${sign(Math.round((agg[f.id].ratio - me[f.id].ratio) * 100))}</b></span></div>`).join('')}</div>
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
  store.save({ self: null, peers: [] }); renderHome(); toast('記録を消しました');
};

$('btn-psend').onclick = async () => {
  const l = peerLink();
  if (!l) return;
  $('p-link').textContent = l.url;
  $('p-link').hidden = false;
  await shareOut({
    title: '何者か',
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
      && FACTORS.every(f => p.s[f.id].sum === got.s[f.id].sum));
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
