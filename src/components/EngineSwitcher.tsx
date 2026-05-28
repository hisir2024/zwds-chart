'use client';
import { AIProvider } from '@/lib/ai/llm';

const ENGINES = [
  { value: 'deepseek' as const, label: 'DeepSeek', desc: '价廉物美' },
  { value: 'qwen' as const, label: '通义千问', desc: '中文流畅' },
  { value: 'openai' as const, label: 'OpenAI', desc: '逻辑严密' },
];

export default function EngineSwitcher({ current, onChange }: { current: AIProvider; onChange: (v: AIProvider) => void }) {
  return (
    <div className="flex gap-2 flex-wrap">
      {ENGINES.map(e => {
        const active = current === e.value;
        return (
          <button
            key={e.value}
            onClick={() => onChange(e.value)}
            className={`px-4 py-2 rounded text-xs tracking-[1px] transition-all duration-300 ${
              active
                ? 'bg-[#b8860b] text-[#faf7f0] shadow-[0_2px_8px_rgba(184,134,11,0.3)]'
                : 'bg-[#faf7f0] text-[var(--ink-light)] border border-[rgba(60,50,40,0.15)] hover:border-[#b8860b] hover:text-[var(--ink)]'
            }`}
          >
            {e.label}
            <span className="block text-[10px] opacity-60 mt-0.5">{e.desc}</span>
          </button>
        );
      })}
    </div>
  );
}
