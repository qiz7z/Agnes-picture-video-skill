<div align="center">

# 🎨 Agnes AI Image & Video Skill

**让 AI Agent 具备视觉创作能力**

[![GitHub Stars](https://img.shields.io/github/stars/qiz7z/Agnes-picture-video-skill?style=social)](https://github.com/qiz7z/Agnes-picture-video-skill/stargazers)
[![GitHub Forks](https://img.shields.io/github/forks/qiz7z/Agnes-picture-video-skill?style=social)](https://github.com/qiz7z/Agnes-picture-video-skill/network/members)
[![License](https://img.shields.io/badge/license-MIT-blue.svg)](LICENSE)
[![Node](https://img.shields.io/badge/node-%3E%3D18-green.svg)](https://nodejs.org)

English | [中文](README_CN.md)

</div>

---

## ✨ 一句话介绍

> 一个让 Claude、WorkBuddy 等 AI Agent **免费**调用 Agnes AI API 生成图片和视频的 Skill。

## 🚀 核心能力

<table>
<tr>
<td width="50%">

### 🖼️ 图片生成

- ✅ 文生图（Text-to-Image）
- ✅ 图生图（Image-to-Image）
- ✅ 两个模型可选
- ✅ 支持本地文件上传

</td>
<td width="50%">

### 🎬 视频生成

- ✅ 文生视频（Text-to-Video）
- ✅ 图生视频（Image-to-Video）
- ✅ 多图视频（Multi-Image）
- ✅ 关键帧动画（Keyframe）

</td>
</tr>
</table>

## 📦 快速开始

### Step 1️⃣ 获取 API Key

访问 [agnes-ai.com](https://agnes-ai.com) 注册，**免费**获取 API Key。

### Step 2️⃣ 配置 API Key

**推荐：配置文件方式**

```bash
# 创建配置文件
echo '{"api_key": "sk-你的API密钥"}' > .claude/skills/run-agnes-pic-video/config.json
```

### Step 3️⃣ 开始使用

```bash
# 🎨 生成图片
node .claude/skills/run-agnes-pic-video/driver.mjs image "一只可爱的猫" --output cat.png

# 🎬 生成视频
node .claude/skills/run-agnes-pic-video/driver.mjs video "海边日落" --output sunset.mp4
```

## 🎨 效果展示

### 文生图（agnes-image-2.0-flash）

<table>
<tr>
<td width="50%">

**Prompt:**
> 一位身穿银色轻甲的少女站在悬浮于云海之上的古老石桥上，长发随风飘动，手中托着一颗散发柔和蓝光的水晶球。背景是巨大的发光古树，树根缠绕着残破的浮空岛屿，几只半透明的灵鹿在远处跳跃。画面采用电影级光影，丁达尔光效穿透云层，色调以冷蓝与暖金交织，超高细节，8K分辨率，奇幻插画风格

</td>
<td width="50%">

<img src="examples/text-to-image.png" alt="Text-to-Image Example" width="100%"/>

</td>
</tr>
</table>

### 图生图（agnes-image-2.1-flash）

<table>
<tr>
<td width="50%">

**原图** → **吉卜力风格**

**Prompt:**
> 基于原图构图，将画面转换为吉卜力动画风格。保留银甲少女和发光水晶球的核心主体，背景的古树和浮空岛屿采用柔和的水彩笔触。少女的头发和衣摆增加随风飘动的动态模糊，水晶球的光芒更加温暖明亮，几只发光的微小光斑环绕在她周围。色彩明亮清新，充满治愈感，高质量动画截图，细腻的光影过渡

</td>
<td width="50%">

<img src="examples/image-to-image.png" alt="Image-to-Image Example" width="100%"/>

</td>
</tr>
</table>

## 💰 价格

| 功能 | 价格 | 说明 |
|:-----|:-----|:-----|
| 🖼️ 图片生成 | **免费** | 有额度限制 |
| 🎬 视频生成 | **免费** | 有额度限制 |

> 💡 **是的，你没看错，图片和视频生成都是免费的！**

## 🎯 功能详解

<details>
<summary><b>🖼️ 文生图（Text-to-Image）</b></summary>

```bash
# 默认模型
node driver.mjs image "A cute cat" --output cat.png

# 指定模型（agnes-image-2.1-flash 效果更好）
node driver.mjs image "A cute cat" --model agnes-image-2.1-flash --output cat.png
```

**支持模型：**
- `agnes-image-2.0-flash` — 速度快
- `agnes-image-2.1-flash` — 质量更高，支持图生图

</details>

<details>
<summary><b>🎨 图生图（Image-to-Image）</b></summary>

```bash
# 本地图片
node driver.mjs image "Transform to cyberpunk style" --model agnes-image-2.1-flash --image input.png --output output.png

# URL 图片
node driver.mjs image "Transform to oil painting style" --model agnes-image-2.1-flash --image "https://example.com/img.png" --output output.png
```

**Prompt 技巧：** 说明**要改什么** + **要保留什么**

> Transform into cyberpunk style with neon reflections while preserving the original composition

</details>

<details>
<summary><b>🎬 文生视频（Text-to-Video）</b></summary>

```bash
node driver.mjs video "A sunset over the ocean, cinematic lighting" --output sunset.mp4
```

**Prompt 结构：** `[Subject] + [Action] + [Scene] + [Camera] + [Lighting] + [Style]`

> A young girl in silver armor standing on a stone bridge, her hair flowing in the wind, slow camera zoom in, cinematic lighting, fantasy style

</details>

<details>
<summary><b>📹 图生视频（Image-to-Video）</b></summary>

```bash
# 本地图片
node driver.mjs video "Animate the character" --image photo.png --output anim.mp4

# URL 图片
node driver.mjs video "Animate the character" --image "https://example.com/img.png" --output anim.mp4
```

**Prompt 技巧：** 描述**什么要动** + **什么要保持不变**

> Animate the character with subtle breathing motion, hair moving gently in the wind, while keeping the face and outfit consistent

</details>

<details>
<summary><b>🎞️ 多图视频（Multi-Image）</b></summary>

```bash
node driver.mjs video "Smooth transformation between images" --images "img1.png,img2.png" --output morph.mp4
```

**用途：** 在多张图片之间生成平滑过渡动画

</details>

<details>
<summary><b>🎭 关键帧动画（Keyframe）</b></summary>

```bash
node driver.mjs video "Transition between keyframes" --images "key1.png,key2.png" --keyframes --output kf.mp4
```

**Prompt 技巧：** 描述**过渡关系** + **一致性元素**

> Create a smooth transition from the first keyframe to the second keyframe, maintaining character identity and natural motion

</details>

## 🏗️ 项目结构

```
Agnes-picture-video-skill/
├── 📄 README.md                          ← English documentation
├── 📄 README_CN.md                       ← Chinese documentation
├── 📄 .gitignore
├── 📁 examples/                          ← 示例图片
│   ├── 🖼️ text-to-image.png             ← 文生图示例
│   └── 🖼️ image-to-image.png            ← 图生图示例
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
