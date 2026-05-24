# ASO Audit Chat

A TypeScript chat app that performs App Store Optimization audits on Apple App Store URLs using Mastra AI agents.

## Features

- Paste an App Store URL and get a comprehensive ASO audit
- Agent confirms the app before running the full audit
- Real-time streaming responses
- Scores across 10 ASO dimensions with weighted overall score
- Quick wins, high-impact changes, and strategic recommendations
- Competitor comparison

## Tech Stack

- **Framework**: Next.js 15 with App Router
- **AI Framework**: Mastra
- **Web Scraping**: Firecrawl
- **LLM**: OpenAI GPT-4o
- **UI**: React 19, Tailwind CSS 4

## Project Structure

```
src/
├── app/
│   ├── api/chat/route.ts     # Streaming chat API endpoint
│   ├── globals.css           # Tailwind styles
│   ├── layout.tsx            # Root layout
│   └── page.tsx              # Chat interface
├── components/
│   ├── chat-input.tsx        # Message input component
│   ├── chat-message.tsx      # Message display with markdown
│   └── typing-indicator.tsx  # Loading indicator
├── hooks/
│   └── use-chat-stream.ts    # Custom streaming chat hook
└── mastra/
    ├── agents/
    │   └── aso-agent.ts      # ASO audit agent with instructions
    ├── tools/
    │   └── app-store.ts      # Firecrawl-based scraping tools
    ├── types.ts              # Zod schemas for app data
    └── index.ts              # Mastra configuration
```

## Setup

1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   ```
3. Copy the environment variables:
   ```bash
   cp .env.example .env
   ```
4. Add your API keys to `.env`:
   ```
   OPENAI_API_KEY=sk-xxx
   FIRECRAWL_API_KEY=fc-xxx
   ```

## Development

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

## How It Works

1. **User pastes an App Store URL** (e.g., `https://apps.apple.com/us/app/spotify-music-and-podcasts/id324684580`)

2. **Agent validates and fetches metadata** using the `validateAppStoreUrl` and `fetchAppMetadata` tools

3. **Agent confirms with user**: Shows app name, developer, category, and asks for confirmation

4. **On confirmation, agent runs full audit**:
   - Fetches comprehensive app details using `fetchAppDetails`
   - Searches for competitors using `searchCompetitors`
   - Scores the listing across 10 dimensions
   - Generates actionable recommendations

5. **Results presented** with:
   - ASO Score Card (scores with progress bars)
   - Quick Wins (3-5 immediate changes)
   - High-Impact Changes (3-5 larger improvements)
   - Strategic Recommendations (3-5 long-term plays)
   - Competitor Comparison table

## ASO Audit Framework

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

## Mastra Integration

The app demonstrates idiomatic use of Mastra:

- **Agent**: Single agent with comprehensive instructions for the audit workflow
- **Tools**: Four tools for URL validation, metadata fetching, detail scraping, and competitor search
- **Streaming**: Uses Mastra's `agent.stream()` with `textStream` for real-time responses

## License

MIT
