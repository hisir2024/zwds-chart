// 紫微斗数 — 详细离线解读引擎 + 格局检测
import { STAR_DICT } from './dictionary';
import { TIAN_GAN, DI_ZHI, GONG_NAMES, JU_MAP, isStarStrong } from './stars';
import type { ChartData } from './calculate';

// ============================================================
// 格局检测
// ============================================================
interface Pattern {
  name: string;
  level: '上格' | '中格' | '下格' | '特殊';
  desc: string;
}

export function detectPatterns(chart: ChartData): Pattern[] {
  const patterns: Pattern[] = [];
  const { starsAtPos, mingGongIndex } = chart;

  const mingStars = [...(starsAtPos[mingGongIndex]?.main || []), ...(starsAtPos[mingGongIndex]?.aux || [])];
  const hasStar = (names: string[]) => names.some(n => mingStars.some(s => s.startsWith(n)));
  const hasAux = (name: string) => mingStars.some(s => s.startsWith(name));

  // --- 紫微系格局 ---
  if (hasStar(['紫微']) && hasStar(['天府'])) {
    patterns.push({ name: '紫府同宫', level: '上格', desc: '紫微天府同守命宫于寅申二宫。紫微为北斗帝星，天府为南斗帝星，二帝同宫，气象万千。命主天生具备领导格局，富贵双全，一生衣食无忧。为人气度恢宏，处事圆融，既有权柄又不失包容。得此格者宜走仕途、大型企业管理之路，不宜屈居人下。' });
  }
  if (hasStar(['紫微']) && (hasAux('左辅') || hasAux('右弼'))) {
    patterns.push({ name: '辅弼拱主', level: '上格', desc: '紫微得左辅右弼拱照，如帝王得贤臣辅佐。命主不仅自身有能力，更懂得选贤任能，身边常有得力助手。遇事有人帮衬，困境有人解围。此为君臣相得之象，权威在握而不孤。' });
  }
  if (hasStar(['紫微']) && !hasAux('左辅') && !hasAux('右弼') && !hasStar(['天府'])) {
    patterns.push({ name: '孤君在野', level: '下格', desc: '紫微独坐命宫，无辅弼、天府拱照，为"孤君在野"之格。命主虽有帝王之志，却缺乏得力助手。性格刚愎自用，处事独断，难以听进他人意见。事业上虽有能力，却往往孤军奋战，事倍功半。化解之道在于学会授权、广纳贤言。' });
  }
  if (hasStar(['紫微']) && (hasStar(['天相']) || hasStar(['武曲']) || hasStar(['廉贞']))) {
    patterns.push({ name: '君臣庆会', level: '上格', desc: '紫微得将星（武曲、廉贞、天相）辅佐，君臣各安其位。命主既有宏观格局，又有执行力，可堪大任。事业上有得力班底，谋事有成，是成就一番事业的上佳之格。' });
  }

  // --- 日月格局 ---
  if (hasStar(['太阴']) && (mingGongIndex === 9 || mingGongIndex === 10 || mingGongIndex === 11 || mingGongIndex === 0 || mingGongIndex === 1)) {
    patterns.push({ name: '月朗天门', level: '上格', desc: '太阴入庙守命于亥子丑宫（太阴旺地）。太阴为月之精华，入庙则光辉显耀，如皓月当空。命主心思细腻，善解人意，财运亨通（太阴化气为富）。一生富足安乐，女命尤贵，有大家闺秀之气。为人温和却有主见，外柔内刚。' });
  }
  if (hasStar(['太阳']) && mingGongIndex === 3) {
    patterns.push({ name: '日照雷门', level: '上格', desc: '太阳坐卯宫（日出扶桑之位），为旭日东升之象。命主光明磊落，热情大方，事业如朝阳初升，蒸蒸日上。声名远播，贵人运强，是天生适合出头露面的格局。早年即能崭露头角，中年后更上层楼。' });
  }
  if (hasStar(['太阳']) && mingGongIndex === 5) {
    patterns.push({ name: '日丽中天', level: '上格', desc: '太阳坐午宫，如日中天，光芒万丈。此格为太阳最旺之位，命主事业鼎盛，声名显赫，贵人多助。但须注意"日中则昃"，过于耀眼则容易招妒。宜知进退，懂得与人分享光芒。' });
  }
  if (hasStar(['太阳']) && hasStar(['太阴'])) {
    patterns.push({ name: '日月并明', level: '上格', desc: '太阳太阴同守命宫或对拱，日月交汇，阴阳调和。命主聪慧过人，既有太阳的热情魄力，又有太阴的细腻周全，是为文武双全、刚柔并济之格。贵人运极强，一生机遇不断。' });
  }

  // --- 贪狼格局 ---
  if (hasStar(['贪狼']) && (hasAux('火星') || hasAux('铃星'))) {
    patterns.push({ name: '火贪格/铃贪格', level: '上格', desc: '贪狼逢火铃二星，为斗数中最著名的"暴发格"。贪狼为欲望之星，得火铃激发，如干柴遇烈火，一发而不可收拾。命主在某一领域可能突然崛起，横发致富。但此格特征是"横发横破"，来得快去得也快，务必在暴发后及时收手、守住果实，不可贪得无厌。' });
  }
  if (hasStar(['贪狼']) && mingGongIndex === 2) {
    patterns.push({ name: '雄宿乾元', level: '上格', desc: '贪狼独坐寅宫（乾元之地），为"雄宿乾元"格。贪狼在寅宫独坐，去其浮华而得其精华。命主志向远大，才华内敛，将欲望转化为积极向上的事业心，一生事业根基扎实，非虚浮之富。' });
  }

  // --- 武曲/七杀/破军格局 ---
  if (hasStar(['武曲']) && hasStar(['天相'])) {
    patterns.push({ name: '将相得位', level: '上格', desc: '武曲（将星）天相（宰相）同宫，刚柔并济，文武双全。命主既有武曲的刚毅果断和理财能力，又有天相的协调公正。极适合军公教、大型企业、体制内发展，既有魄力又有分寸。' });
  }
  if (hasStar(['七杀']) && (mingGongIndex === 2 || mingGongIndex === 8)) {
    patterns.push({ name: '七杀朝斗', level: '中格', desc: '七杀坐寅或申宫，朝拱北斗。七杀为将星，主果决勇猛、敢作敢为。命主有将帅之气，可成大事，但一生起伏较大，多历波折而后成。寅宫七杀较申宫更为稳实，申宫七杀则变动更多。宜从事军警、外科、创业等需要胆识的事业。' });
  }
  if (hasStar(['天府']) && hasStar(['天相'])) {
    patterns.push({ name: '府相朝垣', level: '中格', desc: '天府天相同宫或相会。天府为南斗帝星主包容，天相为宰相星主公正。命主处事周全，秉公守正，是优秀的组织者和管理者。能担大任，但较保守，宜守成而不宜冒险开创。' });
  }

  // --- 机月/巨日格局 ---
  if (hasStar(['天机']) && hasStar(['天梁'])) {
    patterns.push({ name: '善荫朝纲', level: '中格', desc: '天机（智慧）天梁（福荫）同宫。天机善谋略，天梁仁厚长者之风。命主智慧与仁德兼具，善策划、善分析、善教导。适合学术研究、咨询、教育、医疗、慈善等既需要智慧又需要仁心的行业。' });
  }
  if (hasStar(['巨门']) && hasStar(['太阳'])) {
    patterns.push({ name: '巨日同宫', level: '中格', desc: '巨门太阳同宫。巨门为暗曜主口舌是非，得太阳照射则暗气消散。命主口才出众，善于分析辩论。适合法律、教育、传媒、咨询等以口为业的行业。但须注意言语的分寸，避免因口舌惹祸。' });
  }
  if (hasStar(['巨门']) && (mingGongIndex === 4 || mingGongIndex === 5)) {
    patterns.push({ name: '石中隐玉', level: '中格', desc: '巨门独坐巳或午宫。巨门暗星入火旺之地，如玉在石中，才华深藏不露。命主内在才华出众，但需要合适的机遇和平台方能大放异彩。早年可能默默无闻，中年后得遇贵人赏识，一鸣惊人。' });
  }

  // --- 辅星格局 ---
  if (hasAux('文昌') && hasAux('文曲')) {
    patterns.push({ name: '文星拱命', level: '中格', desc: '文昌文曲同守命宫。文昌主文采学术，文曲主才艺口才。命主文采风流，才艺双全，考试运极佳。适合学术研究、文学创作、艺术表演。但须注意不可恃才傲物，脚踏实地方能成才。' });
  }
  if (hasAux('天魁') && hasAux('天钺')) {
    patterns.push({ name: '魁钺夹命', level: '上格', desc: '天魁天钺同守命宫，为天乙贵人、玉堂贵人双拱。命主一生贵人运极旺，遇难有救，逢凶化吉。考试、升迁、求职方面有得天独厚的运气。但贵人之助终究是外力，自身仍需努力。' });
  }
  if (hasAux('禄存') && hasAux('天马')) {
    patterns.push({ name: '禄马交驰', level: '上格', desc: '命宫禄存天马同宫，为"禄马交驰"格。禄存主财富积蓄，天马主动中求财。命主越跑越发，动中得财。极适合交通、物流、贸易、外贸、旅游业。不宜守成，须多走动方能财富滚滚。' });
  }

  // --- 凶格 ---
  if (hasStar(['廉贞']) && (hasAux('擎羊') || hasAux('陀罗'))) {
    patterns.push({ name: '刑囚夹印', level: '下格', desc: '廉贞（化气为囚）逢羊陀，为"刑囚夹印"。命主须注意官非口舌、法律纠纷和意外伤害。此格也暗示命主容易因刚烈而惹祸，宜修身养性，遇事三思而行，避免与人正面冲突。' });
  }

  // 全局检测：四煞会聚
  const allStars = mingStars.join(' ');
  const shaCount = ['擎羊','陀罗','火星','铃星'].filter(s => allStars.includes(s)).length;
  if (shaCount >= 3) {
    patterns.push({ name: '三煞聚命', level: '下格', desc: '命宫有三颗以上煞星会聚，主一生波折较多，须比常人更加坚韧小心。但也因此磨练出超强的抗压能力，历经磨难后反而能成就大事。关键在于修身养性，以柔克刚。' });
  }

  return patterns;
}

// ============================================================
// 庙旺落陷中文描述
// ============================================================
function strengthDesc(starName: string, dzIdx: number): string {
  const pure = starName.replace(/化./, '');
  const strong = isStarStrong(pure, dzIdx);
  if (strong) return '（庙旺，星曜有力）';
  return '（落陷，星曜力量减弱，须借吉星补助）';
}

// ============================================================
// 宫位功能说明
// ============================================================
const PALACE_GUIDE: Record<string, string> = {
  '命宫': '命宫为十二宫之枢纽，统摄一生吉凶祸福。观命宫可知命主性格底色、天赋禀性、一生运势基调。',
  '兄弟': '兄弟宫观手足缘份、与同辈的人际关系、合作运。也反映命主在团体中的相处模式。',
  '夫妻': '夫妻宫观婚姻状况、配偶品性、感情运势。对已婚者观婚姻质量，对未婚者观姻缘早晚及配偶特征。',
  '子女': '子女宫观子息缘分、与晚辈关系、性生活、创作才华。也反映命主的享乐方式和创造力。',
  '财帛': '财帛宫观一生财运好坏、收入来源、理财方式、消费习惯。注意：财帛宫看赚钱能力，非看财富总量。',
  '疾厄': '疾厄宫观身体健康状况、易患疾病类型、意外灾厄。也反映命主的抗压能力和危机处理方式。',
  '迁移': '迁移宫观外出运、远行吉凶、社会形象、在外际遇。迁移宫为命宫之对宫，与命宫互为表里。',
  '交友': '交友宫观朋友、下属、合作伙伴的质量。也反映命主在社交圈中的位置和人际关系的吉凶。',
  '事业': '事业宫观事业发展方向、工作性质、职场运势。也反映命主的事业心和成就动机。',
  '田宅': '田宅宫观家宅状况、房产运、家庭关系、晚年生活。也反映命主的归属感和安全感。',
  '福德': '福德宫观精神世界、内心满足感、晚年福气、享福能力。此宫好则一生内心安乐，此宫差则纵有富贵也难开心。',
  '父母': '父母宫观与父母缘份、长辈缘、上司关系。也反映命主的学历、文书运和外在形象。',
};

// ============================================================
// 针对不同宫位的星曜解读角度
// ============================================================
function palaceStarInterpret(starName: string, palaceName: string, dzIdx: number): string {
  const pure = starName.replace(/化./, '');
  const entry = STAR_DICT[pure];
  if (!entry) return `${starName}：资料暂缺。`;

  const strength = strengthDesc(starName, dzIdx);
  const base = entry.desc;

  // 根据宫位不同，附加不同的解读角度
  const angleMap: Record<string, Record<string, string>> = {
    '紫微': {
      '命宫': '紫微坐命，有帝王之气度，自尊心强，好面子，有领导才能。一生多贵人，但须注意"高处不胜寒"，宜谦虚待人。',
      '夫妻': '紫微在夫妻宫，配偶有贵气，但配偶性格强势，须注意夫妻间的权力平衡。紫微在夫妻宫也暗示婚姻中有"君臣"关系，宜以尊重相待。',
      '事业': '紫微在事业宫，事业有领导机会，适宜管理岗位。有独当一面的能力，不宜久居人下。',
      '财帛': '紫微在财帛宫，财运有贵气，钱来得体面。但紫微好面子，花钱也大方，须注意开源节流。',
    },
    '天机': {
      '命宫': '天机坐命，思维敏捷，善于谋略策划，口才好。但心性多变，事业多变动。宜从事脑力工作。',
      '夫妻': '天机在夫妻宫，配偶聪明机敏，但夫妻关系可能多有变动。天机属木主变动，婚姻需用心经营以稳为主。',
      '事业': '天机在事业宫，事业多有变动和转机，适合策划、咨询、IT等需动脑的行业。不宜从事一成不变的工作。',
    },
    '太阳': {
      '命宫': '太阳坐命，光明磊落，热情大方，乐于助人，事业心强。庙旺则事业有成，落陷则宜辅佐他人。',
      '夫妻': '太阳在夫妻宫，配偶热情开朗，社交能力强。但太阳过旺则配偶可能太忙、聚少离多。女命太阳在夫妻宫，配偶有大男子主义倾向。',
      '事业': '太阳在事业宫，事业光明正大，适合出头露面的工作。仕途顺利，声名在外。',
    },
    '武曲': {
      '命宫': '武曲坐命，刚毅果断，执行力强，重信义，善理财。适合金融、军警等需要纪律和决断的行业。',
      '财帛': '武曲在财帛宫为得位，理财能力强，善于积累财富。适合从事金融、会计、投资等行业。武曲化禄在此，财源滚滚。',
      '事业': '武曲在事业宫，事业心强，执行力出众。适合需要毅力和纪律的行业。',
    },
    '天同': {
      '命宫': '天同坐命，温和善良，知足常乐，有艺术天赋。一生少劳碌有福气，但须防懒散。',
      '福德': '天同在福德宫为得位，内心满足，知足常乐，晚年安逸享福。精神世界丰富，善于享受生活。',
    },
    '廉贞': {
      '命宫': '廉贞坐命，正直廉洁，才华横溢，异性缘佳。适合法律、监察、文艺等行业。须注意感情困扰和官非。',
      '事业': '廉贞在事业宫，事业上有正义感，适合法律、纪检、审计等行业。但也暗示职场中可能有是非纠纷。',
    },
    '天府': {
      '命宫': '天府坐命，稳重包容，忠厚可靠，善于守成。一生衣食无忧，是可靠的合作伙伴。',
      '财帛': '天府在财帛宫，财运稳定，善于理财守财。天府为库，钱财入库，不轻易流失。',
      '田宅': '天府在田宅宫，家宅安稳，房产运佳。天府守田宅，家有积蓄。',
    },
    '太阴': {
      '命宫': '太阴坐命，温柔细腻，善解人意，注重生活品质。女命尤贵，有贵妇之相。善理财但不激进。',
      '夫妻': '太阴在夫妻宫，配偶温柔体贴。男命娶妻贤淑貌美，女命则配偶细腻懂得照顾人。',
      '田宅': '太阴在田宅宫，家宅温馨，房产运佳。太阴主富，田宅为库，易积累房产。',
    },
    '贪狼': {
      '命宫': '贪狼坐命，多才多艺，善于交际，欲望强烈。一生机遇多但需善加把握。见火铃主暴发。',
      '夫妻': '贪狼在夫妻宫，配偶有魅力，但桃花也多。贪狼为桃花星，婚姻需注意第三者介入。',
      '事业': '贪狼在事业宫，适合外交、演艺、销售、美业等与人打交道的工作。机遇多而需善择。',
    },
    '巨门': {
      '命宫': '巨门坐命，口才好，善分析辩论，心思深沉。须注意口舌是非，避免因直言得咎。',
      '夫妻': '巨门在夫妻宫，夫妻间沟通多但也易有口舌争执。巨门化忌在此，夫妻争吵频繁。',
    },
    '天相': {
      '命宫': '天相坐命，温和公正，擅长协调辅助。是做副手、秘书、助理的不二人选。一生多贵人相助。',
      '事业': '天相在事业宫，职场中人际关系良好，善于协调。适合行政、人事、秘书等工作。',
    },
    '天梁': {
      '命宫': '天梁坐命，仁厚稳重，有长者风范，遇难有救，常有贵人相助。适合医疗、教育、慈善行业。',
      '福德': '天梁在福德宫，晚年福气深厚，内心安宁。天梁为寿星，在此主长寿安康。',
    },
    '七杀': {
      '命宫': '七杀坐命，果敢勇猛，有冒险精神，敢作敢为。一生起伏较大，独立创业多成多败。',
      '事业': '七杀在事业宫，事业上敢于拼搏，适合军警、外科、创业等需要胆识的行业。',
    },
    '破军': {
      '命宫': '破军坐命，勇于创新，敢于打破常规。一生多有重大变动，不按常理出牌。',
      '事业': '破军在事业宫，事业上常有变革和转型。适合创业、研发、改革性工作。',
    },
  };

  const specific = angleMap[pure]?.[palaceName];
  if (specific) return `${starName}${strength}：${specific}`;
  return `${starName}${strength}：${base}`;
}

// ============================================================
// 每宫详细解读
// ============================================================
function interpretPalaceFull(palaceName: string, mainStars: string[], auxStars: string[], dz: string, dzIdx: number, chart: ChartData): string {
  const lines: string[] = [];
  lines.push(`\n┌─ ${palaceName}（${dz}）───`);
  lines.push(`│ ${PALACE_GUIDE[palaceName] || ''}`);

  const allStars = [...mainStars, ...auxStars];
  if (allStars.length === 0) {
    const duiIdx = (dzIdx + 6) % 12;
    const duiGong = chart.gongs.find(g => g.dzIndex === duiIdx);
    lines.push(`│ 此宫无主星，为"空宫"。需借对宫（${duiGong?.name || DI_ZHI[duiIdx]}）星曜及力量来参考判断。空宫不代表运势差，而意味着此领域的人生事项受外部环境影响较大，自己掌控力较弱，宜顺势而为。`);
    return lines.join('\n');
  }

  for (const s of allStars) {
    lines.push(`│`);
    lines.push(`│ ${palaceStarInterpret(s, palaceName, dzIdx)}`);
  }

  // 如果此宫有主星且为关键宫位，加一段综合提示
  const keyHints: Record<string, string> = {
    '命宫': '│ 命宫星曜为一生运势之根基。以上星曜组合，决定了命主的核心性格底色与人生大方向。',
    '财帛': '│ 财帛宫星曜反映赚钱能力和理财方式。注意此宫与命宫、事业宫的三方关系——赚钱能力与个人性格、事业选择密不可分。',
    '事业': '│ 事业宫反映适合的工作性质和职场运势。结合命宫主星来看，可判断命主适合独立创业还是辅佐他人。',
    '夫妻': '│ 夫妻宫观婚姻质量。若此宫星曜组合不佳，不必过于忧虑——晚婚、择吉日、双方互相体谅可化解诸多不利。',
    '福德': '│ 福德宫为"果报宫"，观晚年福气与内心满足感。此宫好，纵使财帛事业平常，也能内心安乐。',
  };
  if (keyHints[palaceName]) lines.push(`│ ${keyHints[palaceName]}`);

  return lines.join('\n');
}

// ============================================================
// 四化深度解读
// ============================================================
function interpretSiHuaFull(sihua: ChartData['sihua'], yearGan: number, chart: ChartData): string {
  const lines: string[] = [];
  lines.push('\n┌─ 四化深解 ───');
  lines.push(`│ 生年天干：${TIAN_GAN[yearGan]}，四化以此年干为基准而排定，管一生大局。`);
  lines.push('│');

  const items: { label: string; star: string | undefined; icon: string; nature: string; meaning: string }[] = [
    { label: '化禄', star: sihua.lu, icon: '禄', nature: '主财禄、机遇、人缘、顺遂。化禄是四化中最吉的一化，所到之处如春风化雨，财源广进，做事顺利。化禄在何宫，福气就落在对应的领域。', meaning: '' },
    { label: '化权', star: sihua.quan, icon: '权', nature: '主权力、掌控、专业性、领导力。化权之处需要亲力亲为，主动争取，不可被动等待。化权在何宫，命主在该领域就有掌控欲和领导力。', meaning: '' },
    { label: '化科', star: sihua.ke, icon: '科', nature: '主名声、才华、考试运、文采。化科不直接生财，但名气可带来财源。化科在何宫，命主在该领域声名远播、才华外显。', meaning: '' },
    { label: '化忌', star: sihua.ji, icon: '忌', nature: '主阻碍、困扰、收敛、执着。化忌为四化之末，所到之处多有波折。但化忌并非全凶——它让人在该领域更加专注和执着，从而在磨难中成长。', meaning: '' },
  ];

  for (const { label, star, icon, nature } of items) {
    if (!star) continue;
    // 找到此星所在的宫位
    let gongName = '';
    for (const g of chart.gongs) {
      if (chart.starsAtPos[g.dzIndex]?.main?.includes(star) || chart.starsAtPos[g.dzIndex]?.aux?.some(a => a.includes(label))) {
        gongName = g.name;
        break;
      }
    }
    lines.push(`│ ★ ${star}化${icon}（落${gongName || '—'}）`);
    lines.push(`│   ${nature}`);
    if (gongName) {
      lines.push(`│   ${star}在${gongName}化${icon}，此领域为命主人生的重要着力点。`);
    }
    lines.push('│');
  }

  return lines.join('\n');
}

// ============================================================
// 大限解读
// ============================================================
function interpretDaXian(daxian: ChartData['daxian'], chart: ChartData): string {
  if (!daxian || daxian.length === 0) return '';
  const lines: string[] = [];
  lines.push('\n┌─ 大限走势 ───');
  lines.push('│ 大限十年一转，每一阶段各有其主题与功课。');
  lines.push('│');

  for (let i = 0; i < daxian.length; i++) {
    const dx = daxian[i];
    const dzIdx = DI_ZHI.indexOf(dx.palace);
    const gong = chart.gongs.find(g => DI_ZHI[g.dzIndex] === dx.palace);
    const stars = chart.starsAtPos[dzIdx];
    const mainStars = stars?.main?.join('、') || '无主星';
    const stage = i === 0 ? '命垣初立，性格养成期' :
                  i === 1 ? '少年运，求学成长阶段' :
                  i === 2 ? '青年运，踏入社会初期' :
                  i === 3 ? '壮年运，事业奠基期' :
                  i === 4 ? '壮年运，事业发展期' :
                  i === 5 ? '中年运，人生巅峰期' :
                  i === 6 ? '中年运，转型调整期' :
                  i === 7 ? '中晚运，收获守成期' :
                  i === 8 ? '晚运前期，退而不休' :
                  i === 9 ? '晚运，享受人生' :
                  i === 10 ? '晚运，智慧传承期' : '暮年运，颐养天年';
    lines.push(`│ ${dx.startAge}–${dx.endAge}岁（大限在${gong?.name || ''}宫·${dx.palace}）：${stage}。限内主星：${mainStars}。`);
  }

  return lines.join('\n');
}

// ============================================================
// 主治建议
// ============================================================
function generateAdvice(chart: ChartData): string {
  const lines: string[] = [];
  lines.push('\n┌─ 修身指南 ───');

  const mingStars = chart.starsAtPos[chart.mingGongIndex]?.main || [];
  const mingStr = mingStars.join(' ');
  const auxStr = (chart.starsAtPos[chart.mingGongIndex]?.aux || []).join(' ');

  const advices: string[] = [];

  if (mingStr.includes('紫微')) {
    advices.push('紫微坐命，领袖气质天成。建议：每日三省——"今日是否倾听他人意见？是否独断专行？是否站在他人立场思考？"记日记对照，谦受益，满招损。');
  }
  if (mingStr.includes('天机')) {
    advices.push('天机善谋而多变。建议：选定一个方向深耕至少三年，不要频繁变换跑道。每月为自己设定一个"不变"的小目标，锻炼定力。');
  }
  if (mingStr.includes('太阳')) {
    advices.push('太阳博爱普照，但须注意"过犹不及"。建议：学会拒绝，每周至少留一天独处时间。施比受更有福，但前提是先照顾好自己。');
  }
  if (mingStr.includes('武曲')) {
    advices.push('武曲刚毅果决。建议：练习"缓三秒"——做决定前默数三秒，尤其是涉及人际关系的决定。刚强之外，学会柔软的力量。');
  }
  if (mingStr.includes('天同')) {
    advices.push('天同知足有福，但易懒散。建议：每日制定"最小行动清单"（不超过三件事），完成后奖励自己。积跬步以至千里。');
  }
  if (mingStr.includes('廉贞')) {
    advices.push('廉贞正直敏感。建议：遇到不平事先深呼吸十次再发言。培养一个能释放情绪的爱好（如书法、跑步），避免情绪积压。');
  }
  if (mingStr.includes('贪狼')) {
    advices.push('贪狼多欲多才。建议：欲望是双刃剑——每月设定一个"节欲日"，不购物、不刷手机、饮食清淡。学会与欲望共存而非被欲望控制。');
  }
  if (mingStr.includes('巨门')) {
    advices.push('巨门口才好但易惹是非。建议：开口前问自己三个问题——"这话必要吗？这话真实吗？这话善意吗？"每日修炼"止语"十分钟。');
  }
  if (mingStr.includes('太阴')) {
    advices.push('太阴细腻善感。建议：培养"日光习惯"——每天早晨晒十分钟太阳，让阳气驱散思虑。心情低落时即刻出门散步，不可闷坐。');
  }

  if (auxStr.includes('擎羊') || auxStr.includes('陀罗')) {
    advices.push('命带羊陀，刚烈之气需以柔克之。建议：练习打坐或瑜伽，每日十分钟。遇争执时，先离开现场冷静半小时再回复。');
  }
  if (auxStr.includes('地空') || auxStr.includes('地劫')) {
    advices.push('命逢空劫，人生多"计划赶不上变化"。建议：凡事留有余地——财务上保留至少半年生活费作为应急金，重要决定不做孤注一掷。');
  }

  // 通用建议补足五条
  if (advices.length < 5) {
    advices.push('每日静坐或冥想十分钟，观察呼吸，不随念转。此为修心之基本功，不因命盘好坏而改。');
    advices.push('每月读一本好书，人物传记尤佳。观他人一生起伏，可对照己身命盘，豁然开朗。');
    advices.push('与家人保持每周至少一次深入交谈——命盘再好，无人分享也是孤芳自赏。');
    advices.push('保持一项持续的体育锻炼，动静结合。紫微斗数讲"阴阳平衡"，身体之阳与精神之阴需同修。');
    advices.push('知命而不认命。命盘如地图，路还需自己走。修心改命，从当下每一念开始。');
  }

  // 只取前五条
  const selected = advices.slice(0, 5);
  selected.forEach((a, i) => lines.push(`│ ${i + 1}. ${a}`));

  return lines.join('\n');
}

// ============================================================
// 主入口
// ============================================================
export function generateInterpretation(chart: ChartData): string {
  const lines: string[] = [];
  const { lunar, yearGan, yearZhi, mingGongIndex, shenGongIndex, juShu, gender, shengxiao, sihua, gongs, starsAtPos } = chart;

  // ═══ 卷首 ═══
  lines.push('╔══════════════════════════════════════╗');
  lines.push('║       紫微斗数 · 先天命盘详解       ║');
  lines.push('╚══════════════════════════════════════╝');

  const baZi = `${TIAN_GAN[yearGan]}${DI_ZHI[yearZhi]} ${TIAN_GAN[lunar.monthGanIndex]}${DI_ZHI[lunar.monthZhiIndex]} ${TIAN_GAN[lunar.dayGanIndex]}${DI_ZHI[lunar.dayZhiIndex ?? 0]} ${TIAN_GAN[lunar.hourGanIndex]}${DI_ZHI[lunar.hourZhiIndex]}`;
  lines.push(`\n八字：${baZi}`);
  lines.push(`性别：${gender === '男' ? '乾造（男命）' : '坤造（女命）'}　　生肖：${shengxiao}`);
  lines.push(`命宫：${gongs[mingGongIndex].name}（${DI_ZHI[mingGongIndex]}）　　身宫：${gongs[shenGongIndex].name}（${DI_ZHI[shenGongIndex]}）`);
  lines.push(`五行局：${JU_MAP[juShu] || juShu}　　生年年干：${TIAN_GAN[yearGan]}`);
  lines.push(`\n说明：身宫为后天努力方向，中年（约35岁）后影响渐显。命宫为先天禀赋，身宫为后天修为，二宫相辅相成。`);

  // ═══ 格局 ═══
  const patterns = detectPatterns(chart);
  if (patterns.length > 0) {
    lines.push('\n┌─ 格局鉴定 ───');
    patterns.forEach(p => {
      lines.push(`│`);
      lines.push(`│ ★ ${p.name}【${p.level}】`);
      lines.push(`│   ${p.desc}`);
    });
  }

  // ═══ 十二宫 ═══
  lines.push('\n\n┌──────────────────────────────────────');
  lines.push('│ 十二宫星曜详析');
  lines.push('└──────────────────────────────────────');
  for (let i = 0; i < 12; i++) {
    const g = gongs[i];
    const stars = starsAtPos[i];
    lines.push(interpretPalaceFull(g.name, stars?.main || [], stars?.aux || [], DI_ZHI[g.dzIndex], g.dzIndex, chart));
  }

  // ═══ 四化 ═══
  lines.push(interpretSiHuaFull(sihua, yearGan, chart));

  // ═══ 大限 ═══
  lines.push(interpretDaXian(chart.daxian, chart));

  // ═══ 修身指南 ═══
  lines.push(generateAdvice(chart));

  // ═══ 结语 ═══
  lines.push('\n┌──────────────────────────────────────');
  lines.push('│');
  lines.push('│ 命理之学，贵在知命而修心。星盘如一面古镜，照见的不是注定的宿命，');
  lines.push('│ 而是你与生俱来的禀赋、课题与可能性。');
  lines.push('│');
  lines.push('│ 吉星不必骄——福气需以德行承载；');
  lines.push('│ 凶星不必惧——磨难正是修心的最好道场。');
  lines.push('│');
  lines.push('│ 愿君以此为鉴，知己知命，行稳致远。');
  lines.push('└──────────────────────────────────────');

  return lines.join('\n');
}
