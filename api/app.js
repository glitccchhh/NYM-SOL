// This is a handler for Vercel that serves the frontend application
import path from 'path';
import fs from 'fs';

export default function handler(req, res) {
  const indexPath = path.join(process.cwd(), 'server/public/index.html');
  
  try {
    const htmlContent = fs.readFileSync(indexPath, 'utf8');
    res.setHeader('Content-Type', 'text/html');
    return res.status(200).send(htmlContent);
  } catch (error) {
    return res.status(500).json({
      error: 'Could not load the application',
      details: error.message
    });
  }
}