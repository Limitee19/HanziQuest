import { ToolDefinition, AIToolCall, AIToolResult } from './tools/toolTypes';

export * from './tools/toolTypes';

export type AIRole = 'system' | 'user' | 'assistant' | 'tool';

export interface AIMessage {
  id: string;
  role: AIRole;
  content: string;
  toolCalls?: AIToolCall[];
  toolResult?: AIToolResult;
  timestamp: string;
}

export interface AIRequest {
  messages: AIMessage[];
  tools?: ToolDefinition[];
  model?: string;
  temperature?: number;
}

export interface AIResponse {
  message: AIMessage;
  finishReason?: string;
  usage?: {
    promptTokens: number;
    completionTokens: number;
    totalTokens: number;
  };
}

export interface AIModel {
  id: string;
  name: string;
  provider: 'groq' | 'gemini' | 'local';
  contextLength?: number;
}

export interface AISettings {
  enabled: boolean;
  activeProvider: 'groq' | 'gemini' | 'local';
  groqApiKey: string;
  groqModel: string;
  geminiApiKey: string;
  geminiModel: string;
  localEndpoint: string;
  localModel: string;
  privacyMode: 'standard' | 'restricted' | 'local_only';
}

export interface AIProvider {
  id: 'groq' | 'gemini' | 'local';
  name: string;
  sendMessage(request: AIRequest): Promise<AIResponse>;
  isAvailable(): Promise<boolean>;
  getAvailableModels(): Promise<AIModel[]>;
}
