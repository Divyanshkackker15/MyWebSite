# Deploying kackkerdivyansh.in

The site is static files in `dist/`. Setup: **GitHub → Cloudflare Pages**, with the domain registered at GoDaddy and **DNS moved to Cloudflare** (free).

> Dashboard button names change from time to time. If a label below doesn't match exactly, look for the closest equivalent.

## Why Cloudflare

- Free plan with unlimited bandwidth, automatic HTTPS and a CDN with edge locations in India (Mumbai, Delhi, Chennai and more).
- Serves `dist/blog/foo.html` at `/blog/foo` and uses `dist/404.html` for unknown URLs, which is exactly how `npm run build` lays out the files.
- Reads `public/_headers` for caching and security headers.
- Free, cookie-less Web Analytics when you want it.

---

## Step 1: push the code to GitHub

1. Create an **empty** repository on github.com, for example `MyWebSite`. Don't add a README; the project has one.
2. In the project folder:

```bash
git init
```

```bash
git add .
```

```bash
git commit -m "Portfolio v1"
```

```bash
git branch -M main
```

```bash
git remote add origin https://github.com/Divyanshkackker15/MyWebSite.git
```

```bash
git push -u origin main
```

`.gitignore` already excludes `node_modules`, `dist` and `.env`.

## Step 2: create the Cloudflare Pages project

1. Sign up or log in at dash.cloudflare.com.
2. **Workers & Pages → Create → Pages → Connect to Git** → authorise GitHub → choose `MyWebSite`.
3. Build settings:

| Setting | Value |
| --- | --- |
| Framework preset | None (or Vite) |
| Build command | `npm run build` |
| Build output directory | `dist` |
| Root directory | *(leave empty)* |

4. **Environment variables** (Production *and* Preview):

| Name | Value |
| --- | --- |
| `NODE_VERSION` | `22` |
| `VITE_FORMSPREE_ID` | your Formspree form id (the part after `/f/`) |

5. **Save and Deploy.** After 1–3 minutes you get a URL like `https://kackker-portfolio.pages.dev`. Open it and check that the home page, `/blog` and a post load.

From now on, every `git push` to `main` deploys automatically, and pull requests get preview URLs.

<details>
<summary><b>Option B: if your dashboard only offers "Workers" (static assets)</b></summary>

Cloudflare also hosts static sites as Workers. The repo includes `wrangler.jsonc` for this.

1. **Workers & Pages → Create → Import a repository** → choose the repo.
2. Build command: `npm run build`. Deploy command: `npx wrangler deploy`.
3. Add the same environment variables (`NODE_VERSION`, `VITE_FORMSPREE_ID`) as **build** variables.
4. Custom domains are under the Worker's **Settings → Domains & Routes**. The DNS steps below are the same.

</details>

## Step 3: move DNS from GoDaddy to Cloudflare

The domain **stays registered (and renewed) at GoDaddy**. You only change *who answers DNS questions* for it.

1. In Cloudflare: **Add a domain** (also called "Add site") → enter `kackkerdivyansh.in` → choose the **Free** plan.
2. Cloudflare scans existing records. Since nothing is set up yet, the list may be empty; that's fine. Delete any GoDaddy "parked" A records it imports (they point to GoDaddy's parking page).
3. Cloudflare shows **two nameservers**, for example `ada.ns.cloudflare.com` and `bob.ns.cloudflare.com`. Yours will differ, so copy them.
4. In GoDaddy: **My Products → Domains → kackkerdivyansh.in → DNS → Nameservers → Change nameservers → "I'll use my own nameservers"** → paste both Cloudflare nameservers → **Save** and confirm.
5. Back in Cloudflare, click **Check nameservers**. It usually becomes **Active** within an hour (it can take up to 24–48 hours). Cloudflare emails you when it's done.

## Step 4: connect the domain to the site

1. **Workers & Pages → kackker-portfolio → Custom domains → Set up a custom domain** → enter `kackkerdivyansh.in` → **Activate**. Because DNS is on Cloudflare, it creates the DNS record for you.
2. Repeat for `www.kackkerdivyansh.in`.
3. Make one address the main one, and redirect `www` to the bare domain (the site's canonical URLs use `https://kackkerdivyansh.in`):
   **your domain → Rules → Redirect Rules → Create rule** (there is a "Redirect from WWW to root" template):
   - When: Hostname equals `www.kackkerdivyansh.in`
   - Then: Dynamic redirect to `concat("https://kackkerdivyansh.in", http.request.uri.path)`, status **301**, preserve query string ✔
4. **SSL/TLS → Overview**: mode **Full**. Under **Edge Certificates**, turn on **Always Use HTTPS**.

## Step 5: verify

- [ ] `https://kackkerdivyansh.in` loads with a padlock (certificates can take a few minutes after activation).
- [ ] `http://kackkerdivyansh.in` and `https://www.kackkerdivyansh.in` both redirect to `https://kackkerdivyansh.in`.
- [ ] `https://kackkerdivyansh.in/blog/monolith-to-microservices` opens directly (refresh works).
- [ ] `https://kackkerdivyansh.in/anything-wrong` shows the custom 404 page.
- [ ] `https://kackkerdivyansh.in/sitemap.xml` and `/robots.txt` load.
- [ ] Paste a post URL into the **LinkedIn Post Inspector** (linkedin.com/post-inspector) and check the title, description and image preview. Use it again after updates to refresh LinkedIn's cache.
- [ ] Send yourself a message through the contact form. Formspree asks you to confirm the first submission by email.
- [ ] Submit the sitemap in **Google Search Console** (add a *Domain* property; verification is a TXT record, which you add in Cloudflare DNS).

## Updating the site later

Edit files → `git commit` → `git push`. Cloudflare rebuilds and deploys in about two minutes. To check a change locally first:

```bash
npm run build && npm run preview
```

