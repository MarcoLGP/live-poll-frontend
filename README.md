# Interface de Usuário do Live Poll

> Aplicação de interface de usuário web para a plataforma de código aberto Live Poll. Construída com Angular 21, suporte a Renderização no Lado do Servidor, notificações em tempo real via Eventos Enviados pelo Servidor e internacionalização.

---

## Visão Geral

Este repositório contém a interface de usuário em Angular para o projeto Live Poll.

Características principais:
- Aplicação `Angular 21` com inicialização independente usando `bootstrapApplication`
- Suporte a `@angular/ssr` com renderização no lado do servidor e hidratação no cliente
- Fluxo de atividades e notificações em tempo real via Eventos Enviados pelo Servidor (`ngx-sse-client`)
- Internacionalização usando `@ngx-translate/core`
- Fluxos de autenticação com manipulação de Token JSON Web e token de atualização
- Projeto modular separando rotas públicas e privadas

## Arquitetura

### Fluxo principal da aplicação

- `src/main.ts` inicializa a aplicação no navegador com `appConfig`
- `src/app/app.routes.ts` define as rotas da aplicação para páginas públicas e protegidas
- `src/app/app.config.ts` fornece o roteador, cliente HTTP, interceptadores e serviços de tradução
- O `AuthGuard` protege as rotas privadas e inicializa as conexões de Eventos Enviados pelo Servidor quando o usuário está autenticado

### Roteamento

Rotas públicas em `src/app/app.routes.ts`:
- `/` → Início
- `/login`
- `/login-success` (Sucesso de Login)
- `/register` (Registrar)
- `/register/confirmation` (Confirmação de Registro)
- `/confirm-account` (Confirmar Conta)
- `/forgot-password` (Esqueci a Senha)
- `/reset-password` (Redefinir Senha)

Rotas protegidas guardadas por `authGuard`:
- `/dashboard` (Painel de Controle)
- `/my-polls` (Minhas Enquetes)
- `/my-votes` (Meus Votos)
- `/poll` (Enquete)

Fallback (Rota de Retorno):
- `**` redireciona para `/`

## Pilha Técnica

- `@angular/common`, `@angular/compiler`, `@angular/core`, `@angular/forms`, `@angular/router`
- `@angular/platform-browser`, `@angular/platform-server`, `@angular/ssr`
- `@angular/cdk`
- `@ngx-translate/core`, `@ngx-translate/http-loader`
- `@ng-icons/core`, `@ng-icons/heroicons`, `@ng-icons/simple-icons`
- `ngx-sse-client`
- `rxjs`
- `typescript 5.9`
- `vitest` para testes unitários

## Estrutura de Pastas

- `src/app/components/` — peças de interface de usuário reutilizáveis e componentes modais
- `src/app/layouts/` — invólucros de layout público e privado
- `src/app/pages/` — páginas de nível de rota e telas de funcionalidades
- `src/app/core/` — serviços, guardas, clientes de Eventos Enviados pelo Servidor, modelos, interceptadores
- `src/assets/i18n/` — arquivos JSON de tradução
- `src/environments/` — valores de ambiente de execução

## Integração com Interface de Programação de Aplicações e Backend

A interface de usuário se comunica com o backend através do `ApiService` em `src/app/core/services/base-api.ts`.

Detalhes de comportamento:
- A Localização Base do Recurso para a Interface de Programação de Aplicações vem de `src/environments/environment.ts` ou `src/environments/environment.development.ts`
- As requisições incluem `Authorization: Bearer {token}` quando um token existe
- As requisições são enviadas com `withCredentials: true` (com credenciais verdadeiro)
- As conexões de Eventos Enviados pelo Servidor são estabelecidas para:
  - `/stream/feed` (Fluxo de Atividades)
  - `/stream/notifications` (Notificações)

## Autenticação e Segurança

### Serviço de Autenticação

Implementado em `src/app/core/services/auth.ts`.

Operações suportadas:
- Registro: `auth/register`
- Confirmação de Conta: `auth/account/confirm`
- Login: `auth/login`
- Atualização de Token: `auth/refresh-token`
- Logout: `auth/logout`
- Solicitação de Redefinição de Senha: `auth/password/reset/request`
- Confirmação de Redefinição de Senha: `auth/password/reset/confirm`
- Alteração de Senha: `auth/password`
- Fluxo de Alteração de Endereço de Correio Eletrônico: `auth/email/request-change` e `auth/email/confirm`
- Redirecionamentos de Login Social:
  - `auth/social/github/login`
  - `auth/social/google/login`

### Manipulação de Token

- `TokenService` mantém o token de acesso atual em memória
- `AuthInterceptor` anexa o token às requisições de saída
- O `authGuard` tenta o fallback do token de atualização quando necessário e inicializa o carregamento do perfil do usuário e as conexões de Eventos Enviados pelo Servidor

## Experiência em Tempo Real

### Fluxo de Atividades via Eventos Enviados pelo Servidor

- Implementado em `src/app/core/sse/feed-sse.ts`
- Conecta-se ao fluxo de atividades do backend e emite objetos de evento com os tipos:
  - `POLL_CREATED` (Enquete Criada)
  - `POLL_UPDATED` (Enquete Atualizada)
  - `POLL_DELETED` (Enquete Excluída)
  - `OPTION_REMOVED` (Opção Removida)
  - `VOTE_UPDATED` (Voto Atualizado)

### Notificações via Eventos Enviados pelo Servidor

- Implementado em `src/app/core/sse/notification-sse.ts`
- Recebe notificações do backend e as publica através da aplicação

## Modelos de Domínio

As principais interfaces de modelo são definidas em `src/app/core/models/poll.model.ts` e incluem:
- `Poll` (Enquete)
- `PollOption` (Opção da Enquete)
- `PollReadFeed` (Leitura do Fluxo de Enquete)
- `PollCreateDTO` (Objeto de Transferência de Dados para Criação de Enquete)
- `PagedResult<T>` (Resultado Paginado)
- `FeedParams` (Parâmetros do Fluxo)

Os formatos de perfil de usuário e notificação são definidos em `UserService` e `NotificationService`.

## Internacionalização

- O carregador de tradução lê arquivos JSON de `/assets/i18n/`
- O idioma padrão é `pt-BR`
- O idioma selecionado é restaurado de `localStorage.lang`
- O idioma de fallback é `pt-BR`

## Desenvolvimento

### Instalação

```bash
npm install
