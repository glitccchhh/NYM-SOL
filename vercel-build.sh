#!/bin/bash

# Set environment to production
export NODE_ENV=production

# Build both client and server
echo "Building client and server..."
npm run build || { echo "Build failed"; exit 1; }

# Make sure the output directory exists
mkdir -p server/public

# Done
echo "Build process completed successfully!"