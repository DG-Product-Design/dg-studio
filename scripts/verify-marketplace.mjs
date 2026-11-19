import assert from 'node:assert/strict';

export async function verifyMarketplace({ page, story, audit }) {
  await page.setViewportSize({ width: 1280, height: 900 });
  await page.emulateMedia({ reducedMotion: 'no-preference' });
  await story('forms-search-select--default');
  const search = page.getByRole('combobox', { name: 'Accounts' });
  await search.fill('studio');
  await page.getByRole('option', { name: /Studio account/ }).waitFor();
  await search.press('ArrowDown');
  await search.press('Enter');
  await page.getByRole('button', { name: 'Remove Studio account' }).waitFor();
  await search.fill('team');
  await page.getByRole('option', { name: /Team account/ }).waitFor();
  await search.press('ArrowDown');
  await search.press('Enter');
  assert.equal(
    await page.getByRole('list', { name: 'Selected Accounts' }).getByRole('listitem').count(),
    2,
  );
  await search.fill('error');
  await page
    .getByText('Account search unavailable. Try another search.', {
      exact: true,
    })
    .waitFor();
  await search.fill('New account');
  await page.getByText('No matching options', { exact: true }).waitFor();
  await page.getByRole('button', { name: 'Create “New account”' }).click();
  await page.getByRole('button', { name: 'Remove New account' }).waitFor();
  await search.press('Escape');
  await story('forms-dual-range--default');
  const low = page.getByRole('slider', { name: 'Budget Minimum' });
  await low.focus();
  await page.keyboard.press('ArrowRight');
  assert.equal(await low.getAttribute('aria-valuenow'), '21');
  await story('navigation-nested-menu--default');
  await page.getByRole('button', { name: 'Collection actions' }).click();
  await page.getByRole('menuitem', { name: 'Export', exact: true }).focus();
  await page.keyboard.press('ArrowRight');
  await page.getByRole('menuitem', { name: 'PNG', exact: true }).waitFor();
  await page.getByRole('menuitem', { name: 'PNG', exact: true }).click();
  await page.getByText('PNG export selected', { exact: true }).waitFor();
  await story('overlays-settings-drawer--default');
  await page.getByRole('button', { name: 'Open settings drawer' }).click();
  await page.getByRole('button', { name: 'Account', exact: true }).click();
  await page.getByRole('button', { name: 'Notifications', exact: true }).click();
  await page.getByRole('switch', { name: 'Email updates' }).click();
  await page.getByRole('button', { name: 'Back', exact: true }).click();
  await page.getByRole('button', { name: 'Notifications', exact: true }).click();
  assert.equal(await page.getByRole('switch').getAttribute('aria-checked'), 'false');
  await page.keyboard.press('Escape');
  await story('forms-draft-wizard--default');
  await page.getByRole('button', { name: 'Discard draft' }).click();
  await page.getByRole('button', { name: 'Continue', exact: true }).click();
  await page.getByText('Enter a name.', { exact: true }).waitFor();
  await page.getByRole('textbox', { name: 'Draft name' }).fill('Saved campaign');
  await page.getByRole('switch', { name: 'Advanced delivery' }).click();
  await page.getByRole('button', { name: 'Continue', exact: true }).click();
  await page.getByRole('heading', { name: 'Delivery', exact: true }).waitFor();
  await page.reload();
  await page.getByRole('heading', { name: 'Delivery', exact: true }).waitFor();
  await page.getByRole('button', { name: 'Back', exact: true }).click();
  assert.equal(
    await page.getByRole('textbox', { name: 'Draft name' }).inputValue(),
    'Saved campaign',
  );
  await page.getByRole('switch').click();
  await page.getByRole('button', { name: 'Continue', exact: true }).click();
  await page.getByRole('heading', { name: 'Review', exact: true }).waitFor();
  await page.getByRole('button', { name: 'Prepare draft' }).click();
  await page.getByText('The saved draft has been cleared.').waitFor();
  assert.equal(await page.evaluate(() => localStorage.getItem('dg-studio-demo-draft-v1')), null);
  await story('media-carousel--looping');
  await page.getByRole('button', { name: 'Previous image' }).click();
  await page.getByText('6 of 6', { exact: true }).waitFor();
  await page.getByRole('button', { name: 'Go to image 2' }).click();
  await page.getByText('2 of 6', { exact: true }).waitFor();
  const img = page.locator('[data-image-state]').first();
  const box = await img.boundingBox();
  await page.mouse.move(box.x + box.width * 0.7, box.y + 80);
  await page.mouse.down();
  await page.mouse.move(box.x + box.width * 0.2, box.y + 80, { steps: 5 });
  await page.mouse.up();
  await page.getByText('3 of 6', { exact: true }).waitFor();
  await story('examples-asset-operations--default');
  await page.locator('table[aria-busy="true"]').waitFor({ state: 'hidden' });
  await page
    .getByRole('button', { name: /Edit asset name/ })
    .first()
    .click();
  await page.getByRole('textbox', { name: 'asset name', exact: true }).fill('Renamed campaign');
  await page.getByRole('button', { name: 'Save', exact: true }).click();
  await page
    .getByRole('button', {
      name: 'Edit asset name: Renamed campaign',
      exact: true,
    })
    .waitFor();
  await page.getByRole('button', { name: 'Next page' }).click();
  await page.getByText('Page 2 of 3', { exact: true }).waitFor();
  await page.getByRole('button', { name: 'Edit asset name: Dusk study 5', exact: true }).waitFor();
  await page.locator('table[aria-busy="true"]').waitFor({ state: 'hidden' });
  await page.getByRole('checkbox', { name: 'Select all visible rows' }).check();
  await page
    .getByRole('button', { name: /details for/i })
    .first()
    .click();
  await page.getByText(/Asset 5 ·/).waitFor();
  const download = page.waitForEvent('download');
  await page.getByRole('button', { name: 'Export CSV' }).click();
  assert.equal((await download).suggestedFilename(), 'collection.csv');
  await page.getByRole('textbox', { name: 'Search table' }).fill('error');
  await page.getByText('Unable to load rows', { exact: true }).waitFor();
  await page.getByRole('textbox', { name: 'Search table' }).fill('');
  await page.locator('table[aria-busy="true"]').waitFor({ state: 'hidden' });
  for (const theme of ['miami-85', 'matrix', 'calm', 'blue-hour']) {
    for (const id of [
      'forms-dual-range--default',
      'content-illustrated-avatar--people',
      'examples-asset-operations--default',
      'motion-loader--default',
    ]) {
      await story(id, theme);
      await page.locator('table[aria-busy="true"]').waitFor({ state: 'hidden' });
      await audit(`${id}/${theme}`);
    }

    await story('forms-search-select--default', theme);
    await page.getByRole('combobox').fill('studio');
    await page.getByRole('option').waitFor();
    await audit(`search-select-open/${theme}`);
  }

  await story('feedback-toast--default');
  const height = await page
    .locator('#storybook-root > [data-theme]')
    .evaluate((el) => el.getBoundingClientRect().height);

  assert.ok(height < 400, `Compact canvas height ${height}`);
  await page.setViewportSize({ width: 390, height: 844 });
  for (const id of [
    'layout-marketplace-grid--default',
    'forms-draft-wizard--default',
    'examples-asset-operations--default',
  ]) {
    await story(id);
    assert.equal(
      await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth),
      true,
      `Mobile overflow ${id}`,
    );
  }

  await page.emulateMedia({ reducedMotion: 'reduce' });
  await story('motion-loader--default');
  assert.equal(
    await page
      .locator('.dg-wave')
      .evaluateAll(
        (elements) =>
          elements.length === 2 &&
          elements.every((el) => getComputedStyle(el).animationName === 'none'),
      ),
    true,
  );
  console.log(
    'Marketplace partial adaptations: interactions, drafts, remote table, compact canvas, mobile and four-theme accessibility passed.',
  );
}
