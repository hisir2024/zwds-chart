'use client';

const DI_ZHI = ['子','丑','寅','卯','辰','巳','午','未','申','酉','戌','亥'];

// 紫微斗数传统命盘布局：4列×3行（地支固定位置）
const LAYOUT: number[][] = [
  [5, 6, 7, 8],   // 巳 午 未 申
  [4, 3, 2, 9],   // 辰 卯 寅 酉
  [1, 0, 11, 10], // 丑 子 亥 戌
];

function starClass(name: string): string {
  const pure = name.replace(/化.*/, '');
  if (['擎羊','陀罗','火星','铃星','地空','地劫'].includes(pure)) return 'text-red-500';
  if (name.includes('化')) return 'text-fuchsia-400';
  if (['左辅','右弼','天魁','天钺','禄存','天马'].includes(pure)) return 'text-sky-400';
  if (['文昌','文曲'].includes(pure)) return 'text-cyan-400';
  if (['紫微','天府','天机','太阳','武曲','天同','廉贞','太阴','贪狼','巨门','天相','天梁','七杀','破军'].includes(pure)) return 'text-amber-300 font-bold';
  return 'text-stone-300';
}

function mainStarClass(name: string): string {
  if (['紫微','天府'].includes(name)) return 'text-yellow-400 text-base font-bold';
  return 'text-amber-300 text-sm font-bold';
}

export default function ChartGrid({ data }: { data: any }) {
  if (!data?.palaces) return null;

  const mingIdx = data.mingGongIndex;
  const shenIdx = data.shenGongIndex;
  const gender = data.gender || '男';
  const shengxiao = data.shengxiao || '';

  return (
    <div className="bg-[#0d1b2a] border-2 border-[#c9a84c] rounded-lg overflow-hidden max-w-[640px] mx-auto">
      <div className="grid grid-cols-4 gap-px bg-[#2a3a6a]">
        {LAYOUT.flat().map((dzIdx) => {
          // 中心格（寅位，显示命盘标题）
          if (dzIdx === 2) {
            return (
              <div key="center" className="bg-[#0f3460] min-h-[110px] p-3 flex flex-col items-center justify-center text-center">
                <div className="text-[#f0d68a] text-lg font-bold tracking-[4px] mb-2">紫微斗数</div>
                <div className="text-[#8b7d6b] text-xs leading-relaxed">
                  <div>命宫: {DI_ZHI[mingIdx]}</div>
                  <div>身宫: {DI_ZHI[shenIdx]}</div>
                  <div>{gender === '男' ? '乾造' : '坤造'} · {shengxiao}</div>
                </div>
              </div>
            );
          }

          const p = data.palaces?.find((g: any) => g.dz === DI_ZHI[dzIdx]);
          const stars = p?.stars || [];
          const auxStars = p?.auxStars || [];

          return (
            <div key={dzIdx} className="bg-[#0d1b2a] min-h-[110px] p-2 flex flex-col">
              {/* 宫位名 + 地支 */}
              <div className="text-center pb-1 mb-1 border-b border-[#1a2a4a]">
                <span className="text-[#f0d68a] text-sm font-bold">{p?.name || DI_ZHI[dzIdx]}</span>
                <span className="text-[#5a4a3a] text-xs ml-1">{DI_ZHI[dzIdx]}</span>
              </div>
              {/* 星曜 */}
              <div className="flex-1 text-xs space-y-0.5 leading-relaxed">
                {stars.map((s: string) => (
                  <div key={s} className={mainStarClass(s)}>{s}</div>
                ))}
                {auxStars.length > 0 && (
                  <div className="mt-1 pt-0.5 border-t border-[#1a2a4a]">
                    {auxStars.map((s: string) => (
                      <div key={s} className={starClass(s)}>{s}</div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* 底部信息栏 */}
      <div className="bg-[#0f3460] border-t border-[#2a3a6a] px-4 py-2 text-center text-[#8b7d6b] text-xs">
        五行局: {['','','水二局','木三局','金四局','土五局','火六局'][data.juShu] || ''} · 四化: {data.sihua?.lu || '?'}禄 {data.sihua?.quan || '?'}权 {data.sihua?.ke || '?'}科 {data.sihua?.ji || '?'}忌
      </div>
    </div>
  );
}
