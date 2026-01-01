const { createCanvas } = require('canvas');
const fs = require('fs');
const path = require('path');

// Function to generate icon
function generateIcon(size) {
  const canvas = createCanvas(size, size);
  const ctx = canvas.getContext('2d');

  // Background gradient
  const gradient = ctx.createLinearGradient(0, 0, size, size);
  gradient.addColorStop(0, '#0ea5e9');
  gradient.addColorStop(1, '#0284c7');
  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, size, size);

  // Draw pill shape
  const centerX = size / 2;
  const centerY = size / 2;
  const pillWidth = size * 0.5;
  const pillHeight = size * 0.3;

  ctx.fillStyle = '#ffffff';
  ctx.beginPath();
  
  // Rounded rectangle (pill shape)
  const radius = pillHeight / 2;
  ctx.moveTo(centerX - pillWidth / 2 + radius, centerY - pillHeight / 2);
  ctx.lineTo(centerX + pillWidth / 2 - radius, centerY - pillHeight / 2);
  ctx.quadraticCurveTo(
    centerX + pillWidth / 2,
    centerY - pillHeight / 2,
    centerX + pillWidth / 2,
    centerY - pillHeight / 2 + radius
  );
  ctx.lineTo(centerX + pillWidth / 2, centerY + pillHeight / 2 - radius);
  ctx.quadraticCurveTo(
    centerX + pillWidth / 2,
    centerY + pillHeight / 2,
    centerX + pillWidth / 2 - radius,
    centerY + pillHeight / 2
  );
  ctx.lineTo(centerX - pillWidth / 2 + radius, centerY + pillHeight / 2);
  ctx.quadraticCurveTo(
    centerX - pillWidth / 2,
    centerY + pillHeight / 2,
    centerX - pillWidth / 2,
    centerY + pillHeight / 2 - radius
  );
  ctx.lineTo(centerX - pillWidth / 2, centerY - pillHeight / 2 + radius);
  ctx.quadraticCurveTo(
    centerX - pillWidth / 2,
    centerY - pillHeight / 2,
    centerX - pillWidth / 2 + radius,
    centerY - pillHeight / 2
  );
  ctx.closePath();
  ctx.fill();

  // Draw division line in the middle of the pill
  ctx.strokeStyle = '#0ea5e9';
  ctx.lineWidth = size * 0.02;
  ctx.beginPath();
  ctx.moveTo(centerX, centerY - pillHeight / 2);
  ctx.lineTo(centerX, centerY + pillHeight / 2);
  ctx.stroke();

  // Add small circles (medicine dots) on each side
  const dotRadius = size * 0.03;
  ctx.fillStyle = '#0ea5e9';
  
  // Left side dots
  ctx.beginPath();
  ctx.arc(centerX - pillWidth / 4, centerY - pillHeight / 4, dotRadius, 0, Math.PI * 2);
  ctx.fill();
  
  ctx.beginPath();
  ctx.arc(centerX - pillWidth / 4, centerY + pillHeight / 4, dotRadius, 0, Math.PI * 2);
  ctx.fill();
  
  // Right side dots
  ctx.beginPath();
  ctx.arc(centerX + pillWidth / 4, centerY - pillHeight / 4, dotRadius, 0, Math.PI * 2);
  ctx.fill();
  
  ctx.beginPath();
  ctx.arc(centerX + pillWidth / 4, centerY + pillHeight / 4, dotRadius, 0, Math.PI * 2);
  ctx.fill();

  return canvas;
}

// Generate icons
const sizes = [192, 512];
const publicDir = path.join(__dirname, '..', 'public');

// Ensure public directory exists
if (!fs.existsSync(publicDir)) {
  fs.mkdirSync(publicDir, { recursive: true });
}

sizes.forEach(size => {
  const canvas = generateIcon(size);
  const buffer = canvas.toBuffer('image/png');
  const filePath = path.join(publicDir, `icon-${size}.png`);
  fs.writeFileSync(filePath, buffer);
  console.log(`✅ Generated icon-${size}.png (${size}x${size})`);
});

console.log('\n🎉 All icons generated successfully!');

