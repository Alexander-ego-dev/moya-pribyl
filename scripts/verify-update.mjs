/* global URL, navigator, indexedDB */
// Run after saving the previous production dist to .update-check/previous-dist
// and building the next release into dist. Uses a single origin throughout.
import { createServer } from 'node:http';
import { readFile, mkdir } from 'node:fs/promises';
import { resolve, extname, sep } from 'node:path';
import { chromium, expect } from '@playwright/test';

let root = resolve('.update-check/previous-dist');
const types = { '.html': 'text/html', '.js': 'text/javascript', '.css': 'text/css', '.png': 'image/png', '.svg': 'image/svg+xml', '.webmanifest': 'application/manifest+json' };
const server = createServer(async (request, response) => {
  const pathname = decodeURIComponent(new URL(request.url, 'http://localhost').pathname);
  const target = resolve(root, `.${pathname === '/' ? '/index.html' : pathname}`);
  if (!target.startsWith(root + sep)) { response.writeHead(403).end(); return; }
  try {
    const data = await readFile(target);
    response.writeHead(200, { 'Content-Type': types[extname(target)] || 'application/octet-stream', 'Cache-Control': 'no-store' }).end(data);
  } catch { response.writeHead(404).end(); }
});
await new Promise(done => server.listen(4174, '127.0.0.1', done));
const browser = await chromium.launch({ channel: 'msedge', headless: true });
try {
  const context = await browser.newContext({ viewport: { width: 390, height: 844 } });
  const page = await context.newPage();
  await page.goto('http://127.0.0.1:4174/');
  await page.getByRole('heading', { name: 'Обзор', exact: true }).waitFor();
  await page.getByRole('button', { name: 'Доход', exact: true }).click();
  await page.getByLabel('Сумма, ₽', { exact: true }).fill('12345,67');
  await page.getByRole('combobox', { name: 'Категория', exact: true }).selectOption({ label: 'Татуировки' });
  await page.getByRole('button', { name: 'Сохранить операцию' }).click();
  await page.getByRole('button', { name: 'Изменить цель месяца' }).click();
  await page.getByLabel('Сумма, ₽', { exact: true }).fill('10000');
  await page.getByRole('button', { name: 'Сохранить цель' }).click();
  await page.evaluate(async () => { await navigator.serviceWorker.ready; });
  await page.reload();
  await expect(page.getByRole('heading', { name: '12 345,67 ₽' })).toBeVisible();
  const snapshot = () => page.evaluate(async () => {
    const request = indexedDB.open('moya-pribyl');
    const db = await new Promise((done, fail) => { request.onsuccess = () => done(request.result); request.onerror = fail; });
    const result = {};
    for (const store of ['operations', 'categories', 'goals']) {
      const read = db.transaction(store).objectStore(store).getAll();
      result[store] = await new Promise((done, fail) => { read.onsuccess = () => done(read.result); read.onerror = fail; });
    }
    db.close();
    return result;
  });
  const before = await snapshot();
  root = resolve('dist');
  await page.evaluate(async () => { const registration = await navigator.serviceWorker.getRegistration(); await registration.update(); });
  await page.getByRole('button', { name: 'Обновить', exact: true }).waitFor({ timeout: 30000 });
  await page.getByRole('button', { name: 'Обновить', exact: true }).click();
  await expect(page.getByRole('heading', { name: 'Ваши достижения' })).toBeVisible({ timeout: 30000 });
  await expect(page.getByRole('heading', { name: '12 345,67 ₽' })).toBeVisible();
  expect(await snapshot()).toEqual(before);
  await page.getByRole('button', { name: /Открыть достижения/ }).click();
  await expect(page.getByText('Получено', { exact: true })).toHaveCount(2);
  await mkdir('test-results', { recursive: true });
  await page.screenshot({ path: 'test-results/update-preserved.png' });
  console.log('PASS: installed v1 → current release via Service Worker; operations, categories and goals unchanged; two badges earned.');
} finally { await browser.close(); server.close(); }

