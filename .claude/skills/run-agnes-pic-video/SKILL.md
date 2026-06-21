---
name: run-agnes-pic-video
description: Generate images and videos using Agnes AI free API. Supports text-to-image, image-to-image, text-to-video, image-to-video, multi-image video, and keyframe animation. Includes prompt recommendations.
---

# Agnes AI Image & Video Generation

Generate images and videos using Agnes AI's free API.

## ⚠️ IMPORTANT: API Key Setup

**Before using this skill, you MUST get the API key from the user.**

Ask the user:
> "请提供你的 Agnes AI API key（可在 agnes-ai.com 免费获取）"

Once you have the key, use it directly in all curl commands by replacing `YOUR_API_KEY` with the actual key.

**Example:**
```bash
curl -sL "https://apihub.agnes-ai.com/v1/images/generations" \
  -H "Authorization: Bearer sk-actual-key-here" \
  -H "Content-Type: application/json" \
  -d '{"model":"agnes-image-2.0-flash","prompt":"A cute cat","size":"1024x768","extra_body":{"response_format":"url"}}'
```

## Quick Start (curl)

### Generate Image (Text-to-Image)

```bash
# agnes-image-2.0-flash (default, fast)
curl -sL "https://apihub.agnes-ai.com/v1/images/generations" \
  -H "Authorization: Bearer YOUR_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{"model":"agnes-image-2.0-flash","prompt":"YOUR_PROMPT","size":"1024x768","extra_body":{"response_format":"url"}}'

# agnes-image-2.1-flash (newer, better quality, supports image-to-image)
curl -sL "https://apihub.agnes-ai.com/v1/images/generations" \
  -H "Authorization: Bearer YOUR_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{"model":"agnes-image-2.1-flash","prompt":"YOUR_PROMPT","size":"1024x768","extra_body":{"response_format":"url"}}'
```

Returns JSON with `data[0].url` — the image URL.

### Generate Image (Image-to-Image) — agnes-image-2.1-flash only

```bash
# URL input
curl -sL "https://apihub.agnes-ai.com/v1/images/generations" \
  -H "Authorization: Bearer YOUR_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{"model":"agnes-image-2.1-flash","prompt":"Transform into cyberpunk style while preserving composition","size":"1024x768","extra_body":{"image":["https://example.com/input.png"],"response_format":"url"}}'

# Base64 input (Data URI format)
curl -sL "https://apihub.agnes-ai.com/v1/images/generations" \
  -H "Authorization: Bearer YOUR_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{"model":"agnes-image-2.1-flash","prompt":"Make it matte black while preserving composition","size":"1024x768","extra_body":{"image":["data:image/png;base64,BASE64_HERE"],"response_format":"url"}}'
```

**Important:** For image-to-image, put input images in `extra_body.image` array, NOT at top level.

### Generate Video (Text-to-Video)

```bash
curl -sL -X POST "https://apihub.agnes-ai.com/v1/videos" \
  -H "Authorization: Bearer YOUR_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{"model":"agnes-video-v2.0","prompt":"YOUR_PROMPT","height":768,"width":1152,"num_frames":121,"frame_rate":24}'
```

### Generate Video (Image-to-Video)

```bash
curl -sL -X POST "https://apihub.agnes-ai.com/v1/videos" \
  -H "Authorization: Bearer YOUR_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{"model":"agnes-video-v2.0","prompt":"YOUR_PROMPT","image":"https://example.com/image.png","num_frames":121,"frame_rate":24}'
```

### Generate Video (Multi-Image)

```bash
curl -sL -X POST "https://apihub.agnes-ai.com/v1/videos" \
  -H "Authorization: Bearer YOUR_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{"model":"agnes-video-v2.0","prompt":"YOUR_PROMPT","extra_body":{"image":["https://example.com/img1.png","https://example.com/img2.png"]},"num_frames":121,"frame_rate":24}'
```

### Generate Video (Keyframe Animation)

```bash
curl -sL -X POST "https://apihub.agnes-ai.com/v1/videos" \
  -H "Authorization: Bearer YOUR_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{"model":"agnes-video-v2.0","prompt":"YOUR_PROMPT","extra_body":{"image":["https://example.com/keyframe1.png","https://example.com/keyframe2.png"],"mode":"keyframes"},"num_frames":121,"frame_rate":24}'
```

### Poll Video Status

All video generation returns `task_id` — poll until complete:

```bash
curl -sL "https://apihub.agnes-ai.com/v1/videos/TASK_ID" -H "Authorization: Bearer YOUR_API_KEY"
```

When `status` is `"completed"`, the video URL is in `remixed_from_video_id` field.

## Advanced: Driver Script

If Node.js 18+ is available, use the driver for auto-polling and file download:

```bash
# Text-to-image
node .claude/skills/run-agnes-pic-video/driver.mjs image "prompt" --output output.png

# Text-to-image with specific model
node .claude/skills/run-agnes-pic-video/driver.mjs image "prompt" --model agnes-image-2.1-flash --output output.png

# Image-to-image (agnes-image-2.1-flash)
node .claude/skills/run-agnes-pic-video/driver.mjs image "Transform to cyberpunk" --model agnes-image-2.1-flash --image input.png --output output.png

# Text-to-video
node .claude/skills/run-agnes-pic-video/driver.mjs video "prompt" --output output.mp4

# Image-to-video
node .claude/skills/run-agnes-pic-video/driver.mjs video "prompt" --image "image.png" --output output.mp4

# Multi-image video
node .claude/skills/run-agnes-pic-video/driver.mjs video "prompt" --images "img1.png,img2.png" --output output.mp4

# Keyframe animation
node .claude/skills/run-agnes-pic-video/driver.mjs video "prompt" --images "key1.png,key2.png" --keyframes --output output.mp4

# Check video status
node .claude/skills/run-agnes-pic-video/driver.mjs status task_xxxxx

# Show help
node .claude/skills/run-agnes-pic-video/driver.mjs --help
```

The driver reads API key from: environment variable `AGNES_API_KEY` > `config.json` in skill dir.

## Models

| Model | Type | Notes |
|-------|------|-------|
| `agnes-image-2.0-flash` | Image | Default, fast, text-to-image only |
| `agnes-image-2.1-flash` | Image | Newer, supports text-to-image AND image-to-image |
| `agnes-video-v2.0` | Video | Async, 5 seconds, poll for result |

## Prompt Recommendations

### Image Generation (agnes-image-2.1-flash)

**Structure:** `[Subject] + [Scene] + [Style] + [Lighting] + [Composition] + [Quality]`

**Text-to-image example:**
> "A luminous floating city above a misty canyon at sunrise, cinematic realism, wide-angle composition, rich architectural details, soft golden light, high visual density"

**Image-to-image example:**
> "Transform the scene into a rain-soaked cyberpunk night with neon reflections while preserving the original composition and main subject layout"

**Key:** For image-to-image, describe what to change AND what to keep.

### Text-to-Video

**Structure:** `[Subject] + [Action] + [Scene] + [Camera] + [Lighting] + [Style]`

**Example:**
> "A young astronaut walking across a red desert planet, dust blowing in the wind, slow cinematic tracking shot, dramatic sunset lighting, realistic sci-fi style"

### Image-to-Video

Describe what should move AND what should stay stable:

**Example:**
> "Animate the character with subtle breathing motion, hair moving gently in the wind, background lights flickering softly, while keeping the face and outfit consistent"

### Keyframe Animation

Describe the transition between keyframes:

**Example:**
> "Create a smooth transition from the first keyframe to the second keyframe, maintaining character identity, consistent camera angle, and natural motion between scenes"

## Gotchas

- API base: `apihub.agnes-ai.com` (NOT `api.agnes-ai.com`)
- Video URL is in `remixed_from_video_id` field (not `video_url`)
- Video generation takes 1-3 minutes, must poll task status
- **Image-to-image:** Put input images in `extra_body.image` array, NOT at top level
- **response_format:** Must be in `extra_body`, NOT at top level (will cause 400 error)
- **Base64 output:** Text-to-image uses `return_base64: true`; image-to-image uses `extra_body.response_format: "b64_json"`
- **No tags needed:** Don't pass `tags: ["img2img"]` for image-to-image
