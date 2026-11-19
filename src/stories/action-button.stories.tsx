import { useState, useEffect, useRef } from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { ActionButton } from '../components/action-button';
import { Download } from 'lucide-react';

const meta = {
  title: 'Forms/Action button',
  component: ActionButton,
  tags: ['autodocs'],
} satisfies Meta<typeof ActionButton>;

export default meta;

export const Default: StoryObj<typeof ActionButton> = {
  args: { children: 'Export images', leadingIcon: <Download /> },
};

export const Loading: StoryObj<typeof ActionButton> = {
  args: {
    children: 'Export images',
    loading: true,
    loadingLabel: 'Exporting images',
  },
};

export const Interactive: StoryObj<typeof ActionButton> = {
  render: () => {
    const [loading, setLoading] = useState(false);
    const [status, setStatus] = useState('');
    const timer = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);
    useEffect(() => () => clearTimeout(timer.current), []);

    return (
      <div className="space-y-3">
        <ActionButton
          loading={loading}
          loadingLabel="Exporting images"
          leadingIcon={<Download />}
          onClick={() => {
            setLoading(true);
            setStatus('');
            timer.current = setTimeout(() => {
              setLoading(false);
              setStatus('Export preview complete.');
            }, 900);
          }}
        >
          Export images
        </ActionButton>
        <p role="status" className="text-sm">
          {status}
        </p>
      </div>
    );
  },
};
