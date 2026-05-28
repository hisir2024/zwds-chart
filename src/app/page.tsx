'use client';
import { useState, useRef, useEffect } from 'react';
import { generateChart } from '@/lib/zwds/calculate';
import ChartGrid from '@/components/ChartGrid';
import EngineSwitcher from '@/components/EngineSwitcher';
import PdfExporter from '@/components/PdfExporter';
import { AIProvider } from '@/lib/ai/llm';
import { saveCache, loadCache, clearCache } from '@/lib/stream-cache';

type StreamState = 'idle' | 'generating' | 'done' | 'interrupted';

const inputCls = 'p-2 bg-[#0d1b2a] border border-[#2a3a6a] rounded text-[#e0d5c1] text-sm focus:outline-none focus:border-[#f0d68a] placeholder:text-[#5a4a3a]';

export default function Home() {
  const [birth, setBirth] = useState({ year: 1995, month: 8, day: 15, hour: 14, minute: 20, longitude: 112.4, gender: '男' as const });
  const [provider, setProvider] = useState<AIProvider>('deepseek');
  const [chart, setChart] = useState<any>(null);
  const [reading, setReading] = useState('');
  const [state, setState] = useState<StreamState>('idle');
  const abortRef = useRef<AbortController | null>(null);

  useEffect(() => {
    const cached = loadCache();
    if (cached?.text && cached.chartData) {
      setChart(cached.chartData);
      setReading(cached.text);
      setProvider(cached.provider as AIProvider);
      setState('done');
    }
  }, []);

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
        setReading(err.error || '生成失败');
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
        setReading('网络异常或推理超时，已保留草稿。');
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
    <main className="min-h-screen bg-[#1a1a2e] p-6">
      <h1 className="text-2xl font-bold text-center mb-2 text-[#f0d68a] tracking-[6px]">✦ 紫微斗数 ✦</h1>
      <p className="text-center text-[#8b7d6b] text-sm mb-6">命 盘 排 盘 系 统</p>

      {/* 输入区 */}
      <div className="max-w-4xl mx-auto bg-[#16213e] border border-[#2a3a6a] p-6 rounded-xl mb-6">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
          <div>
            <label className="block text-xs text-[#8b7d6b] mb-1">阳历生日</label>
            <input type="date" defaultValue={`${birth.year}-${String(birth.month).padStart(2,'0')}-${String(birth.day).padStart(2,'0')}`} onChange={e => { const [y,m,d] = e.target.value.split('-').map(Number); setBirth({...birth, year: y, month: m, day: d}); }} className={inputCls + ' w-full'} />
          </div>
          <div>
            <label className="block text-xs text-[#8b7d6b] mb-1">出生时间</label>
            <select value={birth.hour} onChange={e => setBirth({...birth, hour: +e.target.value})} className={inputCls + ' w-full'}>
              <option value="0">子时 23:00-01:00</option><option value="1">丑时 01:00-03:00</option>
              <option value="2">寅时 03:00-05:00</option><option value="3">卯时 05:00-07:00</option>
              <option value="4">辰时 07:00-09:00</option><option value="5">巳时 09:00-11:00</option>
              <option value="6">午时 11:00-13:00</option><option value="7">未时 13:00-15:00</option>
              <option value="8">申时 15:00-17:00</option><option value="9">酉时 17:00-19:00</option>
              <option value="10">戌时 19:00-21:00</option><option value="11">亥时 21:00-23:00</option>
            </select>
          </div>
          <div>
            <label className="block text-xs text-[#8b7d6b] mb-1">性别</label>
            <select value={birth.gender} onChange={e => setBirth({...birth, gender: e.target.value as any})} className={inputCls + ' w-full'}>
              <option value="男">男</option><option value="女">女</option>
            </select>
          </div>
          <div>
            <label className="block text-xs text-[#8b7d6b] mb-1">出生地经度</label>
            <input type="number" value={birth.longitude} onChange={e => setBirth({...birth, longitude: +e.target.value})} className={inputCls + ' w-full'} placeholder="112.4" step="0.1" />
          </div>
        </div>

        <div className="flex flex-col gap-3">
          <label className="block text-xs text-[#8b7d6b]">AI 引擎</label>
          <EngineSwitcher current={provider} onChange={setProvider} />
        </div>

        <div className="flex gap-3 mt-4">
          {state === 'idle' && (
            <button onClick={() => handleGenerate(false)} className="flex-1 bg-[#c9a84c] text-[#1a1a2e] py-3 rounded-lg font-bold tracking-[2px] hover:bg-[#d4b85a] transition-colors">
              开 始 排 盘
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
              <button onClick={handleClear} className="px-4 py-3 border border-[#2a3a6a] text-[#8b7d6b] rounded-lg hover:bg-[#0f3460]">
                清空
              </button>
            </>
          )}
          {state === 'done' && (
            <>
              <button onClick={() => handleGenerate(false)} className="flex-1 bg-[#2a3a6a] text-[#e0d5c1] py-3 rounded-lg hover:bg-[#3a4a7a] transition-colors">
                重新排盘
              </button>
              <PdfExporter targetId="reading-output" />
            </>
          )}
        </div>
      </div>

      {/* 输出区 */}
      {chart && (
        <div id="reading-output" className="max-w-4xl mx-auto space-y-6">
          <ChartGrid data={chart} />

          <div className="bg-[#0d1b2a] border border-[#2a3a6a] p-6 rounded-xl">
            <h2 className="text-lg font-bold mb-4 flex items-center gap-2 text-[#f0d68a]">
              <span className="w-1.5 h-5 bg-[#f0d68a] rounded-full" />
              AI 白话盘解
            </h2>
            <div className="whitespace-pre-wrap text-[#d0c8b8] leading-relaxed min-h-[200px] text-sm">
              {reading || <span className="text-[#8b7d6b] animate-pulse">AI 正在排布星轨...</span>}
              {state === 'generating' && (
                <span className="inline-block w-2 h-5 ml-1 bg-[#f0d68a] animate-pulse align-middle" />
              )}
            </div>
            {state === 'done' && (
              <div className="mt-4 pt-4 border-t border-[#1a2a4a] text-sm text-[#8b7d6b] flex justify-between">
                <span>解读已完成，数据已本地缓存</span>
                <span className="cursor-pointer hover:text-[#e0d5c1]" onClick={handleClear}>清除</span>
              </div>
            )}
          </div>
        </div>
      )}
    </main>
  );
}
