# 🚀 Tunicoin — Project Vision & Build Plan

## What We're Building

**Tunicoin** is a sophisticated virtual CFD futures trading platform that provides:

- **Realistic Trading Simulation** — Full-featured trading environment with no real money at risk
- **AI Trading Agents** — Automated trading bots that execute strategies on behalf of users
- **Educational Focus** — Learn CFD trading, test strategies, and compete safely
- **Multi-Currency Support** — Crypto deposits via Binance Pay, Coinbase Commerce, and on-chain payments

---

## 🎯 Core Value Propositions

1. **Risk-Free Learning** — Trade realistic simulations without losing real capital
2. **AI-Powered Trading** — Subscribe to algorithmic strategies managed by the Tunicoin Bot
3. **Complete Transparency** — Every trade, decision, and metric is logged and explainable
4. **Professional Tools** — Charts, indicators, backtesting, portfolio analytics
5. **Flexible Payments** — Fiat (Stripe) + Crypto (Binance Pay, Coinbase, USDC on-chain)

---

## 🏗️ Technical Architecture

### Monorepo Structure

```
tunicoin/
├── apps/
│   ├── web/          # Next.js 14 Frontend (TypeScript + Tailwind)
│   ├── api/          # FastAPI Backend (Python + SQLModel)
│   ├── worker/       # Celery Workers (Python)
│   └── agent/        # AI Strategy Engine (Python)
├── packages/         # Shared utilities
├── infrastructure/   # Docker, K8s, CI/CD
└── docs/            # Documentation
```

### Technology Stack

#### Frontend
- **Framework**: Next.js 14 (App Router, TypeScript)
- **Styling**: Tailwind CSS + shadcn/ui components
- **Charts**: TradingView Lightweight Charts
- **State**: Zustand + React Query
- **Icons**: Lucide React
- **Animations**: Framer Motion

#### Backend
- **API**: FastAPI (Python 3.11+)
- **Database**: PostgreSQL (managed)
- **ORM**: SQLModel + Alembic migrations
- **Cache**: Redis
- **Queue**: Celery + Redis broker
- **Auth**: JWT tokens + 2FA (TOTP)

#### AI/Trading Engine
- **Strategy Framework**: Python classes (BaseStrategy)
- **Backtesting**: Vectorized pandas calculations
- **Risk Management**: Position sizing, circuit breakers
- **Explainability**: Decision logging with reasoning

#### Payments & Billing
- **Fiat**: Stripe Checkout + Subscriptions
- **Crypto**: Binance Pay, Coinbase Commerce
- **On-chain**: WalletConnect + MetaMask (USDC/ERC-20)

#### Infrastructure
- **Containers**: Docker + Docker Compose
- **Orchestration**: Kubernetes (optional) or Render/Fly/Railway
- **CI/CD**: GitHub Actions
- **Monitoring**: Sentry, Prometheus, Grafana
- **Logging**: Structured JSON logs

---

## 📊 Data Model (Core Tables)

1. **users** — Auth, email, 2FA, plan_id, kyc_status
2. **accounts** — Simulated trading accounts (multi-account per user)
3. **instruments** — BTC-USD, ETH-USD, futures contracts (tick size, spreads)
4. **candles** — OHLCV data for charting
5. **orders** — Simulated order records (market, limit, stop, etc.)
6. **positions** — Open positions with unrealized P&L
7. **ledger_entries** — Double-entry accounting for all transactions
8. **bots** — AI agent instances (strategy, params, status)
9. **bot_decisions** — Decision logs with explainability
10. **backtests** — Historical strategy test results

---

## 🎨 Design System

### Brand Colors
- **Primary Blue**: `#2B6EEA` (trust, professionalism)
- **Deep Blue**: `#0B3D91` (authority)
- **White**: `#FFFFFF` (clarity)
- **Muted Gray**: `#F5F7FA` (backgrounds)
- **Text**: `#0F172A` (readable contrast)

### Typography
- **Font**: Inter (Variable weight)
- **Headings**: 600–700 weight
- **Body**: 400 weight

### Components Style
- **Cards**: 12px border-radius, soft shadows
- **Buttons**: Blue gradient, subtle scale on press
- **Modals**: Backdrop blur, rounded-2xl
- **Motion**: 150–220ms transitions, purposeful only

---

## 🚦 10-Phase Build Plan

### Phase 1: Monorepo Scaffold ✅ NEXT
**Goal**: Project initialization with all infrastructure

- Initialize Git repo + README
- Set up Next.js 14 frontend (`/apps/web`)
- Set up FastAPI backend (`/apps/api`)
- Create Celery worker structure (`/apps/worker`)
- Create AI agent package (`/apps/agent`)
- Docker Compose for Postgres, Redis, PgAdmin, Nginx
- Makefile commands: `make dev`, `make build`, `make migrate`
- GitHub Actions CI skeleton

**Deliverables**:
- Monorepo with all apps initialized
- `make dev` boots entire stack
- Frontend: http://localhost:3000
- API Docs: http://localhost:8000/docs

---

### Phase 2: Database Schema & Migrations
**Goal**: Complete data model with seed data

- Define SQLModel models (10 core tables)
- Alembic migrations
- Seed script: demo user, instruments, 30 days of candle data
- API endpoint: `/api/seed/run` (dev only)

**Acceptance**: Demo user exists, candles queryable

---

### Phase 3: Backend Core API
**Goal**: Trading operations and WebSocket streams

**Endpoints**:
- Auth: signup, login, refresh JWT
- Accounts: create, view
- Orders: place, list, cancel
- Positions: view, close
- Market: candles API
- Backtests: create, view results

**WebSocket**: `/ws/accounts/:id/streams` for live updates

**Business Logic**: Execution simulator (fills, slippage, ledger)

**Acceptance**: Place order → WebSocket fill event < 1s

---

### Phase 4: Landing, Auth & Payment UI
**Goal**: Public-facing pages and payment flows

- Landing page (hero, features, CTA)
- Auth pages (signup, login, 2FA setup)
- Pricing page (Free/Basic/Pro/Enterprise)
- Stripe Checkout integration
- Binance Pay button (stub)
- WalletConnect/MetaMask modal (stub)

**Acceptance**: User can sign up and trigger Stripe checkout

---

### Phase 5: Trading Canvas UI
**Goal**: Core trading interface

- TradingView chart component (candles, indicators, drawing tools)
- Order ticket (6 order types, leverage slider, margin preview)
- Positions panel (live updates via WebSocket)
- Orders panel
- Mobile-first responsive design
- Keyboard shortcuts (O, C, B)

**Acceptance**: User can place order from chart, see live position updates

---

### Phase 6: AI Agent Framework
**Goal**: Strategy engine and backtesting

- BaseStrategy interface
- EMA Crossover strategy (20/50 default)
- Backtester with metrics (CAGR, Sharpe, drawdown)
- Explainability (trade reasoning)
- Celery job integration for backtests

**Acceptance**: POST backtest → get metrics with trade-by-trade logs

---

### Phase 7: Bot Orchestration & Risk
**Goal**: Live bot runtime with safety limits

- Bot runtime service (Celery-based)
- RiskManager (position sizing, max loss, circuit breakers)
- Decision logging to database
- API: attach bot, update params, view logs

**Acceptance**: Bot runs on demo account, produces decision logs, auto-pauses on risk limit

---

### Phase 8: Crypto Payments Integration
**Goal**: Production-ready payment gateways

- Binance Pay (create order + webhook)
- Coinbase Commerce (charge + webhook)
- On-chain USDC (WalletConnect, txid verification)
- Crypto withdrawals (admin approval, KYC check)

**Acceptance**: All payment methods create demo transactions, withdrawals require admin approval

---

### Phase 9: Admin Dashboard
**Goal**: Platform management and operations

- User management (search, edit plan, set KYC)
- Billing management (view subscriptions, manual adjustments)
- Payment reconciliation
- Instrument management (add/edit)
- Bot/strategy monitoring
- Backtest job monitor
- Withdrawal approvals
- Logs viewer

**Acceptance**: Admin can change user plan, approve withdrawal

---

### Phase 10: CI/CD & Production Launch
**Goal**: Deployment automation and monitoring

- GitHub Actions (lint, test, build, deploy)
- Multi-stage Dockerfiles
- Kubernetes manifests (or Render/Fly instructions)
- Sentry integration
- Prometheus metrics + Grafana dashboards
- Production environment variables template
- Security audit checklist
- Legal review checklist

**Acceptance**: Push to main → CI passes → staging deploy works

---

## ⚖️ Legal & Compliance

### Critical Requirements
- ✅ Prominent disclaimers: "Simulated trading, no real funds"
- ✅ No guarantees of returns
- ✅ Risk disclosures on landing and checkout
- ✅ Terms of Service + Privacy Policy
- ✅ KYC for withdrawals
- ✅ Regional CFD regulation notices

### Disclaimer Language
> "Tunicoin simulates CFD & futures trading for educational purposes. No real funds are traded. Past simulated performance is not indicative of future results."

---

## 📈 Success Metrics

### Technical KPIs
- **Uptime**: 99.9% for core API
- **Accuracy**: Ledger reconciliation to 0.01 unit
- **Performance**: Chart load < 400ms for 1-year data

### User KPIs
- **Conversion**: Trial → Paid > 4%
- **Retention**: D7, D30, D90 cohorts
- **Engagement**: Daily active users, trades per user

---

## 🔐 Security Priorities

1. **Auth**: bcrypt/argon2 password hashing, JWT, 2FA
2. **API**: Rate limiting on critical endpoints
3. **Secrets**: Environment vault, never in code
4. **Crypto**: Admin approval for withdrawals, KYC required
5. **Monitoring**: Sentry for errors, structured logs for audits

---

## 🎯 MVP Scope (First Release)

**Core Features Only**:
- ✅ User signup + demo account (pre-funded $10k)
- ✅ Trading canvas (chart + basic order types)
- ✅ Tunicoin Bot (single EMA strategy, fixed params)
- ✅ Stripe billing (one plan)
- ✅ Basic backtesting
- ✅ Position management
- ✅ Portfolio analytics

**Deferred to v2**:
- Strategy marketplace
- Multiple bot strategies
- Advanced order types (OCO, trailing stop)
- Walk-forward testing
- Live-sim replay controls

---

## 📝 Development Commands

```bash
# Initialize and run locally
make dev          # Boot entire stack
make migrate      # Run DB migrations
make seed         # Seed demo data
make test         # Run all tests
make build        # Build production images

# Individual services
make web          # Frontend only
make api          # Backend only
make worker       # Celery workers
```

---

## 🚀 Getting Started (First Steps)

### Immediate Actions:
1. ✅ Read this vision document
2. ⏭️ Execute Prompt 1: Scaffold monorepo
3. ⏭️ Execute Prompt 2: Database schema
4. ⏭️ Continue sequentially through all 10 prompts

### Estimated Timeline:
- **Phases 1-3**: 1-2 weeks (infrastructure + backend)
- **Phases 4-5**: 1 week (frontend UI)
- **Phases 6-7**: 1-2 weeks (AI engine)
- **Phases 8-9**: 1 week (payments + admin)
- **Phase 10**: 3-5 days (CI/CD + launch prep)

**Total MVP**: 4-6 weeks with dedicated development

---

## 📚 Reference Documents

- `description.txt` — Complete product specification (594 lines)
- `prompts.txt` — 10 detailed build prompts (265 lines)
- This document — Strategic overview and roadmap

---

## ✨ What Makes Tunicoin Unique

1. **Simulation Fidelity** — Realistic spread, slippage, funding costs
2. **AI Transparency** — Every bot decision is explainable
3. **Educational Focus** — No real money risk, pure learning
4. **Crypto-Native** — Multiple payment options including on-chain
5. **Professional Grade** — Tools that match real trading platforms

---

**Status**: 🟡 Ready to Begin Phase 1
**Next Action**: Execute Prompt 1 — Monorepo Scaffold

---

*Created: November 2024*
*Last Updated: November 2024*
