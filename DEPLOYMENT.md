# Deploying kackkerdivyansh.in

**GitHub → Cloudflare Workers.** Every push to `main` builds and deploys automatically. The domain is registered at GoDaddy, with DNS on Cloudflare.

> Dashboard labels change from time to time. If a label below doesn't match exactly, look for the closest equivalent.

## Cloudflare project settings

**Workers & Pages → mywebsite → Settings → Build**

| Setting | Value |
| --- | --- |
| Git repository | `Divyanshkackker15/MyWebSite`, production branch `main` |
| Build command | `npm run build` |
| Deploy command | `npx wrangler deploy` |
| Root directory | `/` |

Node 22 is picked up from `.node-version`. The project name and static-file settings come from `wrangler.jsonc`.

## Contact form secret (once)

1. Create a free account at **resend.com** with `kackkerdivyansh1115@gmail.com`.
2. **API Keys → Create API key**, permission **Sending access**, then copy it.
3. In Cloudflare: **Workers & Pages → mywebsite → Settings → Variables and Secrets → Add**.
   Type **Secret**, name `RESEND_API_KEY`, then paste the key and save.
4. Open the site, send yourself a message, and check your inbox (and spam the first time).

Until the domain is verified in Resend, messages come from `onboarding@resend.dev`. This test sender can only deliver to the email that owns the Resend account, which is exactly what the form needs.

**Optional, later:** in Resend, **Domains → Add domain → kackkerdivyansh.in**, and add the DNS records it lists in Cloudflare DNS. Then change `CONTACT_FROM` in `wrangler.jsonc` to `Divyansh Kackker <hello@kackkerdivyansh.in>`.

Never put the key in code, `wrangler.jsonc` or a commit. For local testing it goes in `.dev.vars`, which is git-ignored.

## Domain

1. In GoDaddy, set the nameservers for `kackkerdivyansh.in` to the two Cloudflare ones shown on the domain's Cloudflare page (`dahlia.ns.cloudflare.com`, `theo.ns.cloudflare.com`). Wait until Cloudflare shows **Active**.
2. **Workers & Pages → mywebsite → Domains → Add domain**: add `kackkerdivyansh.in` and `www.kackkerdivyansh.in`.
3. **Redirect `www` to the bare domain:** go to **your domain → Rules → Redirect Rules → Create rule** (the "Redirect from WWW to root" template).
4. **HTTPS:** go to **SSL/TLS → Edge Certificates** and turn on **Always Use HTTPS**.

## Changing the site

Work on a branch, push it, and open a pull request. Cloudflare builds a preview URL for the branch. Merge to `main` to publish; it's live in about two minutes.

To check a production build locally:

```bash
npm run build && npm run preview
```

## Checklist after a deploy

- [ ] `https://kackkerdivyansh.in` loads with a padlock; `www` and `http` redirect to it.
- [ ] `/blog/monolith-to-microservices` opens directly, and a wrong URL shows the 404 page.
- [ ] `/sitemap.xml` and `/robots.txt` load.
- [ ] The contact form delivers a message to your inbox.
- [ ] A post URL in the **LinkedIn Post Inspector** shows the right title and image.
