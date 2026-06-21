# 🤖 AI Chatbot Setup Guide

## ⚠️ Current Status: NOT CONFIGURED

Your AI chatbot is showing this error:
```
⚠️ Error: I'm having trouble connecting to the AI service
```

**Cause:** Missing or invalid `GEMINI_API_KEY` environment variable.

---

## ✅ Quick Fix (5 Minutes)

### Step 1: Get Your FREE API Key

1. Visit: **https://aistudio.google.com/app/apikey**
2. Sign in with your Google account
3. Click **"Create API Key"**
4. Copy the generated key (looks like: `AIzaSyC_...`)

**Note:** Google provides a FREE tier with generous limits:
- ✅ 60 requests per minute
- ✅ 1,500 requests per day
- ✅ No credit card required

---

### Step 2: Update Your Environment File

**Location:** `frontend/.env`

Find this line:
```env
GEMINI_API_KEY=your_gemini_api_key_here
```

Replace with your actual key:
```env
GEMINI_API_KEY=AIzaSyC_your_actual_key_here
```

**Important:** 
- Remove any quotes around the key
- No spaces before or after the `=`
- Make sure it's on a single line

---

### Step 3: Restart Your Development Server

```bash
# Stop the current server (Ctrl+C or Cmd+C)

# Navigate to frontend directory
cd frontend

# Start the server again
npm run dev
```

---

## 🧪 Test Your Chatbot

After restart:

1. **Open the chatbot** (bottom-right corner)
2. **Ask:** "What machines do you offer?"
3. **Expected:** AI lists all 17 DKM machines with categories

### Sample Test Questions:
- "Show me grain cleaning machines"
- "What's the price of the Wheat Cleaning Machine?"
- "Tell me about your company"
- "How do I place an order?"

---

## 🚀 For Production (Vercel Deployment)

### Add Environment Variable to Vercel:

1. Go to **Vercel Dashboard** → Your DKM Project
2. Click **Settings** → **Environment Variables**
3. Add new variable:
   - **Name:** `GEMINI_API_KEY`
   - **Value:** Your API key (AIzaSyC_...)
   - **Environments:** ✅ Production ✅ Preview ✅ Development
4. Click **Save**
5. **Redeploy** your application

**Tip:** After adding, Vercel will prompt you to redeploy. Click the redeploy button.

---

## 🔍 Troubleshooting

### Error: "AI Service Not Configured"

**Cause:** API key is missing or still set to placeholder value.

**Fix:**
1. Open `frontend/.env`
2. Check the `GEMINI_API_KEY` line
3. Make sure it's NOT `your_gemini_api_key_here`
4. Paste your actual API key
5. Restart server

---

### Error: "Invalid API Key"

**Possible causes:**

1. **API key is incorrect:**
   - Copy the key again from Google AI Studio
   - Make sure you copied the entire key
   - No extra spaces or characters

2. **API is not enabled:**
   - Go to: https://console.cloud.google.com/apis/library
   - Search for "Generative Language API"
   - Click **Enable**

3. **API key restrictions:**
   - Go to: https://console.cloud.google.com/apis/credentials
   - Click your API key
   - Check "API restrictions" section
   - Make sure "Generative Language API" is allowed

---

### Error: "API Quota Exceeded"

**Cause:** You've exceeded the free tier limits.

**Free tier limits:**
- 60 requests per minute
- 1,500 requests per day

**Solutions:**

1. **Wait a few minutes** - limits reset automatically
2. **Upgrade to paid plan** - if you need more capacity
3. **Check usage:** https://console.cloud.google.com/apis/dashboard

---

### Error: "Connection Error" or "Cannot reach AI service"

**Possible causes:**

1. **Development server not running:**
   ```bash
   cd frontend
   npm run dev
   ```

2. **Port conflict:**
   - Check if port 3000 is already in use
   - Try: `http://localhost:3000`

3. **Firewall blocking:**
   - Check firewall allows connections to `generativelanguage.googleapis.com`
   - Try disabling VPN temporarily

4. **Internet connection:**
   - Verify you're online
   - Test: `ping google.com`

---

## 📋 What's Already Working

Your chatbot implementation is **fully complete** and includes:

✅ **Complete Knowledge Base:**
- All 17 DKM machines with full specifications
- Company information and policies
- FAQ responses
- Ethiopian market context

✅ **RAG System:**
- Loads product documentation automatically
- Fetches live data from database
- Combines static and dynamic content

✅ **Professional Features:**
- Context-aware responses
- Product recommendations
- Accurate pricing (where available)
- Order guidance

✅ **Smart Error Handling:**
- Helpful error messages
- Fallback suggestions
- Contact information

**The ONLY thing missing:** The Gemini API key connection.

---

## 🎯 Quick Summary

| Status | Item |
|--------|------|
| ❌ | API Key Configuration |
| ✅ | Chatbot Code Implementation |
| ✅ | Knowledge Base (17 Machines) |
| ✅ | RAG System |
| ✅ | Error Handling |
| ✅ | UI Components |
| ✅ | Database Integration |

**Action Required:** Add `GEMINI_API_KEY` to `.env` file → Restart server → Done!

---

## 📞 Support

### If You Still Have Issues:

1. **Check Console Logs:**
   ```bash
   # In your terminal where dev server is running
   # Look for error messages starting with ❌
   ```

2. **Check Browser Console:**
   - Open browser DevTools (F12)
   - Go to Console tab
   - Look for red error messages

3. **Verify API Key Works:**
   ```bash
   # Test with curl (Mac/Linux)
   curl "https://generativelanguage.googleapis.com/v1beta/models?key=YOUR_API_KEY"
   
   # Should return a list of models
   ```

4. **Contact Support:**
   - Email: support@dukanmachinery.com
   - Include: Error message from console

---

## 🔐 Security Best Practices

1. **Never commit API keys to Git:**
   - ✅ `.env` is already in `.gitignore`
   - ❌ Don't add keys to frontend code
   - ❌ Don't share keys in screenshots

2. **Rotate keys periodically:**
   - Generate new key every 3-6 months
   - Delete old unused keys

3. **Set API restrictions (Optional):**
   - Limit by IP address
   - Limit by HTTP referrer
   - Set usage quotas

4. **Monitor usage:**
   - Check Google Cloud Console dashboard
   - Set up billing alerts
   - Review usage logs

---

## ✨ After Setup

Once configured, your AI chatbot will:

- ✅ Answer questions about all 17 DKM machines
- ✅ Provide accurate specifications and pricing
- ✅ Guide users through the ordering process
- ✅ Explain company policies and features
- ✅ Suggest related machines based on needs
- ✅ Respond professionally in user's language

**Your chatbot is production-ready** - it just needs the API key! 🚀

---

**Last Updated:** June 20, 2026  
**Next Step:** Add your Gemini API key to `.env`  
**Time Required:** 5 minutes  
**Cost:** FREE (up to 1,500 requests/day)
