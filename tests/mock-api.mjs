import { createServer } from 'node:http'
import { readFile } from 'node:fs/promises'

const recipes = JSON.parse(await readFile(new URL('./fixtures/recipes.json', import.meta.url), 'utf8'))

createServer((request, response) => {
  const url = new URL(request.url, 'http://127.0.0.1:4301')
  response.setHeader('Access-Control-Allow-Origin', '*')
  response.setHeader('Content-Type', 'application/json')

  if (url.pathname === '/recipes/search') {
    const query = (url.searchParams.get('q') ?? '').toLowerCase()
    if (query === 'falha') {
      response.writeHead(503).end(JSON.stringify({ message: 'Serviço indisponível' }))
      return
    }
    const matches = recipes.filter(recipe => recipe.name.toLowerCase().includes(query))
    const send = () => response.end(JSON.stringify({ recipes: matches, total: matches.length, skip: 0, limit: matches.length }))
    if (query === 'chicken') {
      setTimeout(send, 300)
    } else {
      send()
    }
    return
  }

  if (url.pathname === '/recipes') {
    response.end(JSON.stringify({ recipes, total: recipes.length, skip: 0, limit: recipes.length }))
    return
  }

  const match = url.pathname.match(/^\/recipes\/(\d+)$/)
  if (match?.[1] === '998') {
    response.writeHead(503).end(JSON.stringify({ message: 'Serviço indisponível' }))
    return
  }
  const recipe = match && recipes.find(item => item.id === Number(match[1]))
  if (recipe) {
    response.end(JSON.stringify(recipe))
  } else {
    response.writeHead(404).end(JSON.stringify({ message: 'Recipe not found' }))
  }
}).listen(4301, '127.0.0.1')
