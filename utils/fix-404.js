const fs = require('fs');
const path = require('path');

// Copy the not-found page to 404.html for static hosting
const outDir = path.join(process.cwd(), 'out');
const notFoundFile = path.join(outDir, 'not-found.html');
const fourOhFourFile = path.join(outDir, '404.html');

if (fs.existsSync(notFoundFile)) {
  fs.copyFileSync(notFoundFile, fourOhFourFile);
  console.log('✅ 404.html created for static hosting');
}