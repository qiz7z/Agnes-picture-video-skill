#!/usr/bin/env node

/**
 * Agnes AI Image & Video Generation Driver
 *
 * Usage:
 *   node driver.mjs image "prompt" [--size 1024x768] [--output path.png]
 *   node driver.mjs video "prompt" [--width 1152] [--height 768] [--frames 121] [--fps 24] [--output path.mp4]
 *   node driver.mjs status <task_id>
 */

import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const API_BASE = "https://apihub.agnes-ai.com/v1";

function getApiKey() {
  // 1. Check environment variable
  const envKey = process.env.AGNES_API_KEY;
  if (envKey) return envKey;

  // 2. Check config.json in the same directory as this script
  const configPath = path.join(__dirname, "config.json");

  if (fs.existsSync(configPath)) {
    try {
      const config = JSON.parse(fs.readFileSync(configPath, "utf-8"));
      if (config.api_key) return config.api_key;
    } catch (e) {
      // ignore parse errors
    }
  }

  console.error("Error: No API key found.");
  console.error("Either:");
  console.error("  1. Set environment variable: export AGNES_API_KEY=sk-...");
  console.error("  2. Create config.json with {\"api_key\": \"sk-...\"} in the skill directory");
  process.exit(1);
}

async function generateImage(prompt, options = {}) {
  const apiKey = getApiKey();
  const size = options.size || "1024x768";
  const model = options.model || "agnes-image-2.0-flash";

  const body = {
    model: model,
    prompt: prompt,
    size: size,
    extra_body: {
      response_format: "url",
    },
  };

  // Image-to-image: add input image if provided
  if (options.image) {
    let imageData = options.image;

    // Check if it's a local file path (not a URL)
    if (!options.image.startsWith("http://") && !options.image.startsWith("https://") && !options.image.startsWith("data:")) {
      // Read local file and convert to base64 data URI
      const imagePath = path.resolve(options.image);

      if (!fs.existsSync(imagePath)) {
        console.error(`Error: Image file not found: ${imagePath}`);
        process.exit(1);
      }

      const imageBuffer = fs.readFileSync(imagePath);
      const ext = path.extname(imagePath).toLowerCase().replace(".", "");
      const mimeType = ext === "jpg" ? "image/jpeg" : `image/${ext}`;
      imageData = `data:${mimeType};base64,${imageBuffer.toString("base64")}`;
      console.log(`Mode: Image-to-image (local file: ${options.image})`);
    } else {
      console.log(`Mode: Image-to-image (URL: ${options.image})`);
    }

    body.extra_body.image = [imageData];
  } else {
    console.log(`Mode: Text-to-image`);
  }

  console.log(`Generating image: "${prompt}" (${size}, model: ${model})`);

  let response;
  try {
    response = await fetch(`${API_BASE}/images/generations`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
    });
  } catch (err) {
    console.error("Network error:", err.message);
    console.error("Please check your internet connection and try again.");
    process.exit(1);
  }

  const data = await response.json();

  if (data.error) {
    console.error("API Error:", data.error.message);
    process.exit(1);
  }

  const imageUrl = data.data?.[0]?.url;
  if (!imageUrl) {
    console.error("Error: No image URL in response");
    console.error(JSON.stringify(data, null, 2));
    process.exit(1);
  }

  console.log(`Image URL: ${imageUrl}`);

  // Download if output path specified
  if (options.output) {
    console.log(`Downloading to: ${options.output}`);
    const imgResponse = await fetch(imageUrl);
    if (!imgResponse.ok) {
      console.error(`Error: Failed to download image (${imgResponse.status})`);
      process.exit(1);
    }
    const buffer = Buffer.from(await imgResponse.arrayBuffer());
    fs.writeFileSync(options.output, buffer);
    console.log(`Saved: ${options.output}`);
  }

  return { url: imageUrl, data };
}

async function generateVideo(prompt, options = {}) {
  const apiKey = getApiKey();
  const width = options.width || 1152;
  const height = options.height || 768;
  const numFrames = options.frames || 121;
  const frameRate = options.fps || 24;

  const body = {
    model: "agnes-video-v2.0",
    prompt: prompt,
    height: height,
    width: width,
    num_frames: numFrames,
    frame_rate: frameRate,
  };

  // Image-to-video: add image parameter if provided
  if (options.image) {
    let imageData = options.image;

    // Check if it's a local file path (not a URL)
    if (!options.image.startsWith("http://") && !options.image.startsWith("https://") && !options.image.startsWith("data:")) {
      // Read local file and convert to base64
      const imagePath = path.resolve(options.image);

      if (!fs.existsSync(imagePath)) {
        console.error(`Error: Image file not found: ${imagePath}`);
        process.exit(1);
      }

      const imageBuffer = fs.readFileSync(imagePath);
      imageData = imageBuffer.toString("base64");
      console.log(`Mode: Image-to-video (local file: ${options.image})`);
    } else {
      console.log(`Mode: Image-to-video (URL: ${options.image})`);
    }

    body.image = imageData;
  } else if (options.images) {
    // Multi-image video: --images "img1.png,img2.png,url3"
    const imageList = options.images.split(",").map(s => s.trim());
    const processedImages = [];

    for (const img of imageList) {
      if (img.startsWith("http://") || img.startsWith("https://")) {
        processedImages.push(img);
      } else {
        const imagePath = path.resolve(img);
        if (!fs.existsSync(imagePath)) {
          console.error(`Error: Image file not found: ${imagePath}`);
          process.exit(1);
        }
        const imageBuffer = fs.readFileSync(imagePath);
        processedImages.push(imageBuffer.toString("base64"));
      }
    }

    body.extra_body = { image: processedImages };

    // Check if keyframe mode is requested
    if (options.keyframes) {
      body.extra_body.mode = "keyframes";
      console.log(`Mode: Keyframe animation (${imageList.length} keyframes)`);
    } else {
      console.log(`Mode: Multi-image video (${imageList.length} images)`);
    }
  } else {
    console.log(`Mode: Text-to-video`);
  }

  console.log(`Generating video: "${prompt}" (${width}x${height}, ${numFrames} frames, ${frameRate}fps)`);

  let response;
  try {
    response = await fetch(`${API_BASE}/videos`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
    });
  } catch (err) {
    console.error("Network error:", err.message);
    console.error("Please check your internet connection and try again.");
    process.exit(1);
  }

  const data = await response.json();

  if (data.error) {
    console.error("API Error:", data.error.message);
    process.exit(1);
  }

  const taskId = data.task_id;
  console.log(`Task ID: ${taskId}`);
  console.log(`Status: ${data.status}`);

  // Poll for completion
  if (options.wait !== false) {
    console.log("Waiting for video generation to complete...");
    const result = await pollVideoStatus(taskId, apiKey);

    if (result.video_url) {
      console.log(`Video URL: ${result.video_url}`);

      if (options.output) {
        console.log(`Downloading to: ${options.output}`);
        const vidResponse = await fetch(result.video_url);
        if (!vidResponse.ok) {
          console.error(`Error: Failed to download video (${vidResponse.status})`);
          process.exit(1);
        }
        const buffer = Buffer.from(await vidResponse.arrayBuffer());
        fs.writeFileSync(options.output, buffer);
        console.log(`Saved: ${options.output}`);
      }
    }

    return result;
  }

  return data;
}

async function pollVideoStatus(taskId, apiKey, maxAttempts = 60) {
  for (let i = 0; i < maxAttempts; i++) {
    await new Promise((resolve) => setTimeout(resolve, 5000)); // Wait 5 seconds

    let response;
    try {
      response = await fetch(`${API_BASE}/videos/${taskId}`, {
        headers: {
          Authorization: `Bearer ${apiKey}`,
        },
      });
    } catch (err) {
      console.error("Network error during polling:", err.message);
      continue; // Retry on network error
    }

    const data = await response.json();

    if (data.error) {
      console.error("API Error:", data.error.message);
      return data;
    }

    console.log(`Status: ${data.status} (progress: ${data.progress || 0}%)`);

    if (data.status === "completed" || data.status === "succeeded") {
      return {
        ...data,
        video_url: data.video_url || data.remixed_from_video_id || data.data?.[0]?.url,
      };
    }

    if (data.status === "failed" || data.status === "error") {
      console.error("Video generation failed:", data.error || "Unknown error");
      return data;
    }
  }

  console.error("Timeout: Video generation took too long");
  return { status: "timeout" };
}

async function checkStatus(taskId) {
  const apiKey = getApiKey();

  let response;
  try {
    response = await fetch(`${API_BASE}/videos/${taskId}`, {
      headers: {
        Authorization: `Bearer ${apiKey}`,
      },
    });
  } catch (err) {
    console.error("Network error:", err.message);
    process.exit(1);
  }

  const data = await response.json();
  console.log(JSON.stringify(data, null, 2));
  return data;
}

// Parse command line arguments
function parseArgs(args) {
  const options = {};
  const positional = [];

  for (let i = 0; i < args.length; i++) {
    if (args[i].startsWith("--")) {
      const key = args[i].slice(2);
      const value = args[i + 1];
      if (value && !value.startsWith("--")) {
        options[key] = value;
        i++;
      } else {
        options[key] = true;
      }
    } else {
      positional.push(args[i]);
    }
  }

  return { positional, options };
}

// Main
async function main() {
  const args = process.argv.slice(2);

  if (args.length === 0 || args[0] === "--help" || args[0] === "-h") {
    console.log("Agnes AI Image & Video Generation Driver");
    console.log("");
    console.log("Usage:");
    console.log('  node driver.mjs image "prompt" [options]     Generate image');
    console.log('  node driver.mjs video "prompt" [options]     Generate video');
    console.log('  node driver.mjs status <task_id>             Check video status');
    console.log("");
    console.log("Image options:");
    console.log("  --size <WxH>        Image size (default: 1024x768)");
    console.log("  --model <model>     Model: agnes-image-2.0-flash, agnes-image-2.1-flash");
    console.log("  --image <path>      Input image for image-to-image (agnes-image-2.1-flash)");
    console.log("  --output <path>     Save image to file");
    console.log("");
    console.log("Video options:");
    console.log("  --width <num>       Video width (default: 1152)");
    console.log("  --height <num>      Video height (default: 768)");
    console.log("  --frames <num>      Number of frames (default: 121)");
    console.log("  --fps <num>         Frame rate (default: 24)");
    console.log("  --image <path>      Input image for image-to-video");
    console.log("  --images <paths>    Comma-separated images for multi-image/keyframe");
    console.log("  --keyframes         Enable keyframe mode (use with --images)");
    console.log("  --output <path>     Save video to file");
    process.exit(0);
  }

  const command = args[0];
  const { positional, options } = parseArgs(args.slice(1));

  switch (command) {
    case "image":
      if (positional.length === 0) {
        console.error("Error: Please provide a prompt");
        process.exit(1);
      }
      await generateImage(positional[0], options);
      break;

    case "video":
      if (positional.length === 0) {
        console.error("Error: Please provide a prompt");
        process.exit(1);
      }
      await generateVideo(positional[0], options);
      break;

    case "status":
      if (positional.length === 0) {
        console.error("Error: Please provide a task ID");
        process.exit(1);
      }
      await checkStatus(positional[0]);
      break;

    default:
      console.error(`Unknown command: ${command}`);
      console.error("Valid commands: image, video, status");
      process.exit(1);
  }
}

main().catch((err) => {
  console.error("Fatal error:", err.message);
  process.exit(1);
});
