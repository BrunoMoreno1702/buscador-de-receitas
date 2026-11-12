# Receita em Dia

Aplicação responsiva para descobrir receitas, buscar por nome, combinar filtros e acompanhar o preparo. Criada com Nuxt 4, Vue 3 e TypeScript, usando a [API de receitas da DummyJSON](https://dummyjson.com/docs/recipes).

## Requisitos

- Node.js 22.12 ou superior (recomenda-se uma versão LTS compatível com as ferramentas).
- npm.

## Instalação e execução

```powershell
npm install
npm run dev
```

Abra o endereço informado pelo Nuxt, normalmente `http://localhost:3000`. Se o PowerShell bloquear a execução de `npm.ps1`, use `npm.cmd` no lugar de `npm` nos comandos.

## Funcionalidades

- Listagem com imagem, tempo total, calorias por porção e avaliação.
- Busca por nome na API e filtros combináveis por categoria (tipo de refeição) e culinária.
- Detalhes em `/recipes/:id`, com ingredientes marcáveis e instruções.
- Estados de carregamento, erro com nova tentativa, resultado vazio e receita inexistente.
- Layout responsivo e metadados para cada página.

A interface está em português, mas o conteúdo da DummyJSON é predominantemente em inglês. Por exemplo, busque por `chicken`, não por `frango`. A marcação dos ingredientes dura apenas enquanto a página está aberta; não há persistência, conta ou backend próprio.

## Como os dados funcionam

O serviço em `app/services/recipes.ts` centraliza as chamadas à API. A listagem e a busca usam `limit=0` para obter todos os resultados; os filtros de tipo de refeição e culinária são aplicados localmente e podem ser combinados com a busca. As opções dos filtros vêm do catálogo completo. Essa estratégia é adequada para o conjunto pequeno de demonstração da DummyJSON, mas, para um catálogo grande, seria melhor filtrar e paginar no servidor.

O endereço padrão da API pode ser alterado por `NUXT_PUBLIC_RECIPES_API_BASE`. Ele é público e não deve conter credenciais. A aplicação solicita essa API diretamente do navegador durante buscas e navegação, portanto um endereço alternativo deve permitir CORS.

## Comandos

```powershell
npm run typecheck
npm run test
npx playwright install chromium
npm run test:e2e
npm run build
npm run preview
```

Os testes de ponta a ponta iniciam um servidor Nuxt e uma API simulada nas portas 4300 e 4301, respectivamente. Isso evita depender dos dados ou da disponibilidade da API externa. As portas precisam estar livres e outro servidor Nuxt deste projeto deve ser encerrado antes dos testes. A instalação do Chromium é necessária apenas antes da primeira execução dos testes E2E.

Para produção, `npm run build` gera a aplicação em `.output`; `npm run preview` permite testá-la localmente.

## Organização

```text
app/
  assets/css/       Estilos globais
  components/       Cards, busca, filtros e estados reutilizáveis
  pages/            Página inicial e rota dinâmica de detalhes
  services/         Chamadas à DummyJSON
  types/            Tipos das receitas e respostas
  utils/            Regras de filtragem
tests/
  unit/             Testes de lógica e componentes
  e2e/              Fluxos de navegação com Playwright
  fixtures/         Dados usados nos testes
  mock-api.mjs      API simulada para os testes E2E
```
