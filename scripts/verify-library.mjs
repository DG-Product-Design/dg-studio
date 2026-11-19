import assert from 'node:assert/strict';

export async function verifyLibrary({ page, context, story, audit }) {
  await page.setViewportSize({ width: 1440, height: 1000 });
  await page.emulateMedia({ reducedMotion: 'no-preference' });
  for (const theme of ['miami-85', 'matrix', 'calm', 'blue-hour']) {
    for (const id of [
      'forms-text-field--invalid',
      'forms-radio-cards--default',
      'feedback-banner--warning',
      'foundations-color-tokens--default',
      'examples-collection-settings--default',
      'examples-collection-manager--default',
    ]) {
      await story(id, theme);
      await audit(`${id}/${theme}`);
    }

    await story('forms-select-field--default', theme);
    await page.getByRole('combobox', { name: 'Collection type' }).click();
    await page.getByRole('listbox').waitFor();
    assert.equal(await page.getByRole('listbox').getAttribute('data-theme'), theme);
    await audit(`dropdown-open/${theme}`);
    await page.keyboard.press('End');
    await page.waitForFunction(() => document.activeElement?.textContent?.includes('Moodboard'));
    await page.keyboard.press('Enter');
    await page.waitForFunction(() =>
      document.querySelector('[role="combobox"]')?.textContent.includes('Moodboard'),
    );
    await story('forms-multiple-selection--default', theme);
    await page.getByRole('button', { name: 'Tags', exact: true }).click();
    await page.getByRole('checkbox', { name: 'Summer', exact: true }).check();
    await audit(`multi-select-open/${theme}`);
    await page.getByRole('button', { name: 'Done', exact: true }).click();
    assert.ok(
      (await page.getByRole('button', { name: 'Tags', exact: true }).textContent())?.includes(
        'Summer',
      ),
    );
  }

  console.log('Expanded component and portal accessibility checks passed in all themes.');
  await story('forms-text-field--default');
  const input = page.getByRole('textbox', { name: 'Collection name' });
  await input.fill('Summer campaign');
  assert.equal(await input.inputValue(), 'Summer campaign');
  const described = await input.getAttribute('aria-describedby');
  assert.ok(described);
  await story('forms-checklist--default');
  await page.getByRole('checkbox', { name: /Social channels/ }).check();
  assert.equal(await page.getByRole('checkbox', { name: /Social channels/ }).isChecked(), true);
  assert.equal(await page.getByRole('checkbox', { name: /Print/ }).isDisabled(), true);
  await story('forms-switch--default');
  await page.getByRole('switch').focus();
  await page.keyboard.press('Space');
  assert.equal(await page.getByRole('switch').getAttribute('aria-checked'), 'false');
  await story('forms-range-slider--default');
  await page.getByRole('slider').focus();
  await page.keyboard.press('ArrowRight');
  assert.equal(await page.getByRole('slider').inputValue(), '85');
  await story('forms-action-button--interactive');
  const button = page.getByRole('button', {
    name: 'Export images',
    exact: true,
  });

  const before = await button.boundingBox();
  await button.click();
  const pending = page.getByRole('button', {
    name: 'Exporting images',
    exact: true,
  });

  assert.equal(await pending.isDisabled(), true);
  assert.equal(Math.round((await pending.boundingBox()).width), Math.round(before.width));
  await page.getByText('Export preview complete.', { exact: true }).waitFor();
  await story('content-card--collapsible');
  await page.getByRole('button', { name: 'Toggle Campaign notes' }).click();
  await page.getByText(/Keep the warm light/).waitFor({ state: 'hidden' });
  await page.getByRole('button', { name: 'Toggle Campaign notes' }).click();
  await page.getByText(/Keep the warm light/).waitFor();
  await story('content-tag-list--removable');
  await page.getByRole('button', { name: 'Remove Summer' }).click();
  assert.equal(await page.getByRole('listitem').count(), 2);
  await story('navigation-tabs--default');
  await page.getByRole('tab', { name: 'Overview' }).focus();
  await page.keyboard.press('ArrowRight');
  await page.getByRole('tabpanel').filter({ hasText: 'The dusk revision' }).waitFor();
  assert.equal(await page.getByRole('tab', { name: 'Billing' }).isDisabled(), true);
  await story('navigation-pagination--default');
  await page.getByRole('button', { name: 'Next page' }).click();
  await page.getByText('Page 2 of 12', { exact: true }).waitFor();
  await page.getByRole('button', { name: 'Page 12', exact: true }).click();
  assert.equal(await page.getByRole('button', { name: 'Next page' }).isDisabled(), true);
  await story('overlays-popover--default');
  await page.getByRole('button', { name: 'Preview settings' }).click();
  await page.getByRole('dialog').waitFor();
  await page.keyboard.press('Escape');
  await page.getByRole('dialog').waitFor({ state: 'hidden' });
  await story('feedback-banner--dismissible');
  await page.getByRole('button', { name: 'Dismiss A newer draft is available' }).click();
  await page.getByText('Notice dismissed.', { exact: true }).waitFor();
  await story('feedback-toast--default');
  await page.getByRole('button', { name: 'Archive draft', exact: true }).click();
  await page.getByText('Draft archived', { exact: true }).waitFor();
  await page.getByRole('button', { name: 'Undo', exact: true }).click();
  await page.getByText('Draft restored.', { exact: true }).waitFor();
  await context.grantPermissions(['clipboard-read', 'clipboard-write']);
  await story('content-click-to-copy--default');
  await page.getByRole('button', { name: 'Copy primary token' }).click();
  await page.getByText('Copied to clipboard.', { exact: true }).waitFor();
  assert.equal(await page.evaluate(() => navigator.clipboard.readText()), 'var(--primary)');
  // A denied clipboard must give the user a usable failure message.
  await story('content-click-to-copy--default');
  await page.evaluate(() => {
    Object.defineProperty(navigator.clipboard, 'writeText', {
      configurable: true,
      value: async () => {
        throw new Error('Permission denied');
      },
    });
  });
  await page.getByRole('button', { name: 'Copy primary token' }).click();
  await page
    .getByText('Clipboard unavailable. Select and copy the value above.', {
      exact: true,
    })
    .waitFor();
  await story('media-photo-library--default');
  await page.getByRole('combobox', { name: 'Collection' }).click();
  await page.getByRole('option', { name: 'Moodboards', exact: true }).click();
  assert.equal(await page.getByRole('button', { name: /View details/ }).count(), 2);
  await story('examples-collection-settings--default');
  await page.getByRole('button', { name: 'Continue', exact: true }).click();
  await page
    .getByText('Use at least 3 characters for the collection name.', {
      exact: true,
    })
    .waitFor();
  await page.getByRole('textbox', { name: 'Collection name' }).fill('Summer campaign');
  await page.getByRole('button', { name: 'Continue', exact: true }).click();
  await page.getByRole('radio', { name: /PNG/ }).check();
  await page.getByRole('button', { name: 'Back', exact: true }).click();
  assert.equal(
    await page.getByRole('textbox', { name: 'Collection name' }).inputValue(),
    'Summer campaign',
  );
  await page.getByRole('button', { name: 'Continue', exact: true }).click();
  assert.equal(await page.getByRole('radio', { name: /PNG/ }).isChecked(), true);
  await page.getByRole('button', { name: 'Continue', exact: true }).click();
  await page.getByRole('button', { name: 'Prepare collection', exact: true }).click();
  await page.getByText('Collection prepared', { exact: true }).waitFor();
  await story('forms-form-wizard--save-failure');
  await page.getByRole('button', { name: 'Save collection' }).click();
  await page.getByRole('alert').filter({ hasText: 'Connection interrupted' }).waitFor();
  assert.equal(await page.getByRole('button', { name: 'Save collection' }).isEnabled(), true);
  await story('examples-collection-manager--default');
  await page.getByRole('button', { name: 'Name', exact: true }).click();
  assert.equal(
    await page.getByRole('columnheader', { name: 'Name', exact: true }).getAttribute('aria-sort'),
    'ascending',
  );
  await page.getByRole('checkbox', { name: 'Select all visible rows' }).check();
  await page.getByRole('button', { name: 'Archive selected' }).click();
  await page.getByText('4 assets archived', { exact: true }).waitFor();
  assert.equal(await page.getByRole('row').count(), 3);
  await page.getByRole('button', { name: 'Undo', exact: true }).click();
  assert.equal(await page.getByRole('row').count(), 5);
  await page.getByRole('textbox', { name: 'Search assets' }).fill('nothing');
  await page.getByRole('heading', { name: 'No results' }).waitFor();
  await story('source-catalog-marketplace--inventory');
  await page.getByRole('textbox', { name: 'Find a source component' }).fill('CartAnimation');
  await page.getByRole('heading', { name: 'CartAnimation', exact: true }).waitFor();
  assert.equal(await page.getByRole('article').count(), 1);
  await page.getByRole('link', { name: 'Explore CartAnimation', exact: true }).click();
  await page.waitForURL('**/?path=/story/motion-cart-animation--interactive');
  await page
    .frameLocator('#storybook-preview-iframe')
    .getByRole('button', { name: 'Add item' })
    .waitFor();
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await story('motion-cart-animation--interactive');
  const animation = page.locator('span[aria-hidden="true"] > svg');
  await animation.waitFor();
  await page.getByRole('button', { name: 'Add item' }).click();
  await page.getByText('Added to your cart.', { exact: true }).waitFor();
  await page.waitForTimeout(100);
  const still = await animation.innerHTML();
  await page.waitForTimeout(250);
  assert.equal(await animation.innerHTML(), still, 'Reduced-motion animation must remain static.');
  await page.emulateMedia({ reducedMotion: 'no-preference' });
  await story('examples-collection-manager--default');
  await page.screenshot({
    path: 'test-results/collection-manager-desktop.png',
    fullPage: true,
  });
  await story('foundations-color-tokens--default', 'calm');
  await page.screenshot({
    path: 'test-results/color-tokens-calm.png',
    fullPage: true,
  });
  await page.setViewportSize({ width: 390, height: 844 });
  for (const id of [
    'examples-collection-settings--default',
    'examples-collection-manager--default',
    'foundations-color-tokens--default',
    'source-catalog-marketplace--inventory',
  ]) {
    await story(id);
    assert.equal(
      await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth),
      true,
      `Mobile overflow: ${id}`,
    );
    if (id === 'examples-collection-settings--default')
      await page.screenshot({
        path: 'test-results/collection-settings-mobile.png',
        fullPage: true,
      });
  }

  console.log(
    'Fields, keyboard controls, feedback, clipboard, wizard, table, source catalog, animation, and mobile checks passed.',
  );
}
