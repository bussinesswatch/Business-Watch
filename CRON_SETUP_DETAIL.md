# Step 4: Detailed Cron Job Setup

## Option A: GitHub Actions (FREE & Recommended)

This runs on GitHub's servers for free. No need for Vercel Pro.

### Step 4A.1: Add GitHub Secrets

1. Go to your GitHub repository: `https://github.com/bussinesswatch/Business-Watch`

2. Click **Settings** tab (top right)

3. In left sidebar, click **Secrets and variables** → **Actions**

4. Click **New repository secret** button

5. Add these 2 secrets:

   **Secret 1: CRON_SECRET**
   - Name: `CRON_SECRET`
   - Value: Your random secret from `.env` (e.g., `your-random-secret-key-here`)
   - Click **Add secret**

   **Secret 2: VERCEL_URL**
   - Name: `VERCEL_URL`
   - Value: Your Vercel domain (e.g., `business-watch.vercel.app`)
   - Click **Add secret**

### Step 4A.2: Verify Workflow File Exists

I already created `.github/workflows/cron.yml`. Check it exists:
- Open `.github/workflows/cron.yml` in your project
- Should have 2 jobs: `check-deadlines` and `scrape-gazette`

### Step 4A.3: Push to GitHub

```bash
git add .github/workflows/cron.yml
git commit -m "Add GitHub Actions cron jobs"
git push origin main
```

### Step 4A.4: Verify It's Working

1. Go to your GitHub repo
2. Click **Actions** tab
3. You should see "Deadline & Gazette Checks" workflow
4. Click on it → Click **Run workflow** → **Run workflow** (to test manually)
5. Wait 30 seconds, refresh
6. Should show green checkmark if successful

### Step 4A.5: Check Schedule

The workflow automatically runs:
- **Deadline check**: Every day at 8:00 AM UTC
- **Gazette scrape**: Every 6 hours

Times shown in GitHub are UTC. Maldives is UTC+5, so:
- 8:00 AM UTC = 1:00 PM Maldives time

---

## Option B: Cron-Job.org (FREE Alternative)

Use this if you don't want GitHub Actions.

### Step 4B.1: Create Account

1. Go to https://cron-job.org
2. Click **Sign Up** (top right)
3. Fill in: Email, Password, Confirm Password
4. Click **Create my account**
5. Check your email and click verification link
6. Log in

### Step 4B.2: Create First Job (Deadline Check)

1. Click **CREATE CRONJOB** (big blue button)

2. Fill the form:
   
   **General Settings:**
   - Title: `Business Watch - Deadline Check`
   - Address: `https://your-site.vercel.app/api/check-deadlines`
     - (Replace with your actual Vercel URL)
   
   **Schedule:**
   - Select: `Every day`
   - At: `08:00`
   - Timezone: `(UTC) Coordinated Universal Time`
   
   **Notifications:**
   - Check: `When execution fails`
   - Check: `When execution succeeds` (optional)
   - Enter your email

3. Click **CREATE** button

### Step 4B.3: Add Authorization Header

1. Find your new job in the list
2. Click **Edit** (pencil icon)
3. Scroll down to **Extended HTTP settings**
4. Click to expand
5. In **HTTP Headers** section, click **Add header**
6. Fill:
   - Name: `Authorization`
   - Value: `Bearer your-cron-secret`
     - (Replace with your CRON_SECRET from `.env`)
7. Click **SAVE**

### Step 4B.4: Create Second Job (Gazette Scrape)

1. Click **CREATE CRONJOB** again

2. Fill the form:
   
   **General Settings:**
   - Title: `Business Watch - Gazette Scrape`
   - Address: `https://your-site.vercel.app/api/scrape-gazette`
   
   **Schedule:**
   - Select: `Every hour`
   - At minute: `0`
   - But we want every 6 hours, so:
   - Select: `Every hour` and set `Execution happens every 6 hours`
   - Or use: `Advanced` → `0 */6 * * *`

3. Add the same Authorization header (Step 4B.3)

4. Click **SAVE**

### Step 4B.5: Test Both Jobs

1. Back in your cron job list
2. Click **Execute** (play icon) on first job
3. Wait 10 seconds, check result
4. Should show: `HTTP 200 OK`
5. Do same for second job

---

## Option C: Manual Trigger (For Testing Only)

Just bookmark these URLs and visit them when needed:

1. **Check Deadlines**: 
   ```
   https://your-site.vercel.app/api/check-deadlines
   ```
   - Visit daily to trigger email alerts

2. **Scrape Gazette**: 
   ```
   https://your-site.vercel.app/api/scrape-gazette
   ```
   - Visit periodically to check for new tenders

### Important for Manual Option:

Add this to your browser bookmarks with the Authorization header:

**For Chrome/Edge (using extensions):**
1. Install "ModHeader" extension
2. Add header: `Authorization: Bearer your-cron-secret`
3. Then visit the URLs

**Or use a simple HTML page:**
```html
<!-- Save as trigger-alerts.html -->
<button onclick="checkDeadlines()">Check Deadlines</button>
<button onclick="scrapeGazette()">Scrape Gazette</button>
<script>
const CRON_SECRET = 'your-cron-secret';
function checkDeadlines() {
  fetch('https://your-site.vercel.app/api/check-deadlines', {
    headers: { 'Authorization': 'Bearer ' + CRON_SECRET }
  }).then(r => r.json()).then(console.log);
}
function scrapeGazette() {
  fetch('https://your-site.vercel.app/api/scrape-gazette', {
    headers: { 'Authorization': 'Bearer ' + CRON_SECRET }
  }).then(r => r.json()).then(console.log);
}
</script>
```

---

## Step 5: Verify Email Delivery

After setting up cron jobs, test that emails actually send:

### Test 1: Manual API Test
```bash
curl -H "Authorization: Bearer your-cron-secret" \
  https://your-site.vercel.app/api/check-deadlines
```

Expected output:
```json
{
  "success": true,
  "message": "Deadline check completed",
  "tendersChecked": 43,
  "timestamp": "2026-03-30T..."
}
```

### Test 2: Check Email Inbox
1. Wait 1 minute after running test
2. Check your Gmail inbox
3. Look for email with subject: `🔔 Deadline Alert: ...`
4. If no email:
   - Check spam/junk folder
   - Check `.env` SMTP credentials
   - Check Vercel logs: `vercel logs --json`

### Test 3: Add Test Subscriber
```bash
curl -X POST \
  -H "Content-Type: application/json" \
  -d '{"email":"your-test-email@example.com","preferences":{"deadlineAlerts":true}}' \
  https://your-site.vercel.app/api/notifications/subscribe
```

---

## Troubleshooting Cron Jobs

### "401 Unauthorized" error
- CRON_SECRET doesn't match between `.env` and GitHub Secrets/Cron-Job.org
- Check for extra spaces or different cases

### "404 Not Found" error
- Vercel URL is wrong
- Check: `https://business-watch.vercel.app` not `http://`
- Make sure `/api/` prefix is correct

### "500 Internal Server Error"
- Check Vercel logs: `vercel logs --json`
- Usually means SMTP credentials wrong
- Or `working_file.json` not found

### Emails not sending
- Gmail App Password must be 16 characters
- Remove spaces from password in `.env`
- Wrong: `abcd efgh ijkl mnop`
- Right: `abcdefghijklmnop`

### Cron job runs but no alerts sent
- No tenders with upcoming deadlines in data
- Check `working_file.json` for `submission_deadline` dates
- Manually edit a tender to have deadline tomorrow for testing

---

## Quick Reference: Cron Schedule Times

| Schedule | Cron Expression | When It Runs |
|----------|----------------|--------------|
| Daily 8 AM | `0 8 * * *` | Every day at 08:00 UTC |
| Every 6 hours | `0 */6 * * *` | 00:00, 06:00, 12:00, 18:00 UTC |
| Every hour | `0 * * * *` | Every hour on the hour |
| Every 30 min | `*/30 * * * *` | Every 30 minutes |

---

## Which Option Should You Choose?

| Feature | GitHub Actions | Cron-Job.org | Manual |
|---------|---------------|--------------|--------|
| Cost | Free | Free | Free |
| Setup Time | 5 minutes | 10 minutes | 1 minute |
| Reliability | High | High | Low (you must remember) |
| Logs | Detailed | Basic | None |
| Failure Alerts | Email | Email | None |
| Best For | Production | Production | Testing only |

**Recommendation**: Use GitHub Actions for production.
