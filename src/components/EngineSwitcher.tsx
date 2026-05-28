'use client';
import { AIProvider } from '@/lib/ai/llm';

const ENGINES = [
  { value: 'openai' as const, label: 'OpenAI', desc: '逻辑严密' },
  { value: 'qwen' as const, label: '通义千问', desc: '中文流畅' },
  { value: 'deepseek' as const, label: 'DeepSeek', desc: '性价比高' },
];

export default function EngineSwitcher({ current, onChange }: { current: AIProvider; onChange: (v: AIProvider) => void }) {
  return (
    <div className="flex gap-3 flex-wrap">
      {ENGINES.map(e => (
        <button
          key={e.value}
          onClick={() => onChange(e.value)}
          className={`px-3 py-1.5 rounded-md text-sm border transition-colors ${
            current === e.value
              ? 'bg-stone-800 text-white border-stone-800'
              : 'bg-white border-stone-300 hover:border-stone-500'
          }`}
        >
          {e.label}
          <span className="text-xs opacity-70 ml-1">({e.desc})</span>
        </button>
      ))}
    </div>
  );
}
