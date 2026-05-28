// API 流式路由（SSE）
import { NextRequest, NextResponse } from 'next/server';
import { streamReading } from '@/lib/ai/llm';

export async function POST(req: NextRequest) {
  const { chart, provider = 'openai' } = await req.json();

  if (!chart) return NextResponse.json({ error: '缺少星盘数据' }, { status: 400 });
  if (!['openai', 'qwen', 'deepseek'].includes(provider)) {
    return NextResponse.json({ error: '不支持的AI引擎' }, { status: 400 });
  }

  try {
    const stream = await streamReading(chart, provider);
    return new NextResponse(stream, {
      headers: { 'Content-Type': 'text/event-stream' },
    });
  } catch (error: any) {
    console.error(`[${provider}] 解读失败:`, error.message);
    return NextResponse.json({ error: `引擎暂不可用 (${error.message})` }, { status: 500 });
  }
}
