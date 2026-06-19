<div align="center">

# 🎨 Agnes AI Image & Video Skill

**Empower AI Agents with Visual Creation Capabilities**

[![GitHub Stars](https://img.shields.io/github/stars/qiz7z/Agnes-picture-video-skill?style=social)](https://github.com/qiz7z/Agnes-picture-video-skill/stargazers)
[![GitHub Forks](https://img.shields.io/github/forks/qiz7z/Agnes-picture-video-skill?style=social)](https://github.com/qiz7z/Agnes-picture-video-skill/network/members)
[![License](https://img.shields.io/badge/license-MIT-blue.svg)](LICENSE)
[![Node](https://img.shields.io/badge/node-%3E%3D18-green.svg)](https://nodejs.org)

English | [中文](README_CN.md)

</div>

---

## ✨ Introduction

> A Skill that enables Claude, WorkBuddy, and other AI Agents to **freely** generate images and videos using Agnes AI API.

## 🚀 Core Capabilities

<table>
<tr>
<td width="50%">

### 🖼️ Image Generation

- ✅ Text-to-Image
- ✅ Image-to-Image
- ✅ Two models available
- ✅ Local file upload support

</td>
<td width="50%">

### 🎬 Video Generation

- ✅ Text-to-Video
- ✅ Image-to-Video
- ✅ Multi-Image Video
- ✅ Keyframe Animation

</td>
</tr>
</table>

## 📦 Quick Start

### Step 1️⃣ Get API Key

Visit [agnes-ai.com](https://agnes-ai.com) to register and get a **free** API Key.

### Step 2️⃣ Configure API Key

**Recommended: Config file**

```bash
# Create config file
echo '{"api_key": "sk-your-api-key"}' > .claude/skills/run-agnes-pic-video/config.json
```

### Step 3️⃣ Start Using

```bash
# 🎨 Generate Image
node .claude/skills/run-agnes-pic-video/driver.mjs image "A cute cat" --output cat.png

# 🎬 Generate Video
node .claude/skills/run-agnes-pic-video/driver.mjs video "A sunset over the ocean" --output sunset.mp4
```

## 🎨 Showcase

### Text-to-Image (agnes-image-2.0-flash)

<table>
<tr>
<td width="50%">

**Prompt:**
> A young girl in silver armor standing on an ancient stone bridge floating above a sea of clouds, her long hair flowing gently in the wind, holding a softly glowing blue crystal orb. Background features a massive glowing ancient tree with roots entwined around broken floating islands, several translucent spirit deer leaping in the distance. Cinematic lighting with Tyndall effect through the clouds, cool blue and warm gold tones, ultra high detail, 8K resolution, fantasy illustration style

</td>
<td width="50%">

<img src="examples/text-to-image.png" alt="Text-to-Image Example" width="100%"/>

</td>
</tr>
</table>

### Image-to-Image (agnes-image-2.1-flash)

<table>
<tr>
<td width="50%">

**Original** → **Ghibli Style**

**Prompt:**
> Transform into Ghibli animation style while preserving the original composition. Keep the silver-armored girl and glowing crystal orb as the main subjects. Apply soft watercolor brushstrokes to the ancient tree and floating islands. Add dynamic blur to the girl's hair and clothing flowing in the wind. Make the crystal orb's glow warmer and brighter. Add small glowing particles around her. Bright and fresh colors, healing atmosphere, high-quality animation screenshot, delicate light and shadow transitions

</td>
<td width="50%">

<img src="examples/image-to-image.png" alt="Image-to-Image Example" width="100%"/>

</td>
</tr>
</table>

## 💰 Pricing

| Feature | Price | Notes |
|:--------|:-----:|:------|
| 🖼️ Image Generation | **FREE** | Usage limits apply |
| 🎬 Video Generation | **FREE** | Usage limits apply |

> 💡 **Yes, you read that right - both image and video generation are FREE!**

## 🎯 Feature Details

<details>
<summary><b>🖼️ Text-to-Image</b></summary>

```bash
# Default model
node driver.mjs image "A cute cat" --output cat.png

# Specify model (agnes-image-2.1-flash has better quality)
node driver.mjs image "A cute cat" --model agnes-image-2.1-flash --output cat.png
```

**Supported Models:**
- `agnes-image-2.0-flash` — Fast speed
- `agnes-image-2.1-flash` — Higher quality, supports image-to-image

</details>

<details>
<summary><b>🎨 Image-to-Image</b></summary>

```bash
# Local file
node driver.mjs image "Transform to cyberpunk style" --model agnes-image-2.1-flash --image input.png --output output.png

# URL image
node driver.mjs image "Transform to oil painting style" --model agnes-image-2.1-flash --image "https://example.com/img.png" --output output.png
```

**Prompt Tips:** Describe **what to change** + **what to keep**

> Transform into cyberpunk style with neon reflections while preserving the original composition

</details>

<details>
<summary><b>🎬 Text-to-Video</b></summary>

```bash
node driver.mjs video "A sunset over the ocean, cinematic lighting" --output sunset.mp4
```

**Prompt Structure:** `[Subject] + [Action] + [Scene] + [Camera] + [Lighting] + [Style]`

> A young girl in silver armor standing on a stone bridge, her hair flowing in the wind, slow camera zoom in, cinematic lighting, fantasy style

</details>

<details>
<summary><b>📹 Image-to-Video</b></summary>

```bash
# Local file
node driver.mjs video "Animate the character" --image photo.png --output anim.mp4

# URL image
node driver.mjs video "Animate the character" --image "https://example.com/img.png" --output anim.mp4
```

**Prompt Tips:** Describe **what should move** + **what should stay stable**

> Animate the character with subtle breathing motion, hair moving gently in the wind, while keeping the face and outfit consistent

</details>

<details>
<summary><b>🎞️ Multi-Image Video</b></summary>

```bash
node driver.mjs video "Smooth transformation between images" --images "img1.png,img2.png" --output morph.mp4
```

**Use case:** Generate smooth transition animations between multiple images

</details>

<details>
<summary><b>🎭 Keyframe Animation</b></summary>

```bash
node driver.mjs video "Transition between keyframes" --images "key1.png,key2.png" --keyframes --output kf.mp4
```

**Prompt Tips:** Describe **transition relationship** + **consistency elements**

> Create a smooth transition from the first keyframe to the second keyframe, maintaining character identity and natural motion

</details>

## 📖 Prompt Recommendations

### Image Generation

```
[Subject] + [Scene] + [Style] + [Lighting] + [Composition] + [Quality]
```

### Text-to-Video

```
[Subject] + [Action] + [Scene] + [Camera Movement] + [Lighting] + [Style]
```

### Image-to-Video

```
[What should move] + [What should stay stable]
```

### Keyframe Animation

```
[Transition relationship] + [Consistency elements]
```

## 🏗️ Project Structure

```
Agnes-picture-video-skill/
├── 📄 README.md                          ← English documentation
├── 📄 README_CN.md                       ← Chinese documentation
├── 📄 .gitignore
├── 📁 examples/                          ← Example images
│   ├── 🖼️ text-to-image.png             ← Text-to-Image example
│   └── 🖼️ image-to-image.png            ← Image-to-Image example
└── 📁 .claude/skills/run-agnes-pic-video/
    ├── 📄 SKILL.md                       ← Agent instructions (self-contained)
    ├── 📄 driver.mjs                     ← Node.js driver script
    └── 📄 config.json                    ← API Key config (create this)
```

## 🤖 Agent Compatibility

| Agent | Support | Notes |
|:------|:-------:|:------|
| Claude Code | ✅ | Full support |
| WorkBuddy | ✅ | Via SKILL.md |
| Other Agents | ✅ | Any agent that supports Skills |

## ⚠️ Important Notes

> **API Base URL:** `apihub.agnes-ai.com` (NOT `api.agnes-ai.com`)

> **Image-to-Image:** Put input images in `extra_body.image` array, NOT at top level

> **response_format:** Must be in `extra_body`, NOT at top level (causes 400 error)

> **Video URL:** Located in `remixed_from_video_id` field after completion

## 📚 Documentation

- [English](README.md)
- [中文](README_CN.md)
- [Skill Details](.claude/skills/run-agnes-pic-video/SKILL.md)

## 🤝 Contributing

Issues and Pull Requests are welcome!

## ⭐ Star

If this project helps you, please give it a Star!

<div align="center">

**[⬆ Back to Top](#-agnes-ai-image--video-skill)**

</div>

---

<div align="center">

**Made with ❤️ by [qiz7z](https://github.com/qiz7z)**

</div>
