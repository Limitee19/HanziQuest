import { executeSql, selectSql } from '@/db/client';
import { AISettings, AIRequest, AIMessage, AIProvider } from './aiTypes';
import { GroqProvider } from './providers/GroqProvider';
import { GeminiProvider } from './providers/GeminiProvider';
import { LocalAIProvider } from './providers/LocalAIProvider';

const DEFAULT_SETTINGS: AISettings = {
  enabled: true,
  activeProvider: 'groq',
  // SECURITY: NEVER hardcode API keys here! The real key is entered via
  // AI Assistant -> Config and stored in the local database (app_metadata).
  groqApiKey: '',
  groqModel: 'openai/gpt-oss-120b',
  geminiApiKey: '',
  geminiModel: 'gemini-flash-latest',
  localEndpoint: 'http://localhost:11434',
  localModel: 'llama3.2',
  privacyMode: 'standard',
};


export async function fetchAISettings(): Promise<AISettings> {
  // Sanitize values read from DB: older saves may contain stray backticks/quotes
  // copied from markdown-formatted text (causes Groq HTTP 404 model_not_found / 401).
  const clean = (raw: any): string => String(raw ?? '').trim().replace(/[`'"]/g, '');

  try {
    const rows = await selectSql<any>(`SELECT key, value FROM app_metadata WHERE key LIKE 'ai_%';`);
    const kvMap: Record<string, string> = {};
    rows.forEach((r) => {
      kvMap[r.key] = r.value;
    });

    return {
      enabled: kvMap['ai_enabled'] !== 'false',
      activeProvider: (kvMap['ai_activeProvider'] as any) || DEFAULT_SETTINGS.activeProvider,
      groqApiKey: clean(kvMap['ai_groqApiKey']) || DEFAULT_SETTINGS.groqApiKey,
      groqModel: clean(kvMap['ai_groqModel']) || DEFAULT_SETTINGS.groqModel,
      geminiApiKey: clean(kvMap['ai_geminiApiKey']) || DEFAULT_SETTINGS.geminiApiKey,
      geminiModel: clean(kvMap['ai_geminiModel']) || DEFAULT_SETTINGS.geminiModel,
      localEndpoint: clean(kvMap['ai_localEndpoint']) || DEFAULT_SETTINGS.localEndpoint,
      localModel: clean(kvMap['ai_localModel']) || DEFAULT_SETTINGS.localModel,
      privacyMode: (kvMap['ai_privacyMode'] as any) || DEFAULT_SETTINGS.privacyMode,
    };
  } catch (err) {
    console.error('Error fetching AI settings:', err);
    return DEFAULT_SETTINGS;
  }
}

export async function saveAISettings(settings: Partial<AISettings>): Promise<void> {
  const now = new Date().toISOString();
  // Sanitize: strip stray backticks/quotes/spaces that break API calls
  // (e.g. model names or keys accidentally copied WITH markdown formatting).
  const sanitize = (raw: any): string => String(raw ?? '').trim().replace(/[`'"]/g, '');

  for (const [key, val] of Object.entries(settings)) {
    const dbKey = `ai_${key}`;
    const stringVal =
      key === 'groqApiKey' || key === 'groqModel' || key === 'geminiApiKey' || key === 'geminiModel' || key === 'localEndpoint' || key === 'localModel'
        ? sanitize(val)
        : String(val ?? '');
    const existing = await selectSql<any>(`SELECT key FROM app_metadata WHERE key = ? LIMIT 1;`, [dbKey]);
    if (existing.length > 0) {
      await executeSql(`UPDATE app_metadata SET value = ?, updated_at = ? WHERE key = ?;`, [stringVal, now, dbKey]);
    } else {
      await executeSql(`INSERT INTO app_metadata (key, value, created_at, updated_at) VALUES (?, ?, ?, ?);`, [dbKey, stringVal, now, now]);
    }
  }
}

export function getActiveProvider(settings: AISettings): AIProvider {
  if (settings.activeProvider === 'gemini') {
    return new GeminiProvider(settings.geminiApiKey, settings.geminiModel);
  }
  if (settings.activeProvider === 'local') {
    return new LocalAIProvider(settings.localEndpoint, settings.localModel);
  }
  return new GroqProvider(settings.groqApiKey, settings.groqModel);
}

/** Model aktif sesuai provider yang dipilih (untuk field `model` AIRequest). */
export function activeModelFor(settings: AISettings): string {
  switch (settings.activeProvider) {
    case 'gemini': return settings.geminiModel;
    case 'local': return settings.localModel;
    default: return settings.groqModel;
  }
}

/**
 * General Chat mode ("Ask Anything") — free-form conversation like ChatGPT.
 * No domain tools are exposed; only a lightweight system prompt is used so the
 * model can answer ANY question (Mandarin study help, general knowledge, etc.).
 */
export async function processGeneralChatTurn(
  userMessageContent: string,
  history: AIMessage[],
  settings: AISettings
): Promise<{ messages: AIMessage[] }> {
  const provider = getActiveProvider(settings);

  const systemPrompt: AIMessage = {
    id: 'sys_general_chat',
    role: 'system',
    content: `You are OmniLife Mandarin AI Chat, a friendly, knowledgeable, and versatile assistant inside the OmniLife Mandarin app.

Current Date: ${new Date().toISOString().slice(0, 10)} (${new Date().toLocaleDateString('en-US', { weekday: 'long' })})

You can help with ANYTHING the user asks, including:
- Mandarin learning (HSK vocabulary, 汉字, grammar 语法, pinyin, listening practice)
- General knowledge, writing, coding, daily life advice

Guidelines:
- Reply in the SAME LANGUAGE the user writes in (Indonesian, English, 中文, etc.).
- Be clear, structured, and helpful. Use lists/headings when it improves readability.
- You do NOT have access to the user's personal app data. Data lives locally in SQLite only.`,
    timestamp: new Date().toISOString(),
  };

  const userMsg: AIMessage = {
    id: `msg_usr_${Date.now()}`,
    role: 'user',
    content: userMessageContent,
    timestamp: new Date().toISOString(),
  };

  const request: AIRequest = {
    messages: [systemPrompt, ...history, userMsg],
    model: activeModelFor(settings),
  };

  const response = await provider.sendMessage(request);

  return { messages: [userMsg, response.message] };
}
