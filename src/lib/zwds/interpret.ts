// 紫微斗数 — 离线解读引擎 + 格局检测
import { STAR_DICT } from './dictionary';
import { TIAN_GAN, DI_ZHI, GONG_NAMES, JU_MAP } from './stars';
import type { ChartData } from './calculate';

// ----- 格局检测 -----
interface Pattern {
  name: string;
  level: '上格' | '中格' | '下格' | '特殊';
  desc: string;
}

export function detectPatterns(chart: ChartData): Pattern[] {
  const patterns: Pattern[] = [];
  const { starsAtPos, mingGongIndex, sihua } = chart;

  const mingStars = [...(starsAtPos[mingGongIndex]?.main || []), ...(starsAtPos[mingGongIndex]?.aux || [])];
  const hasStar = (names: string[]) => names.some(n => mingStars.some(s => s.startsWith(n)));
  const hasAux = (name: string) => mingStars.some(s => s.startsWith(name));

  // 紫府同宫
  if (hasStar(['紫微']) && hasStar(['天府'])) {
    patterns.push({ name: '紫府同宫', level: '上格', desc: '紫微天府同守命宫，帝王之格，富贵双全，一生衣食无忧，有领导才能。' });
  }
  // 辅弼拱主
  if (hasStar(['紫微']) && (hasAux('左辅') || hasAux('右弼'))) {
    patterns.push({ name: '辅弼拱主', level: '上格', desc: '紫微得左辅右弼拱照，君臣相得，权威在握，遇事有人相助。' });
  }
  // 孤君在野
  if (hasStar(['紫微']) && !hasAux('左辅') && !hasAux('右弼') && !hasAux('天府')) {
    patterns.push({ name: '孤君在野', level: '下格', desc: '紫微独坐无辅弼拱照，孤君在野，刚愎自用，虽有能力但难得人心。' });
  }
  // 君臣庆会
  if (hasStar(['紫微']) && (hasStar(['天相']) || hasStar(['武曲']) || hasStar(['廉贞']))) {
    patterns.push({ name: '君臣庆会', level: '上格', desc: '紫微得将相辅弼，君臣各安其位，事业有靠，谋事有成。' });
  }
  // 月朗天门
  if (hasStar(['太阴']) && mingGongIndex >= 9 && mingGongIndex <= 1) {
    patterns.push({ name: '月朗天门', level: '上格', desc: '太阴入庙守命，亥子丑宫为太阴旺地，光辉显耀，一生富足安乐。' });
  }
  // 日照雷门
  if (hasStar(['太阳']) && mingGongIndex === 3) {
    patterns.push({ name: '日照雷门', level: '上格', desc: '太阳坐卯宫，旭日东升，光明正大，事业昌盛，声名远播。' });
  }
  // 日丽中天
  if (hasStar(['太阳']) && mingGongIndex === 5) {
    patterns.push({ name: '日丽中天', level: '上格', desc: '太阳坐午宫，如日中天，光明耀眼，事业鼎盛，贵人众多。' });
  }
  // 明珠出海
  if (hasStar(['太阳']) && hasStar(['太阴'])) {
    patterns.push({ name: '明珠出海', level: '上格', desc: '太阳太阴同守命宫或对拱，日月并明，聪明才智，贵人运强。' });
  }
  // 火贪格
  if (hasStar(['贪狼']) && (hasAux('火星') || hasAux('铃星'))) {
    patterns.push({ name: '火贪格/铃贪格', level: '上格', desc: '贪狼逢火铃，暴发之格，横发横破，宜把握时机及时收手。' });
  }
  // 雄宿乾元
  if (hasStar(['贪狼']) && mingGongIndex === 2) {
    patterns.push({ name: '雄宿乾元', level: '上格', desc: '贪狼独坐寅宫，身居要地，志向远大，一生事业有根基。' });
  }
  // 武曲天相
  if (hasStar(['武曲']) && hasStar(['天相'])) {
    patterns.push({ name: '将相得位', level: '上格', desc: '武曲天相同宫，刚柔并济，文武双全，适合军公教职。' });
  }
  // 七杀朝斗
  if (hasStar(['七杀']) && (mingGongIndex === 2 || mingGongIndex === 8)) {
    patterns.push({ name: '七杀朝斗', level: '中格', desc: '七杀坐寅申，朝拱斗牛，有将帅之气，可成大事但多波折。' });
  }
  // 府相朝垣
  if (hasStar(['天府']) && hasStar(['天相'])) {
    patterns.push({ name: '府相朝垣', level: '中格', desc: '天府天相同宫或相会，秉公守正，处事周全，能担大任。' });
  }
  // 善荫朝纲
  if (hasStar(['天机']) && hasStar(['天梁'])) {
    patterns.push({ name: '善荫朝纲', level: '中格', desc: '天机天梁同宫，智慧仁厚，福荫双全，适合研究、学术、慈善。' });
  }
  // 文星拱命
  if (hasAux('文昌') && hasAux('文曲')) {
    patterns.push({ name: '文星拱命', level: '中格', desc: '文昌文曲同守命宫，才华出众，文采斐然，考试运佳。' });
  }
  // 魁钺夹命
  if (hasAux('天魁') && hasAux('天钺')) {
    patterns.push({ name: '魁钺夹命', level: '上格', desc: '天魁天钺同守命宫，天乙贵人双拱，富贵可期，遇难有救。' });
  }
  // 巨日同宫
  if (hasStar(['巨门']) && hasStar(['太阳'])) {
    patterns.push({ name: '巨日同宫', level: '中格', desc: '巨门太阳同宫，以阳光驱暗气，口才出众，适合法律、教育。' });
  }
  // 禄马交驰
  if (hasAux('禄存') && hasAux('天马')) {
    patterns.push({ name: '禄马交驰', level: '上格', desc: '命宫禄马同宫，动中得财，越跑越发，适合交通、贸易、物流。' });
  }
  // 石中隐玉
  if (hasStar(['巨门']) && mingGongIndex >= 4 && mingGongIndex <= 5) {
    patterns.push({ name: '石中隐玉', level: '中格', desc: '巨门坐巳午，如玉在石中，才华需要机遇方能显露。' });
  }
  // 铃昌陀武
  if (hasAux('铃星') && hasAux('文昌') && hasAux('陀罗') && hasStar(['武曲'])) {
    patterns.push({ name: '铃昌陀武', level: '下格', desc: '四煞会聚，铃星文昌陀罗武曲同会命宫，主意外波折，须加倍谨慎。' });
  }
  // 刑囚夹印
  if (hasStar(['廉贞']) && (hasAux('擎羊') || hasAux('陀罗'))) {
    patterns.push({ name: '刑囚夹印', level: '下格', desc: '廉贞逢羊陀，刑伤入命，注意官非口舌和意外伤害。' });
  }

  return patterns;
}

// ----- 每宫星曜解读 -----
function interpretPalaceStars(palaceName: string, mainStars: string[], auxStars: string[], dz: string): string {
  const lines: string[] = [];
  lines.push(`【${palaceName}（${dz}）】`);

  const allStars = [...mainStars, ...auxStars];
  if (allStars.length === 0) {
    lines.push('此宫无主星，需借对宫星曜来参考。对宫的力量会影响此宫的吉凶。');
    return lines.join('\n');
  }

  for (const s of allStars) {
    const pure = s.replace(/化.*/, '');
    const entry = STAR_DICT[pure];
    if (!entry) continue;
    const kw = entry.keywords;
    if (palaceName === '命宫') {
      lines.push(`${s}：${entry.desc}`);
    } else {
      lines.push(`${s}（${kw}）：${entry.desc.slice(0, 80)}...`);
    }
  }

  return lines.join('\n');
}

// ----- 四化解读 -----
function interpretSiHua(sihua: ChartData['sihua'], yearGan: number): string {
  const lines: string[] = [];
  lines.push('【四化分析】');
  lines.push(`生年天干：${TIAN_GAN[yearGan]}`);

  const items = [
    { label: '化禄', star: sihua.lu, meaning: '主财运、机遇、人缘顺畅。化禄之处，财源广进，做什么都容易成功。' },
    { label: '化权', star: sihua.quan, meaning: '主权力、掌控、专业性。化权之处，需要主动掌控，有领导力。' },
    { label: '化科', star: sihua.ke, meaning: '主名声、才华、考试运。化科之处，声名远播，才华外显。' },
    { label: '化忌', star: sihua.ji, meaning: '主阻碍、困扰、需要收敛之处。化忌之处，多有不顺，须加倍努力。' },
  ];

  for (const { label, star, meaning } of items) {
    if (star) {
      lines.push(`${star}${label}：${meaning}`);
    }
  }

  return lines.join('\n');
}

// ----- 三方四正分析 -----
function interpretSanFang(mingIdx: number, chart: ChartData): string {
  const lines: string[] = [];
  lines.push('【三方四正】');

  const duiGong = (mingIdx + 6) % 12;
  const sanFang1 = (mingIdx + 4) % 12;
  const sanFang2 = (mingIdx - 4 + 12) % 12;

  const duiStars = chart.starsAtPos[duiGong];
  lines.push(`- 对宫（${chart.gongs[duiGong].name} ${DI_ZHI[duiGong]}）：${(duiStars?.main || []).join('、') || '无主星'}`);

  const sf1Stars = chart.starsAtPos[sanFang1];
  lines.push(`- 三方一（${chart.gongs[sanFang1].name} ${DI_ZHI[sanFang1]}）：${(sf1Stars?.main || []).join('、') || '无主星'}`);

  const sf2Stars = chart.starsAtPos[sanFang2];
  lines.push(`- 三方二（${chart.gongs[sanFang2].name} ${DI_ZHI[sanFang2]}）：${(sf2Stars?.main || []).join('、') || '无主星'}`);

  return lines.join('\n');
}

// ============================================================
// 主入口：生成完整离线解读
// ============================================================
export function generateInterpretation(chart: ChartData): string {
  const lines: string[] = [];
  const { lunar, yearGan, yearZhi, monthZhi, hourZhi, mingGongIndex, shenGongIndex, juShu, gender, shengxiao, sihua, gongs, starsAtPos } = chart;

  // 一、总论
  lines.push('══════ 紫微斗数命盘解读 ══════');
  lines.push('');
  const baZi = `${TIAN_GAN[yearGan]}${DI_ZHI[yearZhi]} ${TIAN_GAN[lunar.monthGanIndex]}${DI_ZHI[monthZhi]} ${TIAN_GAN[lunar.dayGanIndex]}${DI_ZHI[(lunar as any).dayZhiIndex ?? 0]} ${TIAN_GAN[lunar.hourGanIndex]}${DI_ZHI[hourZhi]}`;
  lines.push(`八字：${baZi}　性别：${gender === '男' ? '乾造' : '坤造'}　生肖：${shengxiao}`);
  lines.push(`命宫：${gongs[mingGongIndex].name}（${DI_ZHI[mingGongIndex]}）　身宫：${gongs[shenGongIndex].name}（${DI_ZHI[shenGongIndex]}）`);
  lines.push(`五行局：${JU_MAP[juShu] || juShu}　生年年干：${TIAN_GAN[yearGan]}`);

  // 格局
  const patterns = detectPatterns(chart);
  if (patterns.length > 0) {
    lines.push('');
    lines.push('【格局】');
    patterns.forEach(p => lines.push(`  ★ ${p.name}（${p.level}）：${p.desc}`));
  }

  // 二、十二宫逐一分析
  lines.push('');
  lines.push('────────────────────────────');
  lines.push('【十二宫星曜分析】');
  for (let i = 0; i < 12; i++) {
    const g = gongs[i];
    const stars = starsAtPos[i];
    lines.push('');
    lines.push(interpretPalaceStars(g.name, stars?.main || [], stars?.aux || [], DI_ZHI[g.dzIndex]));
  }

  // 三、三方四正
  lines.push('');
  lines.push('────────────────────────────');
  lines.push(interpretSanFang(mingGongIndex, chart));

  // 四、四化
  lines.push('');
  lines.push('────────────────────────────');
  lines.push(interpretSiHua(sihua, yearGan));

  // 五、关键宫位
  lines.push('');
  lines.push('────────────────────────────');
  lines.push('【关键宫位提示】');
  lines.push(`- 命宫（${gongs[mingGongIndex].name}）：一生运势的根本所在。`);
  lines.push(`- 财帛宫（${DI_ZHI[(mingGongIndex + 4) % 12]}）：财运好坏看此宫。`);
  lines.push(`- 事业宫（${DI_ZHI[(mingGongIndex + 8) % 12]}）：事业发展看此宫。`);
  lines.push(`- 夫妻宫（${DI_ZHI[(mingGongIndex + 2) % 12]}）：婚姻状况看此宫。`);
  lines.push(`- 福德宫（${DI_ZHI[(mingGongIndex + 10) % 12]}）：精神世界、晚年运势。`);

  // 六、总结
  lines.push('');
  lines.push('═══════════════════════════════');
  lines.push('以上解读由紫微斗数排盘系统自动生成，供参考研究。命理之学，贵在修身。知命而不认命，方为上策。');
  lines.push('═══════════════════════════════');

  return lines.join('\n');
}
