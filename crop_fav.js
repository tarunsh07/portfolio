import ffmpeg from 'fluent-ffmpeg';
import ffmpegInstaller from 'ffmpeg-static';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

ffmpeg.setFfmpegPath(ffmpegInstaller);

ffmpeg(path.join(__dirname, 'public/projectimages/fav.webp'))
  .outputOptions([
    '-vf', 'crop=in_w*0.6:in_h*0.6',
    '-c:v', 'libwebp',
    '-y'
  ])
  .save(path.join(__dirname, 'public/projectimages/fav-zoomed.webp'))
  .on('end', () => console.log('Successfully cropped!'))
  .on('error', (err) => console.log('Error:', err));
