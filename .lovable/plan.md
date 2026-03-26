
# 🧠 Personal AI Workspace — Phase 1

## Visual Identity
- **Dark futuristic theme**: Deep navy/black backgrounds with glowing cyan/purple neon accents
- **Glassmorphism cards** with backdrop blur and subtle borders
- **3D-style CSS**: Perspective transforms on cards, floating shadows, depth layers
- **SVG animations**: Pulsing AI orb in chat, animated circuit-line patterns, glowing particles
- **Smooth transitions**: Fade/scale animations on all interactions

## Layout
- **Sidebar navigation** (collapsible, icon-only mini mode) with glowing active indicators
- **Main content area** with animated header showing time-of-day greeting
- **Floating AI chat panel** (expandable from bottom-right corner)

## Pages & Features

### 1. Dashboard
- Animated greeting with user's name + time-based message
- Summary cards (glassmorphism) showing: tasks due today, balance, unread docs, pending approvals
- Quick action buttons with hover glow effects
- Animated background with subtle particle/grid animation

### 2. AI Chat Interface
- Expandable chat panel with streaming AI responses (Lovable AI Gateway)
- Markdown rendering for AI responses
- Animated typing indicator with pulsing orb
- Chat routes requests contextually (tasks, finance, documents)

### 3. Task & Reminders
- Task list with priority badges (color-coded neon: red/yellow/green)
- Create/edit/complete tasks with smooth animations
- Due date picker, status toggles
- AI-suggested task creation from chat

### 4. Finance Ledger
- Transaction list with income (green glow) / expense (red glow) styling
- Add transaction form with category selector
- Summary cards: total income, expenses, balance with animated counters
- Period filter (daily/weekly/monthly)

### 5. Document Intelligence
- Upload documents (stored in Supabase Storage)
- Document list with type badges
- AI-powered summarization via chat ("summarize this document")
- Key points extraction displayed as glowing chips

## Backend (Lovable Cloud + Supabase)
- **Database tables**: tasks, transactions, documents, chat_messages
- **Edge functions**: AI chat (streaming), document summarization
- **Storage bucket**: for uploaded documents
- **RLS policies**: user-scoped data access

## AI Integration
- Lovable AI Gateway with streaming responses
- System prompt that understands workspace context
- Can create tasks, log transactions, summarize docs via natural language
