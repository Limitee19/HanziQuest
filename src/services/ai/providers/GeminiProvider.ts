import { AIProvider, AIRequest, AIResponse, AIModel, AIMessage } from '../aiTypes';

const GEMINI_BASE = 'https://generativelanguage.googleapis.com/v1beta';

/** Model gratis yang tersedia via API key Google AI Studio. */
export const GEMINI_MODELS: AIModel[] = [
  { id: 'gemini-flash-latest', name: 'Gemini Flash (Latest) — Recommended', provider: 'gemini', contextLength: 1_048_576 },
  { id: 'gemini-flash-lite-latest', name: 'Gemini Flash-Lite (Latest) — Fastest', provider: 'gemini', contextLength: 1_048_576 },
  { id: 'gemini-2.5-flash', name: 'Gemini 2.5 Flash', provider: 'gemini', contextLength: 1_048_576 },
  { id: 'gemini-2.5-flash-lite', name: 'Gemini 2.5 Flash-Lite', provider: 'gemini', contextLength: 1_048_576 },
];

/**
 * GeminiProvider — Google AI Studio (generativelanguage REST API).
 * Plain chat only: user/assistant messages → contents[], system prompt → systemInstruction.
 */
export class GeminiProvider implements AIProvider {
  public id: 'gemini' = 'gemini';
  public name = 'Google Gemini AI';

  private apiKey: string;
  private defaultModel: string;

  constructor(apiKey: string, defaultModel = 'gemini-flash-latest') {
    this.apiKey = String(apiKey || '').trim().replace(/[`'"]/g, '');
    this.defaultModel = String(defaultModel || 'gemini-flash-latest').trim().replace(/[`'"]/g, '');
  }

  public async isAvailable(): Promise<boolean> {
    return Boolean(this.apiKey);
  }

  public async getAvailableModels(): Promise<AIModel[]> {
    return GEMINI_MODELS;
  }

  /** system prompt → systemInstruction field. */
  private extractSystemInstruction(messages: AIMessage[]): { parts: { text: string }[] } | undefined {
    const systemParts = messages.filter((m) => m.role === 'system').map((m) => m.content).filter(Boolean);
    if (systemParts.length === 0) return undefined;
    return { parts: [{ text: systemParts.join('\n\n') }] };
  }

  /** Riwayat non-system → contents[] Gemini. */
  private toContents(messages: AIMessage[]): any[] {
    const contents: any[] = [];
    for (const m of messages) {
      const role = m.role === 'assistant' ? 'model' : 'user';
      const parts: any[] = [];
      if (m.content) parts.push({ text: m.content });
      if (parts.length === 0) parts.push({ text: '' });
      contents.push({ role, parts });
    }
    return contents;
  }

  public async sendMessage(request: AIRequest): Promise<AIResponse> {
    if (!this.apiKey) {
      throw new Error('Gemini API Key belum diatur. Buka Settings AI untuk memasukkan kunci dari aistudio.google.com.');
    }

    const model = (request.model || this.defaultModel).replace(/^models\//, '');
    const url = `${GEMINI_BASE}/models/${encodeURIComponent(model)}:generateContent?key=${encodeURIComponent(this.apiKey)}`;

    const payload: any = {
      contents: this.toContents(request.messages),
      systemInstruction: this.extractSystemInstruction(request.messages),
      generationConfig: {
        temperature: request.temperature ?? 0.3,
      },
    };


    const response = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      const errText = await response.text().catch(() => '');
      console.error('Gemini API Error:', errText.slice(0, 400));
      if (response.status === 429) {
        throw new Error(`Gemini kuota habis (HTTP 429). Coba lagi nanti atau ganti provider.`);
      }
      throw new Error(`Gemini API returned HTTP ${response.status}: ${errText.slice(0, 300)}`);
    }

    const data = await response.json();
    const candidate = data?.candidates?.[0];
    const parts: any[] = candidate?.content?.parts || [];

    let text = '';
    for (const part of parts) {
      if (part.text) text += part.text;
    }

    const resultMessage: AIMessage = {
      id: `msg_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
      role: 'assistant',
      content: text,
      timestamp: new Date().toISOString(),
    };

    return {
      message: resultMessage,
      finishReason: candidate?.finishReason,
      usage: data?.usageMetadata
        ? {
            promptTokens: data.usageMetadata.promptTokenCount ?? 0,
            completionTokens: data.usageMetadata.candidatesTokenCount ?? 0,
            totalTokens: data.usageMetadata.totalTokenCount ?? 0,
          }
        : undefined,
    };
  }
}
