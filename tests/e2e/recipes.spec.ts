import { expect, test, type Page } from '@playwright/test'

async function openPage(page: Page, path: string) {
  await page.goto(path)
  await page.waitForFunction(() => '__vue_app__' in (document.querySelector('#__nuxt') ?? {}))
}

test('combina busca e filtros, limpa filtros e abre a receita correta', async ({ page }) => {
  await openPage(page, '/')
  await expect(page.getByText('3 receitas encontradas')).toBeVisible()
  await page.getByLabel('Buscar receita pelo nome').fill('chicken')
  await page.getByRole('button', { name: 'Buscar' }).click()
  await expect(page.getByText('2 receitas encontradas')).toBeVisible()
  await page.getByLabel('Categoria').selectOption('Dinner')
  await page.getByLabel('Culinária').selectOption('Italian')
  await expect(page.getByText('1 receita encontrada')).toBeVisible()
  await expect(page.getByRole('heading', { name: 'Chicken Tacos' })).toHaveCount(0)
  await page.getByRole('button', { name: 'Limpar filtros' }).click()
  await expect(page.getByText('2 receitas encontradas')).toBeVisible()
  await page.getByRole('link', { name: /Chicken Pasta/ }).click()
  await expect(page).toHaveURL(/\/recipes\/1$/)
  await expect(page.getByRole('heading', { name: 'Chicken Pasta' })).toBeVisible()
  await expect(page).toHaveTitle('Chicken Pasta | Receita em Dia')
  await page.getByLabel('Chicken', { exact: true }).check()
  await expect(page.getByText('1 de 2 separados')).toBeVisible()
})

test('apresenta vazio, erro de busca e permite tentar novamente', async ({ page }) => {
  await openPage(page, '/')
  const search = page.getByLabel('Buscar receita pelo nome')
  await search.fill('inexistente')
  await page.getByRole('button', { name: 'Buscar' }).click()
  await expect(page.getByText('Nenhuma receita encontrada')).toBeVisible()
  await search.fill('falha')
  await page.getByRole('button', { name: 'Buscar' }).click()
  await expect(page.getByRole('alert')).toContainText('Não foi possível realizar a busca')
  await page.getByRole('button', { name: 'Tentar novamente' }).click()
  await expect(page.getByRole('alert')).toContainText('Não foi possível realizar a busca')
  await search.fill('')
  await page.getByRole('button', { name: 'Buscar' }).click()
  await expect(page.getByText('3 receitas encontradas')).toBeVisible()
})

test('não permite que uma busca antiga substitua a busca mais recente', async ({ page }) => {
  await openPage(page, '/')
  const search = page.getByLabel('Buscar receita pelo nome')
  await search.fill('chicken')
  await page.getByRole('button', { name: 'Buscar' }).click()
  await search.fill('cake')
  await page.getByRole('button', { name: 'Buscar' }).click()
  await expect(page.getByRole('heading', { name: 'Italian Cake' })).toBeVisible()
  await expect(page.getByText('Resultados para “cake”')).toBeVisible()
  await expect(page.getByRole('heading', { name: 'Chicken Pasta' })).toHaveCount(0)
})

test('apresenta receita inexistente', async ({ page }) => {
  const response = await page.goto('/recipes/999')
  expect(response?.status()).toBe(404)
  await page.waitForFunction(() => '__vue_app__' in (document.querySelector('#__nuxt') ?? {}))
  await expect(page.getByRole('heading', { name: 'Receita não encontrada' })).toBeVisible()
  await expect(page.getByRole('main').getByRole('link', { name: 'Explorar receitas' })).toBeVisible()
})

test('distingue erro ao carregar detalhes de receita inexistente', async ({ page }) => {
  const response = await page.goto('/recipes/998')
  expect(response?.status()).toBe(503)
  await page.waitForFunction(() => '__vue_app__' in (document.querySelector('#__nuxt') ?? {}))
  await expect(page.getByRole('alert')).toContainText('Não foi possível carregar esta receita')
  await page.getByRole('button', { name: 'Tentar novamente' }).click()
  await expect(page.getByRole('alert')).toContainText('Não foi possível carregar esta receita')
})

test('permite recuperar o catálogo após uma falha', async ({ page }) => {
  await openPage(page, '/recipes/1')
  await page.route('http://127.0.0.1:4301/recipes?*', route => route.fulfill({
    status: 503,
    headers: { 'Access-Control-Allow-Origin': '*' },
    body: 'Indisponível',
  }))
  await page.getByRole('link', { name: 'Todas as receitas' }).click()
  await expect(page.getByRole('alert')).toContainText('Não foi possível carregar as receitas')
  await page.unrouteAll({ behavior: 'wait' })
  await page.getByRole('button', { name: 'Tentar novamente' }).click()
  await expect(page.getByText('3 receitas encontradas')).toBeVisible()
})

test('adapta o conteúdo a uma tela de celular', async ({ page }) => {
  await page.setViewportSize({ width: 375, height: 812 })
  await openPage(page, '/')
  await expect(page.getByRole('heading', { name: /O próximo prato/ })).toBeVisible()
  await expect(page.getByLabel('Buscar receita pelo nome')).toBeVisible()
  const hasHorizontalOverflow = await page.evaluate(() => document.documentElement.scrollWidth > window.innerWidth)
  expect(hasHorizontalOverflow).toBe(false)
})
