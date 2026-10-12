# GlobalPath Careers — starter project

This is a learning starter for a real front-end + backend. It does not charge applicants and does not implement M-PESA payments. Listings in the page are examples, not verified vacancies.

## What it does
- Serves the website from `public/index.html`.
- Validates application fields on the server.
- Saves submissions in Supabase Postgres.
- Adds basic security headers and a submission rate limit.
- Keeps database secrets on the server.

## Step 1 — Create a Supabase database
1. Open https://supabase.com/ in your phone browser and create a project.
2. Open the project's SQL Editor.
3. Copy and run `supabase-schema.sql`.
4. Open Project Settings / API (or Connect, depending on the current dashboard) and copy the project URL and the server-side `service_role` secret. Never share this secret or put it in HTML.

## Step 2 — Configure environment variables
Copy `.env.example` to `.env`, then fill in:
- `SUPABASE_URL`
- `SUPABASE_SERVICE_ROLE_KEY`

Do not upload `.env` to GitHub. The `.env` file is ignored by convention; make sure it is not committed.

## Step 3 — Run the server
Requires Node.js 20 or newer:
```bash
npm install
npm start
```
Open `http://localhost:3000`. If testing on Android, localhost is the same phone running the server. The database must be configured or the API returns a setup error.

## Step 4 — Deploy
Use a Node.js host that supports environment variables and HTTPS (for example Render):
- Create a private GitHub repository and upload this project, excluding `.env`.
- Create a Web Service from the repository.
- Build command: `npm install`
- Start command: `npm start`
- Add `SUPABASE_URL` and `SUPABASE_SERVICE_ROLE_KEY` in the host's environment settings.
- Use the HTTPS address provided by the host.

## Step 5 — Before real applicants use it
- Add a privacy notice, retention/deletion process, admin authentication and access controls.
- Verify real vacancies and employer permission to advertise them.
- Confirm licensing and fees with Kenya's National Employment Authority and get destination-country guidance. Do not turn on mandatory job-seeker fees until you have written confirmation the exact fee is lawful and approved where required.
- Add CAPTCHA/bot protection and monitoring before public launch.
- Never collect ID/passport scans until necessary and protected. Never ask for an M-PESA PIN or OTP.

## M-PESA / Daraja
Official portal: https://developer.safaricom.co.ke/
Daraja offers sandbox testing. Production requires approved business setup, credentials, HTTPS callback URLs and server-side verification of the final payment result. Do not mark an application as paid just because the browser says it was paid; verify the callback/transaction with the backend. Do not add a fee unless the legal and licensing checks above are complete.
