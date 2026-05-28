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
