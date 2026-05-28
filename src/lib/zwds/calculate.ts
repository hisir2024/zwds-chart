// 紫微斗数 — 核心排盘算法
import { gregorianToLunar, BirthInfo, LunarResult } from './calendar';
import {
  TIAN_GAN, DI_ZHI, SHENGXIAO, GONG_NAMES,
  ZIWEI_STAR_NAMES, TIANFU_STAR_NAMES,
  HUA_LU, HUA_QUAN, HUA_KE, HUA_JI,
  JU_MAP, YIN_INDEX,
  zuoFu, youBi, wenChang, wenQu, diKong, diJie,
  tianKui, tianYue, luCun, qingYang, tuoLuo, huoXing, lingXing, tianMa,
} from './stars';

// ----- 命宫 -----
function calcMingGong(lunarMonth: number, hourZhi: number): number {
  const start = (YIN_INDEX + (lunarMonth - 1)) % 12;
  return (start - hourZhi + 12) % 12;
}

// ----- 身宫 -----
function calcShenGong(lunarMonth: number, hourZhi: number): number {
  const start = (YIN_INDEX + (lunarMonth - 1)) % 12;
  return (start + hourZhi) % 12;
}

// ----- 十二宫（从命宫逆排）-----
function placeTwelveGongs(mingIdx: number) {
  return GONG_NAMES.map((name, i) => ({
    name,
    dzIndex: (mingIdx - i + 12) % 12,
  }));
}

// ----- 五行局 -----
function getJuShu(yearGan: number, yearZhi: number): number {
  const gi = (yearGan * 6 + yearZhi) % 60;
  const g = Math.floor(gi / 2) % 30;
  const ny = Math.floor(g / 6) % 5;
  return [4, 3, 2, 6, 5][ny]; // 金木水火土 → 局数
}

// ----- 紫微星位置 -----
function calcZiWeiZhi(juShu: number, lunarDay: number): number {
  const q = Math.floor(lunarDay / juShu);
  const r = lunarDay % juShu;
  if (r === 0) return (YIN_INDEX + q) % 12;
  return (YIN_INDEX - (q + 1) + 120) % 12;
}

// ----- 紫微系主星（紫微→天机→...→廉贞）-----
function placeZiWeiStars(zwZhi: number) {
  return [
    { name: '紫微', dzIndex: zwZhi },
    { name: '天机', dzIndex: (zwZhi - 1 + 12) % 12 },
    { name: '太阳', dzIndex: (zwZhi - 3 + 12) % 12 },
    { name: '武曲', dzIndex: (zwZhi - 4 + 12) % 12 },
    { name: '天同', dzIndex: (zwZhi - 5 + 12) % 12 },
    { name: '廉贞', dzIndex: (zwZhi + 6) % 12 },
  ];
}

// ----- 天府系主星 -----
function calcTianFuZhi(zwZhi: number): number {
  return (6 - zwZhi + 12) % 12;
}

function placeTianFuStars(tfZhi: number) {
  return TIANFU_STAR_NAMES.map((name, i) => ({
    name,
    dzIndex: (tfZhi + i) % 12,
  }));
}

// ----- 四化 -----
function getSiHua(yearGan: number) {
  const g = TIAN_GAN[yearGan];
  return {
    lu: HUA_LU[g],
    quan: HUA_QUAN[g],
    ke: HUA_KE[g],
    ji: HUA_JI[g],
  };
}

// ----- 大限 -----
function getDaXian(lunarYear: number, gender: string, mingIdx: number) {
  const yang = lunarYear % 10 % 2 === 0;
  const forward = (yang && gender === '男') || (!yang && gender === '女');
  const result = [];
  for (let i = 0; i < 12; i++) {
    const di = forward ? (mingIdx + i) % 12 : (mingIdx - i + 12) % 12;
    result.push({ palace: DI_ZHI[di], startAge: i * 10, endAge: (i + 1) * 10 - 1 });
  }
  return result;
}

// ============================================================
// 主入口
// ============================================================
export function generateChart(year: number, month: number, day: number, hour: number, _minute: number, _longitude: number, gender: string) {
  const lunar = gregorianToLunar({ year, month, day, hour, minute: _minute, longitude: _longitude, gender });
  const yearGan = lunar.yearGanIndex;
  const yearZhi = lunar.yearZhiIndex;

  const mingIdx = calcMingGong(lunar.month, lunar.hourZhi);
  const shenIdx = calcShenGong(lunar.month, lunar.hourZhi);
  const gongs = placeTwelveGongs(mingIdx);

  const juShu = getJuShu(yearGan, yearZhi);
  const zwZhi = calcZiWeiZhi(juShu, lunar.day);
  const tfZhi = calcTianFuZhi(zwZhi);

  const allMain = [...placeZiWeiStars(zwZhi), ...placeTianFuStars(tfZhi)];

  // 辅星
  const aux: { name: string; dzIndex: number }[] = [];
  aux.push({ name: '左辅', dzIndex: zuoFu(lunar.month) });
  aux.push({ name: '右弼', dzIndex: youBi(lunar.month) });
  aux.push({ name: '文昌', dzIndex: wenChang(lunar.hourZhi) });
  aux.push({ name: '文曲', dzIndex: wenQu(lunar.hourZhi) });
  aux.push({ name: '地空', dzIndex: diKong(lunar.hourZhi) });
  aux.push({ name: '地劫', dzIndex: diJie(lunar.hourZhi) });
  aux.push({ name: '天魁', dzIndex: tianKui(yearGan) });
  aux.push({ name: '天钺', dzIndex: tianYue(yearGan) });
  const lc = luCun(yearGan);
  aux.push({ name: '禄存', dzIndex: lc });
  aux.push({ name: '擎羊', dzIndex: qingYang(lc) });
  aux.push({ name: '陀罗', dzIndex: tuoLuo(lc) });
  aux.push({ name: '火星', dzIndex: huoXing(yearGan, lunar.hourZhi) });
  aux.push({ name: '铃星', dzIndex: lingXing(yearGan, lunar.hourZhi) });
  aux.push({ name: '天马', dzIndex: tianMa(yearGan) });

  const sihua = getSiHua(yearGan);
  const daxian = getDaXian(lunar.year, gender, mingIdx);

  // 构建每宫星曜
  const starsAtPos: Record<number, { main: string[]; aux: string[] }> = {};
  for (let i = 0; i < 12; i++) starsAtPos[i] = { main: [], aux: [] };
  allMain.forEach(s => starsAtPos[s.dzIndex].main.push(s.name));
  aux.forEach(s => starsAtPos[s.dzIndex].aux.push(s.name));

  // 四化标签
  const huaNames = ['化禄', '化权', '化科', '化忌'];
  const huaStars = [sihua.lu, sihua.quan, sihua.ke, sihua.ji];
  huaStars.forEach((sn, i) => {
    if (!sn) return;
    const st = allMain.find(s => s.name === sn);
    if (st) starsAtPos[st.dzIndex].aux.push(huaNames[i]);
  });

  return {
    lunar,
    yearGan,
    yearZhi,
    monthGan: lunar.monthGanIndex,
    monthZhi: lunar.monthZhiIndex,
    hourGan: lunar.hourGanIndex,
    hourZhi: lunar.hourZhiIndex,
    gender,
    shengxiao: lunar.shengxiao,
    juShu,
    mingGongIndex: mingIdx,
    shenGongIndex: shenIdx,
    gongs,
    allMainStars: allMain,
    aux,
    sihua,
    daxian,
    starsAtPos,
    palaces: gongs.map(g => ({
      name: g.name,
      dz: DI_ZHI[g.dzIndex],
      stars: starsAtPos[g.dzIndex]?.main || [],
      auxStars: starsAtPos[g.dzIndex]?.aux || [],
    })),
  };
}

export type ChartData = ReturnType<typeof generateChart>;
