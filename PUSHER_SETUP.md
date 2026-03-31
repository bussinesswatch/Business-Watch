# Pusher Setup Guide for Business Watch Chat

## Step-by-Step Instructions

### Step 1: Choose Channels
From your current screen (dashboard.pusher.com):
1. Click **"Get started"** button on the **Channels** box (left side with purple icon)
   - Channels = Real-time messaging (what we need)
   - Beams = Push notifications (not needed)

### Step 2: Create Your App
Fill in the form:
- **App name**: `Business Watch Chat`
- **Cluster**: Select `Asia Pacific (Mumbai) - ap2` (closest to Maldives)
- Click **"Create app"**

### Step 3: Get Your API Keys
After app is created, you'll see tabs at the top:
1. Click **"App Keys"** tab
2. You'll see these values:
   - **app_id**: 1234567 (numbers)
   - **key**: abc123def456ghi789 (letters/numbers, about 20 chars)
   - **secret**: xyz789abc123 (secret key, don't share)
   - **cluster**: ap2

**Copy the `key` value** (the one that looks like `abc123def456`)

### Step 4: Update Code
Open file: `src/hooks/useChat.js`

Find this line (around line 7):
```javascript
const PUSHER_KEY = 'a6f9d8c2a8e8c2a8e8c2'; // Placeholder
```

Replace with your actual key:
```javascript
const PUSHER_KEY = 'YOUR_COPIED_KEY_HERE'; // Paste your real key here
```

Save the file.

### Step 5: Enable Client Events (Required for @all mentions)
1. In Pusher dashboard, click **"Settings"** tab
2. Scroll down to **"Client Events"** section
3. Toggle switch to **ON**
4. Click **"Update"** button at bottom

### Step 6: Test
1. In your terminal, restart dev server:
   ```bash
   npm run dev
   ```
2. Open browser to `http://localhost:5173/chat`
3. You should see the chat interface (no more setup message)
4. Try sending a message

## Free Tier Limits
- 200,000 messages per day
- 100 concurrent connections
- No expiration
- No credit card required

## Troubleshooting

**"Invalid key" error:**
- Double-check you copied the key correctly (no extra spaces)
- Key should be about 20 characters

**Messages not syncing:**
- Make sure you enabled "Client Events" in Settings
- Check browser console for errors

**Still seeing setup message:**
- Hard refresh browser (Ctrl+F5 or Cmd+Shift+R)
- Check that `IS_DUMMY_KEY` check is working in useChat.js

---

## Quick Check
After setup, your `useChat.js` should look like:
```javascript
const PUSHER_KEY = '1a2b3c4d5e6f7g8h9i0j'; // Your real key
const PUSHER_CLUSTER = 'ap2';
const IS_DUMMY_KEY = PUSHER_KEY === 'a6f9d8c2a8e8c2a8e8c2';
// IS_DUMMY_KEY will now be false, so chat will work!
```
