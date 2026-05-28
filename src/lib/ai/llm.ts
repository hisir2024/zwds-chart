// 多引擎 AI 适配器（OpenAI SDK 流式封装）
import OpenAI from 'openai';

export type AIProvider = 'openai' | 'qwen' | 'deepseek';

interface ProviderConfig {
  apiKey: string;
  baseURL: string;
  defaultModel: string;
}

const PROVIDER_MAP: Record<AIProvider, ProviderConfig> = {
  openai:   { apiKey: process.env.OPENAI_API_KEY!,     baseURL: 'https://api.openai.com/v1',                          defaultModel: 'gpt-4o-mini' },
  qwen:     { apiKey: process.env.QWEN_API_KEY!,       baseURL: 'https://dashscope.aliyuncs.com/compatible-mode/v1',  defaultModel: 'qwen-plus' },
  deepseek: { apiKey: process.env.DEEPSEEK_API_KEY!,   baseURL: 'https://api.deepseek.com/v1',                        defaultModel: 'deepseek-chat' },
};

export async function streamReading(chart: any, provider: AIProvider = 'openai'): Promise<ReadableStream> {
  const config = PROVIDER_MAP[provider];
  if (!config?.apiKey) throw new Error(`${provider} API Key 未配置`);

  const client = new OpenAI({ apiKey: config.apiKey, baseURL: config.baseURL });

  const stream = await client.chat.completions.create({
    model: config.defaultModel,
    stream: true,
    messages: [
      { role: 'system', content: '你是精通《紫微斗数全书》与现代心理学的命理导师。请根据星盘输出结构化白话解读，语气平和笃定，避免术语堆砌，控制在600字内。' },
      { role: 'user', content: `【星盘数据】\n${JSON.stringify(chart, null, 2)}\n\n请从以下维度解读：\n1. 命身宫格局与性格底色\n2. 财帛/官禄/夫妻宫关键提示\n3. 当前大限走势与建议\n4. 三句修身指南` },
    ],
    temperature: 0.6,
    max_tokens: 800,
  });

  const encoder = new TextEncoder();
  return new ReadableStream({
    async start(controller) {
      for await (const chunk of stream) {
        const content = chunk.choices?.[0]?.delta?.content || '';
        if (content) controller.enqueue(encoder.encode(content));
      }
      controller.close();
    },
  });
}
