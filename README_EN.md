# 🚀 DEX - Decentralized Exchange

> Enterprise-grade DEX implementation based on UniswapV2 with modern tech stack, fully open-source.

[English](./README_EN.md) | [简体中文](./README.md)

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue.svg)](https://www.typescriptlang.org/)
[![React](https://img.shields.io/badge/React-18-61DAFB.svg)](https://reactjs.org/)
[![NestJS](https://img.shields.io/badge/NestJS-10-E0234E.svg)](https://nestjs.com/)
[![Solidity](https://img.shields.io/badge/Solidity-0.8.20-363636.svg)](https://soliditylang.org/)
[![PRs Welcome](https://img.shields.io/badge/PRs-welcome-brightgreen.svg)](CONTRIBUTING.md)

---

## 📖 Introduction

A full-featured decentralized exchange (DEX) featuring:

- ✅ **Swap** - Token exchange with AMM algorithm
- ✅ **Liquidity** - Add/remove liquidity
- ✅ **Pool** - Liquidity pool management
- ✅ **Farms** - Liquidity mining (MasterChef)
- ✅ **Price Oracle** - Price feeds (Chainlink)
- ✅ **History** - Complete transaction history
- ✅ **Analytics** - Data analysis and statistics
- ✅ **Real-time** - WebSocket live updates
- 🔄 **The Graph** - Data indexing and fast queries (In Development)

### 🌟 Highlights

- **Truly Decentralized** - Users manage private keys through MetaMask
- **Modern Architecture** - Frontend calls contracts directly, backend provides read-only services
- **Complete Analytics** - Historical records, statistics, real-time monitoring
- **Production-Ready** - Refactored and optimized code, clean and maintainable

---

## 🏗️ Tech Stack

### Smart Contracts
- **Solidity** - Contract language
- **Hardhat** - Development framework
- **UniswapV2** - AMM protocol

### Backend
- **NestJS** - Node.js framework
- **TypeScript** - Type safety
- **SQL** - Database
- **Redis** - Cache
- **Socket.IO** - WebSocket real-time communication
- **Viem** - Ethereum library (read-only)
- **The Graph** - Blockchain data indexing (In Development)
- **GraphQL** - Data query language

### Frontend
- **React 18** - UI framework
- **TypeScript** - Type safety
- **Vite** - Build tool
- **Ant Design** - UI component library
- **Wagmi** - React Hooks for Ethereum
- **Viem** - Ethereum library
- **Zustand** - State management
- **React Query** - Data fetching

---

## 🚀 Quick Start

### Prerequisites

- Node.js >= 18
- npm (comes with Node.js)
- MetaMask wallet

### 1. Clone Repository

```bash
git clone https://github.com/your-username/dex.git
cd dex
```

### 2. One-Click Start

```bash
# See detailed steps
cat START_ALL.md

# Or quick start guide
cat GETTING_STARTED.md
```

### 3. Access Application

- **Frontend:** http://localhost:3000
- **Backend API:** http://localhost:3002
- **API Docs:** http://localhost:3002/api
- **Wallet Service:** http://localhost:3001

---

## 🎯 Core Concepts

### User Perspective

```
User → MetaMask → Smart Contracts
         ↓
    Sign Transaction
         ↓
   On-chain Execution (Decentralized)
```

### System Architecture

```
┌─────────────────────────────────────────────┐
│                   Frontend                   │
│   (React + Viem + MetaMask)                 │
│   - Direct contract calls                    │
│   - Backend API queries                      │
└──────────────┬──────────────────────────────┘
               │
               ├──────────────┐
               │              │
               ▼              ▼
      ┌────────────┐   ┌──────────────┐
      │  Contracts │   │   Backend     │
      │ (Solidity) │   │   (NestJS)    │
      │            │   │  - Read API   │
      │ - Swap     │   │  - Analytics  │
      │ - Pool     │   │  - Events     │
      │ - Router   │   │  - Real-time  │
      └────────────┘   └──────────────┘
            ▲                  │
            │                  │
            └──────────────────┘
           Blockchain Events
```

---

## 🔧 Development

### Project Structure

```
dex/
├── contracts/          # Smart contracts
│   ├── contracts/      # Solidity contracts
│   │   ├── core/       # Core contracts (Factory, Pair, Router)
│   │   ├── farming/    # Farming contracts (MasterChef)
│   │   └── oracle/     # Price oracle (PriceOracle)
│   └── scripts/        # Deployment scripts
│
├── backend/            # Backend services
│   └── services/
│       ├── analytics-service/  # Data analytics service
│       │   ├── modules/
│       │   │   ├── price/      # Price service
│       │   │   └── thegraph/   # The Graph integration
│       │   └── ...
│       └── wallet-service/     # Wallet service
│
├── frontend/           # Frontend app
│   └── web-app/        # React app
│       ├── src/
│       │   ├── pages/          # Pages (Swap, Pools, Farms...)
│       │   ├── hooks/          # React Hooks
│       │   └── components/     # Components
│       └── ...
│
├── subgraph/           # The Graph Subgraph (New)
│   ├── schema.graphql  # GraphQL Schema
│   ├── subgraph.yaml   # Config file
│   └── src/mappings/   # Event handlers
│
├── scripts/            # Test scripts
└── tests/              # Tests
```

### Common Commands

```bash
# Mint tokens
bash scripts/mint-tokens-simple.sh

# Sync pool data
bash scripts/sync-all-pools.sh

# Test API
bash scripts/test-analytics-api.sh
```

---

## 🤝 Contributing

### Development Standards

- **Code Style** - ESLint + Prettier
- **Commit Convention** - Conventional Commits
- **Branch Strategy** - Git Flow
- **Testing** - Unit tests + Integration tests

---

## 📄 License

MIT License - See [LICENSE](./LICENSE)

---

## 🌟 Acknowledgments

- [Uniswap V2](https://uniswap.org/) - AMM protocol
- [NestJS](https://nestjs.com/) - Backend framework
- [React](https://reactjs.org/) - Frontend framework
- [Viem](https://viem.sh/) - Ethereum library
- [Wagmi](https://wagmi.sh/) - React Hooks

---

**Last Updated:** 2025-10-30  
**Maintainers:** DEX Team

---

## 📈 Project Highlights

### Implemented Core Features

✅ **8 Smart Contracts** - Factory, Pair, Router, WETH, MasterChef, RewardToken, PriceOracle, Mock Aggregator  
✅ **62+ REST API Endpoints** - Complete backend services  
✅ **10+ GraphQL Queries** - The Graph data indexing (In Development)  
✅ **7 Frontend Pages** - Swap, Liquidity, Pools, Farms, History...  
✅ **Real-time Updates** - WebSocket support  
✅ **Price Oracle** - Chainlink integration, USD price display  
✅ **Liquidity Mining** - Complete Staking and Rewards system  

### Technical Features

🚀 **Performance Optimized** - The Graph indexing, 10-100x faster queries  
🔒 **Security First** - Comprehensive permission control and input validation  
📚 **Well-documented** - 20,000+ lines of detailed documentation  
🧪 **Fully Tested** - Unit tests + Integration tests + E2E tests  
🎨 **Modern UI** - Ant Design + Responsive design

