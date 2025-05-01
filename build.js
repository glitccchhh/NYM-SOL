const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

// Ensure we're in production mode
process.env.NODE_ENV = 'production';

console.log('Building NymSOL for production...');

// Create the public directory if it doesn't exist
const publicDir = path.join(__dirname, 'server', 'public');
if (!fs.existsSync(publicDir)) {
  fs.mkdirSync(publicDir, { recursive: true });
}

try {
  // Build the frontend
  console.log('\nBuilding frontend...');
  execSync('npm run build:client', { stdio: 'inherit' });
  
  console.log('\nBuild completed successfully!');
} catch (error) {
  console.error('\nBuild failed:', error);
  process.exit(1);
}