import ffmpeg from 'fluent-ffmpeg';
import ffmpegInstaller from 'ffmpeg-static';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

ffmpeg.setFfmpegPath(ffmpegInstaller);

const videoUrl = 'https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260616_212935_bbf608da-62d1-4f25-9be4-c346e4d09cc8.mp4';
const outputDir = path.join(__dirname, 'public', 'heroframes');

if (fs.existsSync(outputDir)) {
  fs.rmSync(outputDir, { recursive: true, force: true });
}
fs.mkdirSync(outputDir, { recursive: true });

console.log('Extracting frames from video... This might take a minute.');

ffmpeg(videoUrl)
  .outputOptions([
    '-vf', 'fps=15', 
    '-s', '1920x1080',
    '-c:v', 'libwebp',
    '-q:v', '85' // higher quality webp
  ])
  .output(path.join(outputDir, 'frame_%03d.webp'))
  .on('end', () => {
    const files = fs.readdirSync(outputDir).filter(f => f.endsWith('.webp'));
    console.log(`Done! Extracted ${files.length} frames to public/heroframes/`);
  })
  .on('error', (err) => {
    console.error('Error extracting frames:', err);
  })
  .run();
