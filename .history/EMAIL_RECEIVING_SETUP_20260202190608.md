# Email Receiving Setup Guide

## Current Status

Your inbox system is set up correctly and ready to receive emails. However, for emails to appear in your inbox, you need to have emails being sent TO your Resend email address.

## How Email Receiving Works

There are TWO ways emails can enter your inbox:

### 1. **Automatic Polling** (Current Implementation)
- The system polls Resend every time you visit the inbox page
- It looks for emails received on your Resend domain
- Logs are shown in browser console when you open the inbox

### 2. **Webhook** (Optional)
- Resend can send a webhook when an email is received
- Webhook endpoint: `https://yourdomain.com/api/webhooks/inbound-email`
- More real-time than polling

## What You Need to Do

### Step 1: Set Up Resend Receiving

1. Go to your [Resend Dashboard](https://resend.com/dashboard)
2. Go to **Domains** section
3. Click on your domain
4. Look for **Receiving** settings
5. Create a catch-all rule or specific recipient email

### Step 2: Test Email

Send a test email TO your Resend domain. For example:
- If your domain is `yourdomain.com`
- Send a test email to: `test@yourdomain.com` or `anything@yourdomain.com`

### Step 3: Check Inbox

1. Open the inbox page: `https://yourdomain.com/admin/email-va/inbox`
2. Check browser console (F12 → Console tab)
3. Look for logs like:
   - `[Inbox] Starting auto-sync...`
   - `🔄 Syncing received emails from Resend...`
   - `📧 Found X received emails in Resend`

### Step 4: Debug

Visit the debug endpoint to see real-time status:
- `https://yourdomain.com/api/debug/inbox`
- Shows:
  - Number of emails in Resend
  - Number of emails in Firestore
  - Sample emails with details

## Troubleshooting

### No emails appear in Resend
- **Cause**: You haven't received any emails yet OR Resend Receiving isn't set up
- **Fix**: Send a test email to your domain

### Emails in Resend but not in Inbox
- **Cause**: Sync might be failing
- **Fix**: Check browser console for errors, or visit `/api/debug/inbox` for detailed status

### Email received but shows as SPAM
- **Cause**: AI classification marked it as spam
- **Fix**: Check the SPAM tab in your inbox, or adjust the AI classification settings

## Console Logs to Look For

When the inbox page loads, you should see in the browser console:
```
[Inbox] Starting auto-sync...
🔄 Syncing received emails from Resend...
📧 Found X received emails in Resend
✅ Synced X new emails, skipped Y duplicates
[Inbox] Sync result: { success: true, synced: X, ... }
[Inbox] Loading messages...
[Inbox] Got result: { itemCount: X, hasMore: false, total: X }
[Inbox] Counts: { inbox: X, spam: 0, archived: 0 }
```

## Next Steps

1. **Verify Resend Receiving is enabled** on your domain
2. **Send a test email** to your domain
3. **Open the inbox page** and check browser console
4. **Visit `/api/debug/inbox`** to see detailed status
5. **Check the SPAM tab** if email goes there

If emails still don't appear after these steps, there may be an issue with:
- Resend API credentials
- Domain configuration
- Network connectivity

Check the debug endpoint response for specific error messages.
