# Email Virtual Assistant (Email-VA) Setup Instructions

This guide will help you set up and configure the Email Virtual Assistant system to work with your business email, database, AI APIs, and all necessary services.

## Table of Contents

1. [Overview](#overview)
2. [Prerequisites](#prerequisites)
3. [Environment Variables Setup](#environment-variables-setup)
4. [Firebase Setup](#firebase-setup)
5. [Resend Email Setup](#resend-email-setup)
6. [Groq AI Setup](#groq-ai-setup)
7. [Database Structure](#database-structure)
8. [Initial Configuration](#initial-configuration)
9. [Usage Guide](#usage-guide)
10. [Troubleshooting](#troubleshooting)

---

## Overview

The Email Virtual Assistant system provides:
- **AI-powered email classification** (sales, support, hiring, spam, other)
- **Automatic reply generation** using Groq AI
- **Email campaign management** with personalization
- **Lead management** with CSV import
- **Inbox management** with priority-based organization
- **Manual email composition**

**Free Tier Limits:**
- Groq AI: 14,400 requests/day
- Resend: 3,000 emails/month

---

## Prerequisites

- Node.js 18+ installed
- Firebase project with Firestore enabled
- Resend account (free tier available)
- Groq API account (free tier available)
- Domain email address (for sending emails)

---

## Environment Variables Setup

Create a `.env.local` file in the root of your project with the following variables:

```bash
# Firebase Configuration
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your-firebase-project-id
FIREBASE_ADMIN_CLIENT_EMAIL=your-service-account-email@your-project.iam.gserviceaccount.com
FIREBASE_ADMIN_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\nYour private key here\n-----END PRIVATE KEY-----\n"
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your-project.appspot.com

# Resend Email Service
RESEND_API_KEY=re_your_resend_api_key
EMAIL_FROM=noreply@yourdomain.com
EMAIL_FROM_NAME=Your Business Name

# Groq AI
GROQ_API_KEY=your_groq_api_key

# Application URL (for unsubscribe links)
NEXT_PUBLIC_APP_URL=https://yourdomain.com
```

### Important Notes:

1. **FIREBASE_ADMIN_PRIVATE_KEY**: 
   - Must include the full private key with `\n` characters
   - Keep the quotes around the entire key
   - Replace actual newlines with `\n` in the string

2. **EMAIL_FROM**: 
   - Must be a verified domain in Resend
   - Use your business email domain

3. **NEXT_PUBLIC_APP_URL**: 
   - Used for unsubscribe links in campaign emails
   - Should be your production domain

---

## Firebase Setup

### Step 1: Create Firebase Project

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Click "Add project"
3. Enter your project name
4. Enable Google Analytics (optional)
5. Click "Create project"

### Step 2: Enable Firestore

1. In Firebase Console, go to **Firestore Database**
2. Click "Create database"
3. Choose **Production mode** (or Test mode for development)
4. Select your preferred location
5. Click "Enable"

### Step 3: Create Service Account

1. Go to **Project Settings** → **Service Accounts**
2. Click "Generate new private key"
3. Download the JSON file
4. Extract the following from the JSON:
   - `project_id` → `NEXT_PUBLIC_FIREBASE_PROJECT_ID`
   - `client_email` → `FIREBASE_ADMIN_CLIENT_EMAIL`
   - `private_key` → `FIREBASE_ADMIN_PRIVATE_KEY`
   - `storageBucket` → `NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET` (if available)

### Step 4: Set Up Firestore Collections

The system will automatically create collections when first used, but you can pre-create them:

**Collections needed:**
- `emailVaLeads` - Stores lead/contact information
- `emailVaCampaigns` - Stores email campaigns
- `emailVaInbox` - Stores incoming messages
- `emailVaSent` - Stores sent email logs
- `emailVaConfig` - Stores system configuration
- `emailVaPrompts` - Stores AI prompts

**Optional: Create indexes**

If you plan to query by multiple fields, create composite indexes in Firestore:
- `emailVaLeads`: `status` + `tags` (for campaign filtering)
- `emailVaInbox`: `status` + `createdAt` (for filtering)

---

## Resend Email Setup

### Step 1: Create Resend Account

1. Go to [Resend](https://resend.com/)
2. Sign up for a free account
3. Verify your email address

### Step 2: Add and Verify Domain

1. Go to **Domains** in Resend dashboard
2. Click "Add Domain"
3. Enter your domain (e.g., `yourdomain.com`)
4. Add the DNS records provided by Resend to your domain:
   - **SPF record** (TXT)
   - **DKIM record** (TXT)
   - **DMARC record** (TXT) - Optional but recommended
5. Wait for verification (usually a few minutes)

### Step 3: Get API Key

1. Go to **API Keys** in Resend dashboard
2. Click "Create API Key"
3. Give it a name (e.g., "Email VA Production")
4. Copy the API key (starts with `re_`)
5. Add to `.env.local` as `RESEND_API_KEY`

### Step 4: Configure From Email

1. Use a verified domain email: `noreply@yourdomain.com` or `hello@yourdomain.com`
2. Add to `.env.local`:
   - `EMAIL_FROM=noreply@yourdomain.com`
   - `EMAIL_FROM_NAME=Your Business Name`

**Note:** Free tier allows 3,000 emails/month. Upgrade for higher limits.

---

## Groq AI Setup

### Step 1: Create Groq Account

1. Go to [Groq Console](https://console.groq.com/)
2. Sign up for a free account
3. Verify your email

### Step 2: Get API Key

1. Go to **API Keys** section
2. Click "Create API Key"
3. Give it a name (e.g., "Email VA")
4. Copy the API key
5. Add to `.env.local` as `GROQ_API_KEY`

**Note:** Free tier allows 14,400 requests/day. The system uses:
- `llama-3.3-70b-versatile` model (fast and free)

---

## Database Structure

### Collection: `emailVaLeads`

```typescript
{
  email: string;              // Required, unique
  name?: string;
  company?: string;
  tags: string[];             // e.g., ["client", "newsletter"]
  status: "active" | "unsubscribed" | "bounced";
  source: string;             // "manual", "csv_import", etc.
  customFields?: Record<string, any>;
  createdAt: Timestamp;
  updatedAt: Timestamp;
}
```

### Collection: `emailVaCampaigns`

```typescript
{
  name: string;
  subject: string;            // Supports {{name}} and {{company}}
  bodyHtml: string;           // HTML version
  bodyPlain: string;           // Plain text version
  recipientTags: string[];      // Filter leads by tags
  status: "draft" | "sending" | "sent" | "paused";
  stats: {
    total: number;
    sent: number;
    failed: number;
  };
  createdAt: Timestamp;
  updatedAt: Timestamp;
  sentAt?: Timestamp;
}
```

### Collection: `emailVaInbox`

```typescript
{
  fromEmail: string;
  fromName?: string;
  subject: string;
  body: string;
  intent?: "sales" | "support" | "hiring" | "spam" | "other";
  priority: "low" | "medium" | "high" | "urgent";
  status: "unread" | "drafted" | "sent" | "archived";
  aiReply?: string;
  aiApproved: boolean;
  createdAt: Timestamp;
  updatedAt: Timestamp;
}
```

### Collection: `emailVaSent`

```typescript
{
  toEmail: string;
  subject: string;
  body: string;
  type: "manual" | "campaign" | "auto_reply";
  campaignId?: string;
  inboxId?: string;
  sentAt: Timestamp;
}
```

### Collection: `emailVaConfig`

```typescript
{
  autoReplyEnabled: boolean;
  requireApproval: boolean;
  rateLimitPerHour: number;
  updatedAt: Timestamp;
}
```

### Collection: `emailVaPrompts`

```typescript
{
  type: "classify" | "reply";
  name: string;
  prompt: string;              // The actual prompt text
  active: boolean;             // Only active prompts are used
  createdAt: Timestamp;
  updatedAt: Timestamp;
}
```

---

## Initial Configuration

### Step 1: Install Dependencies

```bash
npm install
```

### Step 2: Start Development Server

```bash
npm run dev
```

### Step 3: Access Admin Panel

Navigate to: `http://localhost:3000/admin/email-va`

### Step 4: Configure Settings

1. Go to **Settings** (`/admin/email-va/settings`)
2. Configure:
   - **Auto-Reply**: Enable/disable automatic reply generation
   - **Require Approval**: Require manual approval before sending AI replies
3. Set up AI Prompts:
   - **Intent Classification Prompt**: How to classify incoming emails
   - **Reply Generation Prompt**: How to generate email replies
4. Click "Save Configuration" and "Save Prompts"

### Step 5: Import Leads

1. Go to **Leads** (`/admin/email-va/leads`)
2. Click "Import CSV"
3. Format your CSV:
   ```csv
   email,name,company
   john@example.com,John Doe,Acme Inc
   jane@example.com,Jane Smith,Tech Corp
   ```
4. Add tags (comma-separated): `client, newsletter`
5. Click "Import Leads"

---

## Usage Guide

### Managing Leads

**Add Lead Manually:**
1. Go to **Leads** → Click "Add Lead"
2. Fill in email, name, company, tags
3. Click "Add Lead"

**Import from CSV:**
1. Prepare CSV with headers: `email,name,company`
2. Go to **Leads** → "Import CSV"
3. Paste CSV content
4. Add tags
5. Import

**Search Leads:**
- Use the search bar to filter by email, name, or company

### Creating Campaigns

1. Go to **Campaigns** → "New Campaign"
2. Fill in:
   - **Campaign Name**: e.g., "Q1 Newsletter"
   - **Email Subject**: Use `{{name}}` and `{{company}}` for personalization
   - **Email Body**: Use `{{name}}` and `{{company}}` variables
   - **Recipient Tags**: Leave empty for all leads, or specify tags
3. Click "Save as Draft" or "Send Now"

**Personalization Variables:**
- `{{name}}` - Replaced with lead's name (or "there" if missing)
- `{{company}}` - Replaced with lead's company (or empty if missing)

**Example Subject:**
```
Hello {{name}}, special offer from {{company}}
```

**Example Body:**
```
Hi {{name}},

We hope this email finds you well! We have an exciting update for {{company}}.

Best regards,
Your Team
```

### Managing Inbox

1. Go to **Inbox** (`/admin/email-va/inbox`)
2. View incoming messages
3. Click a message to view details
4. Click "Generate AI Reply" to create automatic reply
5. Review and click "Approve & Send Reply" to send

**Message Status:**
- **Unread**: New message, not processed
- **Drafted**: AI reply generated, awaiting approval
- **Sent**: Reply has been sent

**Priority Levels:**
- **Urgent**: Red badge
- **High**: Orange badge
- **Medium**: Blue badge
- **Low**: Gray badge

### Composing Manual Emails

1. Go to **Compose Email** (`/admin/email-va/compose`)
2. Enter recipients (comma-separated)
3. Enter subject and message
4. Click "Send Email"

### Dashboard Overview

The dashboard shows:
- **Total Leads**: Number of active leads
- **Active Campaigns**: Draft, sending, or paused campaigns
- **Pending Replies**: Messages with AI replies awaiting approval
- **Sent Today**: Emails sent today

---

## Troubleshooting

### Issue: "GROQ_API_KEY not configured"

**Solution:**
- Check `.env.local` file exists
- Verify `GROQ_API_KEY` is set correctly
- Restart the development server after adding env variables

### Issue: "RESEND_API_KEY not configured"

**Solution:**
- Verify Resend API key in `.env.local`
- Check API key is active in Resend dashboard
- Restart server

### Issue: Firebase connection errors

**Solution:**
- Verify all Firebase env variables are set
- Check `FIREBASE_ADMIN_PRIVATE_KEY` includes `\n` for newlines
- Ensure service account has Firestore permissions
- Check Firebase project ID is correct

### Issue: Emails not sending

**Solution:**
- Verify domain is verified in Resend
- Check `EMAIL_FROM` uses verified domain
- Check Resend API key is valid
- Review Resend dashboard for error logs
- Check monthly email limit (3,000 for free tier)

### Issue: AI replies not generating

**Solution:**
- Check Groq API key is valid
- Verify daily request limit (14,400 for free tier)
- Check prompts are saved in Settings
- Review browser console for errors

### Issue: Campaign personalization not working

**Solution:**
- Ensure leads have `name` and `company` fields
- Check variable syntax: `{{name}}` and `{{company}}` (double curly braces)
- Verify campaign is using correct variable names

### Issue: Stats not showing on dashboard

**Solution:**
- Check Firestore collections exist
- Verify Firebase connection
- Check browser console for errors
- Ensure collections have data

### Issue: Inbox messages not loading

**Solution:**
- Verify `getInboxMessages` server action is working
- Check Firestore `emailVaInbox` collection exists
- Review server logs for errors
- Check Firestore security rules allow reads

---

## Security Best Practices

1. **Never commit `.env.local` to git**
   - Already in `.gitignore` by default

2. **Use environment-specific keys**
   - Different keys for development and production

3. **Rotate API keys regularly**
   - Update keys every 90 days

4. **Limit Firebase permissions**
   - Service account should only have necessary permissions

5. **Monitor usage**
   - Check Groq and Resend dashboards regularly
   - Set up alerts for usage limits

6. **Validate email addresses**
   - System validates emails, but double-check imports

---

## Production Deployment

### Environment Variables

Set all environment variables in your hosting platform:
- **Vercel**: Project Settings → Environment Variables
- **Netlify**: Site Settings → Environment Variables
- **Other**: Follow platform-specific instructions

### Build and Deploy

```bash
npm run build
npm start
```

### Post-Deployment Checklist

- [ ] All environment variables set
- [ ] Domain verified in Resend
- [ ] Firebase service account configured
- [ ] `NEXT_PUBLIC_APP_URL` set to production domain
- [ ] Test email sending
- [ ] Test AI reply generation
- [ ] Import initial leads
- [ ] Configure AI prompts in Settings

---

## Support

For issues or questions:
1. Check the Troubleshooting section above
2. Review Firebase, Resend, and Groq documentation
3. Check server logs for detailed error messages
4. Verify all environment variables are correctly set

---

## Additional Resources

- [Firebase Documentation](https://firebase.google.com/docs)
- [Resend Documentation](https://resend.com/docs)
- [Groq API Documentation](https://console.groq.com/docs)
- [Next.js Documentation](https://nextjs.org/docs)

---

**Last Updated:** 2024
**Version:** 1.0.0
