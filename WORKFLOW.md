# ASO Audit Chat - Workflow & Architecture

This document explains the complete workflow of the ASO Audit Chat application and the reasoning behind our technology choices.

## Overview

ASO Audit Chat is an AI-powered application that analyzes Apple App Store listings and provides actionable recommendations to improve app visibility and conversion rates. The system combines web scraping, AI agents, and real-time streaming to deliver comprehensive audits.

## Technology Stack & Rationale

### Mastra AI Framework

**What it is:** Mastra is a TypeScript framework for building AI agents with tool-calling capabilities.

**Why we use it:**
- **Agent Architecture**: Mastra provides a structured way to define AI agents with specific instructions, tools, and models
- **Tool Integration**: Easy integration of custom tools (like our App Store scraping tools) that the AI can call autonomously
- **Model Flexibility**: Supports multiple LLM providers (OpenAI, Anthropic) through a unified interface
- **Streaming Support**: Built-in support for streaming responses, essential for real-time chat experiences
- **TypeScript Native**: Full type safety throughout the agent definition and tool implementation

### Firecrawl

**What it is:** Firecrawl is a web scraping API that extracts structured data from websites using AI.

**Why we use it:**
- **Structured Extraction**: Uses LLMs to extract specific data fields from web pages, not just raw HTML
- **Schema-Based**: Define exactly what data you need using Zod schemas, and Firecrawl returns typed JSON
- **Handles Dynamic Content**: Works with JavaScript-rendered pages like the App Store
- **No Infrastructure**: Cloud-based API means no need to manage headless browsers or proxy servers
- **Reliability**: Handles rate limiting, retries, and anti-bot measures automatically

### OpenAI GPT-4o / Anthropic Claude

**What they are:** Large Language Models (LLMs) that power the AI agent's reasoning and analysis.

**Why we support both:**
- **Model Diversity**: Different models have different strengths; GPT-4o excels at structured analysis while Claude excels at nuanced recommendations
- **Fallback Options**: If one provider has issues, switch to the other
- **Cost Optimization**: GPT-4o Mini offers a cheaper option for development/testing
- **User Preference**: Some users prefer one provider over another for various reasons

## Complete Workflow

### Step 1: User Input

```
User pastes App Store URL
         │
         ▼
┌─────────────────────┐
│   Chat Interface    │
│   (Next.js React)   │
└─────────────────────┘
```

The user enters an Apple App Store URL (e.g., `https://apps.apple.com/us/app/spotify/id324684580`) into the chat input. The frontend validates basic input and sends it to the API.

### Step 2: API Route Processing

```
         │
         ▼
┌─────────────────────┐
│   /api/chat Route   │
│   (Next.js API)     │
└─────────────────────┘
         │
         ▼
┌─────────────────────┐
│   Mastra Agent      │
│   Initialization    │
└─────────────────────┘
```

The API route receives the message, retrieves the ASO Audit Agent from Mastra, and initiates a streaming response.

### Step 3: URL Validation

```
         │
         ▼
┌─────────────────────┐
│  validateAppStoreUrl│
│      (Tool)         │
└─────────────────────┘
```

The agent's first action is to validate the URL:
- Checks if URL matches Apple App Store pattern
- Extracts app ID and country code
- Returns validation status

**Tool Implementation:**
```typescript
// Regex pattern for App Store URLs
/apps\.apple\.com\/([a-z]{2})\/app\/[^\/]+\/id(\d+)/
```

### Step 4: Metadata Fetch & Confirmation

```
         │
         ▼
┌─────────────────────┐
│  fetchAppMetadata   │
│   (Firecrawl Tool)  │
└─────────────────────┘
         │
         ▼
┌─────────────────────┐
│  Agent asks user:   │
│  "Is this the app?" │
└─────────────────────┘
```

Before running a full audit, the agent:
1. Fetches basic metadata (name, developer, rating, icon)
2. Presents this to the user for confirmation
3. Waits for user to confirm before proceeding

**Why this step exists:**
- Prevents wasting API calls on wrong apps
- Handles cases where URL might be outdated
- Builds user trust through transparency

### Step 5: Full Audit Execution

```
User confirms "Yes"
         │
         ▼
┌─────────────────────┐
│   fetchAppDetails   │
│   (Firecrawl Tool)  │
└─────────────────────┘
         │
         ▼
┌─────────────────────┐
│  searchCompetitors  │
│   (Firecrawl Tool)  │
└─────────────────────┘
```

On confirmation, the agent:

**A. Fetches Comprehensive App Details:**
- Full description
- All screenshots metadata
- Version history
- In-app purchases
- Privacy information
- Complete ratings breakdown

**B. Searches for Competitors:**
- Queries App Store search for similar apps
- Extracts top competing apps
- Gathers their metadata for comparison

### Step 6: AI Analysis

```
         │
         ▼
┌─────────────────────┐
│   LLM Analysis      │
│ (GPT-4o or Claude)  │
└─────────────────────┘
```

The AI agent analyzes all collected data against the ASO framework:

| Dimension | Weight | What's Analyzed |
|-----------|--------|-----------------|
| Title | 20% | Keyword usage, brand balance, character count |
| Subtitle | 15% | Benefit-driven copy, keyword inclusion |
| Keywords | 15% | Relevance, no duplication, full utilization |
| Description | 10% | First 3 lines hook, feature/benefit balance |
| Screenshots | 15% | Quantity, captions, value communication |
| Preview Video | 5% | Existence, quality, engagement |
| Ratings | 15% | Average score, volume, recent trends |
| Icon | 5% | Distinctiveness, category fit, scalability |
| Conversion | 5% | What's New, promotional text, events |
| Competition | 5% | Keyword gaps, visual differentiation |

### Step 7: Streaming Response

```
         │
         ▼
┌─────────────────────┐
│  Streaming Output   │
│  (ReadableStream)   │
└─────────────────────┘
         │
         ▼
┌─────────────────────┐
│   Chat Interface    │
│  (Real-time render) │
└─────────────────────┘
```

The analysis streams back to the user in real-time:
- Score card with all 10 dimensions
- Overall weighted score (0-100)
- Quick Wins (immediate actions)
- High-Impact Changes (significant improvements)
- Strategic Recommendations (long-term)
- Competitor comparison table

## Data Flow Diagram

```
┌──────────────┐     ┌──────────────┐     ┌──────────────┐
│              │     │              │     │              │
│    User      │────▶│   Next.js    │────▶│    Mastra    │
│   Browser    │◀────│   API Route  │◀────│    Agent     │
│              │     │              │     │              │
└──────────────┘     └──────────────┘     └──────────────┘
                                                 │
                           ┌─────────────────────┼─────────────────────┐
                           │                     │                     │
                           ▼                     ▼                     ▼
                    ┌──────────────┐     ┌──────────────┐     ┌──────────────┐
                    │              │     │              │     │              │
                    │  Firecrawl   │     │   OpenAI     │     │  Anthropic   │
                    │     API      │     │   GPT-4o     │     │   Claude     │
                    │              │     │              │     │              │
                    └──────────────┘     └──────────────┘     └──────────────┘
                           │
                           ▼
                    ┌──────────────┐
                    │              │
                    │  App Store   │
                    │   Website    │
                    │              │
                    └──────────────┘
```

## Key Design Decisions

### 1. Agent-Based Architecture

Instead of a simple prompt-response pattern, we use an agent that can:
- Make decisions about which tools to call
- Chain multiple tool calls together
- Maintain conversation context
- Handle errors gracefully

### 2. Tool Separation

Each scraping function is a separate tool:
- `validateAppStoreUrl`: Quick validation, no API calls
- `fetchAppMetadata`: Light scrape for confirmation
- `fetchAppDetails`: Heavy scrape for full analysis
- `searchCompetitors`: Separate search operation

This allows the agent to be efficient - it only calls expensive operations when needed.

### 3. Streaming First

We stream responses because:
- ASO audits can take 30-60 seconds to complete
- Users see progress immediately
- Better perceived performance
- Can abort early if needed

### 4. Model Agnostic

The model configuration layer allows:
- Easy switching via environment variable
- No code changes needed to swap models
- Testing with cheaper models, production with better ones

## Environment Variables

| Variable | Purpose |
|----------|---------|
| `OPENAI_API_KEY` | Authentication for OpenAI models |
| `ANTHROPIC_API_KEY` | Authentication for Anthropic models |
| `FIRECRAWL_API_KEY` | Authentication for Firecrawl scraping |
| `AI_MODEL` | Which model to use (default: gpt-4o) |

## Error Handling

The system handles errors at multiple levels:

1. **URL Validation**: Invalid URLs caught before any API calls
2. **Firecrawl Errors**: Graceful handling of scraping failures
3. **LLM Errors**: Timeout handling for long-running requests
4. **Streaming Errors**: Connection drops handled by the client

## Future Considerations

- **Caching**: Store audit results to avoid re-scraping unchanged apps
- **Batch Analysis**: Audit multiple apps at once for comparison
- **Historical Tracking**: Track ASO scores over time
- **Google Play Support**: Extend to Android app analysis
