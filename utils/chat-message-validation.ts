export interface ChatMessageLike {
  role: string;
  content?: unknown;
  tool_call_id?: string;
  tool_calls?: Array<{
    id?: string;
    type?: string;
    function?: {
      name?: string;
      arguments?: string;
    };
  }>;
}

export function normalizeMessagesForModel(messages: ChatMessageLike[]) {
  const normalized: ChatMessageLike[] = [];

  for (const [index, message] of messages.entries()) {
    if (message.role === 'tool') {
      const previousMessage = messages[index - 1];
      const previousToolCalls = previousMessage?.role === 'assistant' ? previousMessage.tool_calls : undefined;
      const hasMatchingToolCall = Boolean(
        previousToolCalls?.some((toolCall) => toolCall?.id && toolCall.id === message.tool_call_id),
      );

      if (!hasMatchingToolCall) {
        continue;
      }
    }

    normalized.push(message);
  }

  return normalized;
}
