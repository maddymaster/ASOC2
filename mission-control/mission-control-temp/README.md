# Mission Control

An AI-powered sales dashboard featuring a conversational agent for strategy definition and lead generation. This project uses Next.js 15, Tailwind CSS, and shadcn/ui.

## Features

- **Conversational Strategy Agent**: Define your target market (Industry, Geo, Company Size) through natural language.
- **Automated Lead Generation**: Fetches enriched leads (via Apollo.io or mock data) based on the defined strategy.
- **Lead Scoring**: Automatically scores leads based on firmographic fit.
- **Dual-Pane Interface**: seamless chat and dashboard experience.

## Getting Started

1. **Install Dependencies**:
   ```bash
   npm install
   ```

2. **Run Development Server**:
   ```bash
   npm run dev
   ```

3. **Open Application**:
   Navigate to [http://localhost:3000](http://localhost:3000).

## Configuration

- **API Keys**:
  - `APOLLO_API_KEY`: Set in `.env.local` to enable real data fetching.
  - `GOOGLE_API_KEY`: Currently hardcoded for demo purposes (see `src/app/api/chat/route.ts`).
