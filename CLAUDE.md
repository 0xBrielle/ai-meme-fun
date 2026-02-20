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
- Created `ElleAI-chatbar-responsive-20260220.md` — Fix ChatBar controls row overflow on narrow iPhone viewports: shorten type labels ("Txt → Img") and aspect ratio labels (drop words like "Classic"/"Mobile"), reduce gap/padding, add WebkitOverflowScrolling for iOS momentum scroll, add right-edge fade gradient as scroll hint, add end spacer so last control isn't hidden under fade
- Created `ElleAI-video-api-error-fix-20260220.md` — Fix "[object Object]" toast on video generation: (1) route.ts: FAL returns detail as array of objects — extract .msg fields and join as readable string; (2) api-client.ts: APIError.fromResponse handles non-string error fields defensively; (3) fal.ts: video requests get 310s timeout + 0 retries (prevents premature 2-min abort and duplicate VEO3 jobs), image requests get 60s + 1 retry
- Created `ElleAI-veo3-duration-correction-20260220.md` — CORRECTION: VEO3 API confirmed permitted durations are '4s', '6s', '8s' (not '5s'/'8s' as previously assumed). Updates chat-bar.tsx pills from [5,8] → [4,6,8], default from 5 → 6; updates route.ts clamp whitelist from [5,8] → [4,6,8]
- Created `ElleAI-video-controls-errors-20260220.md` — (1) Video mode controls go vertical: stacked panel (ratio 16:9/9:16, quality 720p/1080p, duration 4s/6s/8s, audio on/off) replacing horizontal scroll; image mode keeps horizontal layout; auto-switches to valid video values on mode change. (2) generateAudio param plumbed through full chain. (3) getFriendlyError() helper with caring messages for content policy/timeout/rate-limit/invalid; errorMessage stored in ChatMessage; error bubble uses warm amber for policy violations, red for generic
- Created `ElleAI-kling26-migration-20260220.md` — SUPERSEDED by v2 below (had duration as number, missing image-to-video aspect_ratio, wrong keep_original_sound default)
- Created `ElleAI-kling26-migration-v2-20260220.md` — CONFIRMED from API docs. Kling 2.6 replaces VEO3 entirely. Corrections: duration sent as string enum "5"|"10" (not number); image-to-video also accepts aspect_ratio/cfg_scale/negative_prompt; keep_original_sound defaults to true; 4 files: types.ts (add videoUrl/keepOriginalSound/characterOrientation/cfgScale/negativePrompt), route.ts (full rewrite with correct Kling params), chat-bar.tsx (full rewrite, duration [5,10], aspect [16:9/9:16/1:1], video-to-video panel), page.tsx (signature update + pass new params)

### 2026-02-21
- Created `ElleAI-pro-page-navbar-20260220.md` — Pro Page + Navbar Adjustments:
  - Created `src/hooks/use-video-picker.ts`: browser file input for video (returns base64 data URL)
  - `chat-bar.tsx`: replaced video URL text input with file attachment picker for video-to-video mode
    - New state: `videoAttachment` (base64 data URL) replaces `videoUrl` (string)
    - New UI: pill button showing attach state, X clear button, updated hints
  - `create/page.tsx`: renamed `videoUrl` → `videoAttachment` param, passed as `videoUrl` to generateVideo
  - `app-shell.tsx`: logo h-7→h-[42px] (+50%), maxWidth 96px→144px; removed Plus button
    - Added "🚀 Pro" pill button navigating to /pro
  - Created `src/app/pro/page.tsx`: standalone page (no AppShell)
    - Top bar: ⚡ElleAI back button + "Pro" title
    - Content: placeholder "coming soon" card
    - Bottom nav: Home | Explore | Create (center white circle +) | Assets | Profile

- Created `ElleAI-logo-replacements-20260220.md` — Logo Replacements:
  - `app-shell.tsx`: replaced "🚀 Pro" text button with logoPro.png image
  - `pro/page.tsx`: replaced ⚡ElleAI text with logoElle.png; "Pro" title with logoPro.png; 🚀 emoji with logoPro.png
  - `result-feed.tsx`: replaced <Sparkles> empty-state icon with logoElle.png; removed Sparkles import
