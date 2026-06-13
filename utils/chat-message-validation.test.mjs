import test from 'node:test';
import assert from 'node:assert/strict';
import { normalizeMessagesForModel } from './chat-message-validation.ts';

test('drops tool messages that are not preceded by a matching assistant tool call', () => {
  const messages = [
    { role: 'user', content: 'What is the weather?' },
    { role: 'tool', tool_call_id: 'call_123', content: '{"temp":22}' },
  ];

  assert.deepEqual(normalizeMessagesForModel(messages), [
    { role: 'user', content: 'What is the weather?' },
  ]);
});

test('drops tool messages when the preceding message is not an assistant tool-call message', () => {
  const messages = [
    { role: 'user', content: 'What is the weather?' },
    { role: 'assistant', content: 'Hello' },
    { role: 'tool', tool_call_id: 'call_123', content: '{"temp":22}' },
  ];

  assert.deepEqual(normalizeMessagesForModel(messages), [
    { role: 'user', content: 'What is the weather?' },
    { role: 'assistant', content: 'Hello' },
  ]);
});

test('keeps tool messages when they follow a matching assistant tool call', () => {
  const messages = [
    { role: 'user', content: 'What is the weather?' },
    {
      role: 'assistant',
      content: '',
      tool_calls: [{ id: 'call_123', type: 'function', function: { name: 'get_weather', arguments: '{"city":"London"}' } }],
    },
    { role: 'tool', tool_call_id: 'call_123', content: '{"temp":22}' },
    { role: 'assistant', content: 'It is 22°C in London.' },
  ];

  assert.deepEqual(normalizeMessagesForModel(messages), messages);
});
