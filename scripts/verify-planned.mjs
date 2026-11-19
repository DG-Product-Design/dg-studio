import assert from 'node:assert/strict';

export async function verifyPlanned({ page, context, story, audit }) {
  await page.setViewportSize({ width: 1440, height: 1000 });
  await page.emulateMedia({ reducedMotion: 'no-preference' });
  await story('forms-form--default');
  await page.getByRole('button', { name: 'Save changes', exact: true }).click();
  await page.getByRole('alert').filter({ hasText: 'Check the form' }).waitFor();
  await page.getByRole('textbox', { name: 'Name', exact: true }).fill('Studio prints');
  await page.getByRole('textbox', { name: 'Owner email' }).fill('dg@example.com');
  await page.getByRole('button', { name: 'Save changes', exact: true }).click();
  await page.getByText('Studio prints saved', { exact: true }).waitFor();
  await story('forms-password--default');
  const pass = page.getByLabel('New password', { exact: true });
  await pass.fill('AstrongSecret123');
  await page.getByRole('button', { name: 'Show password' }).click();
  assert.equal(await pass.getAttribute('type'), 'text');
  await page.getByRole('button', { name: 'Hide password' }).click();
  assert.equal(await pass.getAttribute('type'), 'password');
  await story('forms-recipes-transfer-points--default');
  await page.getByRole('spinbutton', { name: 'Amount in points' }).fill('250');
  for (const label of ['From account', 'To account']) {
    await page.getByRole('combobox', { name: label }).click();
    await page.getByRole('option', { name: 'Studio account', exact: true }).click();
  }

  await page.getByRole('button', { name: 'Transfer points', exact: true }).click();
  await page
    .getByRole('alert')
    .filter({ hasText: 'Choose a different destination account.' })
    .first()
    .waitFor();
  await page.getByRole('combobox', { name: 'To account' }).click();
  await page.getByRole('option', { name: 'Team account', exact: true }).click();
  await page.getByRole('button', { name: 'Transfer points', exact: true }).click();
  await page.getByText('Changes saved.', { exact: true }).waitFor();
  await story('forms-recipes-recurring-point-dates--default');
  await page.getByRole('radio', { name: 'Custom date', exact: true }).check();
  await page.getByRole('spinbutton', { name: 'Recurring day' }).waitFor();
  await page.getByRole('radio', { name: 'Employee event', exact: true }).check();
  await page.getByRole('spinbutton', { name: 'Recurring day' }).waitFor({ state: 'hidden' });
  await page.getByRole('combobox', { name: 'Employee event', exact: true }).waitFor();
  await story('forms-additional-information--default');
  await page.getByRole('checkbox', { name: 'Apply matching answers to all products' }).check();
  await page
    .getByRole('textbox', { name: 'Recipient name', exact: true })
    .first()
    .fill('Maya Chen');
  assert.equal(
    await page.getByRole('textbox', { name: 'Recipient name', exact: true }).nth(1).inputValue(),
    'Maya Chen',
  );
  await page.getByRole('button', { name: 'Save answers' }).click();
  await page.getByText('Changes saved.', { exact: true }).waitFor();
  await story('forms-employee-csv-import--default');
  await page.getByLabel('Employee CSV').setInputFiles({
    name: 'invalid.csv',
    mimeType: 'text/csv',
    buffer: Buffer.from(
      'firstName,lastName,email\nMaya,Chen,maya@example.com\nSam,Rivera,maya@example.com',
    ),
  });
  await page.getByText('Row 3: Duplicate email address.', { exact: true }).waitFor();
  assert.equal(
    await page.getByRole('button', { name: 'Import employees', exact: true }).isDisabled(),
    true,
  );
  await page.getByRole('button', { name: 'Choose another file' }).click();
  await page.getByLabel('Employee CSV').setInputFiles({
    name: 'employees.csv',
    mimeType: 'text/csv',
    buffer: Buffer.from(
      'firstName,lastName,email,department\r\n"Maya, Jean",Chen,maya@example.com,Design\r\nSam,Rivera,sam@example.com,Engineering',
    ),
  });
  await page.getByRole('cell', { name: 'Maya, Jean Chen', exact: true }).waitFor();
  await page.getByRole('button', { name: 'Import employees', exact: true }).click();
  await page.getByText('Employees imported', { exact: true }).waitFor();
  await story('forms-payment-fields--default');
  await page.getByRole('button', { name: 'Add card', exact: true }).click();
  await page
    .getByRole('alert')
    .filter({ hasText: 'Complete the secure payment fields.' })
    .waitFor();
  await page.getByRole('switch', { name: 'Demo payment fields complete' }).click();
  await page.getByRole('textbox', { name: 'Card nickname' }).fill('Studio card');
  await page.getByRole('button', { name: 'Add card', exact: true }).click();
  await page.getByText('Changes saved.', { exact: true }).waitFor();
  await story('commerce-cart--default');
  await page.getByRole('spinbutton', { name: 'Quantity for Art print collection' }).fill('3');
  await page
    .getByRole('article', { name: 'Art print collection' })
    .getByText('375 points', { exact: true })
    .waitFor();
  await page.getByRole('button', { name: 'Checkout', exact: true }).click();
  await page.getByRole('button', { name: 'Continue', exact: true }).click();
  await page
    .getByRole('alert')
    .filter({ hasText: 'Complete your contact and shipping information.' })
    .waitFor();
  for (const [name, value] of [
    ['First name', 'Maya'],
    ['Last name', 'Chen'],
    ['Email address', 'maya@example.com'],
    ['Street address', '100 Studio Way'],
    ['City', 'Phoenix'],
    ['State / Province', 'AZ'],
    ['ZIP / Postal code', '85001'],
  ])
    await page.getByRole('textbox', { name, exact: true }).fill(value);
  await page.getByRole('button', { name: 'Continue', exact: true }).click();
  await page.getByRole('heading', { name: 'Payment', exact: true }).waitFor();
  await page.getByRole('button', { name: 'Continue', exact: true }).click();
  await page.getByRole('heading', { name: 'Review order', exact: true }).waitFor();
  await page.getByRole('button', { name: 'Place order', exact: true }).click();
  await page.getByRole('heading', { name: 'Order confirmed' }).waitFor();
  await page.getByRole('button', { name: 'Continue browsing' }).click();
  await page.getByRole('heading', { name: 'Cart (2)' }).waitFor();
  await story('examples-directory-integration--default');
  await page.getByRole('button', { name: 'Connect People directory' }).click();
  await page.getByText('Connected', { exact: true }).waitFor();
  await page.getByRole('button', { name: 'Sync People directory' }).click();
  await page
    .getByText('12 employee records synchronized in this preview.', {
      exact: true,
    })
    .waitFor();
  await page.getByRole('button', { name: 'Disconnect', exact: true }).click();
  await page.getByText('Not connected', { exact: true }).waitFor();
  await story('feedback-error-boundary--default');
  await page.getByRole('button', { name: 'Trigger preview error' }).click();
  await page.getByText('This view couldn’t load', { exact: true }).waitFor();
  await page.getByRole('button', { name: 'Try again', exact: true }).click();
  await page.getByRole('button', { name: 'Trigger preview error' }).waitFor();
  await story('media-scannable-code--default');
  await page.waitForFunction(() => {
    const image = document.querySelector('#storybook-root img');

    return image?.complete && image.naturalWidth > 0;
  });
  await story('motion-border-glow--default');
  const border = page.locator('[data-glow-border]').first();
  const box = await border.boundingBox();
  await page.mouse.move(box.x + box.width - 10, box.y + 10);
  await page.waitForFunction(
    () =>
      document.querySelector('[data-glow-border]')?.style.getPropertyValue('--dg-glow-opacity') ===
      '1',
  );
  const before = await border.evaluate((el) => el.style.getPropertyValue('--dg-glow-angle'));

  await page.mouse.move(box.x + 10, box.y + box.height - 10);
  await page.waitForFunction(
    (previous) =>
      document.querySelector('[data-glow-border]')?.style.getPropertyValue('--dg-glow-angle') !==
      previous,
    before,
  );
  await page.getByRole('button', { name: 'Choose first' }).focus();
  assert.equal(await border.evaluate((el) => getComputedStyle(el).outlineWidth), '2px');
  await page.keyboard.press('Enter');
  await page.getByText('First card selected', { exact: true }).waitFor();
  await page.emulateMedia({ reducedMotion: 'reduce' });
  assert.equal(
    await border.locator('.dg-glow-halo').evaluate((el) => getComputedStyle(el).display),
    'none',
  );
  assert.ok(
    (await border.evaluate((el) => getComputedStyle(el, '::after').backgroundImage)).includes(
      'linear-gradient',
    ),
  );
  await page.emulateMedia({ reducedMotion: 'no-preference' });
  await story('welcome--start-here');
  await page.getByRole('button', { name: 'Update total' }).click();
  await page.getByText('$2,895.75', { exact: true }).waitFor();
  const original = await page.locator('[data-image-state] img').getAttribute('src');

  await page.getByRole('button', { name: 'Change artwork' }).click();
  assert.notEqual(await page.locator('[data-image-state] img').getAttribute('src'), original);
  await page.getByRole('button', { name: 'Play illustration' }).click();
  await page.getByRole('img', { name: 'Cart animation', exact: true }).locator('svg').waitFor();
  await page.screenshot({
    path: 'test-results/welcome-glow-desktop.png',
    fullPage: true,
  });
  const touch = await context.browser().newContext({
    viewport: { width: 390, height: 844 },
    isMobile: true,
    hasTouch: true,
  });

  const touchPage = await touch.newPage();
  await touchPage.goto(
    'http://127.0.0.1:6007/iframe.html?id=motion-border-glow--default&viewMode=story',
  );
  await touchPage.locator('[data-glow-border]').first().waitFor();
  assert.equal(
    await touchPage
      .locator('[data-glow-border]')
      .first()
      .evaluate((el) => getComputedStyle(el).animationName),
    'dg-glow-orbit',
  );
  await touchPage.emulateMedia({ reducedMotion: 'reduce' });
  assert.equal(
    await touchPage
      .locator('[data-glow-border]')
      .first()
      .evaluate((el) => getComputedStyle(el).animationName),
    'none',
  );
  await touch.close();
  for (const theme of ['miami-85', 'matrix', 'calm', 'blue-hour']) {
    for (const id of [
      'welcome--start-here',
      'commerce-cart--default',
      'forms-recipes-sign-up--default',
      'examples-profile-and-billing--default',
      'layout-app-frame--default',
      'motion-border-glow--default',
    ]) {
      await story(id, theme);
      await audit(`${id}/${theme}`);
    }
  }

  await page.setViewportSize({ width: 390, height: 844 });
  for (const id of [
    'welcome--start-here',
    'commerce-cart--default',
    'layout-app-frame--default',
    'examples-employee-profile--default',
    'forms-recipes-send-points--default',
  ]) {
    await story(id);
    assert.equal(
      await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth),
      true,
      `Mobile overflow ${id}`,
    );
    if (id === 'welcome--start-here')
      await page.screenshot({
        path: 'test-results/welcome-glow-mobile.png',
        fullPage: true,
      });
  }

  await page.setViewportSize({ width: 1440, height: 900 });
  await page.goto('http://127.0.0.1:6007/?path=/docs/feedback-toast--docs');
  const docs = page
    .frameLocator('#storybook-preview-iframe')
    .locator('.docs-story [data-theme]')
    .first();

  await docs.waitFor();
  assert.ok((await docs.boundingBox()).height < 400, 'Docs canvas should size to its component.');
  await page.screenshot({
    path: 'test-results/compact-docs-canvas.png',
    fullPage: true,
  });
  console.log(
    'Planned marketplace recipes, import validation, checkout, border glow, welcome showcases, compact docs and four-theme accessibility passed.',
  );
}
