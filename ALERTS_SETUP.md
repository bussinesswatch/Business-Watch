# Automation & Alerts Setup Guide

## Step 1: Create .env File

Copy `.env.example` to `.env` in your project root:

```bash
cp .env.example .env
```

Then fill in your details:

```env
# Firebase (already configured)
VITE_FIREBASE_API_KEY=your-api-key
VITE_FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your-project-id
VITE_FIREBASE_STORAGE_BUCKET=your-project.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=123456789
VITE_FIREBASE_APP_ID=1:123456789:web:abcdef

# Email Configuration (for notifications)
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-email@gmail.com
SMTP_PASS=your-16-char-app-password
FROM_EMAIL=your-email@gmail.com
ADMIN_EMAIL=your-email@gmail.com

# Security (generate random string at https://random.org)
CRON_SECRET=your-random-secret-key-min-32-chars
```

---

## Step 2: Enable Gmail App Password

Since regular Gmail passwords don't work with SMTP, you need an App Password:

1. **Enable 2-Step Verification** on your Google Account:
   - Go to https://myaccount.google.com/security
   - Click "2-Step Verification" → "Get started"
   - Follow the steps to enable

2. **Generate App Password**:
   - Go to https://myaccount.google.com/apppasswords
   - Sign in again if prompted
   - Select app: "Mail"
   - Select device: "Other (Custom name)" → type "Business Watch"
   - Click "Generate"
   - **Copy the 16-character password** (looks like: `abcd efgh ijkl mnop`)
   - Paste this into your `.env` file as `SMTP_PASS`

---

## Step 3: Vercel Deployment & Cron Jobs

### ⚠️ Important: Cron Jobs Require Vercel Pro ($20/month)

Free alternatives:

### Option A: External Cron Service (FREE)
Use these services to call your API endpoints on a schedule:

1. **Cron-Job.org** (Free)
   - Sign up at https://cron-job.org
   - Create job: URL = `https://your-site.vercel.app/api/check-deadlines`
   - Schedule: Daily at 8:00 AM
   - Add header: `Authorization: Bearer your-cron-secret`
   - Create another job for `/api/scrape-gazette` every 6 hours

2. **Easycron.com** (Free tier)
   - Similar setup

3. **GitHub Actions** (FREE - recommended)
   - Add `.github/workflows/cron.yml` (I can create this)
   - Runs on GitHub's servers
   - No Vercel Pro needed

### Option B: Manual Trigger (for testing)
Visit these URLs manually or bookmark them:
- `https://your-site.vercel.app/api/check-deadlines`
- `https://your-site.vercel.app/api/scrape-gazette`

---

## Step 4: Test the API

### Test Deadline Check
```bash
curl -H "Authorization: Bearer your-cron-secret" \
  https://your-site.vercel.app/api/check-deadlines
```

Expected response:
```json
{
  "success": true,
  "message": "Deadline check completed",
  "tendersChecked": 43,
  "timestamp": "2026-03-30T..."
}
```

### Test Subscription
```bash
curl -X POST \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","preferences":{"deadlineAlerts":true}}' \
  https://your-site.vercel.app/api/notifications/subscribe
```

---

## Step 5: Frontend Setup

The Notification Bell is already in the header. Users can:
1. Click the bell icon
2. Click "Notification Settings" (gear icon)
3. Enter their email
4. Select which alerts they want
5. Click "Subscribe to Alerts"

---

## What Each Alert Does

| Alert Type | When It Fires | Email Subject |
|------------|---------------|---------------|
| **Deadline Alerts** | 7, 3, 1 days before submission deadline | "🔔 Deadline Alert: [Tender] (X days left)" |
| **Bid Opening** | 4 hours before and at opening time | "⏰ Bid Opening Today: [Tender]" |
| **New Tenders** | When scraper finds new gazette tender | "📢 New Tender: [Tender]" |
| **Result Updates** | When bid result changes (Pending→Won/Lost) | "🎉 Bid Won: [Tender]" or "📊 Result Updated" |

---

## Troubleshooting

### Emails not sending?
1. Check Gmail App Password is correct (16 chars, no spaces)
2. Verify SMTP_USER matches your Gmail address
3. Check spam/junk folders
4. Look at Vercel logs: `vercel logs --json`

### Cron jobs not running?
1. Check CRON_SECRET matches in both `.env` and cron service
2. Verify Vercel Functions are enabled in your plan
3. Test endpoints manually first with curl

### Notification bell not showing?
1. Hard refresh browser (Ctrl+F5)
2. Check browser console for errors
3. Verify `NotificationBell.jsx` is in `src/components/`

---

## Quick Checklist

- [ ] `.env` file created with Gmail credentials
- [ ] Gmail 2-Step Verification enabled
- [ ] Gmail App Password generated and added to `.env`
- [ ] CRON_SECRET set (random 32+ character string)
- [ ] Deployed to Vercel
- [ ] Cron job service configured (or GitHub Actions)
- [ ] Tested API endpoint with curl
- [ ] Checked email delivery

---

**Need Help?** Check the email templates in `api/services/notificationService.js` to customize the look of alert emails.
