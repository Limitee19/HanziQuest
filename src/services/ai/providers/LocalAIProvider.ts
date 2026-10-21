import { AIProvider, AIRequest, AIResponse, AIModel, AIMessage } from '../aiTypes';

export class LocalAIProvider implements AIProvider {
  public id: 'local' = 'local';
  public name = 'Local AI (Ollama / Local Server)';

  private endpoint: string;
  private model: string;

  constructor(endpoint = 'http://localhost:11434', model = 'llama3.2') {
    this.endpoint = endpoint;
    this.model = model;
  }

  public async isAvailable(): Promise<boolean> {
    try {
      const res = await fetch(`${this.endpoint}/api/tags`, { method: 'GET' });
      return res.ok;
    } catch {
      return false;
    }
  }

  public async getAvailableModels(): Promise<AIModel[]> {
    return [
      { id: 'llama3.2', name: 'Llama 3.2 (Local Ollama)', provider: 'local', contextLength: 8192 },
      { id: 'mistral', name: 'Mistral 7B (Local Ollama)', provider: 'local', contextLength: 8192 },
      { id: 'qwen2.5', name: 'Qwen 2.5 (Local Ollama)', provider: 'local', contextLength: 8192 },
    ];
  }

  public async sendMessage(request: AIRequest): Promise<AIResponse> {
    const isAvail = await this.isAvailable();
    if (!isAvail) {
      throw new Error(`Local AI endpoint (${this.endpoint}) is not reachable. Please ensure Ollama or local inference server is running.`);
    }

    const payload = {
      model: request.model || this.model,
      messages: request.messages.map((m) => ({ role: m.role, content: m.content })),
      stream: false,
    };

    const res = await fetch(`${this.endpoint}/api/chat`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });

    if (!res.ok) {
      throw new Error(`Local AI server returned HTTP ${res.status}`);
    }

    const data = await res.json();
    const resultMessage: AIMessage = {
      id: `msg_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
      role: 'assistant',
      content: data.message?.content || '',
      timestamp: new Date().toISOString(),
    };

    return {
      message: resultMessage,
      finishReason: 'stop',
    };
  }
}
