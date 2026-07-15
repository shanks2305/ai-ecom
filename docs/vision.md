# Commerce AI Platform - Technical Design Document (v1.0)

## Project Overview

### Project Name

Commerce AI Platform (Working Title)

### Vision

Build an AI-first, API-driven commerce platform where customers and administrators interact entirely through conversational interfaces (Telegram, WhatsApp, Discord, etc.) instead of a traditional web UI.

The AI acts as a shopping assistant for customers and a business assistant for administrators.

---

# Goals

* AI-first architecture
* API-first design
* Messaging platform independent
* Database independent
* LLM independent
* Easily deployable
* Modular and scalable

---

# Tech Stack

## Runtime

* Node.js 22+
* TypeScript

## Backend

* Express.js

## ORM

* Prisma

## Database

Development

* SQLite

Future

* PostgreSQL

## AI

Development

* Ollama
* OpenAI SDK

Production

* OpenAI SDK

## Authentication

* Email OTP
* JWT
* RBAC

## Logging

* Pino

## Validation

* Zod

---

# Architecture

```
Messaging Platform
        │
        ▼
Express Webhook
        │
        ▼
Conversation Manager
        │
        ▼
OpenAI SDK
        │
        ▼
Tool Executor
        │
        ▼
Business Services
        │
        ▼
Repositories
        │
        ▼
Prisma
        │
        ▼
SQLite
```

---

# Personas

## Guest

Capabilities

* Authenticate
* Register

---

## Customer

Capabilities

* Search products
* Browse catalog
* Product recommendations
* Add to cart
* Remove from cart
* View cart
* Checkout
* Place order
* Track order
* View order history

---

## Admin

Everything a customer can do plus:

* Add product
* Update product
* Delete product
* View all users
* View all orders
* Update order status
* Manage inventory

---

## Super Admin

Everything an Admin can do plus:

* Create Admin
* Remove Admin
* Manage roles
* System initialization

---

# User Journey

## Authentication

Hello

↓

Ask Email

↓

User Exists?

YES

→ Send OTP

→ Verify OTP

NO

→ Register User

→ Verify OTP

↓

Authenticated

↓

Ask

"What would you like to buy today?"

---

# Shopping Flow

User Request

↓

Extract Intent

↓

Search Products

↓

Exact Match?

YES

↓

Show Product

↓

User Likes Product

↓

Add To Cart

↓

Continue Shopping?

YES

↓

Search Again

NO

↓

Checkout

↓

Create Order

↓

Generate Order ID

↓

Tracking Link

↓

Complete

---

# Admin Flow

Authenticate

↓

Admin Command

↓

Permission Check

↓

Tool Execution

↓

Business Logic

↓

Database

↓

Response

---

# AI Principles

The AI NEVER:

* Writes SQL
* Reads the database directly
* Performs business logic

The AI ONLY:

* Understands intent
* Chooses tools
* Explains results
* Guides conversations

---

# AI Tools

Customer

* searchProducts()
* getProduct()
* findAlternativeProducts()
* addToCart()
* removeFromCart()
* viewCart()
* createOrder()
* trackOrder()

Admin

* createProduct()
* updateProduct()
* deleteProduct()
* viewUsers()
* viewOrders()
* updateOrderStatus()
* createAdmin()

---

# Project Structure

```
commerce-ai/

src/

    ai/

    controllers/

    routes/

    middleware/

    services/

    repositories/

    adapters/

    models/

    config/

    prisma/

    utils/

    types/
```

---

# Layer Responsibilities

Controllers

* HTTP
* Validation
* Response

Services

* Business logic

Repositories

* Database access only

AI

* Intent
* Tool selection
* Prompting

Adapters

* Telegram
* WhatsApp
* Discord

---

# Database Strategy

Current

SQLite

Future

PostgreSQL

All database access must go through Prisma repositories.

No service should depend directly on Prisma.

---

# Messaging Strategy

Every platform implements a common adapter.

```
receiveMessage()

sendMessage()

sendImage()

sendButtons()

sendCarousel()
```

The Conversation Manager remains unaware of the underlying messaging provider.

---

# Security

* JWT Sessions
* OTP Verification
* Role-Based Access Control
* Tool-level permission checks
* Audit logging for admin actions

---

# Logging

Log every AI interaction.

* User message
* AI response
* Tool call
* Execution time
* Tool result
* Final response

---

# Version 1 Scope

* Bootstrap Super Admin
* Authentication
* Product CRUD
* User CRUD
* Search Products
* Cart
* Checkout
* Orders
* Tracking
* Telegram integration
* AI shopping assistant
* AI admin assistant

---

# Future Versions

v2

* Semantic Search
* Product Embeddings
* Recommendation Engine

v3

* WhatsApp
* Discord
* Slack

v4

* Voice Support
* Image Search
* Human Handoff

v5

* Analytics
* Multi-Agent Workflows
* LangGraph
* Memory
* Personalization

---

# Development Rules

1. Business logic belongs in Services.
2. Database access belongs in Repositories.
3. AI never accesses the database directly.
4. Controllers stay thin.
5. Every feature should expose a service before adding an AI tool.
6. Every AI tool maps to exactly one service operation.
7. All admin actions require RBAC validation.
8. Design for SQLite today and PostgreSQL tomorrow.
9. Keep messaging providers interchangeable through adapters.
10. Write documentation before implementing major features.

---

# Initial Milestones

Milestone 1

* Project setup
* Express
* TypeScript
* Prisma
* SQLite

Milestone 2

* Bootstrap Super Admin
* Authentication
* RBAC

Milestone 3

* Product Management
* User Management

Milestone 4

* Cart
* Orders
* Checkout

Milestone 5

* AI Tool Calling

Milestone 6

* Telegram Integration

Milestone 7

* Production Readiness
