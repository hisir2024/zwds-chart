'use client';
import { AIProvider } from '@/lib/ai/llm';

const ENGINES = [
  { value: 'deepseek' as const, label: 'DeepSeek', desc: '性价比高，推荐日常使用' },
  { value: 'qwen' as const, label: '通义千问', desc: '中文流畅，语感佳' },
  { value: 'openai' as const, label: 'OpenAI', desc: '逻辑严密，格局分析' },
];

export default function EngineSwitcher({ current, onChange }: { current: AIProvider; onChange: (v: AIProvider) => void }) {
  return (
    <div className="flex gap-3 flex-wrap">
      {ENGINES.map(e => (
        <button
          key={e.value}
          onClick={() => onChange(e.value)}
          className={`px-3 py-2 rounded-md text-xs border transition-colors ${
            current === e.value
              ? 'bg-[#c9a84c] text-[#1a1a2e] border-[#c9a84c] font-bold'
              : 'bg-[#0d1b2a] text-[#8b7d6b] border-[#2a3a6a] hover:border-[#f0d68a] hover:text-[#e0d5c1]'
          }`}
        >
          {e.label}
          <span className="block text-[10px] opacity-70 mt-0.5">{e.desc}</span>
        </button>
      ))}
    </div>
  );
}
