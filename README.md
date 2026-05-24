# ASO Audit Chat

A TypeScript chat application that performs comprehensive App Store Optimization (ASO) audits on Apple App Store URLs using Mastra AI agents.

## Features

- Paste any Apple App Store URL and receive a detailed ASO audit
- Agent confirms the app before running the full analysis
- Real-time streaming responses
- Scores across 10 ASO dimensions with weighted overall score (0-100)
- Actionable recommendations: Quick Wins, High-Impact Changes, Strategic Recommendations
- Competitor comparison analysis
- Switchable AI models (OpenAI GPT-4o, Claude, etc.)

## Tech Stack

- **Framework**: Next.js 15 (App Router)
- **AI Framework**: Mastra
- **LLM**: OpenAI GPT-4o / Anthropic Claude (configurable)
- **Web Scraping**: Firecrawl
- **UI**: React 19, Tailwind CSS 4
- **Testing**: Cypress
- **Containerization**: Docker

## Project Structure

```
src/
├── app/
│   ├── api/chat/route.ts        # Streaming chat API
│   ├── globals.css              # Tailwind theme
│   ├── layout.tsx               # Root layout
│   ├── page.tsx                 # Chat interface
│   ├── icon.tsx                 # Favicon
│   └── apple-icon.tsx           # Apple touch icon
├── components/
│   ├── chat-input.tsx           # Message input
│   ├── chat-message.tsx         # Message display with markdown
│   ├── typing-indicator.tsx     # Loading animation
│   └── index.ts
├── hooks/
│   ├── use-chat-stream.ts       # Custom streaming hook
│   └── index.ts
├── mastra/
│   ├── agents/
│   │   └── aso-agent.ts         # ASO audit agent
│   ├── config/
│   │   └── models.ts            # AI model configuration
│   ├── tools/
│   │   └── app-store.ts         # Firecrawl scraping tools
│   ├── types.ts                 # Zod schemas
│   └── index.ts
└── types/
    └── css.d.ts
cypress/
├── e2e/
│   ├── chat.cy.ts               # UI tests
│   └── aso-audit.cy.ts          # Integration tests
└── support/
scripts/
├── docker-run.sh
├── docker-stop.sh
└── docker-clean.sh
```

## Setup

1. Clone the repository

2. Install dependencies:
   ```bash
   npm install
   ```

3. Configure environment variables:
   ```bash
   cp .env.example .env
   ```

4. Add your API keys to `.env`:
   ```env
   OPENAI_API_KEY=sk-xxx
   ANTHROPIC_API_KEY=sk-ant-xxx
   FIRECRAWL_API_KEY=fc-xxx
   AI_MODEL=gpt-4o
   ```

## Development

```bash
npm run dev
```

Open http://localhost:3000

## AI Model Configuration

Switch between models by setting the `AI_MODEL` environment variable:

| Model | Value |
|-------|-------|
| GPT-4o (default) | `gpt-4o` |
| GPT-4o Mini | `gpt-4o-mini` |
| GPT-4 Turbo | `gpt-4-turbo` |
| Claude Sonnet 4 | `claude-sonnet-4` |
| Claude 3.5 Sonnet | `claude-3-5-sonnet` |
| Claude 3 Opus | `claude-3-opus` |

## Docker

Build and run:
```bash
npm run docker:run
```

Stop:
```bash
npm run docker:stop
```

Clean up:
```bash
npm run docker:clean
```

## Testing

Run Cypress tests:
```bash
npm run test:e2e
```

Interactive mode:
```bash
npm run test:e2e:open
```

## ASO Audit Framework

The audit scores apps across 10 dimensions:

| Dimension | Weight |
|-----------|--------|
| Title (30 char limit) | 20% |
| Subtitle (30 char limit) | 15% |
| Keyword field (100 char limit) | 15% |
| Description | 10% |
| Screenshots | 15% |
| App preview video | 5% |
| Ratings & reviews | 15% |
| Icon | 5% |
| Conversion signals | 5% |
| Competitive position | 5% |

## How It Works

1. User pastes an App Store URL
2. Agent validates URL and fetches basic metadata
3. Agent confirms with user: "Is this the app you meant?"
4. On confirmation, agent runs full audit:
   - Fetches comprehensive app details
   - Searches for competitors
   - Scores all 10 dimensions
   - Generates recommendations
5. Results displayed with:
   - ASO Score Card (0-100)
   - Quick Wins (immediate changes)
   - High-Impact Changes (larger improvements)
   - Strategic Recommendations (long-term)
   - Competitor Comparison table

## Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start development server |
| `npm run build` | Build for production |
| `npm run start` | Start production server |
| `npm run docker:run` | Build and run Docker |
| `npm run docker:stop` | Stop Docker containers |
| `npm run docker:clean` | Remove Docker resources |
| `npm run test:e2e` | Run Cypress tests |
| `npm run test:e2e:open` | Open Cypress UI |

## License

MIT
