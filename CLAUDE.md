# Elle AI — Project Notes

This file tracks ongoing changes and architectural decisions for the Elle AI app.

---

## Prompt File Naming Convention

All prompt files saved to the workspace folder follow this format:

```
ElleAI-[topic]-[YYYYMMDD].md
```

Examples:
- `ElleAI-rebranding-20260220.md`
- `ElleAI-api-fix-20260220.md`
- `ElleAI-design-overhaul-20260221.md`

Every prompt created must also have its change registered in this `CLAUDE.md` under the Change Log section so context is preserved across sessions.

---

## Stack

- **Framework**: Next.js (App Router) + Capacitor for iOS/Android
- **Styling**: Tailwind CSS v4 + custom CSS design system in `globals.css`
- **State**: Zustand (`conversation-store`, `generation-store`)
- **Backend**: Supabase (auth + database)
- **AI Models**: FAL.ai (NanoBanana for images, VEO3 for video)
- **Animations**: Framer Motion

---

## FAL.ai Model Routing

All routing is handled in `src/app/api/generate/route.ts`:

| Input | Endpoint |
|---|---|
| Text only | `fal-ai/nano-banana` |
| Text + image attachment | `fal-ai/nano-banana/edit` |
| Any video type | `fal-ai/veo3` |

**NanoBanana text-to-image** → `fal-ai/nano-banana`
- Params: `prompt`, `aspect_ratio`, `num_images`, `output_format`, `safety_tolerance`
- Response: `{ images: [{ url: string }] }`

**NanoBanana image-to-image** → `fal-ai/nano-banana/edit`
- Params: `prompt`, `image_urls` (array!), `aspect_ratio`, `num_images`, `output_format`, `safety_tolerance`
- Accepts base64 data URIs directly in `image_urls` — no CDN upload needed
- Response: `{ images: [{ url: string }] }`

**VEO3 video** → `fal-ai/veo3`
- Params: `prompt`, `image_url` (optional, single string), `duration`, `aspect_ratio`
- Response: `{ video: { url: string } }`

---

## Design System

Defined in `src/app/globals.css`:

- **Background**: `#F5EFE9` (warm off-white)
- **Primary**: `#D4788A` (pastel rose/pink)
- **Gold accent**: `#C9955C`
- **Font**: SF Pro Display (Apple native feel)
- **Cards**: glassmorphism via `.glass-elevated`
- **Output cards**: gradient border via `.card-output` CSS `::before`
- **Animations**: `.shimmer`, `.pulse-glow`, `.message-in`

---

## Key Files

| File | Purpose |
|---|---|
| `src/app/api/generate/route.ts` | FAL.ai API proxy — all model routing here |
| `src/app/(main)/create/page.tsx` | Main create page — orchestrates chat + generation |
| `src/components/create/chat-bar.tsx` | Chat input with type/ratio/resolution/duration controls |
| `src/components/create/result-feed.tsx` | Chat message feed |
| `src/components/create/processing-overlay.tsx` | Loading overlay during generation |
| `src/components/layout/app-shell.tsx` | Root layout shell (header + sidebar toggle) |
| `src/components/layout/sidebar.tsx` | Slide-over sidebar (conversations, nav) |
| `src/stores/conversation-store.ts` | Zustand: conversations, messages, sidebar state |
| `src/stores/generation-store.ts` | Zustand: generation loading/result/error state |
| `src/hooks/use-image-picker.ts` | Camera/file input → base64 data URI |
| `src/types/conversation.ts` | TypeScript types: ChatMessage, GenerationType, etc. |
| `public/assets/logos/logoElle.png` | Elle AI logo image |

---

## Change Log

### 2026-02-20
- Renamed app from "AI Fun Meme" → "Elle AI"
- Replaced text logo with `logoElle.png` in header and sidebar
- Redesigned `ProcessingOverlay` with professional Elle-branded animation
- Fixed FAL model routing: removed all Flux references, NanoBanana only for images
- Fixed image-to-image: now uses `fal-ai/nano-banana/edit` with `image_urls` array
- Confirmed NanoBanana edit endpoint accepts base64 data URIs directly
- Removed CDN upload requirement
- Removed `resolution` pixel dimensions — NanoBanana uses `aspect_ratio` string only
- Removed all `model` override from frontend calls — route.ts owns all routing decisions
- Deleted all old `jules-*.md` prompt files from workspace
- Established prompt file naming convention: `ElleAI-[topic]-[YYYYMMDD].md`
- Created `ElleAI-rebranding-20260220.md` — covers app rename, logo swap, ProcessingOverlay redesign
- Created `ElleAI-chat-ux-20260220.md` — removes full-screen ProcessingOverlay, adds inline Elle avatar loading bubble, compact 240×240 media thumbnails in feed, tap-to-expand lightbox overlay, fixes download filename to `elle-ai-${id}`
- Created `ElleAI-chat-loading-fix-20260220.md` — fixes chat loading state never appearing: replaced non-reactive `getActiveConversation()` call with proper Zustand selector for `messages`, added conversation existence check in `handleSend` to prevent silent `addMessage` no-op on stale persisted conversation IDs, `useEffect` now validates conversation exists in array
- Created `ElleAI-chat-loading-fix-v2-20260220.md` — definitive fix: individual Zustand selectors per value in `CreatePage`, `useConversationStore.getState()` in `handleSend` to always read fresh conversation ID, `useCallback` on all handlers, new `isGenerating` prop to `ResultFeed` for fallback loading bubble that shows even if store message is missed
- Created `ElleAI-clean-store-20260220.md` — ROOT CAUSE FIX: removed `persist` middleware from `conversation-store.ts`; base64 photo attachments were exceeding localStorage 5MB quota on every `addMessage`, silently breaking all Zustand state updates. Store is now pure in-memory. Refresh = new conversation (intentional until Supabase is implemented)
- Created `ElleAI-video-ux-20260220.md` — VEO3 endpoint fix (separate endpoints for text-to-video vs image-to-video, duration as "8s" string, generate_audio, maxDuration=300 for serverless); loading bubble redesign (gradient image frame + frosted Elle logo + rotating motivational messages); remove video-to-video type; add lastGeneratedImageUrl prop to ChatBar for auto-reference in image-to-video
- Created `ElleAI-video-duration-20260220.md` — Fix video duration always showing as 8s: root cause is VEO3 only supports 5s and 8s (3s and 10s are silently rejected). Full duration chain confirmed working. Fix: update ChatBar duration pills from [3, 5, 10] → [5, 8]; add VEO3 duration clamp in buildRequestBody
