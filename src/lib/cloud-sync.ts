// 云端同步（Supabase）
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export const syncToCloud = async (chart: any, text: string, provider: string) => {
  const userId = localStorage.getItem('zwds_user_id') || crypto.randomUUID();
  localStorage.setItem('zwds_user_id', userId);
  await supabase.from('user_readings').upsert({
    user_id: userId, chart_data: chart, reading_text: text, provider, updated_at: new Date().toISOString()
  }, { onConflict: 'user_id' });
};

export const loadFromCloud = async () => {
  const userId = localStorage.getItem('zwds_user_id');
  if (!userId) return null;
  const { data } = await supabase.from('user_readings').select('*').eq('user_id', userId).single();
  return data?.reading_text ? {
    chart: data.chart_data, text: data.reading_text, provider: data.provider, ts: new Date(data.updated_at).getTime()
  } : null;
};
