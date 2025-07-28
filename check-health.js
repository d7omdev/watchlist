#!/usr/bin/env node

const http = require('http');

function checkEndpoint(url, name) {
  return new Promise((resolve) => {
    const request = http.get(url, (res) => {
      if (res.statusCode === 200) {
        console.log(`SUCCESS: ${name} is running`);
        resolve(true);
      } else {
        console.log(`ERROR: ${name} returned status ${res.statusCode}`);
        resolve(false);
      }
    });

    request.on('error', () => {
      console.log(`ERROR: ${name} is not accessible`);
      resolve(false);
    });

    request.setTimeout(5000, () => {
      console.log(`ERROR: ${name} timed out`);
      request.destroy();
      resolve(false);
    });
  });
}

async function healthCheck() {
  console.log('Health Check Starting...\n');
  
  const backendHealth = await checkEndpoint('http://localhost:3001/health', 'Backend API');
  const frontendHealth = await checkEndpoint('http://localhost:5173', 'Frontend Dev Server');
  
  console.log('\nHealth Check Results:');
  if (backendHealth && frontendHealth) {
    console.log('SUCCESS: All services are running correctly!');
    console.log('Frontend: http://localhost:5173');
    console.log('Backend API: http://localhost:3001');
  } else {
    console.log('WARNING: Some services are not running. Please check the logs.');
  }
}

healthCheck();