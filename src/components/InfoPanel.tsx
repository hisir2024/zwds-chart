'use client';
import { TIAN_GAN, DI_ZHI } from '@/lib/zwds/stars';

interface Props { data: any; }

const labelCls = 'text-[11px] text-[var(--ink-light)] tracking-[2px]';
const valCls = 'text-base text-[var(--ink)] font-serif';

export default function InfoPanel({ data }: Props) {
  if (!data) return null;

  const { lunar, yearGan, yearZhi, mingGongIndex, shenGongIndex, juShu, gender, shengxiao, daxian, sihua } = data;

  const baZi = `${TIAN_GAN[yearGan]}${DI_ZHI[yearZhi]} ${TIAN_GAN[lunar.monthGanIndex]}${DI_ZHI[lunar.monthZhiIndex]} ${TIAN_GAN[lunar.dayGanIndex]}${DI_ZHI[lunar.dayZhiIndex ?? 0]} ${TIAN_GAN[lunar.hourGanIndex]}${DI_ZHI[lunar.hourZhiIndex]}`;

  const juName = ['','','水二局','木三局','金四局','土五局','火六局'][juShu] || '—';

  const wuxingMap: Record<number,string> = { 2:'水',3:'木',4:'金',5:'土',6:'火' };
  const nayinMap: Record<string,string> = {
    '甲子乙丑':'海中金','丙寅丁卯':'炉中火','戊辰己巳':'大林木','庚午辛未':'路旁土','壬申癸酉':'剑锋金',
    '甲戌乙亥':'山头火','丙子丁丑':'涧下水','戊寅己卯':'城头土','庚辰辛巳':'白蜡金','壬午癸未':'杨柳木',
    '甲申乙酉':'泉中水','丙戌丁亥':'屋上土','戊子己丑':'霹雳火','庚寅辛卯':'松柏木','壬辰癸巳':'长流水',
    '甲午乙未':'沙中金','丙申丁酉':'山下火','戊戌己亥':'平地木','庚子辛丑':'壁上土','壬寅癸卯':'金箔金',
    '甲辰乙巳':'覆灯火','丙午丁未':'天河水','戊申己酉':'大驿土','庚戌辛亥':'钗钏金','壬子癸丑':'桑柘木',
    '甲寅乙卯':'大溪水','丙辰丁巳':'沙中土','戊午己未':'天上火','庚申辛酉':'石榴木','壬戌癸亥':'大海水',
  };
  const mingGan = TIAN_GAN[(yearGan * 2 + mingGongIndex) % 10];
  const mingZhi = DI_ZHI[mingGongIndex];
  const nayin = nayinMap[mingGan + mingZhi] || '—';

  return (
    <div className="ink-frame rounded-lg p-6 bg-[#faf7f0] space-y-5">
      {/* 八字 */}
      <div>
        <div className="flex items-center gap-2 mb-3">
          <span className="w-1 h-4 bg-[var(--gold)] rounded-full" />
          <h3 className="text-sm tracking-[3px] text-[var(--ink)]">四柱八字</h3>
        </div>
        <div className="grid grid-cols-4 gap-2 text-center">
          {[
            {label:'年柱',gan:TIAN_GAN[yearGan],zhi:DI_ZHI[yearZhi]},
            {label:'月柱',gan:TIAN_GAN[lunar.monthGanIndex],zhi:DI_ZHI[lunar.monthZhiIndex]},
            {label:'日柱',gan:TIAN_GAN[lunar.dayGanIndex],zhi:DI_ZHI[lunar.dayZhiIndex ?? 0]},
            {label:'时柱',gan:TIAN_GAN[lunar.hourGanIndex],zhi:DI_ZHI[lunar.hourZhiIndex]},
          ].map(({label,gan,zhi}) => (
            <div key={label} className="bg-[rgba(184,150,100,0.06)] rounded py-2 px-1">
              <div className="text-xs text-[var(--ink-light)] tracking-[1px] mb-1">{label}</div>
              <div className="text-base text-[var(--ink)] font-bold">{gan}{zhi}</div>
            </div>
          ))}
        </div>
      </div>

      {/* 基本盘面信息 */}
      <div>
        <div className="flex items-center gap-2 mb-3">
          <span className="w-1 h-4 bg-[var(--vermillion)] rounded-full" />
          <h3 className="text-sm tracking-[3px] text-[var(--ink)]">盘面概要</h3>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-x-4 gap-y-2">
          <div><span className={labelCls}>性别</span><div className={valCls}>{gender === '男' ? '乾造' : '坤造'}</div></div>
          <div><span className={labelCls}>生肖</span><div className={valCls}>{shengxiao}</div></div>
          <div><span className={labelCls}>五行局</span><div className={valCls}>{juName}</div></div>
          <div><span className={labelCls}>命宫</span><div className={valCls}>{DI_ZHI[mingGongIndex]}</div></div>
          <div><span className={labelCls}>身宫</span><div className={valCls}>{DI_ZHI[shenGongIndex]}</div></div>
          <div><span className={labelCls}>纳音</span><div className={valCls}>{nayin}</div></div>
          <div><span className={labelCls}>五行</span><div className={valCls}>{wuxingMap[juShu] || '—'}</div></div>
          <div><span className={labelCls}>四化</span><div className={valCls}>
            <span className="text-[var(--jade)]">{sihua.lu ? sihua.lu+'禄' : ''}</span>{' '}
            <span className="text-[var(--vermillion)]">{sihua.quan ? sihua.quan+'权' : ''}</span>{' '}
            <span className="text-[#4a7a9b]">{sihua.ke ? sihua.ke+'科' : ''}</span>{' '}
            <span className="text-[#8b4513]">{sihua.ji ? sihua.ji+'忌' : ''}</span>
          </div></div>
        </div>
      </div>

      {/* 大限 */}
      <div>
        <div className="flex items-center gap-2 mb-3">
          <span className="w-1 h-4 bg-[var(--jade)] rounded-full" />
          <h3 className="text-sm tracking-[3px] text-[var(--ink)]">大限（十年大运）</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-xs text-[var(--ink-light)] tracking-[1px] border-b border-[rgba(60,50,40,0.1)]">
                <th className="py-1.5 text-left">岁数</th>
                <th className="py-1.5 text-left">地支</th>
                <th className="py-1.5 text-right">运程</th>
              </tr>
            </thead>
            <tbody>
              {(daxian || []).map((dx: any, i: number) => (
                <tr key={i} className="border-b border-[rgba(60,50,40,0.05)] hover:bg-[rgba(184,150,100,0.04)]">
                  <td className="py-1.5 text-[var(--ink)]">{dx.startAge}–{dx.endAge}</td>
                  <td className="py-1.5 text-[var(--ink-light)] font-serif">{dx.palace}</td>
                  <td className="py-1.5 text-right text-[var(--ink-light)]">{i === 0 ? '命垣初立' : i < 3 ? '少年运' : i < 7 ? '壮年运' : '晚年运'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
