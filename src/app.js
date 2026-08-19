/* ===== 何者か — ディライトの役職適性診断（3軸18問） ===== */

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
  /* このアプリ独自の名前。よく知られた16タイプの和名は別サービスの商標なので使わない */
  INTJ: '静かな設計者',        INTP: '理屈の探検家',
  ENTJ: '仕切りたがりの司令塔', ENTP: '口達者な発明家',
  INFJ: '物静かな理想主義者',  INFP: '夢を抱えた職人',
  ENFJ: '世話焼きの導き手',    ENFP: '人を巻き込む発起人',
  ISTJ: '抜かりない実務家',    ISFJ: '縁の下の守り手',
  ESTJ: '現場の仕切り屋',      ESFJ: '面倒見のいい世話役',
  ISTP: '黙って直す職人',      ISFP: 'マイペースな感覚派',
  ESTP: '勢いで動く突撃隊',    ESFP: '場を沸かせるムードメーカー'
};
/* 情緒安定性の4段階。16タイプをさらに4つに割って 16 × 4 = 64 にする。
   **設問は1問も足していない。** 情緒安定性はもともと7問で測っていて、
   合計0〜7が4段階に割れる。4文字に入っていなかった唯一の因子なので、
   ここを段の番号として持たせると、穴もふさがる。

   **段を和名の冠にしないこと。** 一度やって失敗した。「揺れる人を巻き込む
   発起人」が「揺れる人／を巻き込む/発起人」とも読めてしまい、意味が壊れる。
   段は4文字のうしろの数字（ENTP3）と、下の一言で示す。 */
const subOf = s => s.s.band;

/* 一言の締め。**4段それぞれで必ず違う文にすること。** ここが同じだと、
   同じ4文字の4つが見分けられなくなり、64に割った意味が消える。
   辛口 → 肯定 の型は他と同じ。 */
const SUB_LINE = [
  'ささいなことでよく揺れますが、その感度があるから人の不調に最初に気づけます。',
  '引きずる日もありますが、たいてい翌日には持ち直します。',
  'たいていのことでは動じないので、慌てている人からは涼しい顔に見えます。',
  '何が起きても平静で、周りの焦りに気づかないほどです。そのぶん、まずい場面でいちばん頼れます。'
];

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

/* 長所と短所。4文字ごとに1組。
   **ここだけは短所をはっきり書く。** READ（因子ごとの読み）は低い側を欠点に
   しない方針だが、この欄は「短所も知りたい」という依頼で足したもの。
   ただし人格の断定ではなく、**場面で出る振る舞い**として書くこと。

   **4文字と矛盾する振る舞いを書かないこと。** ESFJ の短所に「先送りする」と
   書いて指摘された。J は誠実性の高い側から来ているので、きっちり側の人に
   先送りは起きない。書きたかったのは F（協調性）から来る対立回避で、その
   現れ方として低誠実性の振る舞いを借りてしまっていた。
     E/I←外向性  S/N←開放性  T/F←協調性  J/P←誠実性
   短所を1つ書くたびに、それがどの文字から来ているかを言えるか確かめる。

   **この欄は4文字しか見ていない。** 誠実性10の人も6の人も同じJで同じ文が
   出る。実際の数値は五角形と READ が受け持つ。 */
const TRAITS = {
  INTJ: { p: '長期の見通しを立てられる、筋道立てて考える、決めたことを完遂する、独力で進められる。',
          m: '説明を省きがち、他人の段取りの甘さに苛立つ、感情面の配慮が後回しになりやすい。' },
  INTP: { p: '物事の仕組みを掘り下げる、前提を疑える、独創的な着想、専門領域に深く入れる。',
          m: '結論より過程に時間をかける、締切や事務作業が苦手、興味の外に関心が向かない。' },
  ENTJ: { p: '目標から逆算して人を動かせる、決断が速い、責任を引き受ける、全体を設計できる。',
          m: '指示が強くなりがち、待つのが苦手、相手の準備が整う前に進めてしまう。' },
  ENTP: { p: '発想力が高い、柔軟な思考、議論や課題解決が得意、知的な刺激を好む。',
          m: 'ルーチンワークに飽きやすい、細かいルールを嫌う、悪気なく相手を論破してしまうことがある。' },
  INFJ: { p: '人の機微に気づく、理想を言葉にできる、地道に積み上げる、信頼を得やすい。',
          m: '抱え込みやすい、断るのが苦手、理想と現実の差に消耗しやすい。' },
  INFP: { p: '価値観がぶれない、想像力が豊か、一人で深く打ち込める、人の痛みに敏感。',
          m: '現実的な段取りが後手になる、批判をこたえやすい、興味の波が大きい。' },
  ENFJ: { p: '人を巻き込める、場の空気を整える、面倒見がよい、目標に人を向かわせられる。',
          m: '世話を焼きすぎる、断れずに抱える、自分の予定を削ってでも人に付き合う。' },
  ENFP: { p: '着火力がある、人を巻き込む、新しいものに飛び込める、場を明るくする。',
          m: '始めたものを残しがち、細部と締切が苦手、熱の上下が大きい。' },
  ISTJ: { p: '約束を守る、抜け漏れがない、地道に続けられる、事実にもとづいて判断する。',
          m: '変更に弱い、やり方を変えたがらない、他人のゆるさが気になる。' },
  ISFJ: { p: '気配りが細かい、裏方を厭わない、記録が正確、頼まれたことを確実にやる。',
          m: '自己主張が弱い、断れない、感謝されないと消耗する。' },
  ESTJ: { p: '段取りが早い、決めて動かせる、現場を回せる、責任の所在をはっきりさせる。',
          m: '進め方が強引になる、例外を認めにくい、正論で押し切りがち。' },
  ESFJ: { p: '人の輪を保つ、細やかに動く、頼まれごとに応える、場をあたためる。',
          m: '人の評価を気にしすぎる、言いにくいことを飲み込む、抱え込みやすい。' },
  ISTP: { p: '手が動く、トラブル対応が冷静、無駄がない、仕組みを理解するのが速い。',
          m: '説明が少ない、長期の計画が苦手、興味のない作業に身が入らない。' },
  ISFP: { p: '感覚が鋭い、押し付けない、その場の変化に合わせられる、人の気持ちを察する。',
          m: '主張が伝わりにくい、締切に弱い、気が乗らないと動けない。' },
  ESTP: { p: '動き出しが速い、土壇場に強い、現場で判断できる、物おじしない。',
          m: '準備を飛ばす、飽きが早い、言い方が直接的すぎることがある。' },
  ESFP: { p: '場を明るくする、人の輪に入るのが速い、その場を楽しめる、切り替えが早い。',
          m: '計画性が薄い、地道な作業が続かない、その場の空気に流されやすい。' }
};

/* 10段階の表示値。0〜7 を 1〜10 に写す。
   **「2/10」のような分母つきで出さないこと。** 劣っているように見える。
   単に「協調性 2」と置く。 */
const ten = s10 => Math.round(s10.ratio * 9) + 1;

/* 際立っている因子から並べる。中央（3.5/7）からの距離で測る */
const standout = s => FACTORS.slice()
  .sort((x, y) => Math.abs(s[y.id].ratio - .5) - Math.abs(s[x.id].ratio - .5));
const hiSide = (s, f) => s[f.id].band >= 2 ? 1 : 0;

/* 和名は4文字タイプの16通り。段は名前に混ぜず、数字と一言で示す */
const archName = s => CODE_NAME[codeOf(s)];
/* 4群 = 開放性(N/S) × 協調性(T/F)。4文字コードの文字色をこれで決める。
   NT=紫 / ST=青 / SF=黄 / NF=緑。色は index.html の --g-* に置いてある */
const groupOf = s => codeOf(s).slice(1, 3);
/* 見出しの4文字と、情緒安定性の段。色は画面に付けた data-grp から降ってくる。
   4文字だけでは64種のどれかが決まらないので、段の番号まで出す */
const codeTag = s => `<span class="code">${codeOf(s)}<i>${subOf(s) + 1}</i></span>`;
/* 画面ごとに群を宣言する。ここに付けた色を子孫がまとめて継ぐ */
const paintGroup = (id, s) => $(id).setAttribute('data-grp', groupOf(s));
/* 見出しの下の一言。段階の言葉 + 辛口の一言 */
function quipLine(s) {
  const [a, b] = standout(s);
  /* **「〜で、」でつながないこと。** 段の言葉には「感じやすい」「動じない」
     のような形容詞が混ざるので、「とても感じやすいで、」と崩れる。読点で並べる */
  const head = `${bandName(a, s[a.id].band)}、${bandName(b, s[b.id].band)}。`
             + QUIP[a.id][s[a.id].band];
  /* 情緒安定性が際立つ2つに入っていれば、もう触れているので足さない。
     入っていないときだけ足して、**どの場合も4段が必ず書き分かれる**ようにする */
  const shown = a.id === 's' || b.id === 's';
  return shown ? head : head + SUB_LINE[subOf(s)];
}
/* 五角形の下に置く、長所と短所 */
const traitBlock = s => {
  const t = TRAITS[codeOf(s)];
  return `<h4>${esc(archName(s))}（${codeOf(s)}）の主な特徴</h4>
    <dl><dt>長所</dt><dd>${t.p}</dd>
        <dt>短所</dt><dd>${t.m}</dd></dl>`;
};

/* 因子ごとの読み。際立っている順に並べる。
   **自分の結果と他人を診断した結果で、必ず同じものを出すこと。**
   送る側が薄いと、何を送っているのか分からないまま送ることになる */
const readCards = s => standout(s).map(f => `
    <div class="fread">
      <div class="fh"><b>${f.name}</b><span>${bandName(f, s[f.id].band)}</span>
        <i>${ten(s[f.id])}</i></div>
      <p>${READ[f.id][s[f.id].band]}</p>
    </div>`).join('');

/* 一覧用の短いラベル。冠まで入れると行に収まらないので番号で足す */
const shortLabel = s => `${codeOf(s)}${subOf(s) + 1} ${CODE_NAME[codeOf(s)]}`;

const ROLE_NOTE = 'どの因子も「高い側が良い」という意味ではありません。同じ性質が、ある場面では強みに、別の場面では弱みになります。またこの結果は傾向であって、能力や成果を測ったものではありません。';
const PEER_NOTE = '他己評価は、外から見える行動しか拾えません。一人の時間にホッとするか、人と会った後に疲れるかといった内側の項目は、相手には推測でしか答えられません。そのぶんを差し引いて見てください。';

const PEER_MAX = 30;  // 届いた他己評価
const SELF_MAX = 3;   // 自己診断の履歴
/* 他人への診断の上限。
   **容量ではなく一覧の読みやすさで決めている。** 1件は回答35問を35文字に
   しただけなので実測80バイト前後、30件でも3KB。localStorage の 5MB には
   まるで届かない。増やすなら表紙の一覧を畳む作りが先に要る。 */
const MADE_MAX = 30;

/* 回答は1問1文字。'.' は未回答。
   **点数を保存しないこと。** 採点式を直したとき、保存済みの点数だけが
   古い式のまま残って、新しく取った結果と比べられなくなる。 */
const BLANK = '.'.repeat(QS.length);
const packAns = ans => QS.map((_, i) => (ans[i] === 0 || ans[i] === 1) ? String(ans[i]) : '.').join('');
const unpackAns = str => {
  const o = {};
  for (let i = 0; i < QS.length; i++) if (str[i] === '0' || str[i] === '1') o[i] = +str[i];
  return o;
};
const answered = r => (r.a || '').split('').filter(c => c !== '.').length;
/* 旧版は点数だけを持っていた。回答が無い記録はその点数をそのまま使う */
const isDone = r => r.a ? answered(r) === QS.length : !!r.s;
const scoreOf = r => r.a ? score(unpackAns(r.a)) : r.s;
const idOf = r => r.id || r.at;
const nextQ = r => { const i = (r.a || '').indexOf('.'); return i < 0 ? 0 : i; };

const stamp = t => {
  const d = new Date(t);
  const p = n => String(n).padStart(2, '0');
  return `${d.getMonth() + 1}/${d.getDate()} ${p(d.getHours())}:${p(d.getMinutes())}`;
};

const store = (() => {
  const KEY = 'nanimonoda.v5';
  const OLD = 'nanimonoda.v4';
  let mem = null;
  let ok = false;
  try { localStorage.setItem('__t', '1'); localStorage.removeItem('__t'); ok = true; } catch (e) { ok = false; }

  const arr = (o, k, max) => (o && Array.isArray(o[k])) ? o[k].slice(-max) : [];
  const shape = o => ({
    selfs: arr(o, 'selfs', SELF_MAX),
    made:  arr(o, 'made',  MADE_MAX),
    peers: arr(o, 'peers', PEER_MAX),
    seenLp: !!(o && o.seenLp)      // LPは初回だけ出す
  });

  /* v4 からの引き継ぎ。自己評価1件と他己評価はそのまま履歴の1件目にする */
  const migrate = () => {
    let old = null;
    try { old = JSON.parse(localStorage.getItem(OLD) || 'null'); } catch (e) {}
    if (!old) return null;
    return {
      selfs: old.self ? [{ id: old.self.at, at: old.self.at, s: old.self.s }] : [],
      made:  Array.isArray(old.made) ? old.made.map(m => ({ id: m.at, ...m })) : [],
      peers: Array.isArray(old.peers) ? old.peers.map(p => ({ id: p.at, ...p })) : []
    };
  };

  return {
    load() {
      let raw = null;
      try { raw = ok ? localStorage.getItem(KEY) : mem; } catch (e) {}
      if (!raw) {
        const m = migrate();
        if (m) { this.save(m); return shape(m); }
      }
      try { return shape(JSON.parse(raw || '{}')); }
      catch (e) { return shape(null); }
    },
    save(o) {
      const s = JSON.stringify(shape(o));
      try { ok ? localStorage.setItem(KEY, s) : (mem = s); } catch (e) { mem = s; }
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
    return { id: Date.now(), at: Date.now(), nick: nick || '名前なし', a: packAns(answers) };
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
  const newest = list => list.slice().sort((x, y) => (y.at || 0) - (x.at || 0));
  const doneSelf = d.selfs.filter(isDone);

  $('n-self').textContent = d.selfs.length ? `${d.selfs.length}件` : 'はじめて';
  $('n-made').textContent = d.made.length ? `${d.made.length}件` : 'はじめて';
  $('n-peer').textContent = d.peers.length ? `${d.peers.length}件` : 'まだ0件';
  $('go-mirror').classList.toggle('off', !d.peers.length && !doneSelf.length);

  /* 自己診断の履歴は比較ページで扱う。ここは最新を開くボタンだけ */
  const see = $('btn-see');
  see.hidden = !doneSelf.length;
  see.onclick = () => showResult(newest(doneSelf)[0]);

  $('g-made').hidden = !d.made.length;
  if (d.made.length) {
    $('made-count').textContent = `${d.made.length} / ${MADE_MAX}`;
    $('madelist').innerHTML = newest(d.made).map(r => `
      <button class="btn card done" data-open="made:${idOf(r)}">
        <span class="dot c"></span>
        <span class="nm">${esc(r.nick)}</span>
        <span class="meta">${isDone(r) ? shortLabel(scoreOf(r)) : `途中 ${answered(r)}/${QS.length}`}</span>
      </button>`).join('');
    document.querySelectorAll('#s-home [data-open]').forEach(b =>
      b.onclick = () => openRecord(...b.dataset.open.split(':')));
  }
}

/* 一覧から1件開く。終わっていれば結果へ、途中なら続きから */
function openRecord(kind, id) {
  const d = store.load();
  const list = kind === 'self' ? d.selfs : kind === 'made' ? d.made : d.peers;
  const r = list.find(x => String(idOf(x)) === String(id));
  if (!r) return;
  if (!isDone(r)) return resume(kind, r);
  if (kind === 'self') return showResult(r);
  if (kind === 'made') return showPeerSend(r);
  return showInbox(r);
}

/* ===== 設問 ===== */
/* 選んでから次の設問に移るまで。**長くしないこと。** 35問あるので、
   ここが伸びるとそのぶん全部に効いて、反応が鈍いという印象になる。
   選んだことが見える最低限（1フレーム＋α）に留める */
const ADVANCE_MS = 90;
let advTimer = null;
function cancelAdvance() { clearTimeout(advTimer); advTimer = null; }

/* いま解いている記録。kind は self / made、id で保存先を引く */
let cur = null;

function beginSelf() {
  const d = store.load();
  const r = { id: Date.now(), at: Date.now(), a: BLANK };
  d.selfs.push(r);
  if (d.selfs.length > SELF_MAX) d.selfs = d.selfs.slice(-SELF_MAX);
  store.save(d);
  resume('self', r);
}

/* 相手の名前を先に決める。**ここで記録を作ること。**
   保存が最後だと、途中でやめた回答がまるごと消える */
function beginPeer(nick) {
  const d = store.load();
  const now = Date.now();
  const i = d.made.findIndex(m => m.nick === nick);
  const r = { id: i >= 0 ? idOf(d.made[i]) : now, at: now, nick, a: BLANK };
  if (i >= 0) d.made[i] = r; else d.made.push(r);
  if (d.made.length > MADE_MAX) d.made = d.made.slice(-MADE_MAX);
  store.save(d);
  resume('made', r);
}

function resume(kind, r) {
  cancelAdvance();
  cur = { kind, id: idOf(r), nick: r.nick, i: nextQ(r), answers: unpackAns(r.a || '') };
  show('s-quiz'); renderQ();
}

/* 回答を1問ぶん書き戻す。中断はいつ起きるか分からないので毎問やる */
function persist() {
  if (!cur) return;
  const d = store.load();
  const list = cur.kind === 'self' ? d.selfs : d.made;
  const r = list.find(x => String(idOf(x)) === String(cur.id));
  if (!r) return;
  r.a = packAns(cur.answers);
  store.save(d);
}

function renderQ() {
  const { kind, i, answers } = cur;
  const q = QS[i];
  const picked = answers[i];
  const qk = kind === 'self' ? 'self' : 'other';
  $('qmeta').textContent = `${kind === 'self' ? '自分を診断する' : esc(cur.nick)} ${String(i + 1).padStart(2, '0')}/${QS.length}`;
  $('bar').style.width = ((i + 1) / QS.length * 100) + '%';
  $('qno').textContent = `Q${String(i + 1).padStart(2, '0')}`;
  $('qtext').textContent = kind === 'self' ? '自分に近いのはどちら？' : 'この人に近いのはどちら？';
  $('opts').innerHTML = q[qk].map((t, v) => `
    <button class="btn opt ${v === picked ? 'sel' : ''}" data-v="${v}"
            aria-pressed="${v === picked}">
      <span class="ab">${'AB'[v]}</span><span class="ot">${t}</span>
    </button>`).join('');
  document.querySelectorAll('[data-v]').forEach(b => b.onclick = () => answer(+b.dataset.v));
  $('btn-back').style.visibility = i === 0 ? 'hidden' : 'visible';
}

function answer(v) {
  cancelAdvance();                    // 送り待ちの間でも押し直せる
  cur.answers[cur.i] = v;
  document.querySelectorAll('#opts .opt').forEach(b => {
    const on = +b.dataset.v === v;
    b.classList.toggle('sel', on);
    b.setAttribute('aria-pressed', on);
  });
  persist();
  advTimer = setTimeout(() => {
    advTimer = null;
    const left = QS.map((_, i) => i).find(i => cur.answers[i] === undefined);
    if (left !== undefined) { cur.i = left; renderQ(); }
    else finish();
  }, ADVANCE_MS);
}

function finish() {
  const d = store.load();
  const list = cur.kind === 'self' ? d.selfs : d.made;
  const r = list.find(x => String(idOf(x)) === String(cur.id));
  if (!r) return goHome();
  r.a = packAns(cur.answers);
  store.save(d);
  cur = null;
  if (list === d.made) showPeerSend(r); else showResult(r);
}

/* ===== 表示部品 ===== *//* ===== 表示部品 ===== */
/* 5因子ぶんのバー。数値は素点の分数だけ出す */
const readout = (s, exact = true) => FACTORS.map(f => `
  <div class="fct">
    <span class="fl">${f.name}</span>
    <span class="fb"><i style="width:${s[f.id].ratio * 100}%"></i></span>
    <span class="fv">${bandName(f, s[f.id].band)}</span>
    <span class="fn">${exact ? s[f.id].sum : s[f.id].sum.toFixed(1)}/${s[f.id].max}</span>
  </div>`).join('');

/* ===== 結果 ===== */
/* 自分の結果。rec は selfs か peers の1件 */
function showResult(rec, fromPeer) {
  const s = scoreOf(rec);
  $('r-cat').textContent = fromPeer ? `${rec.nick}から見たあなた` : `あなたの結果　${stamp(rec.at)}`;
  $('r-name').innerHTML = codeTag(s) + esc(archName(s));
  $('r-catch').textContent = quipLine(s);
  $('r-hex').innerHTML = radarChart([{ color: 'var(--ac)', s }]);
  $('r-traits').innerHTML = traitBlock(s);
  $('r-map').innerHTML = drawFlat([{ color: fromPeer ? COL.peer : selfCol(s), s }], 'a');
  $('r-body').innerHTML = readCards(s);
  $('r-note').textContent = fromPeer ? PEER_NOTE : ROLE_NOTE;

  $('btn-share').hidden = !!fromPeer;
  $('btn-again').hidden = !!fromPeer;
  if (!fromPeer) {
    $('btn-share').onclick = () => shareResult(s);
    $('btn-again').onclick = beginSelf;
  }
  $('btn-front').onclick = showCompare;
  $('btn-other').onclick = goHome;
  show('s-result');
  paintGroup('s-result', s);
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
  const text = `私は「${codeOf(s)}${subOf(s) + 1} ${archName(s)}」\n`
    + FACTORS.map(f => `${f.name} ${ten(s[f.id])}`).join(' / ')
    + `\n— 何者か`;
  shareOut({ title: '何者か', text }, 'コピーしました');
}

/* ===== 他人を診断した結果を送る ===== */
let sending = null;   // いま開いている made の記録

function showPeerSend(rec) {
  sending = rec;
  const s = scoreOf(rec);
  $('p-cat').textContent = `${rec.nick}を診断した結果　${stamp(rec.at)}`;
  $('p-name').innerHTML = codeTag(s) + esc(archName(s));
  $('p-catch').textContent = quipLine(s);
  $('p-hex').innerHTML = radarChart([{ color: 'var(--ac)', s }]);
  $('p-traits').innerHTML = traitBlock(s);
  $('p-map').innerHTML = drawFlat([{ color: COL.peer, s }], 'p');
  $('p-body').innerHTML = readCards(s);
  $('p-note').textContent = PEER_NOTE;
  $('p-link').hidden = true;
  $('p-link').textContent = '';
  $('p-nick').value = rec.nick;
  show('s-peer');
  paintGroup('s-peer', s);
}

/* 送るときのニックネームは、送り手（自分）の名乗り */
function peerLink() {
  const nick = $('p-nick').value.trim();
  if (!nick) { toast('ニックネームを入れてください'); $('p-nick').focus(); return null; }
  return { nick, url: makeLink(nick, unpackAns(sending.a)) };
}

/* ===== 受け取り ===== */
function showInbox(rec) {
  const s = scoreOf(rec);
  $('i-title').textContent = `${rec.nick}から見たあなた`;
  $('i-catch').textContent = quipLine(s);
  $('i-map').innerHTML = drawFlat([{ color: COL.peer, s }], 'i');
  $('i-readout').innerHTML = readout(s);
  $('i-note').textContent = PEER_NOTE;
  const d = store.load();
  const bi = $('btn-icompare');
  if (d.selfs.length) { bi.textContent = '自分の結果と並べる'; bi.onclick = showCompare; }
  else { bi.textContent = 'まず自分を診断する'; bi.onclick = beginSelf; }
  $('btn-idetail').onclick = () => showResult(rec, true);
  show('s-inbox');
}

/* ===== 比較（自己評価 vs 他己評価の総合） ===== */
/* 何を出して、どこで平均を取るか。
   avg: 0 まとめない / 1 他己をまとめる / 2 すべてまとめる
   **いきなり平均にしないこと。** 平均は個別を潰すので、まず並べて見せて、
   まとめるかどうかは見る人が決める。 */
let cmp = { selfId: null, off: {}, avg: 0 };
let ask = null;    // 消してよいか確認中の行
let edit = null;   // 名前を変更中の行

function showCompare() {
  const d = store.load();
  const done = d.selfs.filter(isDone);
  if (cmp.selfId === null || (cmp.selfId !== 'none' && !done.some(r => String(idOf(r)) === String(cmp.selfId))))
    cmp.selfId = done.length ? String(idOf(done[done.length - 1])) : 'none';
  renderCompare();
  show('s-compare');
}

/* 1件ぶんの見出し。名前・タイプ・辛口の一言 */
const hexCell = (s, label) => `
  <div class="hexcell" data-grp="${groupOf(s)}">
    <div class="hn">${esc(label)}</div>
    <div class="ht">${codeOf(s)}${subOf(s) + 1}　${esc(archName(s))}</div>
    ${radarChart([{ color: 'var(--ac)', s }])}
    <p class="hq">${quipLine(s)}</p>
  </div>`;

/* 1件だけのときは、結果画面と同じ密度で読みまで出す */
const soloView = (s, label) => `
  <div class="card-x" data-grp="${groupOf(s)}">
    <div class="k">${esc(label)}</div>
    <div class="v">${codeOf(s)}${subOf(s) + 1}　${esc(archName(s))}</div>
    <div class="d">${quipLine(s)}</div>
    ${radarChart([{ color: 'var(--ac)', s }])}
  </div>
  <div class="traits">${traitBlock(s)}</div>
  <p class="eyebrow" style="margin-top:30px">因子ごとの読み</p>
  <div>${readCards(s)}</div>`;

function renderCompare() {
  const d = store.load();
  const done = d.selfs.filter(isDone).slice().sort((x, y) => (y.at || 0) - (x.at || 0));
  const meRec = done.find(r => String(idOf(r)) === String(cmp.selfId));
  const me = meRec ? scoreOf(meRec) : null;
  const used = d.peers.filter(p => !cmp.off[idOf(p)]);

  /* 1行 = 選ぶボタン + 名前を変える + 消す。
     **消す前に必ず一度たずねること。** 元に戻せない */
  const row = (on, key, nm, ty, canRename) => {
    const id = key.split(':')[1];
    if (edit && edit.key === key) return `
      <div class="pkedit">
        <input class="field" id="ed-in" type="text" maxlength="20" value="${esc(nm)}">
        <button class="btn ico" data-save="${key}">保存</button>
        <button class="btn ico" data-cancel="1">やめる</button>
      </div>`;
    if (ask === key) return `
      <div class="pkask">「${esc(nm)}」を消しますか
        <b data-del="${key}">消す</b><span data-cancel="1">やめる</span></div>`;
    return `<div class="pkrow">
      <button class="btn pk ${on ? 'on' : ''}" data-pick="${key}">
        <span class="mk"></span><span class="pn">${esc(nm)}</span><span class="pt">${ty}</span></button>
      ${canRename ? `<button class="ico" data-edit="${key}" aria-label="名前を変える">✎</button>` : ''}
      <button class="ico" data-ask="${key}" aria-label="消す">✕</button>
    </div>`;
  };

  $('c-selfcount').textContent = `${done.length} / ${SELF_MAX}`;
  $('c-selfpick').innerHTML =
    done.map(r => row(String(idOf(r)) === String(cmp.selfId), 'self:' + idOf(r),
                      stamp(r.at), shortLabel(scoreOf(r)), false)).join('')
    + `<div class="pkrow"><button class="btn pk ${cmp.selfId === 'none' ? 'on' : ''}" data-pick="self:none">
         <span class="mk"></span><span class="pn">出さない</span>
         <span class="pt">他己評価だけで見る</span></button></div>`;

  $('c-peercount').textContent = `${used.length} / ${d.peers.length}`;
  $('c-peerpick').innerHTML = d.peers.length
    ? d.peers.map(p => row(!cmp.off[idOf(p)], 'peer:' + idOf(p),
                           p.nick, shortLabel(scoreOf(p)), true)).join('')
    : '<p class="hint">まだ届いていません。</p>';

  document.querySelectorAll('#s-compare [data-pick]').forEach(b =>
    b.onclick = () => {
      const [kind, key] = b.dataset.pick.split(':');
      if (kind === 'self') cmp.selfId = key;
      else cmp.off[key] = !cmp.off[key];
      ask = edit = null;
      renderCompare();
    });
  const on = (sel, fn) => document.querySelectorAll('#s-compare ' + sel).forEach(b => b.onclick = () => fn(b));
  on('[data-edit]', b => { edit = { key: b.dataset.edit }; ask = null; renderCompare();
                           const i = $('ed-in'); if (i) { i.focus(); i.select(); } });
  on('[data-ask]',  b => { ask = b.dataset.ask; edit = null; renderCompare(); });
  on('[data-cancel]', () => { ask = edit = null; renderCompare(); });
  on('[data-save]', b => {
    const nick = ($('ed-in').value || '').trim().slice(0, NICK_MAX);
    if (!nick) return toast('名前を入れてください');
    const id = b.dataset.save.split(':')[1];
    const dd = store.load();
    const p = dd.peers.find(x => String(idOf(x)) === String(id));
    if (p) { p.nick = nick; store.save(dd); }
    edit = null; renderCompare(); renderHome();
  });
  on('[data-del]', b => {
    const [kind, id] = b.dataset.del.split(':');
    const dd = store.load();
    const list = kind === 'self' ? dd.selfs : dd.peers;
    const i = list.findIndex(x => String(idOf(x)) === String(id));
    if (i >= 0) { list.splice(i, 1); store.save(dd); }
    ask = null;
    if (kind === 'self' && String(cmp.selfId) === String(id)) cmp.selfId = null;
    showCompare(); renderHome(); toast('消しました');
  });
  document.querySelectorAll('#c-avg [data-avg]').forEach(b => {
    b.classList.toggle('on', +b.dataset.avg === cmp.avg);
    b.onclick = () => { cmp.avg = +b.dataset.avg; renderCompare(); };
  });

  /* 出すものを、まとめ方に応じて組み立てる */
  const scr = document.getElementById('s-compare');
  if (!me && !used.length) {
    $('c-out').innerHTML = '<p class="hint" style="margin-top:26px">自己診断か他己評価を、1つ以上選んでください。</p>';
    scr.removeAttribute('data-grp');
    return;
  }

  let items;   // 画面に出す線。{ s, label, self }
  if (cmp.avg === 2) {
    const all = [...(me ? [{ s: me }] : []), ...used.map(p => ({ s: scoreOf(p) }))];
    items = [{ s: aggregate(all), label: `${all.length}件の平均${me ? '（自己評価をふくむ）' : ''}` }];
  } else if (cmp.avg === 1) {
    items = [
      ...(me ? [{ s: me, label: `自己評価　${stamp(meRec.at)}`, self: true }] : []),
      ...(used.length ? [{ s: aggregate(used.map(p => ({ s: scoreOf(p) }))),
                           label: `他己評価 ${used.length}件の平均` }] : [])
    ];
  } else {
    items = [
      ...(me ? [{ s: me, label: `自己評価　${stamp(meRec.at)}`, self: true }] : []),
      ...used.map(p => ({ s: scoreOf(p), label: `${p.nick}から見たあなた` }))
    ];
  }

  const head = items[0].s;
  const dots = items.map(it => ({ color: it.self ? selfCol(it.s) : COL.peer, s: it.s }));

  let body;
  if (items.length === 1) {
    body = soloView(items[0].s, items[0].label);
  } else if (cmp.avg === 1 && me && used.length) {
    /* 自己1本と他己の平均1本。この形のときだけズレが出せる */
    const agg = items[1].s;
    body = `<div class="card-x">
        ${radarChart([{ color: 'var(--ac)', s: me }, { color: 'var(--peer-line)', s: agg }])}
        <div class="hexleg">
          <span><i style="background:var(--ac)"></i>自己評価</span>
          <span><i style="background:var(--peer-line)"></i>他己評価 ${used.length}件の平均</span>
        </div>
        ${gapBody(me, agg, used.length)}
      </div>
      <p class="eyebrow" style="margin-top:30px">因子ごとの読み（自己評価）</p>
      <div>${readCards(me)}</div>`;
  } else {
    body = `<div class="hexgrid">${items.map(it => hexCell(it.s, it.label)).join('')}</div>
      <p class="hint" style="margin-top:16px">まとめ方を変えると、平均をとった1つの読みが出ます。</p>`;
  }

  $('c-out').innerHTML = `
    <div class="mapwrap" style="margin-top:26px"><div id="c-map"></div></div>
    <p class="mapcap">${items.length > 1 ? '陽陰 × 温冷。紫が自己評価、白が他己評価' : '陽陰 × 温冷'}</p>
    ${body}
    <p class="note">${PEER_NOTE}</p>`;
  $('c-map').innerHTML = drawFlat(dots, 'c');
  paintGroup('s-compare', head);
}

const sign = v => (v > 0 ? '+' : v < 0 ? '−' : '±') + Math.abs(v);

function gapBody(me, agg, n) {
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
  return `<div class="k" style="margin-top:18px">自己評価と他己評価の差 — 外向性 ${abs}pt</div>
    <div class="v">${verdict}</div><div class="d">${desc}</div>
    <div class="delta">${FACTORS.map(f => `
      <div><span class="dk">${f.name}</span>
        <span class="dv">自己 ${Math.round(me[f.id].ratio * 100)}% → 他己 ${Math.round(agg[f.id].ratio * 100)}%
          <b>${sign(Math.round((agg[f.id].ratio - me[f.id].ratio) * 100))}</b></span></div>`).join('')}</div>`;
}

/* ===== イベント ===== */
const goHome = () => { cancelAdvance(); renderHome(); show('s-home'); };

$('btn-enter').onclick = () => {
  const d = store.load(); d.seenLp = true; store.save(d);   // LPは初回だけ
  goHome();
};
$('btn-lp').onclick = () => show('s-intro');
$('btn-rback').onclick = goHome;
$('btn-cback').onclick = goHome;
$('btn-back').onclick = () => { if (!advTimer && cur && cur.i > 0) { cur.i--; renderQ(); } };
$('btn-quit').onclick = goHome;      // 途中でも保存済みなので、そのまま抜けてよい
$('btn-chome').onclick = goHome;
$('btn-phome').onclick = goHome;
$('btn-ihome').onclick = goHome;
$('btn-nhome').onclick = goHome;

$('go-self').onclick = beginSelf;
$('go-peer').onclick = () => { $('n-nick').value = ''; show('s-nick'); $('n-nick').focus(); };
$('go-mirror').onclick = () => {
  if (!store.load().peers.length) return toast('届いた他己評価がまだありません');
  showCompare();
};

const startPeer = () => {
  const nick = $('n-nick').value.trim().slice(0, NICK_MAX);
  if (!nick) { toast('ニックネームを入れてください'); $('n-nick').focus(); return; }
  beginPeer(nick);
};
$('btn-nstart').onclick = startPeer;
$('n-nick').onkeydown = e => { if (e.key === 'Enter') startPeer(); };

/* 全消去は取り返しがつかない。**一度で消さないこと。** 2回押させる */
let armed = false;
$('btn-reset').onclick = () => {
  if (!armed) {
    armed = true;
    $('btn-reset').textContent = 'もう一度押すと、すべて消えます';
    setTimeout(() => { armed = false; $('btn-reset').textContent = '記録をすべて消す'; }, 4000);
    return;
  }
  armed = false;
  $('btn-reset').textContent = '記録をすべて消す';
  store.save({ selfs: [], made: [], peers: [], seenLp: true });
  cur = null; renderHome(); toast('記録を消しました');
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

function boot() {
  const got = readLink(location.hash);
  if (got) {
    const d = store.load();
    /* 同じ人から同じ内容が二重に入らないようにする */
    const same = d.peers.find(p => p.nick === got.nick && p.a === got.a);
    let rec = same, full = false;
    if (!same) {
      rec = got;
      d.peers.push(rec);
      if (d.peers.length > PEER_MAX) { d.peers = d.peers.slice(-PEER_MAX); full = true; }
      store.save(d);
    }
    history.replaceState(null, '', location.pathname + location.search);
    renderHome();
    showInbox(rec);
    if (full) toast(`他己評価は${PEER_MAX}件までです。古いものから外しました`);
    return;
  }
  renderHome();
  show(store.load().seenLp ? 's-home' : 's-intro');   // LPは初回だけ
}
boot();

/* すでに開いているところへ別のリンクを踏まれた場合。
   同一ページ内のハッシュ変更ではリロードが走らないので自分で拾う */
window.addEventListener('hashchange', () => { if (readLink(location.hash)) boot(); });

if ('serviceWorker' in navigator && location.protocol.startsWith('http')) {
  window.addEventListener('load', () => navigator.serviceWorker.register('sw.js').catch(() => {}));
}
