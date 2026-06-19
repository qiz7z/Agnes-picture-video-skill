# Agnes AI Image & Video Skill

A skill for generating images and videos using Agnes AI's free API. Works with Claude Code, WorkBuddy, and other AI agents.

## What is this?

This skill allows AI agents to generate images and videos using Agnes AI's API. It provides:

- **SKILL.md** — Self-contained instructions that any agent can load and follow
- **driver.mjs** — Node.js driver with auto-polling and file download (optional)

## Quick Start

### 1. Get API Key

Get a free API key from [agnes-ai.com](https://agnes-ai.com)

### 2. Configure API Key

**Option A: Config file (recommended)**

Create `.claude/skills/run-agnes-pic-video/config.json`:
```json
{"api_key": "sk-your-api-key-here"}
```

**Option B: Environment variable**
```bash
export AGNES_API_KEY=sk-your-api-key-here
```

### 3. Use the Skill

**With driver script (Node.js 18+):**
```bash
# Text-to-image
node .claude/skills/run-agnes-pic-video/driver.mjs image "A cute cat" --output cat.png

# Image-to-image (agnes-image-2.1-flash)
node .claude/skills/run-agnes-pic-video/driver.mjs image "Transform to cyberpunk" --model agnes-image-2.1-flash --image input.png --output output.png

# Text-to-video
node .claude/skills/run-agnes-pic-video/driver.mjs video "A sunset over the ocean" --output sunset.mp4

# Image-to-video
node .claude/skills/run-agnes-pic-video/driver.mjs video "Animate the character" --image photo.png --output anim.mp4

# Multi-image video
node .claude/skills/run-agnes-pic-video/driver.mjs video "Transform between images" --images "img1.png,img2.png" --output morph.mp4

# Keyframe animation
node .claude/skills/run-agnes-pic-video/driver.mjs video "Smooth transition" --images "key1.png,key2.png" --keyframes --output kf.mp4
```

**With curl (works everywhere):**
```bash
# Text-to-image (agnes-image-2.0-flash)
curl -sL "https://apihub.agnes-ai.com/v1/images/generations" \
  -H "Authorization: Bearer YOUR_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{"model":"agnes-image-2.0-flash","prompt":"A cute cat","size":"1024x768","extra_body":{"response_format":"url"}}'

# Text-to-image (agnes-image-2.1-flash)
curl -sL "https://apihub.agnes-ai.com/v1/images/generations" \
  -H "Authorization: Bearer YOUR_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{"model":"agnes-image-2.1-flash","prompt":"A cute cat","size":"1024x768","extra_body":{"response_format":"url"}}'

# Image-to-image (agnes-image-2.1-flash)
curl -sL "https://apihub.agnes-ai.com/v1/images/generations" \
  -H "Authorization: Bearer YOUR_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{"model":"agnes-image-2.1-flash","prompt":"Transform to cyberpunk while preserving composition","size":"1024x768","extra_body":{"image":["https://example.com/input.png"],"response_format":"url"}}'

# Text-to-video
curl -sL -X POST "https://apihub.agnes-ai.com/v1/videos" \
  -H "Authorization: Bearer YOUR_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{"model":"agnes-video-v2.0","prompt":"A sunset over the ocean","height":768,"width":1152,"num_frames":121,"frame_rate":24}'

# Image-to-video
curl -sL -X POST "https://apihub.agnes-ai.com/v1/videos" \
  -H "Authorization: Bearer YOUR_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{"model":"agnes-video-v2.0","prompt":"Animate the character","image":"https://example.com/img.png","num_frames":121,"frame_rate":24}'

# Multi-image video
curl -sL -X POST "https://apihub.agnes-ai.com/v1/videos" \
  -H "Authorization: Bearer YOUR_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{"model":"agnes-video-v2.0","prompt":"Transform between images","extra_body":{"image":["URL1","URL2"]},"num_frames":121,"frame_rate":24}'

# Keyframe animation
curl -sL -X POST "https://apihub.agnes-ai.com/v1/videos" \
  -H "Authorization: Bearer YOUR_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{"model":"agnes-video-v2.0","prompt":"Smooth transition","extra_body":{"image":["URL1","URL2"],"mode":"keyframes"},"num_frames":121,"frame_rate":24}'
```

## Project Structure

```
agens-pic-video-skill/
├── README.md
└── .claude/skills/run-agnes-pic-video/
    ├── SKILL.md       ← Agent-facing instructions (self-contained)
    ├── driver.mjs     ← Node.js driver (optional)
    └── config.json    ← API key config (create this)
```

## Features

### Image Generation
- **Text-to-image**: Two models available
  - `agnes-image-2.0-flash` — Default, fast
  - `agnes-image-2.1-flash` — Newer, supports image-to-image
- **Image-to-image**: Transform/edit existing images (agnes-image-2.1-flash only)

### Video Generation (all use `agnes-video-v2.0`, async, 5 seconds)
- **Text-to-video**: Generate video from text prompt
- **Image-to-video**: Animate a single image (local file or URL)
- **Multi-image video**: Smooth transformation between multiple images
- **Keyframe animation**: Keyframe-based animation with `mode: "keyframes"`

### Prompt Recommendations

**Image generation (agnes-image-2.1-flash):**
> `[Subject] + [Scene] + [Style] + [Lighting] + [Composition] + [Quality]`
> For image-to-image: describe what to change AND what to keep

**Text-to-video:**
> `[Subject] + [Action] + [Scene] + [Camera] + [Lighting] + [Style]`

**Image-to-video:**
> Describe motion elements AND stability elements

**Keyframe animation:**
> Describe transition + consistency elements

### Driver Features
- Auto-download files to disk
- Auto-poll video tasks until completion
- Support local files (auto-convert to base64) and URLs
- `--model` option for image generation
- `--image` option for image-to-image

## API Models

| Model | Type | Notes |
|-------|------|-------|
| `agnes-image-2.0-flash` | Image | Default, fast, text-to-image only |
| `agnes-image-2.1-flash` | Image | Newer, supports text-to-image AND image-to-image |
| `agnes-video-v2.0` | Video | Async, 5 seconds, poll for result |

## Important Notes

- API base URL: `apihub.agnes-ai.com` (NOT `api.agnes-ai.com`)
- Video URL is in `remixed_from_video_id` field when task completes
- Video generation takes 1-3 minutes
- **Image-to-image:** Input images go in `extra_body.image` array, NOT top level
- **response_format:** Must be in `extra_body`, NOT at top level (causes 400 error)
- **Base64 output:** Text-to-image uses `return_base64: true`; image-to-image uses `extra_body.response_format: "b64_json"`
- **No tags needed:** Don't pass `tags: ["img2img"]` for image-to-image
- For local images, driver auto-converts to base64 Data URI format

## Documentation

See [SKILL.md](.claude/skills/run-agnes-pic-video/SKILL.md) for detailed usage instructions.

## License

MIT
