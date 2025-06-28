
/**
 * Crypto Sniper Bot - Main Entry Point
 * 
 * Features:
 * - Multi-channel signal consensus
 * - Volume spike detection  
 * - Liquidity depth analysis
 * - Whale transaction monitoring
 * - Telegram alerts & commands
 * - Performance tracking
 */

require('dotenv').config();

// Initialize Bot API UI first
console.log('🤖 Initializing Telegram Bot API...');
require('./bot-ui/bot_ui');

const path = require('path');
const { spawn } = require('child_process');

// Available bot modes
const MODES = {
    'signal': './bot/main.js',
    'legacy': './bot/legacy_main.js', 
    'consensus': './bot/legacy_consensus.js',
    'discover': './scripts/test_discovery.js'
};

function printUsage() {
    console.log(`
🤖 Crypto Sniper Bot

Usage: node index.js [mode]

Available modes:
  signal     - Start main signal bot (default)
  legacy     - Legacy signal bot  
  consensus  - Legacy consensus bot
  discover   - Test channel discovery

Examples:
  node index.js signal
  node index.js discover
    `);
}

function startBot(mode = 'signal') {
    const scriptPath = MODES[mode];
    
    if (!scriptPath) {
        console.error(`❌ Unknown mode: ${mode}`);
        printUsage();
        process.exit(1);
    }

    console.log(`🚀 Starting bot in ${mode} mode...`);
    console.log(`📄 Script: ${scriptPath}`);
    console.log('================================\n');
    
    const child = spawn('node', [scriptPath], {
        stdio: 'inherit',
        cwd: process.cwd()
    });

    child.on('error', (error) => {
        console.error(`❌ Failed to start bot: ${error.message}`);
        process.exit(1);
    });

    child.on('exit', (code) => {
        console.log(`\n📊 Bot exited with code ${code}`);
        process.exit(code);
    });

    // Handle graceful shutdown
    process.on('SIGINT', () => {
        console.log('\n🛑 Shutting down bot...');
        child.kill('SIGINT');
    });

    process.on('SIGTERM', () => {
        console.log('\n🛑 Shutting down bot...');
        child.kill('SIGTERM');
    });
}

// Parse command line arguments
const mode = process.argv[2] || 'signal';

if (mode === '--help' || mode === '-h') {
    printUsage();
    process.exit(0);
}

startBot(mode);
