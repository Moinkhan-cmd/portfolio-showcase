# EmailJS Setup Guide

This guide will help you set up EmailJS to receive contact form submissions via email.

## Step 1: Create an EmailJS Account

1. Go to [https://www.emailjs.com/](https://www.emailjs.com/)
2. Sign up for a free account (free tier allows 200 emails/month)

## Step 2: Add an Email Service

1. In the EmailJS dashboard, go to **Email Services**
2. Click **Add New Service**
3. Choose your email provider (Gmail, Outlook, etc.)
4. Follow the setup instructions for your provider
5. Note down your **Service ID** (e.g., `service_xxxxx`)

## Step 3: Create an Email Template

1. Go to **Email Templates** in the dashboard
2. Click **Create New Template**
3. Use the following template variables:
   - `{{from_name}}` - Sender's name
   - `{{from_email}}` - Sender's email
   - `{{message}}` - Message content
   - `{{reply_to}}` - Reply-to email (same as from_email)

4. Example template:
   ```
   Subject: New Contact Form Submission from {{from_name}}
   
   You have received a new message from your portfolio website.
   
   Name: {{from_name}}
   Email: {{from_email}}
   Reply To: {{reply_to}}
   
   Message:
   {{message}}
   ```

5. Note down your **Template ID** (e.g., `template_xxxxx`)

## Step 4: Get Your Public Key

1. Go to **Account** > **General** in the EmailJS dashboard
2. Find your **Public Key** (also called API Key)
3. Copy the key (e.g., `xxxxxxxxxxxxxxxxxxxxx`)

## Step 5: Configure Environment Variables

1. Create a `.env` file in the root of your project (if it doesn't exist)
2. Add the following variables:

```env
VITE_EMAILJS_SERVICE_ID=your_service_id_here
VITE_EMAILJS_TEMPLATE_ID=your_template_id_here
VITE_EMAILJS_PUBLIC_KEY=your_public_key_here
```

3. Replace the placeholder values with your actual IDs and keys from EmailJS

## Step 6: Test the Contact Form

1. Restart your development server if it's running:
   ```bash
   npm run dev
   ```

2. Fill out the contact form on your website
3. Submit the form
4. Check your email inbox (moinbhatti59@gmail.com) for the message

## Important Notes

- The free tier of EmailJS allows 200 emails per month
- Make sure your `.env` file is in `.gitignore` to keep your keys secure
- Never commit your `.env` file to version control
- For production, set these environment variables in your hosting platform (Netlify, Vercel, etc.)

## Troubleshooting

- **"Email service not configured" error**: Make sure all three environment variables are set in your `.env` file
- **Emails not received**: Check your spam folder and verify your EmailJS service is properly connected
- **Rate limit errors**: You've exceeded the free tier limit (200 emails/month)

## Production Deployment

When deploying to production (Netlify, Vercel, etc.):

1. Go to your hosting platform's environment variables settings
2. Add the three EmailJS variables:
   - `VITE_EMAILJS_SERVICE_ID`
   - `VITE_EMAILJS_TEMPLATE_ID`
   - `VITE_EMAILJS_PUBLIC_KEY`
3. Redeploy your application



