import { expect, test } from '@playwright/test';

test.describe('LaTeXcheck app', () => {
    test.beforeEach(async ({ page }) => {
        await page.goto('/');
    });

    test('loads and shows main UI elements', async ({ page }) => {
        await expect(page.locator('#user_input_area')).toBeVisible();
        await expect(page.getByRole('button', { name: 'Check!' })).toBeVisible();
        await expect(page.getByRole('button', { name: 'Preview' })).toBeVisible();
        await expect(page.getByText('Here the results of the style check will be displayed')).toBeVisible();
    });

    test('MathJax 4.1.1 loads', async ({ page }) => {
        const version = await page.waitForFunction(() => window.MathJax?.version, null, { timeout: 15000 });
        expect(String(await version.jsonValue())).toMatch(/^4\.1\.1/);
    });

    test('Check button detects errors', async ({ page }) => {
        await expect(page.locator('#user_input_area')).toBeVisible();
        await page.evaluate(() => {
            document.querySelector('#user_input_area').env.editor.setValue('Let $f(x)=x^2$.$g(x)=x^3$.');
        });
        await page.getByRole('button', { name: 'Check!' }).click();
        await expect(page.locator('.result-display-grid')).toBeVisible();
        await expect(page.locator('[data-severity]').first()).toBeVisible();
    });

    test('Check button reports no errors for clean input', async ({ page }) => {
        await expect(page.locator('#user_input_area')).toBeVisible();
        await page.evaluate(() => {
            document.querySelector('#user_input_area').env.editor.setValue('Hello world.');
        });
        await page.getByRole('button', { name: 'Check!' }).click();
        await expect(page.getByText('nothing to complain about')).toBeVisible();
    });

    test('Preview renders MathJax', async ({ page }) => {
        await expect(page.locator('#user_input_area')).toBeVisible();
        await page.evaluate(() => {
            document.querySelector('#user_input_area').env.editor.setValue('$x^2 + y^2 = z^2$');
        });
        await page.getByRole('button', { name: 'Preview' }).click();
        await expect(page.locator('mjx-container').first()).toBeVisible({ timeout: 15000 });
    });

    test('Language toggle switches to Russian', async ({ page }) => {
        await page.locator('.lang-toggle').click();
        await expect(page.getByRole('button', { name: 'Проверить!' })).toBeVisible();
    });
});
