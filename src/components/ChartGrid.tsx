'use client';

const DI_ZHI = ['子','丑','寅','卯','辰','巳','午','未','申','酉','戌','亥'];

const WU_XING_COLOR: Record<string,string> = {
  '子':'#1a3a5c','丑':'#5c4a2e','寅':'#2e5c2e','卯':'#3a6b3a',
  '辰':'#6b5c2e','巳':'#8b3a2e','午':'#b8422e','未':'#7a5c2e',
  '申':'#6b5a3e','酉':'#8b7a4e','戌':'#6b4a1e','亥':'#1a3a6b',
};

// 紫微斗数传统命盘布局
const LAYOUT: number[][] = [
  [5, 6, 7, 8],   // 巳 午 未 申
  [4, 3, 2, 9],   // 辰 卯 寅 酉
  [1, 0, 11, 10], // 丑 子 亥 戌
];

const MAIN_STARS = ['紫微','天府','天机','太阳','武曲','天同','廉贞','太阴','贪狼','巨门','天相','天梁','七杀','破军'];
const EVIL_STARS = ['擎羊','陀罗','火星','铃星','地空','地劫'];

function starStyle(name: string): string {
  const pure = name.replace(/化.*/, '');
  if (pure === '紫微' || pure === '天府') return 'text-[#b8860b] font-bold text-[15px] star-shimmer';
  if (MAIN_STARS.includes(pure)) return 'text-[#3a2a1a] font-bold text-[14px]';
  if (EVIL_STARS.includes(pure)) return 'text-[#b8422e] text-[13px]';
  if (name.includes('化禄')) return 'text-[#5a7a5a] font-bold text-[13px]';
  if (name.includes('化权')) return 'text-[#b8422e] font-bold text-[13px]';
  if (name.includes('化科')) return 'text-[#3a6a8b] font-bold text-[13px]';
  if (name.includes('化忌')) return 'text-[#7a3a10] font-bold text-[13px]';
  return 'text-[#4a3828] text-[13px]';
}

export default function ChartGrid({ data }: { data: any }) {
  if (!data?.palaces) return null;

  const mingIdx = data.mingGongIndex;
  const shenIdx = data.shenGongIndex;
  const gender = data.gender === '男' ? '乾' : '坤';
  const shengxiao = data.shengxiao || '';
  const juName = ['','','水二局','木三局','金四局','土五局','火六局'][data.juShu] || '';
  const sihua = data.sihua || {};

  return (
    <div className="ink-frame rounded-lg overflow-hidden max-w-[700px] mx-auto bg-[#faf7f0]">
      {/* 标题栏 */}
      <div className="text-center py-4 px-4 relative">
        <div className="absolute left-4 top-1/2 -translate-y-1/2">
          <span className="seal text-sm w-10 h-10">命</span>
        </div>
        <div className="text-3xl brush-title text-[var(--ink)] tracking-[8px]">紫微斗数</div>
        <div className="text-[11px] text-[var(--ink-light)] tracking-[6px] mt-1">命 盘 排 盘</div>
        <div className="absolute right-4 top-1/2 -translate-y-1/2">
          <span className="seal text-sm w-10 h-10">盘</span>
        </div>
        <div className="ink-line my-3" />
      </div>

      {/* 十二宫网格 */}
      <div className="grid grid-cols-4 gap-px p-[2px]">
        {LAYOUT.flat().map((dzIdx) => {
          // 中心格 — 太极位
          if (dzIdx === 2) {
            return (
              <div key="center" className="flex flex-col items-center justify-center text-center py-4 px-2 relative"
                style={{background: 'radial-gradient(circle, rgba(180,134,11,0.05) 0%, transparent 70%)'}}>
                <div className="text-[48px] mb-2 opacity-20">☯</div>
                <div className="text-[11px] text-[var(--ink-light)] leading-relaxed space-y-0.5">
                  <div>命宫 <span className="text-[var(--ink)]">{DI_ZHI[mingIdx]}</span></div>
                  <div>身宫 <span className="text-[var(--ink)]">{DI_ZHI[shenIdx]}</span></div>
                  <div className="text-[10px]">{gender}造 · 肖{shengxiao}</div>
                </div>
              </div>
            );
          }

          const p = data.palaces?.find((g: any) => g.dz === DI_ZHI[dzIdx]);
          const stars = p?.stars || [];
          const auxStars = p?.auxStars || [];
          const diColor = WU_XING_COLOR[DI_ZHI[dzIdx]] || '#5c4a3e';

          return (
            <div key={dzIdx} className="py-2 px-1.5 flex flex-col relative"
              style={{background: 'linear-gradient(180deg, rgba(255,255,255,0.5) 0%, rgba(250,247,240,0.8) 100%)'}}>
              {/* 宫位名 */}
              <div className="text-center pb-1 mb-1 relative">
                <div className="text-sm font-bold text-[var(--ink)] tracking-[1px]">{p?.name}</div>
                <div className="text-xs mt-0.5" style={{color: diColor}}>{DI_ZHI[dzIdx]}</div>
                <div className="mx-auto w-5 h-px mt-0.5" style={{background: `linear-gradient(to right, transparent, ${diColor}88, transparent)`}} />
              </div>
              {/* 主星 */}
              <div className="flex-1 space-y-[1px]">
                {stars.map((s: string) => (
                  <div key={s} className={starStyle(s) + ' leading-tight'}>{s}</div>
                ))}
              </div>
              {/* 辅星 + 四化 */}
              {auxStars.length > 0 && (
                <div className="mt-1 pt-1 border-t border-dotted" style={{borderColor: 'rgba(60,50,40,0.12)'}}>
                  {auxStars.map((s: string) => (
                    <div key={s} className={starStyle(s) + ' leading-tight'}>{s}</div>
                  ))}
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* 底部五行栏 */}
      <div className="text-center py-3 px-4 text-[11px] text-[var(--ink-light)] tracking-[2px] space-x-4"
        style={{borderTop: '1px solid rgba(60,50,40,0.1)', background: 'rgba(180,150,100,0.04)'}}>
        <span>局: <span className="text-[var(--ink)]">{juName}</span></span>
        <span>禄: <span className="text-[var(--jade)]">{sihua.lu || '—'}</span></span>
        <span>权: <span className="text-[var(--vermillion)]">{sihua.quan || '—'}</span></span>
        <span>科: <span className="text-[#4a7a9b]">{sihua.ke || '—'}</span></span>
        <span>忌: <span className="text-[#8b4513]">{sihua.ji || '—'}</span></span>
      </div>
    </div>
  );
}
