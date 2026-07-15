# Conversation Auth Architecture

## Overview

This platform exposes a **single HTTP route** — `/conversation` — through which users interact with the LLM. The LLM then invokes backend functions (tools) based on the user's scenario or stage.

Authentication and authorization are **not route-based**. There are no per-endpoint guards like `/api/orders` or `/api/admin`. Instead, security is enforced at two layers:

1. **Conversation entry** — verify the JWT once (if provided) and establish request-scoped context.
2. **Tool dispatcher** — check auth requirements and permissions before any service function runs.

The LLM is a caller, not a security boundary. The server always owns identity and access control.

---

## Request Flow

```
Client
  │
  │  POST /conversation
  │  Authorization: Bearer <jwt>   (optional)
  │  Body: { message, conversationId, stage? }
  │
  ▼
Conversation Handler
  │
  ├─ Extract JWT from header (if present)
  ├─ Verify token via jwtService.verifyToken()
  ├─ Build ConversationContext { user, token, stage, ... }
  └─ conversationContext.run(ctx, ...)
       │
       ▼
     LLM Service
       │
       ├─ Receives only tools the user is allowed to call
       ├─ Processes user message
       └─ May invoke tool calls
            │
            ▼
          Tool Dispatcher
            │
            ├─ Check auth level (none | optional | required)
            ├─ Check permission (RBAC)
            ├─ Check stage (if applicable)
            └─ Call service function
                 │
                 ▼
               Service Layer
                 │
                 └─ Reads user from conversationContext (no token param)
```

---

## Core Concepts

### Single Exposed Route

Only `/conversation` is exposed to clients. All commerce and auth operations happen as **LLM tool calls** within that request lifecycle.

| Approach | Used here? |
|----------|------------|
| Per-route middleware (`/api/orders`, `/api/cart`) | No |
| Global auth middleware on one route | Yes |
| Service-layer auth via context | Yes |
| LLM passes token to each function | **Never** |

### Optional JWT

A request may or may not include a JWT:

| Scenario | JWT | Behavior |
|----------|-----|----------|
| Guest browsing | None | Public tools available; user treated as unauthenticated |
| Mid-registration / login | None | OTP tools available; no session yet |
| Authenticated shopping | Valid JWT | User loaded into context; protected tools available |
| Invalid / expired JWT | Bad token | Treat as guest or reject — decide per product policy |

JWT is read **once** at the conversation entry point. It is never re-parsed inside individual service functions.

### Conversation Context

Request-scoped state is stored in Node.js `AsyncLocalStorage`. Every function called during a single `/conversation` request can read from it without receiving `token` as an argument.

```typescript
type ConversationContext = {
  token?: string;
  user?: User;
  isAuthenticated: boolean;
  conversationId: string;
  stage?: ConversationStage;
};
```

Planned location: `backend/src/context/conversation-context.ts`

```typescript
import { AsyncLocalStorage } from "node:async_hooks";

export const conversationContext = new AsyncLocalStorage<ConversationContext>();

export function getConversationContext(): ConversationContext {
  const ctx = conversationContext.getStore();
  if (!ctx) {
    throw new Error("Conversation context is not available");
  }
  return ctx;
}

export function getAuthenticatedUser(): User {
  const { user, isAuthenticated } = getConversationContext();
  if (!isAuthenticated || !user) {
    throw new Error("Authentication required");
  }
  return user;
}
```

### Tool Dispatcher

All LLM-invoked functions go through a single dispatcher. This is the authorization gate.

```typescript
type AuthLevel = "none" | "optional" | "required";

type ToolDefinition = {
  auth: AuthLevel;
  permission?: Permission;
  requiredStage?: ConversationStage;
  handler: (args: Record<string, unknown>) => Promise<unknown>;
};

async function executeToolCall(toolName: string, args: Record<string, unknown>) {
  const tool = tools[toolName];
  const ctx = getConversationContext();

  if (tool.auth === "required" && !ctx.isAuthenticated) {
    return { error: "Please log in first", nextStep: "login" };
  }

  if (tool.permission && ctx.user) {
    if (!authorizationService.canAccess(ctx.user.role, tool.permission)) {
      return { error: "You don't have permission for this action" };
    }
  }

  if (tool.requiredStage && ctx.stage !== tool.requiredStage) {
    return { error: `This action is not available at the current stage` };
  }

  return tool.handler(args);
}
```

Planned location: `backend/src/modules/conversation/tool-dispatcher.ts`

---

## Auth Levels for Tools

| Level | JWT required? | Use case |
|-------|---------------|----------|
| `none` | No | `register`, `login`, `verifyOTP`, public product browse |
| `optional` | No, but uses user if present | Personalized browse, cart merge on login |
| `required` | Yes | `getOrders`, `logout`, `createAdmin`, admin actions |

### Example Tool Registry

```typescript
const tools: Record<string, ToolDefinition> = {
  register: {
    auth: "none",
    handler: (args) => authService.register(args.email, args.firstName, args.lastName),
  },
  login: {
    auth: "none",
    handler: (args) => authService.login(args.email),
  },
  verifyOTP: {
    auth: "none",
    handler: (args) => authService.verifyOTP(args.email, args.code, args.purpose),
  },
  browseProducts: {
    auth: "optional",
    permission: Permission.PRODUCT_READ,
    handler: (args) => productService.list(args),
  },
  getOrders: {
    auth: "required",
    permission: Permission.ORDER_READ,
    handler: () => orderService.getOrders(),
  },
  createAdmin: {
    auth: "required",
    permission: Permission.ADMIN_CREATE,
    handler: (args) => authService.createAdmin(args.email, args.firstName, args.lastName),
  },
};
```

---

## Conversation Stages

Stages represent where the user is in their journey. The LLM uses them to choose tools; the server enforces them.

| Stage | JWT | Typical tools |
|-------|-----|---------------|
| `browsing` | Optional | `browseProducts`, `register`, `login` |
| `registering` | No | `verifyOTP` (REGISTER) |
| `logging_in` | No | `verifyOTP` (LOGIN) |
| `authenticated` | Yes | cart, orders, profile |
| `admin` | Yes + role | admin management tools |

Stage can be provided by the client, stored in a `Conversation` record, or inferred from context (`isAuthenticated`, `user.role`).

---

## RBAC (Role-Based Access Control)

Permissions are defined in `backend/src/constant/permision.ts`. Role-to-permission mapping lives in `backend/src/modules/auth/role-permissions.ts`.

| Role | Scope |
|------|-------|
| `CUSTOMER` | Products (read), cart, orders |
| `ADMIN` | All permissions except `SUPER_ADMIN_CREATE` |
| `SUPER_ADMIN` | All permissions |

Authorization checks use `authorization.service.ts`:

```typescript
authorizationService.canAccess(user.role, Permission.ADMIN_CREATE);
authorizationService.canAny(user.role, [Permission.ORDER_READ, Permission.ORDER_UPDATE]);
authorizationService.canAll(user.role, [Permission.PRODUCT_READ, Permission.PRODUCT_UPDATE]);
```

In the conversation architecture, permission checks belong in the **tool dispatcher**, not in the LLM prompt.

---

## Service Layer Conventions

### Do

- Read the current user from `getConversationContext()` or `getAuthenticatedUser()`.
- Keep business logic only — no HTTP header parsing, no JWT verification.
- Return structured results the LLM can interpret (`nextStep`, `error`, data).

### Do not

- Accept `token` as a function parameter (legacy pattern — see `createAdmin` today).
- Call `jwtService.verifyToken()` inside services.
- Trust the LLM to pass identity or authorization data.

### Before (manual token passing)

```typescript
const createAdmin = async (email: string, token: string, firstName?: string, lastName?: string) => {
  const verifiedUser = await jwtService.verifyToken(token);
  if (!authorizationService.canAccess(verifiedUser.role, Permission.ADMIN_CREATE)) {
    throw new Error("You are not authorized to create an admin");
  }
  // ...
};
```

### After (context-based)

```typescript
const createAdmin = async (email: string, firstName?: string, lastName?: string) => {
  const user = getAuthenticatedUser();
  if (!authorizationService.canAccess(user.role, Permission.ADMIN_CREATE)) {
    throw new Error("You are not authorized to create an admin");
  }
  // ...
};
```

Note: when the tool dispatcher already checks `permission`, the service-level check is optional but can remain as defense in depth.

---

## Token Lifecycle

### Issued

`verifyOTP` generates a JWT and persists a session:

```
verifyOTP → jwtService.generateToken() → jwtService.updateSession()
```

Returns `{ user, token }` to the client. The client sends this token on subsequent `/conversation` requests.

### Verified

Once per request at the conversation entry point:

```
Authorization: Bearer <token> → jwtService.verifyToken() → user loaded into context
```

### Refreshed mid-request

After a successful `verifyOTP` tool call within the same conversation turn, update context so later tool calls in that request are authenticated:

```typescript
const result = await authService.verifyOTP(email, code, purpose);
const ctx = getConversationContext();
ctx.user = result.user;
ctx.token = result.token;
ctx.isAuthenticated = true;
ctx.stage = "authenticated";
```

### Revoked

`logout` deletes the session via `jwtService.deleteSession(userId, token)`.

---

## LLM Tool Visibility

Filter which tools the LLM can see based on the current context. This is defense in depth — even if the model tries to call a forbidden tool, the dispatcher blocks it.

```typescript
function getAvailableTools(ctx: ConversationContext): string[] {
  return Object.entries(tools)
    .filter(([, tool]) => {
      if (tool.auth === "required" && !ctx.isAuthenticated) return false;
      if (tool.permission && ctx.user) {
        return authorizationService.canAccess(ctx.user.role, tool.permission);
      }
      if (tool.permission && !ctx.user) return false;
      return true;
    })
    .map(([name]) => name);
}
```

Pass only `getAvailableTools(ctx)` to the LLM for each request.

---

## Security Rules

1. **Never let the LLM pass the JWT** in tool arguments. Extract it from the `Authorization` header at entry only.
2. **Never verify the token in every service.** Verify once; store in context.
3. **Always enforce auth in the tool dispatcher**, even if the LLM is instructed to behave.
4. **Filter the tool list** sent to the LLM by role and auth state.
5. **Return safe error messages** to the LLM (e.g. "Please log in first") — do not leak internal details.
6. **Validate all tool arguments** with Zod before passing to services.

---

## Planned File Structure

```
backend/src/
├── context/
│   └── conversation-context.ts      # AsyncLocalStorage + getters
├── modules/
│   ├── conversation/
│   │   ├── conversation.controller.ts
│   │   ├── conversation.service.ts
│   │   ├── tool-dispatcher.ts       # Auth gate for all LLM tools
│   │   └── tools/
│   │       ├── auth.tools.ts
│   │       ├── product.tools.ts
│   │       └── order.tools.ts
│   └── auth/
│       ├── jwt.service.ts           # generate, verify, session management
│       ├── auth.service.ts          # register, login, verifyOTP, logout
│       ├── authorization.service.ts # canAccess, canAny, canAll
│       └── role-permissions.ts      # role → permission mapping
```

---

## Implementation Checklist

- [ ] Create `conversation-context.ts` with `AsyncLocalStorage`
- [ ] Create `/conversation` route handler
- [ ] Verify JWT once at entry; populate context
- [ ] Create tool registry with `auth` and `permission` metadata
- [ ] Create tool dispatcher with auth and permission gates
- [ ] Filter available tools by context before sending to LLM
- [ ] Refactor services to use `getAuthenticatedUser()` instead of `token` params
- [ ] Update context after `verifyOTP` within the same request
- [ ] Add Zod schemas for tool argument validation

---

## Related Docs

- [Database](./database.md) — `User`, `Session`, and role enums
- [Vision](../vision.md) — AI-first platform goals and tech stack
