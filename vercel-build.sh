#!/bin/bash

# Set environment to production
export NODE_ENV=production

# Build the client-side application
echo "Building client-side application..."
npm run build:client || { echo "Client build failed"; exit 1; }

# Done
echo "Build process completed successfully!"