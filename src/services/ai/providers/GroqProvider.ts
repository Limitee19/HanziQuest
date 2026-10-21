import { AIProvider, AIRequest, AIResponse, AIModel, AIMessage } from '../aiTypes';

export class GroqProvider implements AIProvider {
  public id: 'groq' = 'groq';
  public name = 'Groq Cloud AI';

  private apiKey: string;
  private defaultModel: string;

  constructor(apiKey: string, defaultModel = 'openai/gpt-oss-120b') {
    this.apiKey = apiKey;
    this.defaultModel = defaultModel;
  }

  public async isAvailable(): Promise<boolean> {
    return Boolean(this.apiKey && this.apiKey.trim().length > 0);
  }

  public async getAvailableModels(): Promise<AIModel[]> {
    // Only models accessible on the FREE developer plan (verified via /models API).
    // Llama models are Enterprise-only now and return 404 on free keys.
    return [
      { id: 'openai/gpt-oss-120b', name: 'GPT OSS 120B — Recommended (Groq)', provider: 'groq', contextLength: 131072 },
      { id: 'openai/gpt-oss-20b', name: 'GPT OSS 20B — Fastest (Groq)', provider: 'groq', contextLength: 131072 },
      { id: 'qwen/qwen3.6-27b', name: 'Qwen 3.6 27B + Vision (Groq)', provider: 'groq', contextLength: 131072 },
    ];
  }

  /** Defensive cleanup: strips stray backticks/whitespace that can sneak in via pasted config values. */
  private cleanModelId(raw: string): string {
    return String(raw || '').trim().replace(/[`'"]/g, '');
  }

  public async sendMessage(request: AIRequest): Promise<AIResponse> {
    if (!this.apiKey) {
      throw new Error('Groq API Key is not configured. Please set your Groq API key in AI Assistant Settings.');
    }

    const modelToUse = this.cleanModelId(request.model || this.defaultModel);

    // Convert AIMessages to OpenAI/Groq API payload format
    const formattedMessages = request.messages.flatMap((m) => {
      // Tool result messages: each tool call needs its own 'tool' role message
      if (m.role === 'tool' && m.toolResult) {
        return [{
          role: 'tool' as const,
          tool_call_id: m.toolResult.toolCallId,
          // API requires string content; use result or error text
          content: typeof m.content === 'string' ? m.content : JSON.stringify(m.toolResult.result ?? m.toolResult.error ?? ''),
        }];
      }

      const msgObj: any = { role: m.role };

      if (m.role === 'assistant' && m.toolCalls && m.toolCalls.length > 0) {
        // OpenAI spec: when assistant message has tool_calls, content MUST be null (not '').
        // Sending content:'' causes "model output must contain either output text or tool calls" on the next turn.
        msgObj.content = m.content || null;
        msgObj.tool_calls = m.toolCalls.map((tc) => ({
          id: tc.id,
          type: 'function',
          function: {
            name: tc.toolName,
            arguments: JSON.stringify(tc.arguments || {}),
          },
        }));
      } else {
        msgObj.content = m.content || '';
      }

      return [msgObj];
    });

    // Format tools payload if provided
    let formattedTools: any[] | undefined = undefined;
    if (request.tools && request.tools.length > 0) {
      formattedTools = request.tools.map((t) => ({
        type: 'function',
        function: {
          name: t.name,
          description: t.description,
          parameters: t.parameters,
        },
      }));
    }

    const payload: any = {
      model: modelToUse,
      messages: formattedMessages,
      temperature: request.temperature ?? 0.3,
    };

    if (formattedTools) {
      payload.tools = formattedTools;
      payload.tool_choice = 'auto';
    }

    const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${this.apiKey}`,
      },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      const errText = await response.text();
      console.error('Groq API Error Output:', errText);
      throw new Error(`Groq API returned HTTP ${response.status}: ${errText}`);
    }

    const data = await response.json();
    const choice = data.choices[0];
    const message = choice.message;

    // Parse tool calls if any
    let parsedToolCalls: any[] | undefined = undefined;
    if (message.tool_calls && message.tool_calls.length > 0) {
      parsedToolCalls = message.tool_calls.map((tc: any) => {
        let parsedArgs = {};
        try {
          parsedArgs = JSON.parse(tc.function.arguments || '{}');
        } catch (e) {
          console.error('Failed to parse tool call arguments:', tc.function.arguments);
        }
        return {
          id: tc.id,
          toolName: tc.function.name,
          arguments: parsedArgs,
        };
      });
    }

    const resultMessage: AIMessage = {
      id: `msg_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
      role: 'assistant',
      content: message.content || '',
      toolCalls: parsedToolCalls,
      timestamp: new Date().toISOString(),
    };

    return {
      message: resultMessage,
      finishReason: choice.finish_reason,
      usage: data.usage
        ? {
            promptTokens: data.usage.prompt_tokens,
            completionTokens: data.usage.completion_tokens,
            totalTokens: data.usage.total_tokens,
          }
        : undefined,
    };
  }
}
