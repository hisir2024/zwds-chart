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

const SYSTEM_PROMPT = `你是精通《紫微斗数全书》《斗数宣微》与现代心理学的资深命理导师，擅长将古奥的星盘语言转化为深入浅出的人生指引。

解读要求：
1. 请输出3000字以上的详尽解读，不可敷衍简略。
2. 对每一颗命宫主星、身宫主星，须详细展开其五行属性、庙旺落陷状态、性格表现、人生影响。
3. 对三方四正（命宫的三合宫与对宫）须逐一分析其互动关系。
4. 对四化（化禄、化权、化科、化忌）须说明落在何星何宫，以及对命主的具体影响。
5. 对关键宫位（命宫、财帛、事业、夫妻、福德）须各写一段不少于150字的分析。
6. 分析当前大限与下一大限的运势走向。
7. 最后给出五条具体的修身建议，每条附带可操作的日常实践。
8. 语气平和笃定如长者，避免空洞套话，每一个判断都要有星盘依据。`;

export async function streamReading(chart: any, provider: AIProvider = 'openai'): Promise<ReadableStream> {
  const config = PROVIDER_MAP[provider];
  if (!config?.apiKey) throw new Error(`${provider} API Key 未配置`);

  const client = new OpenAI({ apiKey: config.apiKey, baseURL: config.baseURL });

  const stream = await client.chat.completions.create({
    model: config.defaultModel,
    stream: true,
    messages: [
      { role: 'system', content: SYSTEM_PROMPT },
      { role: 'user', content: `【星盘数据】\n${JSON.stringify(chart, null, 2)}\n\n请按以下框架展开详尽解读（每部分不可省略）：\n\n一、命身宫总论\n- 命宫主星详细分析（五行、庙旺落陷、性格底色、天赋与短板）\n- 身宫主星分析（后天努力方向、中年后运势转向）\n- 命身二宫互动关系\n\n二、三方四正分析\n- 对宫（迁移宫）对冲影响\n- 财帛宫三合来会\n- 事业宫三合来会\n- 三方整体格局判断\n\n三、十二宫精要\n- 命宫、兄弟、夫妻、子女、财帛、疾厄、迁移、交友、事业、田宅、福德、父母\n- 每宫简述星曜配置与人生相应领域之提示\n\n四、四化深解\n- 化禄：何星化禄，落何宫，财运机遇如何把握\n- 化权：何星化权，落何宫，权力与掌控力发挥在何处\n- 化科：何星化科，落何宫，名声才华如何彰显\n- 化忌：何星化忌，落何宫，人生课题与需谨慎之处\n\n五、大限走势\n- 当前所在大限及未来两个大限的运势简述\n\n六、修身指南\n- 五条针对此命盘的具体建议，每条附带可行的日常实践` },
    ],
    temperature: 0.7,
    max_tokens: 4096,
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
