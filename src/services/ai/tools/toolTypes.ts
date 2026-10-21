export type PermissionLevel = 'READ' | 'WRITE' | 'MODIFY' | 'DELETE' | 'SENSITIVE';

export type ToolSchemaItem = ToolParameterProperty | { type: 'object'; properties?: Record<string, ToolParameterProperty>; required?: string[] };

export interface ToolParameterProperty {
  type: 'string' | 'number' | 'boolean' | 'array' | 'object';
  description: string;
  enum?: string[];
  items?: ToolSchemaItem;
}

export interface ToolParametersSchema {
  type: 'object';
  properties: Record<string, ToolParameterProperty>;
  required?: string[];
}

export interface ToolDefinition {
  name: string;
  description: string;
  parameters: ToolParametersSchema;
  permissionLevel?: PermissionLevel;
  requiresConfirmation?: boolean;
}

export interface AIToolCall {
  id: string;
  toolName: string;
  arguments: Record<string, any>;
}

export interface AIToolResult {
  toolCallId: string;
  toolName: string;
  success: boolean;
  result?: any;
  error?: string;
}
