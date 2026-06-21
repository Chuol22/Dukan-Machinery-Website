#!/usr/bin/env node

/**
 * DKM AI Chatbot Setup Verification Script
 * 
 * This script checks if your chatbot environment is properly configured.
 * Run: node scripts/verify-chatbot-setup.js
 */

const fs = require('fs');
const path = require('path');

console.log('\n🔍 DKM AI Chatbot Setup Verification\n');
console.log('=' .repeat(50) + '\n');

let hasErrors = false;
let hasWarnings = false;

// Check 1: .env file exists
console.log('1️⃣  Checking .env file...');
const envPath = path.join(__dirname, '..', '.env');
if (!fs.existsSync(envPath)) {
  console.log('   ❌ ERROR: .env file not found!');
  console.log('   📝 Action: Copy .env.example to .env');
  hasErrors = true;
} else {
  console.log('   ✅ .env file exists');
  
  // Check 2: GEMINI_API_KEY is set
  console.log('\n2️⃣  Checking GEMINI_API_KEY...');
  const envContent = fs.readFileSync(envPath, 'utf-8');
  const apiKeyMatch = envContent.match(/GEMINI_API_KEY=(.+)/);
  
  if (!apiKeyMatch) {
    console.log('   ❌ ERROR: GEMINI_API_KEY not found in .env');
    console.log('   📝 Action: Add GEMINI_API_KEY=your_key to .env');
    hasErrors = true;
  } else {
    const apiKey = apiKeyMatch[1].trim();
    
    if (!apiKey || apiKey === '' || apiKey === 'your_gemini_api_key_here' || apiKey === 'YOUR_GEMINI_API_KEY_HERE') {
      console.log('   ❌ ERROR: GEMINI_API_KEY is not configured properly');
      console.log('   📝 Current value: ' + (apiKey || '(empty)'));
      console.log('   📝 Action: Set a valid Gemini API key');
      console.log('   🔗 Get key at: https://aistudio.google.com/app/apikey');
      hasErrors = true;
    } else if (!apiKey.startsWith('AIza')) {
      console.log('   ⚠️  WARNING: API key format looks unusual');
      console.log('   📝 Expected format: AIzaSyC_...');
      console.log('   📝 Current: ' + apiKey.substring(0, 10) + '...');
      hasWarnings = true;
    } else {
      console.log('   ✅ GEMINI_API_KEY is configured');
      console.log('   📝 Key: ' + apiKey.substring(0, 10) + '...' + apiKey.substring(apiKey.length - 4));
    }
  }
}

// Check 3: Required data files exist
console.log('\n3️⃣  Checking data files...');
const dataFiles = [
  'data/chatbot-knowledge.json',
  'data/machinesData.ts',
];

dataFiles.forEach(file => {
  const filePath = path.join(__dirname, '..', file);
  if (!fs.existsSync(filePath)) {
    console.log(`   ❌ ERROR: ${file} not found`);
    hasErrors = true;
  } else {
    console.log(`   ✅ ${file} exists`);
  }
});

// Check 4: Documentation exists
console.log('\n4️⃣  Checking documentation...');
const docPath = path.join(__dirname, '..', '..', 'PRODUCT_DOCUMENTATION.md');
if (!fs.existsSync(docPath)) {
  console.log('   ⚠️  WARNING: PRODUCT_DOCUMENTATION.md not found in project root');
  console.log('   📝 Chatbot will work but won\'t have full company context');
  hasWarnings = true;
} else {
  console.log('   ✅ PRODUCT_DOCUMENTATION.md exists');
}

// Check 5: API route exists
console.log('\n5️⃣  Checking API route...');
const apiRoute = path.join(__dirname, '..', 'app', 'api', 'chat', 'route.ts');
if (!fs.existsSync(apiRoute)) {
  console.log('   ❌ ERROR: /api/chat/route.ts not found');
  hasErrors = true;
} else {
  console.log('   ✅ /api/chat route exists');
}

// Check 6: Gemini RAG lib exists
console.log('\n6️⃣  Checking RAG system...');
const ragLib = path.join(__dirname, '..', 'lib', 'geminiRag.ts');
if (!fs.existsSync(ragLib)) {
  console.log('   ❌ ERROR: lib/geminiRag.ts not found');
  hasErrors = true;
} else {
  console.log('   ✅ RAG system exists');
}

// Final summary
console.log('\n' + '='.repeat(50));
console.log('\n📊 SUMMARY:\n');

if (!hasErrors && !hasWarnings) {
  console.log('✅ All checks passed! Your chatbot is properly configured.\n');
  console.log('🚀 Next steps:');
  console.log('   1. Make sure dev server is running: npm run dev');
  console.log('   2. Open http://localhost:3000');
  console.log('   3. Click the chatbot icon (bottom-right)');
  console.log('   4. Test with: "What machines do you offer?"\n');
} else if (hasErrors) {
  console.log('❌ Setup is INCOMPLETE. Please fix the errors above.\n');
  console.log('📖 Read: frontend/CHATBOT_SETUP.md for detailed instructions\n');
  process.exit(1);
} else if (hasWarnings) {
  console.log('⚠️  Setup is OK but has warnings. Review them above.\n');
  console.log('🚀 You can proceed with testing, but some features may be limited.\n');
}

console.log('📖 Full setup guide: frontend/CHATBOT_SETUP.md');
console.log('🔗 Get API key: https://aistudio.google.com/app/apikey\n');
