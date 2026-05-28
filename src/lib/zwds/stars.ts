// 紫微斗数 — 常量与查询表
export const TIAN_GAN = ['甲','乙','丙','丁','戊','己','庚','辛','壬','癸'];
export const DI_ZHI  = ['子','丑','寅','卯','辰','巳','午','未','申','酉','戌','亥'];
export const SHENGXIAO = ['鼠','牛','虎','兔','龙','蛇','马','羊','猴','鸡','狗','猪'];
export const GONG_NAMES = ['命宫','兄弟','夫妻','子女','财帛','疾厄','迁移','交友','事业','田宅','福德','父母'];

export const ZIWEI_STAR_NAMES = ['紫微','天机','太阳','武曲','天同'];
export const TIANFU_STAR_NAMES = ['天府','太阴','贪狼','巨门','天相','天梁','七杀','破军'];

// 四化表（年干→星名）
export const HUA_LU: Record<string,string>   = {'甲':'廉贞','乙':'天机','丙':'天同','丁':'太阴','戊':'贪狼','己':'武曲','庚':'太阳','辛':'巨门','壬':'天梁','癸':'破军'};
export const HUA_QUAN: Record<string,string> = {'甲':'破军','乙':'天梁','丙':'天机','丁':'天同','戊':'太阴','己':'贪狼','庚':'武曲','辛':'太阳','壬':'紫微','癸':'巨门'};
export const HUA_KE: Record<string,string>   = {'甲':'武曲','乙':'紫微','丙':'文昌','丁':'天机','戊':'贪狼','己':'天梁','庚':'太阴','辛':'文曲','壬':'左辅','癸':'太阴'};
export const HUA_JI: Record<string,string>   = {'甲':'太阳','乙':'太阴','丙':'廉贞','丁':'巨门','戊':'天机','己':'文曲','庚':'天同','辛':'文昌','壬':'武曲','癸':'贪狼'};

export const JU_MAP: Record<number,string> = { 2:'水二局', 3:'木三局', 4:'金四局', 5:'土五局', 6:'火六局' };

export const YIN_INDEX = 2;

// 辅星位置函数
export const zuoFu = (lm: number) => (4 + (lm - 1)) % 12;
export const youBi = (lm: number) => (10 - (lm - 1) + 12) % 12;
export const wenChang = (hi: number) => (10 + hi) % 12;
export const wenQu = (hi: number) => (4 - hi + 12) % 12;
export const diKong = (hi: number) => (11 + hi) % 12;
export const diJie = (hi: number) => (11 - hi + 12) % 12;
export const tianKui = (yg: number) => [2,2,4,4,6,6,8,8,0,0][yg];
export const tianYue = (yg: number) => [8,8,10,10,0,0,2,2,4,4][yg];
export const luCun = (yg: number)   => [1,1,3,3,5,5,7,7,9,9][yg];
export const qingYang = (lc: number) => (lc + 1) % 12;
export const tuoLuo = (lc: number)   => (lc - 1 + 12) % 12;
export const huoXing = (yg: number, hi: number) => {
  const m: Record<number,number> = {0:1,1:1,2:5,3:5,4:9,5:9,6:3,7:3,8:7,9:7};
  return (m[yg] + hi) % 12;
};
export const lingXing = (yg: number, hi: number) => {
  const m: Record<number,number> = {0:2,1:2,2:10,3:10,4:9,5:9,6:5,7:5,8:4,9:4};
  return (m[yg] + hi) % 12;
};
export const tianMa = (yg: number) => [8,8,5,5,2,2,11,11,3,3][yg] as number;

// 星曜强弱（庙旺落陷）
export function isStarStrong(starName: string, dzIdx: number): boolean {
  const m: Record<string,number[]> = {
    '紫微':[3,4,5,6,7],'天机':[3,4,5,6],'太阳':[2,3,4,5,6],
    '武曲':[3,4,5,6,7],'天同':[4,5,6,7,8],'廉贞':[2,3,4,5],
    '天府':[2,3,4,5,6,7],'太阴':[9,10,11,0,1],'贪狼':[2,3,4,5],
    '巨门':[3,4,5,6],'天相':[2,3,4,5],'天梁':[3,4,5,6,7],
    '七杀':[2,3,4,5,6],'破军':[2,3,4,5]
  };
  return (m[starName] || []).includes(dzIdx);
}

// 月支对应 年干→月干起始  [甲己,乙庚,丙辛,丁壬,戊癸]
export const MONTH_GAN_STARTS = [2,4,6,8,0];
// 时支对应 日干→时干起始
export const HOUR_GAN_STARTS = [0,2,4,6,8];

// ============================================================
// 命主 / 身主
// ============================================================
export function getMingZhu(mingZhi: number): string {
  const map: Record<number,string> = { 0:'贪狼',1:'巨门',2:'禄存',3:'文曲',4:'廉贞',5:'武曲',6:'破军',7:'武曲',8:'廉贞',9:'文曲',10:'禄存',11:'巨门' };
  return map[mingZhi] || '';
}
export function getShenZhu(yearZhi: number): string {
  const map: Record<number,string> = { 0:'铃星',1:'天相',2:'天梁',3:'天同',4:'文昌',5:'天机',6:'火星',7:'天相',8:'天梁',9:'天同',10:'文昌',11:'天机' };
  return map[yearZhi] || '';
}

// ============================================================
// 十二长生 (五行局 + 性别)
// ============================================================
export const CHANG_SHENG_NAMES = ['长生','沐浴','冠带','临官','帝旺','衰','病','死','墓','绝','胎','养'];

export function getChangSheng(wuxing: number, gender: string): Record<number, string> {
  const seq: Record<number, number[]> = {
    2: [8,9,10,11,0,1,2,3,4,5,6,7], // 水: from 申
    3: [11,0,1,2,3,4,5,6,7,8,9,10], // 木: from 亥
    4: [5,6,7,8,9,10,11,0,1,2,3,4], // 金: from 巳
    5: [8,9,10,11,0,1,2,3,4,5,6,7], // 土: from 申 (same as 水)
    6: [2,3,4,5,6,7,8,9,10,11,0,1], // 火: from 寅
  };
  const order = seq[wuxing] || seq[2];
  const result: Record<number, string> = {};
  if (gender === '男') {
    for (let i = 0; i < 12; i++) result[order[i]] = CHANG_SHENG_NAMES[i];
  } else {
    for (let i = 0; i < 12; i++) result[order[(12 - i) % 12]] = CHANG_SHENG_NAMES[i];
  }
  return result;
}

// ============================================================
// 庙旺7级评分 — 每星每宫
// ============================================================
// +3庙 +2旺 +1地 0利 -1平 -2不得地 -3陷
const MIAO_SCORE: Record<string, number[]> = {
  '紫微':[2,3,-1,2,1,2,3,3,2,2,3,1],
  '天机':[3,-3,1,2,0,-1,3,-3,1,2,-1,0],
  '太阳':[-3,-3,3,3,2,2,3,1,-3,0,-1,-3],
  '武曲':[3,2,1,0,2,3,-1,2,1,0,-1,3],
  '天同':[2,-2,0,3,-1,-1,2,3,2,0,0,-1],
  '廉贞':[-1,0,3,-1,0,0,2,-3,3,-1,0,0],
  '天府':[3,3,3,1,2,2,2,1,1,2,1,2],
  '太阴':[3,3,-2,-3,-3,-3,0,1,1,3,2,2],
  '贪狼':[2,3,-1,1,3,3,-3,-1,1,2,3,2],
  '巨门':[2,-2,3,3,-1,-1,2,2,3,2,-2,-3],
  '天相':[3,3,3,2,-3,-3,1,1,3,2,-3,-2],
  '天梁':[-3,2,3,2,-1,2,3,3,2,-3,3,3],
  '七杀':[2,3,3,2,1,2,3,3,2,3,2,3],
  '破军':[-1,-1,1,-3,2,1,2,-3,-1,-3,1,-1],
  '文昌':[1,3,2,-3,2,1,0,3,2,0,1,0],
  '文曲':[1,2,0,-3,1,2,0,0,3,2,1,0],
  '火星':[-3,-3,3,0,2,1,3,1,2,2,3,3],
  '铃星':[-3,-3,3,0,2,1,3,1,2,2,3,3],
  '擎羊':[3,3,0,2,-3,-3,0,2,0,0,2,0],
  '陀罗':[0,3,3,-3,0,2,0,-3,0,2,0,2],
};

const MIAO_LABEL = ['陷','不得地','平','利','地','旺','庙'];

export function getMiaoLabel(starName: string, dzIdx: number): string {
  const pure = starName.replace(/化./, '').replace(/星$/, '');
  const scores = MIAO_SCORE[pure];
  if (!scores) return '';
  const s = scores[dzIdx] ?? 0;
  if (s === 0) return '';
  return MIAO_LABEL[s + 3];
}

export function getMiaoScore(starName: string, dzIdx: number): number {
  const pure = starName.replace(/化./, '').replace(/星$/, '');
  return MIAO_SCORE[pure]?.[dzIdx] ?? 0;
}

// ============================================================
// 年支系诸星 (17星)
// ============================================================
export function getYearZhiStars(yearZhi: number): Record<string, number> {
  const table: Record<number, number[]> = {
    0:  [9,6,6,9,3,4,10,2,10,5,7,4,10,9,5,2,8],  // 子
    1:  [8,7,5,10,2,5,9,2,10,1,6,1,9,6,2,11,9],  // 丑
    2:  [7,8,4,11,1,6,8,5,1,9,9,10,8,3,11,8,10],  // 寅
    3:  [6,9,3,0,0,7,7,5,1,5,8,7,7,0,8,5,5],     // 卯
    4:  [5,10,2,1,11,8,6,5,1,1,11,4,6,9,5,2,6],   // 辰
    5:  [4,11,1,2,10,9,5,8,4,9,10,1,5,6,2,11,7],   // 巳
    6:  [3,0,0,3,9,10,4,8,4,5,1,10,4,3,11,8,2],     // 午
    7:  [2,1,11,4,8,11,3,8,4,1,0,7,3,0,8,5,3],      // 未
    8:  [1,2,10,5,7,0,2,11,7,9,3,4,2,9,5,2,4],     // 申
    9:  [0,3,9,6,6,1,1,11,7,5,2,1,1,6,2,11,11],     // 酉
    10: [11,4,8,7,5,2,0,11,7,1,5,10,0,3,11,8,0],    // 戌
    11: [10,5,7,8,4,3,11,2,10,9,4,7,11,0,8,5,1],    // 亥
  };
  const names = ['天喜','天虚','天哭','天德','红鸾','龙池','凤阁','孤辰','寡宿','破碎','大耗','华盖','解神','咸池','劫杀','天马','蜚廉'];
  const result: Record<string, number> = {};
  const row = table[yearZhi] || table[0];
  names.forEach((n, i) => result[n] = row[i]);
  return result;
}

// ============================================================
// 年干系补充星
// ============================================================
export function getYearGanExtraStars(yearGan: number): Record<string, number> {
  const table: Record<number, number[]> = {
    0: [9,7,8], // 甲: 天福酉, 天官未, 副空亡酉(正空亡申)
    1: [8,4,5], // 乙
    2: [0,5,5], // 丙
    3: [11,2,2], // 丁
    4: [3,3,1], // 戊
    5: [2,9,8], // 己
    6: [6,11,6], // 庚
    7: [5,9,4], // 辛
    8: [6,10,3], // 壬
    9: [5,6,1], // 癸
  };
  const names = ['天福','天官','副空亡'];
  const result: Record<string, number> = {};
  const row = table[yearGan] || table[0];
  names.forEach((n, i) => result[n] = row[i]);
  return result;
}

// 正空亡
export function getZhengKongWang(yearGan: number): number {
  return [8,7,4,3,0,9,6,5,2,1][yearGan] ?? 0;
}

// ============================================================
// 月系补充星 (阴煞, 天刑, 天姚, 天月, 天巫)
// ============================================================
export function getMonthExtraStars(monthZhi: number): Record<string, number> {
  const yinSha   = [2,0,10,8,6,4,2,0,10,8,6,4][monthZhi];
  const tianXing = [9,10,11,0,1,2,3,4,5,6,7,8][monthZhi];
  const tianYao  = [1,2,3,4,5,6,7,8,9,10,11,0][monthZhi];
  const tianYue  = [10,5,4,2,7,3,11,7,2,6,10,2][monthZhi];
  const tianWu   = [5,8,11,2,5,8,11,2,5,8,11,2][monthZhi];
  return { '阴煞':yinSha,'天刑':tianXing,'天姚':tianYao,'天月':tianYue,'天巫':tianWu };
}

// ============================================================
// 时系补充星 (台辅, 封诰)
// ============================================================
export function getHourExtraStars(hourZhi: number): Record<string, number> {
  const taiFu = [6,7,8,9,10,11,0,1,2,3,4,5][hourZhi];
  const fengGao = [2,3,4,5,6,7,8,9,10,11,0,1][hourZhi];
  return { '台辅':taiFu,'封诰':fengGao };
}

// ============================================================
// 其他星 (三台, 八座, 天贵, 恩光, 天才, 天寿)
// ============================================================
export function getOtherStars(zuoFuIdx: number, youBiIdx: number, wenChangIdx: number, wenQuIdx: number, lunarDay: number, yearZhi: number, mingIdx: number, shenIdx: number): Record<string, number> {
  // 三台: 从左辅起初一顺数至生日
  const sanTai = (zuoFuIdx + lunarDay - 1) % 12;
  // 八座: 从右弼起初一逆数至生日
  const baZuo = (youBiIdx - (lunarDay - 1) + 120) % 12;
  // 恩光: 从文昌起初一顺数至生日再退一
  const enGuang = (wenChangIdx + lunarDay - 2 + 12) % 12;
  // 天贵: 从文曲起初一顺数至生日再退一
  const tianGui = (wenQuIdx + lunarDay - 2 + 12) % 12;
  // 天才: 从命宫起子年顺数至年支
  const zhiArr = [0,1,2,3,4,5,6,7,8,9,10,11];
  const mingOrder = zhiArr.slice(mingIdx).concat(zhiArr.slice(0, mingIdx));
  const tianCai = mingOrder[yearZhi];
  // 天寿: 从身宫起子年顺数至年支
  const shenOrder = zhiArr.slice(shenIdx).concat(zhiArr.slice(0, shenIdx));
  const tianShou = shenOrder[yearZhi];
  return { '三台':sanTai,'八座':baZuo,'恩光':enGuang,'天贵':tianGui,'天才':tianCai,'天寿':tianShou };
}

// ============================================================
// 小限
// ============================================================
export function getXiaoXian(yearZhi: number, gender: string): Record<number, number[]> {
  const startMap: Record<number, number> = { 2:4, 6:4, 10:4, 8:10, 0:10, 4:10, 11:1, 3:1, 7:1, 5:7, 9:7, 1:7 };
  const startIdx = startMap[yearZhi] ?? 4;
  const zhiArr = [0,1,2,3,4,5,6,7,8,9,10,11];
  const orderStart = zhiArr.slice(startIdx).concat(zhiArr.slice(0, startIdx));
  let order = gender === '男' ? orderStart : [orderStart[0], ...orderStart.slice(1).reverse()];
  const result: Record<number, number[]> = {};
  for (let i = 0; i < 12; i++) {
    const dz = order[i];
    const ages: number[] = [];
    for (let a = 1; a <= 10; a++) ages.push(i * 10 + a);
    result[dz] = ages;
  }
  return result;
}
