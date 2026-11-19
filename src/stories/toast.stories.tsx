import { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { Toast, ToastProvider } from '../components/feedback';
import { Button } from '../components/ui/button';

const meta = {
  title: 'Feedback/Toast',
  component: Toast,
  tags: ['autodocs'],
} satisfies Meta<typeof Toast>;

export default meta;

export const Default: StoryObj<typeof Toast> = {
  render: () => {
    const [open, setOpen] = useState(false);
    const [undone, setUndone] = useState(false);

    return (
      <ToastProvider>
        <Button
          onClick={() => {
            setOpen(true);
            setUndone(false);
          }}
        >
          Archive draft
        </Button>
        <p role="status" className="mt-4">
          {undone ? 'Draft restored.' : ''}
        </p>
        <Toast
          title="Draft archived"
          description="It’s available in your archive."
          open={open}
          onOpenChange={setOpen}
          action={{
            label: 'Undo',
            altText: 'Restore the archived draft',
            onClick: () => setUndone(true),
          }}
        />
      </ToastProvider>
    );
  },
};
