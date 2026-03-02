# Golf Meow

Last-minute tee time deals in the Coachella Valley (La Quinta, Indian Wells, Palm Desert, Rancho Mirage). No booking fees. Ever.

## Setup

1. **Install Node.js** — [nodejs.org](https://nodejs.org) (LTS)

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Supabase**
   - Create a project at [supabase.com](https://supabase.com)
   - Run `supabase/schema.sql` in the SQL Editor
   - Copy your project URL and anon key from Settings → API

4. **Environment**
   - Copy `.env.example` to `.env.local`
   - Add your Supabase URL and anon key
   - For emails: add `RESEND_API_KEY` from [resend.com](https://resend.com)
   - For cron: add `CRON_SECRET` (any random string)

5. **Run**
   ```bash
   npm run dev
   ```
   Open [localhost:3000](http://localhost:3000)

## Deploy (Vercel)

1. Push to GitHub and import in Vercel
2. Add env vars: `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`, `RESEND_API_KEY`, `CRON_SECRET`
3. Vercel Cron runs the alert job daily at 7am UTC

## Resend sender domain

To send from `alerts@golfmeow.com`, verify your domain in Resend. For testing, use their sandbox domain or your verified domain.
