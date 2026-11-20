// Slice A2b: the core screens in a real browser, on the A2 API.
import { afterAll, beforeAll, describe, expect, it } from 'vitest';
import path from 'node:path';
import { chromium, type Browser, type Page } from 'playwright';
import { build } from 'vite';
import { buildApp } from '../apps/core/server/app.js';
import { coreApp, makeEmployee, PASSWORD, run } from './core.js';

let browser: Browser;
let page: Page;
let base: string;
let t: Awaited<ReturnType<typeof coreApp>>;
let web: ReturnType<typeof buildApp>;
const dialogs: string[] = [];
const consoleErrors: string[] = [];

beforeAll(async () => {
  await build({ configFile: 'vite.config.ts', logLevel: 'error' });
  t = await coreApp();
  web = buildApp({ ...t.deps, webRoot: path.resolve('dist/core-web') });
  base = await web.listen({ host: '127.0.0.1', port: 0 });
  browser = await chromium.launch();
  page = await browser.newPage();
  page.setDefaultTimeout(8000);
  page.on('console', (m) => { if (m.type() === 'error') consoleErrors.push(m.text()); });
  // No screen asks anything in a browser prompt box (the reason is typed in the form): a dialog fails the test.
  page.on('dialog', (d) => { dialogs.push(d.message()); void d.dismiss(); });
}, 120000);

afterAll(async () => { await browser?.close(); await web?.close(); await t?.sql.end(); await t?.md.end(); });

async function signIn(login: string, password = PASSWORD) {
  await page.goto(base);
  await page.getByLabel('Login ID').fill(login);
  await page.getByLabel('Password').fill(password);
  await page.getByRole('button', { name: 'Sign in' }).click();
}

describe('core screens', () => {
  it('PL-03 PL-01 an admin adds a person, ticks permissions or copies them, and the person must change the temporary password', async () => {
    await makeEmployee(`webadmin${run}`, ['core.people.manage']);
    await makeEmployee(`webmodel${run}`, ['core.masterdata.view', 'core.masterdata.edit']);
    await signIn(`webadmin${run}`);
    // Item 7: the signed-out first load leaves no 401 in the console.
    expect(consoleErrors).toEqual([]);
    await page.getByLabel('Login ID (never reused)').fill(`webuser${run}`);
    await page.getByLabel('Full name').fill('Web User');
    await page.getByLabel('How was their identity checked?').fill('ID card seen');
    await page.getByLabel('Reason').fill('new joiner');
    await page.getByRole('button', { name: 'Add' }).click();
    const temp = (await page.locator('.note code').textContent())!;
    expect(temp.length).toBeGreaterThan(8);

    await page.getByRole('link', { name: `webuser${run}` }).click();
    const card = page.locator('.card', { has: page.getByRole('heading', { name: 'Permissions' }) });
    await card.getByLabel('Product').selectOption('core');
    await card.getByRole('checkbox', { name: /core\.masterdata\.view/ }).check();
    await card.getByLabel('Reason', { exact: true }).fill('needs to read master data');
    await card.getByRole('button', { name: 'Save' }).click();
    await expect.poll(() => page.locator('.card', { hasText: 'History' }).textContent()).toContain('Granted core.masterdata.view');
    expect(await card.textContent()).toContain(`granted by Name of webadmin${run}`);

    await card.getByLabel('Copy from').selectOption({ label: `webmodel${run}: Name of webmodel${run}` });
    await card.getByLabel('Reason', { exact: true }).fill('same job as model');
    await card.getByRole('button', { name: 'Copy' }).click();
    await expect.poll(() => page.locator('.card', { hasText: 'History' }).textContent()).toContain('Granted core.masterdata.edit');
    expect(await card.getByRole('checkbox', { name: /core\.masterdata\.edit/ }).isChecked()).toBe(true);
    expect(await card.getByRole('checkbox', { name: /core\.people\.manage/ }).isChecked()).toBe(false);
    expect(await page.locator('.card', { hasText: 'History' }).textContent()).toContain(`same job as model (copied from webmodel${run})`);

    await page.getByRole('button', { name: 'Sign out' }).click();
    await signIn(`webuser${run}`, temp);
    await page.getByRole('heading', { name: 'Change your password' }).waitFor();
    await page.getByLabel('Current password').fill(temp);
    await page.getByLabel('New password', { exact: true }).fill('a lovely long secret');
    await page.getByLabel('New password again').fill('a lovely long secret');
    await page.getByRole('button', { name: 'Change password' }).click();
    await page.getByRole('heading', { name: 'Master data' }).waitFor();          // master-data permissions land on master data
    await page.getByRole('button', { name: 'Sign out' }).click();
  });

  it('PL-04 a lockout shows on every screen for admins until acknowledged', async () => {
    await makeEmployee(`weblocked${run}`);
    for (let i = 0; i < 5; i++) await t.app.inject({ method: 'POST', url: '/api/login', payload: { login: `weblocked${run}`, password: 'nope' } });
    await signIn(`webadmin${run}`);
    const banner = page.getByRole('alert').filter({ hasText: `weblocked${run}` });
    await banner.waitFor();
    expect(await banner.textContent()).toContain('security contact emailed');
    await banner.getByRole('button', { name: 'Acknowledge' }).click();
    await banner.waitFor({ state: 'detached' });
  });

  it('PL-06 PL-08 an editor adds a room and equipment, links them, renames with a reason, and the history shows it', async () => {
    await makeEmployee(`webmd${run}`, ['core.masterdata.edit']);
    await page.getByRole('button', { name: 'Sign out' }).click().catch(() => {});
    await signIn(`webmd${run}`);
    await page.getByRole('heading', { name: 'Master data' }).waitFor();
    await page.getByRole('link', { name: 'Rooms' }).click();
    await page.getByLabel('Code (never reused)').fill(`WR${run}`);
    await page.getByLabel('Name', { exact: true }).fill('Web room');
    await page.getByLabel('Grade').selectOption('D');
    await page.getByLabel('Reason').fill('initial load');
    await page.getByRole('button', { name: 'Add' }).click();
    await page.getByRole('link', { name: `WR${run}` }).waitFor();

    await page.getByRole('link', { name: 'Equipment' }).click();
    await page.getByLabel('Code (never reused)').fill(`WE${run}`);
    await page.getByLabel('Name', { exact: true }).fill('Web mixer');
    await page.getByLabel('Make').fill('Acme');
    await page.getByLabel('Reason').fill('initial load');
    await page.getByRole('button', { name: 'Add' }).click();
    await page.getByRole('link', { name: `WE${run}` }).click();

    const linkForm = page.locator('form', { has: page.getByRole('button', { name: 'Link' }) });
    await linkForm.getByLabel('Room').selectOption({ label: `WR${run}: Web room` });
    await linkForm.getByLabel('Reason for the link').fill('installed');
    await linkForm.getByRole('button', { name: 'Link' }).click();
    await page.getByRole('listitem').filter({ hasText: `WR${run}` }).waitFor();

    await page.getByLabel('Name', { exact: true }).fill('Web high-shear mixer');
    await page.getByLabel('Reason for change').fill('name per URS');
    await page.getByRole('button', { name: 'Save' }).click();
    await page.getByRole('heading', { name: /version 2/ }).waitFor();
    const history = (await page.locator('.card', { hasText: 'History' }).textContent())!;
    expect(history).toContain('Version 1: Web mixer');
    expect(history).toContain('Version 2: Web high-shear mixer');
    expect(history).toContain(`Linked: WE${run} is located in WR${run}`);
    expect(history).toContain('name per URS');
    // The history reads in words, not JSON.
    expect(history).toContain('Make: Acme');
    expect(history).not.toContain('{');

    // Retire takes its reason from the form's own field; empty, it says so (no browser prompt box).
    await page.getByRole('button', { name: 'Retire' }).click();
    await page.getByText('Type the reason for retiring first.').waitFor();
    await page.getByLabel('Reason for change').fill('scrapped');
    await page.getByRole('button', { name: 'Retire' }).click();
    await page.getByRole('heading', { name: /version 3, retired/ }).waitFor();
    expect(await page.locator('.card', { hasText: 'History' }).textContent()).toContain('scrapped');
    expect(dialogs).toEqual([]);
  });

  it('D-82 a product\'s antibiotic box sits before its words; the item and link forms have one reason field each', async () => {
    await page.getByRole('link', { name: '← Master data' }).click();
    await page.getByRole('link', { name: 'Products' }).click();
    const box = page.getByLabel('Antibiotic (needs product-changeover cleaning)');
    const [b, l] = await Promise.all([box.boundingBox(), page.getByText('Antibiotic (needs product-changeover cleaning)').boundingBox()]);
    expect(Math.abs(b!.y + b!.height / 2 - (l!.y + l!.height / 2))).toBeLessThan(6);   // same line
    expect(b!.x).toBeLessThan(l!.x);
    await page.getByLabel('Code (never reused)').fill(`WP${run}`);
    await page.getByLabel('Name', { exact: true }).fill('Web tablets');
    await page.getByLabel('Reason').fill('initial load');
    await page.getByRole('button', { name: 'Add' }).click();
    await page.getByRole('link', { name: `WP${run}` }).click();
    await page.getByRole('heading', { name: /Web tablets/ }).waitFor();
    expect(await page.locator('input[name=reason]').count()).toBe(1);
    expect(await page.locator('input[name=linkReason]').count()).toBe(1);
    await page.getByLabel('Material').waitFor();
  });

  it("D-82 the hire's login is pulled from the name, with a number when taken", async () => {
    const { suggestedLogin } = await import('../apps/core/web/App.js');
    expect(suggestedLogin('Sameer  Kale', [])).toBe('sameer.kale');
    expect(suggestedLogin('Sameer Kale', [{ login: 'sameer.kale' }, { login: 'sameer.kale2' }])).toBe('sameer.kale3');
    expect(suggestedLogin(' ', [])).toBe('');
  });
});
