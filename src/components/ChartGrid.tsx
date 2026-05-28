'use client';
export default function ChartGrid({ data }: { data: any }) {
  if (!data?.palaces) return null;

  // 传统紫微斗数命盘布局：4列3行，地支按固定位置排布
  const layout = [
    [5, 6, 7, 8],    // 巳午未申
    [4, 3, 2, 9],    // 辰卯寅酉
    [1, 0, 11, 10],  // 丑子亥戌
  ];
  const DI_ZHI = ['子','丑','寅','卯','辰','巳','午','未','申','酉','戌','亥'];

  return (
    <div className="grid grid-cols-4 gap-0.5 bg-stone-300 border-2 border-stone-400 rounded-lg overflow-hidden max-w-[700px] mx-auto">
      {layout.flat().map((dzIdx) => {
        const p = data.palaces?.find((g: any) => g.dz === DI_ZHI[dzIdx]);
        const stars = p?.stars || [];
        const auxStars = p?.auxStars || [];

        return (
          <div
            key={dzIdx}
            className="bg-stone-50 min-h-[100px] p-2 flex flex-col"
          >
            <div className="text-xs font-bold text-stone-800 border-b border-stone-200 pb-1 mb-1 flex justify-between">
              <span>{p?.name || DI_ZHI[dzIdx]}</span>
              <span className="text-stone-400">{DI_ZHI[dzIdx]}</span>
            </div>
            <div className="flex-1 text-xs space-y-0.5">
              {stars.map((s: string) => (
                <div key={s} className="text-amber-700 font-bold">{s}</div>
              ))}
              {auxStars.map((s: string) => {
                const isBad = ['擎羊','陀罗','火星','铃星','地空','地劫'].includes(s.replace(/化.*/, ''));
                const isHua = s.includes('化');
                return (
                  <div key={s} className={isBad ? 'text-red-500' : isHua ? 'text-fuchsia-500' : 'text-sky-600'}>
                    {s}
                  </div>
                );
              })}
            </div>
          </div>
        );
      })}
    </div>
  );
}
