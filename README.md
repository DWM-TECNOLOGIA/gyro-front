# Projeto Base Vue 3 + Vite

Este projeto é uma base inicial para desenvolvimento com Vue 3 utilizando o Vite como bundler. Ele foi estruturado para facilitar o desenvolvimento escalável, com organização de serviços, estados e configurações centralizadas.

---

## 📁 Estrutura do Projeto

A estrutura foi pensada para manter separação de responsabilidades e facilitar a escalabilidade:

### Configuração Axios `src/http`

Contém a configuração principal do Axios (`http.js`). Aqui são definidos interceptadores, baseURL e demais configurações globais de requisição.

### Serviços e Endpoints Externos (`src/services`)

Pasta onde cada entidade (ex: `user`, `auth`) possui seu próprio arquivo de serviço. Cada arquivo importa o `http.js` e define as funções de requisição para aquela entidade.

Exemplo:

```js
// services/user.service.js
import http from '../http'

export const getUsers = () => http.get('/users')
```

### Gerenciamento de Estados Globais (`src/store`)

Utiliza Vuex. Cada entidade possui seu próprio módulo (`user.js`, `auth.js`, etc), importando os respectivos serviços e definindo seus `state`, `getters`, `actions` e `mutations`.

Assim, as requisições são feitas **apenas via Vuex**, e não diretamente nos componentes.

### Componentes ou Views

Nos componentes, o fluxo de requisição é feito chamando `dispatch` (actions) ou `getters` do Vuex, nunca acessando diretamente o serviço HTTP.

### Configuração de Ambientes (`/config`)

A pasta `config` contém a lógica para definição dinâmica dos endpoints conforme o ambiente de execução (development, staging, uat ou production).

#### Arquivo `configManager.js`

Responsável por identificar o ambiente atual baseado no host ou variável `NODE_ENV`, e retornar os respectivos endpoints de backend e websocket a partir do `index.json`.

Exemplo de uso:

```js
import { environments } from '@/config/configManager'

const apiUrl = environments.backend
const socketUrl = environments.socket
```

#### Arquivo `index.json`

Define os endpoints para cada ambiente:

```json
{
  "development": {
    "backend": "https://link-backend-dev",
    "socket": "wss://link-socket-dev"
  },
  ...
}
```

### Layouts Condicionais (`/layouts`)

A pasta `layouts` contém arquivos que controlam a estrutura visual das páginas com base no tipo de rota.

#### Exemplo:

- `DefaultLayout.vue`: utilizado nas rotas comuns (sem header fixo).
- `AppLayout.vue`: utilizado nas rotas administrativas, com `AppHeader.vue` fixo e estrutura diferenciada.

Na definição de rotas, o layout pode ser controlado com metadados ou rotas aninhadas. Assim, as rotas do backoffice terão sempre o layout com header, enquanto as demais permanecem com layout simples.

### Utilitários Globais (`/utils`)

A pasta `utils` agrupa funções auxiliares reutilizáveis em todo o projeto.

#### Arquivo `serialize.js`

Função utilitária para transformar objetos em strings de query:

```js
serialize({ id: 1, tags: ['vue', 'vite'] })
// Resultado: "?id=1&tags=vue&tags=vite"
```

#### Arquivo `tagMasks.js`

Plugin Vue para formatação e manipulação de dados. Disponibiliza globalmente:

- `$formatCPF(documentId, documentType)` – Formata CPF ou CNPJ.
- `$formatPhone(phone)` – Formata número de telefone.
- `$formatDateUtc(value)` – Converte datas UTC com timezone local.
- `$firstName(name)` – Retorna o primeiro nome.
- `$camelCase(value)` – Capitaliza a primeira letra de uma string.

Exemplo de uso:

```vue
<p>{{ $formatPhone('+5511999999999') }}</p>
<p>{{ $formatDateUtc('01/01/2024 12:00') }}</p>
```

---

## ⚙️ Setup do Projeto

### Instalação

```bash
npm install
```

### Compilar para Desenvolvimento

```bash
npm run dev
```

### Compilar para Produção

```bash
npm run build
```

### Testes Unitários com [Vitest](https://vitest.dev/)

```bash
npm run test:unit
```

### Lint com [ESLint](https://eslint.org/)

```bash
npm run lint
```

---

## 🧩 Principais Dependências e Responsabilidades

| Biblioteca                | Função                                                             |
| ------------------------- | ------------------------------------------------------------------ |
| **axios**                 | Cliente HTTP para comunicação com APIs                             |
| **vue-router**            | Gerenciamento de rotas da aplicação                                |
| **vuex**                  | Gerenciamento de estado global                                     |
| **@vuelidate/core**       | Validação de formulários reativa                                   |
| **@vuelidate/validators** | Conjunto de validadores utilizados com o Vuelidate                 |
| **vue-toastification**    | Exibição de toasts/alertas amigáveis ao usuário                    |
| **moment-timezone**       | Manipulação e formatação de datas com fuso horário                 |
| **vue-moment**            | Integração entre Moment.js e Vue                                   |
| **vue-the-mask**          | Máscara de input em campos como CPF, telefone, etc                 |
| **bootstrap**             | Estilização com componentes do Bootstrap                           |
| **bootstrap-vue-next**    | Componentes Vue baseados no Bootstrap 5                            |
| **fullstack-serverless**  | Ferramentas para integração com backends serverless (se aplicável) |

---

## 💡 Dicas

- Utilize sempre o Vuex para consumir dados via `actions` ou `getters`, nunca chame os endpoints diretamente nos componentes.
- Estruture novas entidades seguindo o padrão: `services/<entidade>.js` + `store/<entidade>.js`.

---

## ✅ Requisitos de IDE

- [Visual Studio Code](https://code.visualstudio.com/)
- Extensão: [Volar](https://marketplace.visualstudio.com/items?itemName=Vue.volar)
- ⚠️ Desabilitar a extensão **Vetur**, se estiver instalada.

---

## 📬 Contribuições

Sinta-se à vontade para abrir issues ou pull requests com melhorias.
