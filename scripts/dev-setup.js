#!/usr/bin/env node

const { spawn, exec } = require('child_process')
const fs = require('fs')
const path = require('path')

// Colors for console output
const colors = {
  reset: '\x1b[0m',
  bright: '\x1b[1m',
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  magenta: '\x1b[35m',
  cyan: '\x1b[36m'
}

function log(message, color = 'reset') {
  console.log(`${colors[color]}${message}${colors.reset}`)
}

function checkFileExists(filePath) {
  return fs.existsSync(filePath)
}

function copyEnvFile(source, destination) {
  if (!checkFileExists(destination)) {
    if (checkFileExists(source)) {
      fs.copyFileSync(source, destination)
      log(`✅ Created ${destination}`, 'green')
    } else {
      log(`❌ Source file ${source} not found`, 'red')
    }
  } else {
    log(`ℹ️  ${destination} already exists`, 'yellow')
  }
}

function runCommand(command, cwd = process.cwd()) {
  return new Promise((resolve, reject) => {
    log(`🔄 Running: ${command}`, 'cyan')
    const child = spawn(command, { shell: true, cwd, stdio: 'inherit' })
    
    child.on('close', (code) => {
      if (code === 0) {
        log(`✅ Command completed: ${command}`, 'green')
        resolve()
      } else {
        log(`❌ Command failed: ${command}`, 'red')
        reject(new Error(`Command failed with code ${code}`))
      }
    })
  })
}

async function setupEnvironment() {
  log('🚀 Setting up INSIDER Smart Contract Development Environment', 'bright')
  
  // Check if we're in the right directory
  if (!checkFileExists('package.json')) {
    log('❌ package.json not found. Please run this script from the project root.', 'red')
    process.exit(1)
  }
  
  // Copy environment files
  log('\n📁 Setting up environment files...', 'blue')
  copyEnvFile('.env.local.example', '.env.local')
  copyEnvFile('contracts/.env.contracts.example', 'contracts/.env.contracts')
  
  // Install dependencies
  log('\n📦 Installing dependencies...', 'blue')
  try {
    await runCommand('npm install')
  } catch (error) {
    log('❌ Failed to install dependencies', 'red')
    process.exit(1)
  }
  
  // Setup contracts directory
  log('\n🔧 Setting up contracts...', 'blue')
  if (checkFileExists('contracts/package-contracts.json')) {
    try {
      await runCommand('npm install', path.join(process.cwd(), 'contracts'))
    } catch (error) {
      log('⚠️  Failed to install contract dependencies, continuing...', 'yellow')
    }
  }
  
  // Compile contracts
  log('\n⚙️  Compiling smart contracts...', 'blue')
  try {
    await runCommand('npm run contracts:compile')
  } catch (error) {
    log('⚠️  Failed to compile contracts, you may need to install dependencies manually', 'yellow')
  }
  
  // Run tests
  log('\n🧪 Running contract tests...', 'blue')
  try {
    await runCommand('npm run contracts:test')
  } catch (error) {
    log('⚠️  Contract tests failed, please check the contracts', 'yellow')
  }
  
  log('\n✅ Development environment setup complete!', 'green')
  log('\n📋 Next steps:', 'bright')
  log('1. Edit .env.local with your configuration', 'cyan')
  log('2. Edit contracts/.env.contracts with your private key and RPC URLs', 'cyan')
  log('3. Deploy contracts: npm run contracts:deploy:sei-testnet', 'cyan')
  log('4. Start development server: npm run dev', 'cyan')
  log('5. Open http://localhost:3000/dashboard and check Smart Contracts tab', 'cyan')
}

async function startDevelopment() {
  log('\n🚀 Starting development environment...', 'bright')
  
  // Start local hardhat node in background
  log('\n🔗 Starting local blockchain node...', 'blue')
  const hardhatNode = spawn('npm', ['run', 'contracts:node'], { 
    cwd: process.cwd(),
    stdio: 'pipe'
  })
  
  // Wait a bit for the node to start
  await new Promise(resolve => setTimeout(resolve, 3000))
  
  // Deploy contracts to local network
  log('\n📄 Deploying contracts to local network...', 'blue')
  try {
    await runCommand('npm run contracts:deploy:localhost')
  } catch (error) {
    log('⚠️  Failed to deploy to local network', 'yellow')
  }
  
  // Start Next.js development server
  log('\n🌐 Starting Next.js development server...', 'blue')
  const nextDev = spawn('npm', ['run', 'dev'], { 
    cwd: process.cwd(),
    stdio: 'inherit'
  })
  
  // Handle cleanup on exit
  process.on('SIGINT', () => {
    log('\n🛑 Shutting down development environment...', 'yellow')
    hardhatNode.kill()
    nextDev.kill()
    process.exit(0)
  })
  
  log('\n✅ Development environment is running!', 'green')
  log('📱 Frontend: http://localhost:3000', 'cyan')
  log('🔗 Local blockchain: http://localhost:8545', 'cyan')
  log('📊 Dashboard: http://localhost:3000/dashboard', 'cyan')
  log('\nPress Ctrl+C to stop all services', 'yellow')
}

// Parse command line arguments
const args = process.argv.slice(2)
const command = args[0]

switch (command) {
  case 'setup':
    setupEnvironment().catch(console.error)
    break
  case 'start':
    startDevelopment().catch(console.error)
    break
  case 'full':
    setupEnvironment()
      .then(() => startDevelopment())
      .catch(console.error)
    break
  default:
    log('🔧 INSIDER Smart Contract Development Setup', 'bright')
    log('\nUsage:', 'blue')
    log('  node scripts/dev-setup.js setup  - Setup environment and dependencies', 'cyan')
    log('  node scripts/dev-setup.js start  - Start development environment', 'cyan')
    log('  node scripts/dev-setup.js full   - Setup and start (recommended)', 'cyan')
    log('\nExample:', 'blue')
    log('  node scripts/dev-setup.js full', 'cyan')
    break
}