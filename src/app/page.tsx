'use client';
import { useState, useRef, useEffect } from 'react';
import { generateChart } from '@/lib/zwds/calculate';
import ChartGrid from '@/components/ChartGrid';
import EngineSwitcher from '@/components/EngineSwitcher';
import PdfExporter from '@/components/PdfExporter';
import { AIProvider } from '@/lib/ai/llm';
import { saveCache, loadCache, clearCache } from '@/lib/stream-cache';

type StreamState = 'idle' | 'generating' | 'done' | 'interrupted';

const labelCls = 'block text-[11px] text-[var(--ink-light)] mb-1.5 tracking-[2px]';
const inputCls = 'w-full px-3 py-2 bg-[#faf7f0] border border-[rgba(60,50,40,0.15)] rounded text-sm text-[var(--ink)] placeholder:text-[#b5a890] focus:outline-none focus:border-[#b8860b] focus:ring-1 focus:ring-[rgba(184,134,11,0.15)] transition-all font-serif';

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
        setReading(err.error || '推演受阻，请稍后重试');
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
        } catch { break; }
      }
      if (fullText) setState('done');
    } catch (err: any) {
      if (err.name !== 'AbortError') {
        setReading('网络不畅，草稿已留存。请稍后点击"续传"。');
        setState('interrupted');
      }
    } finally {
      abortRef.current = null;
    }
  };

  const handleStop = () => { abortRef.current?.abort(); abortRef.current = null; setState('interrupted'); };
  const handleClear = () => { clearCache(); setChart(null); setReading(''); setState('idle'); };

  return (
    <main className="min-h-screen pb-16 cloud-pattern">
      {/* ===== 顶部：牌匾式标题 ===== */}
      <header className="text-center pt-10 pb-6 relative">
        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-[rgba(184,134,11,0.3)] to-transparent" />
        <h1 className="text-4xl brush-title text-[var(--ink)] tracking-[12px]">紫微斗数</h1>
        <p className="text-xs text-[var(--ink-light)] tracking-[8px] mt-3">先天命盘 · 排盘系统</p>
        <div className="flex justify-center gap-4 mt-2">
          <span className="text-[10px] text-[var(--vermillion)] tracking-[2px]">命</span>
          <span className="text-[10px] text-[var(--ink-light)] tracking-[2px]">身</span>
          <span className="text-[10px] text-[var(--jade)] tracking-[2px]">运</span>
          <span className="text-[10px] text-[var(--ink-light)] tracking-[2px]">局</span>
        </div>
        <div className="ink-line mt-5 max-w-lg mx-auto" />
      </header>

      {/* ===== 输入区：水墨画框 ===== */}
      <section className="max-w-3xl mx-auto px-6 mb-8">
        <div className="ink-frame rounded-lg p-6 bg-[#faf7f0]">
          <div className="flex items-center gap-3 mb-5">
            <span className="w-1 h-5 bg-[var(--vermillion)] rounded-full" />
            <h2 className="text-sm tracking-[4px] text-[var(--ink)]">出生信息</h2>
          </div>

          {/* 第一行：日期 + 时间 */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
            <div>
              <label className={labelCls}>阳历生日</label>
              <input type="date" defaultValue={`${birth.year}-${String(birth.month).padStart(2,'0')}-${String(birth.day).padStart(2,'0')}`}
                onChange={e => { const [y,m,d] = e.target.value.split('-').map(Number); setBirth({...birth, year:y, month:m, day:d}); }}
                className={inputCls} />
            </div>
            <div>
              <label className={labelCls}>时辰</label>
              <select value={birth.hour} onChange={e => setBirth({...birth, hour:+e.target.value})} className={inputCls}>
                {[
                  '子 23-01','丑 01-03','寅 03-05','卯 05-07','辰 07-09','巳 09-11',
                  '午 11-13','未 13-15','申 15-17','酉 17-19','戌 19-21','亥 21-23'
                ].map((s,i) => <option key={i} value={i}>{s}时</option>)}
              </select>
            </div>
            <div>
              <label className={labelCls}>性别</label>
              <select value={birth.gender} onChange={e => setBirth({...birth, gender:e.target.value as any})} className={inputCls}>
                <option value="男">乾造（男）</option>
                <option value="女">坤造（女）</option>
              </select>
            </div>
            <div>
              <label className={labelCls}>出生经度</label>
              <input type="number" value={birth.longitude} onChange={e => setBirth({...birth, longitude:+e.target.value})}
                className={inputCls} step="0.1" />
            </div>
          </div>

          {/* 引擎选择 */}
          <div className="mb-2">
            <label className={labelCls}>推演引擎</label>
            <EngineSwitcher current={provider} onChange={setProvider} />
          </div>

          {/* 按钮组 */}
          <div className="flex gap-3 mt-5 pt-4" style={{borderTop: '1px solid rgba(60,50,40,0.08)'}}>
            {state === 'idle' && (
              <button onClick={() => handleGenerate(false)}
                className="flex-1 py-3 rounded tracking-[6px] text-sm text-[#faf7f0] transition-all duration-300"
                style={{background: 'linear-gradient(135deg, #b8860b, #9a6f0b)', boxShadow: '0 2px 8px rgba(184,134,11,0.25)'}}>
                起 盘 推 演
              </button>
            )}
            {state === 'generating' && (
              <button onClick={handleStop}
                className="flex-1 py-3 rounded tracking-[4px] text-sm text-[#faf7f0] bg-[var(--vermillion)] hover:opacity-90 transition-all">
                中断推演
              </button>
            )}
            {state === 'interrupted' && (
              <>
                <button onClick={() => handleGenerate(true)}
                  className="flex-1 py-3 rounded tracking-[4px] text-sm text-[#faf7f0] transition-all"
                  style={{background: 'linear-gradient(135deg, #b8860b, #9a6f0b)'}}>
                  从断点续传
                </button>
                <button onClick={handleClear}
                  className="px-4 py-3 rounded text-sm text-[var(--ink-light)] border border-[rgba(60,50,40,0.15)] hover:bg-[rgba(60,50,40,0.04)] transition-all">
                  清空
                </button>
              </>
            )}
            {state === 'done' && (
              <>
                <button onClick={() => handleGenerate(false)}
                  className="flex-1 py-3 rounded tracking-[4px] text-sm border border-[rgba(60,50,40,0.2)] text-[var(--ink)] hover:bg-[rgba(60,50,40,0.04)] transition-all">
                  重新排盘
                </button>
                <PdfExporter targetId="reading-output" />
              </>
            )}
          </div>
        </div>
      </section>

      {/* ===== 输出区 ===== */}
      {chart && (
        <section id="reading-output" className="max-w-3xl mx-auto px-6 space-y-6">
          {/* 命盘网格 */}
          <ChartGrid data={chart} />

          {/* 白话盘解 */}
          <div className="ink-frame rounded-lg p-6 bg-[#faf7f0]">
            <div className="flex items-center gap-3 mb-4">
              <span className="w-1 h-5 bg-[var(--jade)] rounded-full" />
              <h2 className="text-sm tracking-[4px] text-[var(--ink)]">白话盘解</h2>
              {state === 'generating' && (
                <span className="text-[10px] text-[var(--vermillion)] animate-pulse tracking-[2px]">推演中...</span>
              )}
            </div>
            <div className="text-sm leading-loose text-[var(--ink-light)] min-h-[200px] whitespace-pre-wrap font-serif">
              {reading || <span className="text-[#b5a890]">AI 正排布星轨，推演命局...</span>}
              {state === 'generating' && (
                <span className="typing-cursor" />
              )}
            </div>
            {state === 'done' && (
              <div className="mt-5 pt-4 flex justify-between text-[11px] text-[#b5a890] tracking-[1px]" style={{borderTop: '1px solid rgba(60,50,40,0.08)'}}>
                <span>解读已毕 · 命盘已存</span>
                <span className="cursor-pointer hover:text-[var(--vermillion)] transition-colors" onClick={handleClear}>清除重来</span>
              </div>
            )}
          </div>
        </section>
      )}

      {/* ===== 页脚 ===== */}
      <footer className="text-center mt-12 py-6">
        <div className="ink-line max-w-md mx-auto mb-4" />
        <p className="text-[10px] text-[#b5a890] tracking-[4px]">
          天地定位 · 山泽通气 · 雷风相薄 · 水火不相射
        </p>
        <p className="text-[10px] text-[#b5a890] mt-2 tracking-[2px]">
          八卦相错 · 数往者顺 · 知来者逆
        </p>
      </footer>
    </main>
  );
}
