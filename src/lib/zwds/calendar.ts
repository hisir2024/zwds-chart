// 紫微斗数 — 农历转换（使用 lunar-javascript 库）
import { Solar } from 'lunar-javascript';

export interface BirthInfo {
  year: number;
  month: number;
  day: number;
  hour: number;
  minute: number;
  longitude: number;
  gender: string;
}

export interface LunarResult {
  year: number;
  month: number;
  day: number;
  yearGanIndex: number;
  yearZhiIndex: number;
  monthGanIndex: number;
  monthZhiIndex: number;
  dayGanIndex: number;
  dayZhiIndex: number;
  hourGanIndex: number;
  hourZhiIndex: number;
  hourZhi: number;
  shengxiao: string;
}

// 时辰对应表：hour → 地支索引
function getHourZhi(hour: number): number {
  if (hour === 23 || hour === 0) return 0; // 子时
  if (hour === 1 || hour === 2) return 1;   // 丑时
  if (hour === 3 || hour === 4) return 2;   // 寅时
  if (hour === 5 || hour === 6) return 3;   // 卯时
  if (hour === 7 || hour === 8) return 4;   // 辰时
  if (hour === 9 || hour === 10) return 5;  // 巳时
  if (hour === 11 || hour === 12) return 6; // 午时
  if (hour === 13 || hour === 14) return 7; // 未时
  if (hour === 15 || hour === 16) return 8; // 申时
  if (hour === 17 || hour === 18) return 9; // 酉时
  if (hour === 19 || hour === 20) return 10; // 戌时
  return 11; // 亥时 21-22
}

export function gregorianToLunar(info: BirthInfo): LunarResult {
  const solar = Solar.fromYmd(info.year, info.month, info.day);
  const lunar = solar.getLunar();

  return {
    year: lunar.getYear(),
    month: lunar.getMonth(),
    day: lunar.getDay(),
    yearGanIndex: lunar.getYearGanIndex(),
    yearZhiIndex: lunar.getYearZhiIndex(),
    monthGanIndex: lunar.getMonthGanIndex(),
    monthZhiIndex: lunar.getMonthZhiIndex(),
    dayGanIndex: lunar.getDayGanIndex(),
    dayZhiIndex: lunar.getDayZhiIndex(),
    hourGanIndex: lunar.getTimeGanIndex(),
    hourZhiIndex: lunar.getTimeZhiIndex(),
    hourZhi: getHourZhi(info.hour),
    shengxiao: lunar.getYearShengXiao(),
  };
}
