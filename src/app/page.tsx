'use client';
import { useState, useRef, useEffect } from 'react';
import { generateChart } from '@/lib/zwds/calculate';
import ChartGrid from '@/components/ChartGrid';
import EngineSwitcher from '@/components/EngineSwitcher';
import PdfExporter from '@/components/PdfExporter';
import { AIProvider } from '@/lib/ai/llm';
import { saveCache, loadCache, clearCache } from '@/lib/stream-cache';

type StreamState = 'idle' | 'generating' | 'done' | 'interrupted';

export default function Home() {
  const [birth, setBirth] = useState({ year: 1995, month: 8, day: 15, hour: 14, minute: 20, longitude: 121.47, gender: '男' as const });
  const [provider, setProvider] = useState<AIProvider>('openai');
  const [chart, setChart] = useState<any>(null);
  const [reading, setReading] = useState('');
  const [state, setState] = useState<StreamState>('idle');
  const abortRef = useRef<AbortController | null>(null);

  // 页面加载自动恢复缓存
  useEffect(() => {
    const cached = loadCache();
    if (cached?.text && cached.chartData) {
      setChart(cached.chartData);
      setReading(cached.text);
      setProvider(cached.provider as AIProvider);
      setState('done');
    }
  }, []);

  // 核心生成/续传逻辑
  const handleGenerate = async (resume: boolean = false) => {
    abortRef.current?.abort();
    abortRef.current = new AbortController();
    setState('generating');

    let currentChart = chart;
    if (!resume) {
      setReading('');
      currentChart = generateChart(birth.year, birth.month, birth.day, birth.hour, birth.minute, birth.longitude, birth.gender);
      setChart(currentChart);
    }

    try {
      const res = await fetch('/api/interpret', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ chart: currentChart, provider }),
        signal: abortRef.current.signal,
      });

      if (!res.ok) {
        const err = await res.json();
        setReading(err.error || '生成失败，请检查网络或Key');
        setState('interrupted');
        return;
      }

      const reader = res.body!.getReader();
      const decoder = new TextDecoder();
      let fullText = resume ? reading : '';

      while (true) {
        try {
          const { done, value } = await reader.read();
          if (done) break;
          fullText += decoder.decode(value, { stream: true });
          setReading(fullText);
          saveCache(currentChart, fullText, provider);
        } catch (readErr: any) {
          if (readErr.name === 'AbortError') break;
          break;
        }
      }

      if (fullText) setState('done');
    } catch (err: any) {
      if (err.name !== 'AbortError') {
        setReading('网络异常或推理超时，已保留草稿。点击"从断点续传"继续。');
        setState('interrupted');
      }
    } finally {
      abortRef.current = null;
    }
  };

  const handleStop = () => {
    abortRef.current?.abort();
    abortRef.current = null;
    setState('interrupted');
  };

  const handleClear = () => {
    clearCache();
    setChart(null);
    setReading('');
    setState('idle');
  };

  return (
    <main className="min-h-screen bg-stone-50 p-6">
      <h1 className="text-3xl font-serif text-center mb-8">紫微斗数排盘系统</h1>

      <div className="max-w-4xl mx-auto bg-white p-6 rounded-xl shadow-sm mb-6">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
          <input type="number" value={birth.year} onChange={e => setBirth({...birth, year: +e.target.value})} className="p-2 border rounded" placeholder="年" />
          <input type="number" value={birth.month} onChange={e => setBirth({...birth, month: +e.target.value})} className="p-2 border rounded" placeholder="月" min={1} max={12} />
          <input type="number" value={birth.day} onChange={e => setBirth({...birth, day: +e.target.value})} className="p-2 border rounded" placeholder="日" min={1} max={31} />
          <input type="time" value={`${String(birth.hour).padStart(2, '0')}:${String(birth.minute).padStart(2, '0')}`} onChange={e => { const [h, m] = e.target.value.split(':'); setBirth({...birth, hour: +h, minute: +m}); }} className="p-2 border rounded" />
        </div>
        <div className="flex gap-4 mb-4">
          <input type="number" value={birth.longitude} onChange={e => setBirth({...birth, longitude: +e.target.value})} className="flex-1 p-2 border rounded" placeholder="经度（默认121.47上海）" />
          <select value={birth.gender} onChange={e => setBirth({...birth, gender: e.target.value as any})} className="p-2 border rounded">
            <option value="男">男</option>
            <option value="女">女</option>
          </select>
        </div>

        <EngineSwitcher current={provider} onChange={setProvider} />

        <div className="flex gap-3 mt-4">
          {state === 'idle' && (
            <button onClick={() => handleGenerate(false)} className="flex-1 bg-stone-700 text-white py-3 rounded-lg hover:bg-stone-800">
              生成命盘与解读
            </button>
          )}
          {state === 'generating' && (
            <button onClick={handleStop} className="flex-1 bg-red-600 text-white py-3 rounded-lg hover:bg-red-700">
              中断推演
            </button>
          )}
          {state === 'interrupted' && (
            <>
              <button onClick={() => handleGenerate(true)} className="flex-1 bg-amber-600 text-white py-3 rounded-lg hover:bg-amber-700">
                从断点续传
              </button>
              <button onClick={handleClear} className="px-4 py-3 border border-stone-300 rounded-lg hover:bg-stone-100">
                清空缓存
              </button>
            </>
          )}
          {state === 'done' && (
            <>
              <button onClick={() => handleGenerate(false)} className="flex-1 bg-stone-200 text-stone-700 py-3 rounded-lg hover:bg-stone-300">
                重新排盘
              </button>
              <PdfExporter targetId="reading-output" />
            </>
          )}
        </div>
      </div>

      {chart && (
        <div id="reading-output" className="max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-6">
          <ChartGrid data={chart} />
          <div className="bg-white p-6 rounded-xl shadow-sm border border-stone-200">
            <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
              <span className="w-2 h-6 bg-stone-800 rounded-full" />
              AI 白话盘解
            </h2>
            <div className="prose prose-stone max-w-none whitespace-pre-wrap text-stone-700 leading-relaxed min-h-[200px]">
              {reading || <span className="text-stone-400 animate-pulse">AI 正在排布星轨...</span>}
              {state === 'generating' && (
                <span className="inline-block w-2 h-5 ml-1 bg-stone-800 animate-pulse align-middle typing-cursor" />
              )}
            </div>
            {state === 'done' && (
              <div className="mt-4 pt-4 border-t border-stone-200 text-sm text-stone-500 flex justify-between">
                <span>解读已完成，数据已本地缓存</span>
                <span className="cursor-pointer hover:text-stone-800" onClick={handleClear}>清除</span>
              </div>
            )}
          </div>
        </div>
      )}
    </main>
  );
}
