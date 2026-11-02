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

beforeAll(async () => {
  await build({ configFile: 'vite.config.ts', logLevel: 'error' });
  t = await coreApp();
  web = buildApp({ ...t.deps, webRoot: path.resolve('dist/core-web') });
  base = await web.listen({ host: '127.0.0.1', port: 0 });
  browser = await chromium.launch();
  page = await browser.newPage();
  page.setDefaultTimeout(8000);
  page.on('dialog', (d) => void d.accept('screen test reason'));
}, 120000);

afterAll(async () => { await browser?.close(); await web?.close(); await t?.sql.end(); await t?.md.end(); });

async function signIn(login: string, password = PASSWORD) {
  await page.goto(base);
  await page.getByLabel('Login ID').fill(login);
  await page.getByLabel('Password').fill(password);
  await page.getByRole('button', { name: 'Sign in' }).click();
}

describe('core screens', () => {
  it('PL-03 PL-01 an admin adds a person, grants a role, and the person must change the temporary password', async () => {
    await makeEmployee(`webadmin${run}`, ['identity_admin']);
    await signIn(`webadmin${run}`);
    await page.getByLabel('Login ID (never reused)').fill(`webuser${run}`);
    await page.getByLabel('Full name').fill('Web User');
    await page.getByLabel('How was their identity checked?').fill('ID card seen');
    await page.getByLabel('Reason').fill('new joiner');
    await page.getByRole('button', { name: 'Add' }).click();
    const temp = (await page.locator('.note code').textContent())!;
    expect(temp.length).toBeGreaterThan(8);

    await page.getByRole('link', { name: `webuser${run}` }).click();
    await page.getByLabel('Add role').selectOption('core/viewer');
    await page.locator('form', { has: page.getByLabel('Add role') }).getByLabel('Reason').fill('needs to read master data');
    await page.getByRole('button', { name: 'Grant' }).click();
    await expect.poll(() => page.locator('table').first().textContent()).toContain('viewer');
    await expect.poll(() => page.locator('.card', { hasText: 'History' }).textContent()).toContain('Granted core / viewer');

    await page.getByRole('button', { name: 'Sign out' }).click();
    await signIn(`webuser${run}`, temp);
    await page.getByRole('heading', { name: 'Change your password' }).waitFor();
    await page.getByLabel('Current password').fill(temp);
    await page.getByLabel('New password', { exact: true }).fill('a lovely long secret');
    await page.getByLabel('New password again').fill('a lovely long secret');
    await page.getByRole('button', { name: 'Change password' }).click();
    await page.getByRole('heading', { name: 'Master data' }).waitFor();          // a viewer lands on master data
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
    await makeEmployee(`webmd${run}`, ['master_data_editor']);
    await page.getByRole('button', { name: 'Sign out' }).click().catch(() => {});
    await signIn(`webmd${run}`);
    await page.getByRole('heading', { name: 'Master data' }).waitFor();
    await page.getByRole('link', { name: 'Rooms' }).click();
    await page.getByLabel('Code (never reused)').fill(`WR${run}`);
    await page.getByLabel('Name', { exact: true }).fill('Web room');
    await page.getByLabel('Grade').fill('D');
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
    await linkForm.getByLabel('room').selectOption({ label: `WR${run}: Web room` });
    await linkForm.getByLabel('Reason').fill('installed');
    await linkForm.getByRole('button', { name: 'Link' }).click();
    await page.getByRole('listitem').filter({ hasText: `WR${run}` }).waitFor();

    await page.getByLabel('Name', { exact: true }).fill('Web high-shear mixer');
    await page.getByLabel('Reason for change').fill('name per URS');
    await page.getByRole('button', { name: 'Save' }).click();
    await page.getByRole('heading', { name: /version 2/ }).waitFor();
    const history = (await page.locator('.card', { hasText: 'History' }).textContent())!;
    expect(history).toContain('Version 1: Web mixer');
    expect(history).toContain('Version 2: Web high-shear mixer');
    expect(history).toContain(`Linked WE${run} located in WR${run}`);
    expect(history).toContain('name per URS');
  });
});
