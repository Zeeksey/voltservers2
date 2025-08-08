// VoltServers Namecheap Entry Point
// This file is required by Namecheap's Node.js hosting

console.log('Starting VoltServers application...');

// Import the built application
import('./dist/index.js')
  .then(() => {
    console.log('VoltServers application started successfully');
  })
  .catch((error) => {
    console.error('Failed to start VoltServers application:', error);
    process.exit(1);
  });
