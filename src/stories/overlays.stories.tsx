import { expect, waitFor, within } from 'storybook/test';
import { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { DetailsPanel, ConfirmDialog, Modal } from '../components/overlays';
import { Button } from '../components/ui/button';
import { ImageFade } from '../components/image-fade';
import storyExamples1 from './overlays.stories.tsx?examples';

function DetailsExample() {
  const [open, setOpen] = useState(false);

  return (
    <DetailsPanel
      open={open}
      onOpenChange={setOpen}
      title="After the sunset"
      description="Moodboard / Retrowave exploration"
      trigger={<Button>Open details</Button>}
      footer={<Button onClick={() => setOpen(false)}>Done</Button>}
    >
      <ImageFade src="./images/welcome.jpg" alt="Retrowave sunset" width={850} height={680} />
      <dl className="mt-6 grid grid-cols-2 gap-4 text-sm">
        <dt>Dimensions</dt>
        <dd>850 × 680</dd>
        <dt>Format</dt>
        <dd>JPEG</dd>
        <dt>Collection</dt>
        <dd>Moodboards</dd>
      </dl>
      <p className="mt-6 text-sm text-muted-foreground">
        A fixed header and footer keep actions in reach while longer content scrolls independently.
      </p>
    </DetailsPanel>
  );
}

const meta = {
  title: 'Overlays/Details panel',
  component: DetailsExample,
} satisfies Meta<typeof DetailsExample>;

export default meta;

export const Default: StoryObj<typeof meta> = {
  parameters: {
    docs: {
      source: {
        code: storyExamples1.DetailsExample,
        language: 'tsx',
        type: 'code',
      },
    },
  },
};

export const Confirmation: StoryObj = {
  render: () => {
    const [open, setOpen] = useState(false);
    const [archived, setArchived] = useState(false);

    return (
      <>
        <ConfirmDialog
          open={open}
          onOpenChange={setOpen}
          title="Archive this collection?"
          description="You can restore it from your archive at any time."
          confirmLabel="Archive collection"
          onConfirm={() => setArchived(true)}
          trigger={<Button variant="outline">Archive collection</Button>}
        />
        <p role="status" className="mt-5 text-sm">
          {archived ? 'Collection archived.' : ''}
        </p>
      </>
    );
  },
};

export const LongContent: StoryObj = {
  render: () => {
    const [open, setOpen] = useState(false);

    return (
      <Modal
        open={open}
        onOpenChange={setOpen}
        title="Collection notes"
        description="Scrollable content with anchored actions."
        trigger={<Button>Open notes</Button>}
        footer={<Button onClick={() => setOpen(false)}>Done</Button>}
      >
        {Array.from({ length: 15 }, (_, i) => (
          <p key={i} className="mb-4">
            Study {i + 1}: explore how light, texture, and framing change the mood of the same
            landscape.
          </p>
        ))}
      </Modal>
    );
  },
};

export const DismissAndRestoreFocus: StoryObj<typeof meta> = {
  parameters: {
    docs: {
      source: {
        code: storyExamples1.DetailsExample,
        language: 'tsx',
        type: 'code',
      },
    },
  },
  play: async ({ canvas, canvasElement, userEvent, step }) => {
    const body = within(canvasElement.ownerDocument.body);
    const trigger = canvas.getByRole('button', { name: 'Open details' });
    await step('Open the portaled details panel', async () => {
      await userEvent.click(trigger);
      await expect(await body.findByRole('dialog', { name: 'After the sunset' })).toBeVisible();
    });
    await step('Escape closes the panel and restores focus', async () => {
      await userEvent.keyboard('{Escape}');
      await waitFor(() => expect(body.queryByRole('dialog')).not.toBeInTheDocument());
      await expect(trigger).toHaveFocus();
    });
  },
};

export const ConfirmArchive: StoryObj = {
  ...Confirmation,
  play: async ({ canvas, canvasElement, userEvent }) => {
    const body = within(canvasElement.ownerDocument.body);
    const trigger = canvas.getByRole('button', { name: 'Archive collection' });
    await userEvent.click(trigger);
    let dialog = within(await body.findByRole('dialog', { name: 'Archive this collection?' }));

    await userEvent.click(dialog.getByRole('button', { name: 'Cancel' }));
    await expect(canvas.getByRole('status')).toBeEmptyDOMElement();
    await userEvent.click(trigger);
    dialog = within(await body.findByRole('dialog', { name: 'Archive this collection?' }));
    await userEvent.click(dialog.getByRole('button', { name: 'Archive collection' }));
    await expect(canvas.getByRole('status')).toHaveTextContent('Collection archived.');
  },
};
