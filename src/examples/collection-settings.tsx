import { useState } from 'react';
import { FormWizard } from '../components/form-wizard';
import {
  TextField,
  SelectField,
  MultiSelectField,
  RadioCards,
  RangeField,
  SwitchField,
} from '../components/fields';
import { Banner } from '../components/feedback';
import { TagList } from '../components/content';
import { Button } from '../components/ui/button';

export function CollectionSettings() {
  const [name, setName] = useState('');
  const [error, setError] = useState('');
  const [collection, setCollection] = useState('campaign');
  const [tags, setTags] = useState<string[]>(['outdoors']);
  const [format, setFormat] = useState('webp');
  const [quality, setQuality] = useState(85);
  const [notify, setNotify] = useState(true);
  const [saved, setSaved] = useState(false);

  return (
    <main className="mx-auto max-w-2xl space-y-7">
      <header>
        <h1 className="text-3xl font-semibold">Prepare a collection</h1>
        <p className="mt-2 text-muted-foreground">
          Name your work, choose delivery settings, and review the details.
        </p>
      </header>
      {saved ? (
        <Banner
          tone="success"
          title="Collection prepared"
          action={
            <Button variant="outline" onClick={() => setSaved(false)}>
              Edit collection
            </Button>
          }
        >
          {name} is ready as {format.toUpperCase()} at {quality}% quality. This preview keeps
          changes in memory.
        </Banner>
      ) : (
        <FormWizard
          finishLabel="Prepare collection"
          onComplete={async () => {
            await new Promise((resolve) => setTimeout(resolve, 650));
            setSaved(true);
          }}
          steps={[
            {
              id: 'details',
              label: 'Collection details',
              validate: () => {
                if (name.trim().length < 3) {
                  setError('Use at least 3 characters for the collection name.');

                  return false;
                }

                setError('');

                return true;
              },
              content: (
                <>
                  <TextField
                    label="Collection name"
                    name="collectionName"
                    value={name}
                    onChange={(e) => {
                      setName(e.target.value);
                      if (error) setError('');
                    }}
                    hint="A clear name makes this collection easier to find."
                    error={error}
                    placeholder="Summer trail campaign"
                    required
                  />
                  <SelectField
                    label="Collection type"
                    name="collectionType"
                    value={collection}
                    onValueChange={setCollection}
                    options={[
                      {
                        value: 'campaign',
                        label: 'Campaign',
                        description: 'Related creative for one launch.',
                      },
                      {
                        value: 'moodboard',
                        label: 'Moodboard',
                        description: 'References and visual directions.',
                      },
                      {
                        value: 'archive',
                        label: 'Archive',
                        description: 'Completed work for later use.',
                      },
                    ]}
                  />
                  <MultiSelectField
                    label="Tags"
                    name="tags"
                    value={tags}
                    onValueChange={setTags}
                    options={[
                      { value: 'outdoors', label: 'Outdoors' },
                      { value: 'summer', label: 'Summer' },
                      { value: 'social', label: 'Social' },
                    ]}
                  />
                </>
              ),
            },
            {
              id: 'delivery',
              label: 'Delivery settings',
              content: (
                <>
                  <RadioCards
                    label="Image format"
                    name="format"
                    value={format}
                    onValueChange={setFormat}
                    options={[
                      {
                        value: 'webp',
                        label: 'WebP',
                        description: 'Smaller files for web delivery.',
                      },
                      {
                        value: 'png',
                        label: 'PNG',
                        description: 'Lossless files with transparency.',
                      },
                    ]}
                  />
                  <RangeField
                    label="Image quality"
                    min={10}
                    max={100}
                    step={5}
                    value={quality}
                    onChange={setQuality}
                    formatValue={(v) => `${v}%`}
                  />
                  <SwitchField
                    label="Notify when ready"
                    description="Show a notification after preparing the collection."
                    checked={notify}
                    onCheckedChange={setNotify}
                  />
                </>
              ),
            },
            {
              id: 'review',
              label: 'Review collection',
              content: (
                <>
                  <dl className="grid grid-cols-2 gap-4 text-sm">
                    <dt className="text-muted-foreground">Name</dt>
                    <dd>{name}</dd>
                    <dt className="text-muted-foreground">Collection type</dt>
                    <dd>{collection}</dd>
                    <dt className="text-muted-foreground">Format</dt>
                    <dd>{format.toUpperCase()}</dd>
                    <dt className="text-muted-foreground">Quality</dt>
                    <dd>{quality}%</dd>
                    <dt className="text-muted-foreground">Notification</dt>
                    <dd>{notify ? 'On' : 'Off'}</dd>
                  </dl>
                  <TagList tags={tags} />
                  <p className="text-xs text-muted-foreground">
                    This local example demonstrates the form flow; it does not upload or export
                    files.
                  </p>
                </>
              ),
            },
          ]}
        />
      )}
    </main>
  );
}
