'use client';
import { useState } from 'react';
import { STAR_DICT, STAR_ORDER, StarDictEntry } from '@/lib/zwds/dictionary';

const typeLabel: Record<string,string> = { '主星':'主', '辅星':'辅', '四化':'化' };
const typeCls: Record<string,string> = {
  '主星':'bg-[#b8860b] text-[#faf7f0]',
  '辅星':'bg-[#5c4033] text-[#faf7f0]',
  '四化':'bg-[var(--jade)] text-[#faf7f0]',
};

export default function StarDict() {
  const [filter, setFilter] = useState<'all'|'主星'|'辅星'|'四化'>('all');
  const [search, setSearch] = useState('');
  const [expanded, setExpanded] = useState<string|null>(null);

  const stars = STAR_ORDER
    .map(name => STAR_DICT[name])
    .filter(Boolean)
    .filter(s => {
      if (filter !== 'all' && s.type !== filter) return false;
      if (search && !s.name.includes(search) && !s.keywords.includes(search)) return false;
      return true;
    });

  const isExpanded = (name: string) => expanded === name;

  return (
    <div className="ink-frame rounded-lg p-6 bg-[#faf7f0]">
      <div className="flex items-center gap-3 mb-5">
        <span className="w-1 h-5 bg-[var(--gold)] rounded-full" />
        <h2 className="text-base tracking-[4px] text-[var(--ink)]">星曜辞典</h2>
      </div>

      {/* 筛选 + 搜索 */}
      <div className="flex flex-wrap gap-2 mb-4">
        {(['all','主星','辅星','四化'] as const).map(t => (
          <button key={t} onClick={() => setFilter(t)}
            className={`px-3 py-1 rounded text-xs tracking-[1px] transition-all ${
              filter === t ? 'bg-[var(--ink)] text-[#faf7f0]' : 'bg-[rgba(60,50,40,0.05)] text-[var(--ink-light)] hover:bg-[rgba(60,50,40,0.1)]'
            }`}>
            {t === 'all' ? '全部' : typeLabel[t]}
          </button>
        ))}
        <input
          type="text" placeholder="搜索星名或关键词..."
          value={search} onChange={e => setSearch(e.target.value)}
          className="flex-1 min-w-[120px] px-3 py-1 rounded text-sm bg-[rgba(60,50,40,0.03)] border border-[rgba(60,50,40,0.1)] text-[var(--ink)] placeholder:text-[#b5a890] focus:outline-none focus:border-[#b8860b]"
        />
      </div>

      {/* 星曜列表 */}
      <div className="space-y-1 max-h-[600px] overflow-y-auto">
        {stars.map(s => (
          <div key={s.name} className="border-b border-[rgba(60,50,40,0.06)] last:border-0">
            <button
              onClick={() => setExpanded(isExpanded(s.name) ? null : s.name)}
              className="w-full flex items-center gap-2 py-2.5 px-2 text-left hover:bg-[rgba(184,150,100,0.05)] transition-colors rounded"
            >
              <span className={`text-xs px-1.5 py-0.5 rounded-full shrink-0 ${typeCls[s.type]}`}>
                {typeLabel[s.type]}
              </span>
              <span className="text-base font-bold text-[var(--ink)]">{s.name}</span>
              <span className="text-xs text-[var(--ink-light)] hidden sm:inline">{s.wuxing}</span>
              <span className="flex-1" />
              <span className="text-xs text-[#6b5a4a] hidden md:inline truncate max-w-[200px]">{s.keywords}</span>
              <span className={`text-xs text-[#6b5a4a] transition-transform ${isExpanded(s.name) ? 'rotate-180' : ''}`}>▼</span>
            </button>
            {isExpanded(s.name) && (
              <div className="px-3 pb-3 text-sm leading-relaxed text-[var(--ink-light)] space-y-2">
                <p>{s.desc}</p>
                {s.jixiang && <p><span className="text-[var(--jade)] font-bold">吉：</span>{s.jixiang}</p>}
                {s.buji && <p><span className="text-[var(--vermillion)] font-bold">忌：</span>{s.buji}</p>}
              </div>
            )}
          </div>
        ))}
        {stars.length === 0 && (
          <div className="text-center py-8 text-[#b5a890] text-xs">无匹配星曜</div>
        )}
      </div>
    </div>
  );
}
