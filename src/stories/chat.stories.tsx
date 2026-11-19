import { expect } from 'storybook/test';
import { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { ChatPanel, ChatComposer, type ChatMessageData } from '../components/chat';

const initial: ChatMessageData[] = [
  { id: '1', role: 'assistant', content: 'What are we making today?' },
  {
    id: '2',
    role: 'user',
    content: 'A campaign that feels like the end of a perfect summer.',
    attachments: [{ id: 'moodboard', name: 'moodboard.jpg' }],
  },
  {
    id: '3',
    role: 'assistant',
    content: 'Let’s start with warm light, open space, and one clear headline.',
    detail: {
      title: 'Creative direction',
      content: 'Late-afternoon color and landscape imagery.',
    },
  },
];

const meta = {
  title: 'AI/Chat panel',
  component: ChatPanel,
  tags: ['autodocs'],
  args: { messages: initial, onSend: () => {}, className: 'max-w-2xl' },
} satisfies Meta<typeof ChatPanel>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: (args) => {
    const [messages, setMessages] = useState(args.messages);

    return (
      <ChatPanel
        {...args}
        messages={messages}
        onSend={(text, files) =>
          setMessages((current) => [
            ...current,
            {
              id: crypto.randomUUID(),
              role: 'user',
              content: text,
              attachments: files.map((f, i) => ({
                id: String(i),
                name: f.name,
              })),
            },
            {
              id: crypto.randomUUID(),
              role: 'assistant',
              content:
                'Message received. This is a local component preview; connect your model through onSend.',
            },
          ])
        }
      />
    );
  },
};

export const Streaming: Story = {
  args: {
    busy: true,
    messages: [...initial, { id: '4', role: 'assistant', content: '' }],
  },
};

export const Empty: Story = { args: { messages: [] } };

export const Composer: StoryObj = {
  render: () => {
    const [sent, setSent] = useState('');

    return (
      <div className="max-w-xl space-y-4">
        <ChatComposer onSend={(text, files) => setSent(`${text} (${files.length} attachments)`)} />
        <p role="status">{sent}</p>
      </div>
    );
  },
};

export const ComposeWithAttachment: StoryObj = {
  ...Composer,
  play: async ({ canvas, userEvent, step }) => {
    const message = canvas.getByRole('textbox', { name: 'Message' });
    await step('Compose a multiline message and attach a reference', async () => {
      await expect(canvas.getByRole('button', { name: 'Send message' })).toBeDisabled();
      await userEvent.type(message, 'Warm light');
      await userEvent.keyboard('{Shift>}{Enter}{/Shift}');
      await userEvent.type(message, 'Open space');
      await expect(message).toHaveValue('Warm light\nOpen space');
      await userEvent.upload(
        canvas.getByLabelText('Attach files', { selector: 'input' }),
        new File(['reference'], 'reference.txt', { type: 'text/plain' }),
      );
      await expect(canvas.getByRole('button', { name: 'Remove reference.txt' })).toBeVisible();
    });
    await step('Enter submits once and clears the composer', async () => {
      await userEvent.click(message);
      await userEvent.keyboard('{Enter}');
      await expect(canvas.getByRole('status')).toHaveTextContent(
        'Warm light Open space (1 attachments)',
      );
      await expect(message).toHaveValue('');
      await expect(
        canvas.queryByRole('button', { name: 'Remove reference.txt' }),
      ).not.toBeInTheDocument();
      await expect(canvas.getByRole('button', { name: 'Send message' })).toBeDisabled();
    });
  },
};
