#!/usr/bin/env node

/**
 * Script to start mock API servers using Prism
 * Runs both the dispersions API and user details API in parallel
 */

const { spawn } = require('child_process');
const path = require('path');

// Paths to OpenAPI specs
const DISPERSIONS_API_SPEC = path.join(__dirname, '..', 'dispersions-api.openapi.json');
const USER_DETAILS_API_SPEC = path.join(__dirname, '..', 'user-details.openapi.json');

// Ports for the mock servers
const DISPERSIONS_API_PORT = 3001;
const USER_DETAILS_API_PORT = 3002;

console.log('🚀 Starting mock API servers...\n');

// Start dispersions API mock server
console.log(`📊 Starting Dispersions API mock server on port ${DISPERSIONS_API_PORT}`);
const dispersionsServer = spawn('npx', [
  'prism', 'mock', 
  DISPERSIONS_API_SPEC,
  '--host', '0.0.0.0',
  '--port', DISPERSIONS_API_PORT.toString(),
  '--cors'
], { stdio: 'pipe' });

// Start user details API mock server  
console.log(`👥 Starting User Details API mock server on port ${USER_DETAILS_API_PORT}`);
const userDetailsServer = spawn('npx', [
  'prism', 'mock',
  USER_DETAILS_API_SPEC, 
  '--host', '0.0.0.0',
  '--port', USER_DETAILS_API_PORT.toString(),
  '--cors'
], { stdio: 'pipe' });

// Handle dispersions API server output
dispersionsServer.stdout.on('data', (data) => {
  console.log(`[Dispersions API] ${data.toString().trim()}`);
});

dispersionsServer.stderr.on('data', (data) => {
  console.error(`[Dispersions API ERROR] ${data.toString().trim()}`);
});

// Handle user details API server output
userDetailsServer.stdout.on('data', (data) => {
  console.log(`[User Details API] ${data.toString().trim()}`);
});

userDetailsServer.stderr.on('data', (data) => {
  console.error(`[User Details API ERROR] ${data.toString().trim()}`);
});

// Handle server shutdowns
dispersionsServer.on('close', (code) => {
  console.log(`\n🔴 Dispersions API mock server exited with code ${code}`);
});

userDetailsServer.on('close', (code) => {
  console.log(`\n🔴 User Details API mock server exited with code ${code}`);
});

// Handle process termination
process.on('SIGINT', () => {
  console.log('\n\n🛑 Shutting down mock servers...');
  dispersionsServer.kill('SIGINT');
  userDetailsServer.kill('SIGINT');
  process.exit(0);
});

process.on('SIGTERM', () => {
  console.log('\n\n🛑 Shutting down mock servers...');
  dispersionsServer.kill('SIGTERM');
  userDetailsServer.kill('SIGTERM');
  process.exit(0);
});

console.log('\n✅ Mock servers started successfully!');
console.log(`🌐 Dispersions API: http://localhost:${DISPERSIONS_API_PORT}`);
console.log(`👥 User Details API: http://localhost:${USER_DETAILS_API_PORT}`);
console.log('\n💡 Press Ctrl+C to stop all servers\n');