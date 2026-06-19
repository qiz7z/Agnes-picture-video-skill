# Agnes AI 图片 & 视频生成 Skill

[English](README.md) | 中文

一个让 AI Agent 调用 Agnes AI 免费 API 生成图片和视频的 Skill。支持 Claude Code、WorkBuddy 等 Agent。

## 这是什么？

这个 Skill 让 AI Agent 可以使用 Agnes AI 的 API 生成图片和视频。它提供：

- **SKILL.md** — 自包含的使用说明，任何 Agent 加载后都能直接使用
- **driver.mjs** — Node.js 驱动脚本，支持自动轮询和文件下载（可选）

## 快速开始

### 1. 获取 API Key

访问 [agnes-ai.com](https://agnes-ai.com) 注册账号，免费获取 API Key。

### 2. 配置 API Key

**方式一：配置文件（推荐）**

创建 `.claude/skills/run-agnes-pic-video/config.json`：
```json
{"api_key": "sk-你的API密钥"}
```

**方式二：环境变量**
```bash
export AGNES_API_KEY=sk-你的API密钥
```

### 3. 使用 Skill

**使用 Driver 脚本（需要 Node.js 18+）：**
```bash
# 文生图（默认：agnes-image-2.0-flash）
node .claude/skills/run-agnes-pic-video/driver.mjs image "一只可爱的猫" --output cat.png

# 文生图（agnes-image-2.1-flash，支持图生图）
node .claude/skills/run-agnes-pic-video/driver.mjs image "一只猫" --model agnes-image-2.1-flash --output cat.png

# 图生图（agnes-image-2.1-flash）
node .claude/skills/run-agnes-pic-video/driver.mjs image "转换为赛博朋克风格" --model agnes-image-2.1-flash --image input.png --output output.png

# 文生视频
node .claude/skills/run-agnes-pic-video/driver.mjs video "海边日落" --output sunset.mp4

# 图生视频（本地图片）
node .claude/skills/run-agnes-pic-video/driver.mjs video "让角色动起来" --image photo.png --output anim.mp4

# 多图视频
node .claude/skills/run-agnes-pic-video/driver.mjs video "图片之间的变换" --images "img1.png,img2.png" --output morph.mp4

# 关键帧动画
node .claude/skills/run-agnes-pic-video/driver.mjs video "平滑过渡" --images "key1.png,key2.png" --keyframes --output kf.mp4
```

**使用 curl（通用方式）：**
```bash
# 文生图（agnes-image-2.0-flash）
curl -sL "https://apihub.agnes-ai.com/v1/images/generations" \
  -H "Authorization: Bearer 你的API_KEY" \
  -H "Content-Type: application/json" \
  -d '{"model":"agnes-image-2.0-flash","prompt":"一只可爱的猫","size":"1024x768","extra_body":{"response_format":"url"}}'

# 文生图（agnes-image-2.1-flash）
curl -sL "https://apihub.agnes-ai.com/v1/images/generations" \
  -H "Authorization: Bearer 你的API_KEY" \
  -H "Content-Type: application/json" \
  -d '{"model":"agnes-image-2.1-flash","prompt":"一只可爱的猫","size":"1024x768","extra_body":{"response_format":"url"}}'

# 图生图（agnes-image-2.1-flash）
curl -sL "https://apihub.agnes-ai.com/v1/images/generations" \
  -H "Authorization: Bearer 你的API_KEY" \
  -H "Content-Type: application/json" \
  -d '{"model":"agnes-image-2.1-flash","prompt":"转换为赛博朋克风格，保留原图构图","size":"1024x768","extra_body":{"image":["https://example.com/input.png"],"response_format":"url"}}'

# 文生视频
curl -sL -X POST "https://apihub.agnes-ai.com/v1/videos" \
  -H "Authorization: Bearer 你的API_KEY" \
  -H "Content-Type: application/json" \
  -d '{"model":"agnes-video-v2.0","prompt":"海边日落","height":768,"width":1152,"num_frames":121,"frame_rate":24}'

# 图生视频
curl -sL -X POST "https://apihub.agnes-ai.com/v1/videos" \
  -H "Authorization: Bearer 你的API_KEY" \
  -H "Content-Type: application/json" \
  -d '{"model":"agnes-video-v2.0","prompt":"让角色动起来","image":"https://example.com/img.png","num_frames":121,"frame_rate":24}'

# 多图视频
curl -sL -X POST "https://apihub.agnes-ai.com/v1/videos" \
  -H "Authorization: Bearer 你的API_KEY" \
  -H "Content-Type: application/json" \
  -d '{"model":"agnes-video-v2.0","prompt":"图片之间的变换","extra_body":{"image":["URL1","URL2"]},"num_frames":121,"frame_rate":24}'

# 关键帧动画
curl -sL -X POST "https://apihub.agnes-ai.com/v1/videos" \
  -H "Authorization: Bearer 你的API_KEY" \
  -H "Content-Type: application/json" \
  -d '{"model":"agnes-video-v2.0","prompt":"平滑过渡","extra_body":{"image":["URL1","URL2"],"mode":"keyframes"},"num_frames":121,"frame_rate":24}'
```

## 项目结构

```
agens-pic-video-skill/
├── README.md            ← 英文文档
├── README_CN.md         ← 中文文档（本文件）
└── .claude/skills/run-agnes-pic-video/
    ├── SKILL.md         ← Agent 使用说明（自包含）
    ├── driver.mjs       ← Node.js 驱动脚本（可选）
    └── config.json      ← API Key 配置（需要自己创建）
```

## 功能特性

### 图片生成
- **文生图**：两个模型可选
  - `agnes-image-2.0-flash` — 默认，速度快
  - `agnes-image-2.1-flash` — 新版本，支持图生图，复杂图像效果更好
- **图生图**：基于已有图片进行风格转换、编辑、优化（仅 agnes-image-2.1-flash）

### 视频生成（均使用 agnes-video-v2.0，异步，5 秒）
- **文生视频**：文字描述生成视频
- **图生视频**：单张图片生成动态视频（支持本地文件和 URL）
- **多图视频**：多张图片之间的平滑过渡
- **关键帧动画**：基于关键帧的动画（设置 `mode: "keyframes"`）

### Prompt 推荐

**图片生成（agnes-image-2.1-flash）：**
> `[主体] + [场景] + [风格] + [光照] + [构图] + [质量]`
>
> 图生图时，需要说明**要改什么**和**要保留什么**

**文生视频：**
> `[主体] + [动作] + [场景] + [镜头运动] + [光照] + [风格]`
>
> 示例：一位身穿银色轻甲的少女站在石桥上，长发随风飘动，缓慢推镜，电影级光影，奇幻插画风格

**图生视频：**
> 描述**什么要动** + **什么要保持不变**
>
> 示例：让角色的头发和衣服随风飘动，保持面部和服装不变

**关键帧动画：**
> 描述**过渡关系** + **一致性元素**
>
> 示例：从第一帧平滑过渡到第二帧，保持角色身份和镜头角度一致

### Driver 功能
- 自动下载文件到本地
- 自动轮询视频任务直到完成
- 支持本地文件（自动转 Base64）和 URL
- `--model` 选项选择图片模型
- `--image` 选项进行图生图

## 模型列表

| 模型 | 类型 | 说明 |
|------|------|------|
| `agnes-image-2.0-flash` | 图片 | 默认，速度快，仅支持文生图 |
| `agnes-image-2.1-flash` | 图片 | 新版本，支持文生图和图生图 |
| `agnes-video-v2.0` | 视频 | 异步生成，5 秒，需要轮询 |

## 价格

| 功能 | 价格 |
|------|------|
| 图片生成 | $0.003/张（约 2 分钱人民币） |
| 视频生成 | 免费（有额度限制） |

## 重要说明

- API 基础地址：`apihub.agnes-ai.com`（不是 `api.agnes-ai.com`）
- 视频生成完成后，URL 在 `remixed_from_video_id` 字段中
- 视频生成需要 1-3 分钟，必须轮询任务状态
- **图生图**：输入图片放在 `extra_body.image` 数组中，不是顶层
- **response_format**：必须放在 `extra_body` 中，放顶层会报 400 错误
- **Base64 输出**：文生图用 `return_base64: true`；图生图用 `extra_body.response_format: "b64_json"`
- **不需要 tags**：图生图不需要传 `tags: ["img2img"]`
- 本地图片会自动转换为 Base64 Data URI 格式

## 适用场景

- **创意设计**：概念图、视觉探索、海报草图
- **内容创作**：社交媒体素材、封面图、Banner
- **产品视觉**：产品图、展示图
- **动画制作**：关键帧动画、动态效果
- **AI Agent 增强**：让 Claude 等 Agent 具备视觉创作能力

## 文档

详细使用说明请查看 [SKILL.md](.claude/skills/run-agnes-pic-video/SKILL.md)。

## 开源协议

MIT

## 作者

- GitHub: [qiz7z](https://github.com/qiz7z)
- 项目地址: [Agnes-picture-video-skill](https://github.com/qiz7z/Agnes-picture-video-skill)

## 致谢

- [Agnes AI](https://agnes-ai.com) — 提供免费 API
- [Claude](https://claude.ai) — AI Agent
