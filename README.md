# Malek Norouzi: personal site

A static site for GitHub Pages. Live at https://maleknorouzi.com. Persian is the main language (`/`), with an English version (`/en/`).
No build step, no frameworks, and no outside fonts or scripts: everything loads from this repo, so the
site does not depend on Google or other CDNs that can be slow or blocked for visitors in Iran.

```
index.html                 Persian home
eshghnameh/index.html      Persian book page (request form + gift)
eshghnameh/sample.pdf      Public sample: cover + first 12 pages
en/index.html              English home
en/eshghnameh/index.html   English book page
assets/js/config.js        <- all account settings live here
assets/css/site.css        styles
assets/img/                cover, photos, social image, icon
assets/fonts/              Vazirmatn (SIL Open Font License, see OFL.txt)
404.html
```

The full PDF and EPUB are deliberately **not** in this repo. Anything in a GitHub Pages repo can be
downloaded by anyone, so the files are sent by email instead.

## Hosting

- Repo: `github.com/nargesnorouzi/maleknorouzi.com` (public; GitHub Pages needs a public repo on a free plan)
- Pages: Settings > Pages > Deploy from branch `main`, folder `/ (root)`
- Custom domain: `maleknorouzi.com` (Settings > Pages > Custom domain, with "Enforce HTTPS" on).
  The `CNAME` file in the repo holds the domain; don't delete it.

DNS records at the registrar (DNS only, no proxy):

| Type  | Name | Value |
|-------|------|-------|
| A     | @    | 185.199.108.153 |
| A     | @    | 185.199.109.153 |
| A     | @    | 185.199.110.153 |
| A     | @    | 185.199.111.153 |
| AAAA  | @    | 2606:50c0:8000::153 |
| AAAA  | @    | 2606:50c0:8001::153 |
| AAAA  | @    | 2606:50c0:8002::153 |
| AAAA  | @    | 2606:50c0:8003::153 |
| CNAME | www  | nargesnorouzi.github.io |

## Book requests

The form posts to FormSubmit (free, no account), set in `assets/js/config.js` as `formEndpoint`.
The first request sends a one-time activation email to the address in the URL; click it once.
Requests then arrive by email with the person's name, email, format (PDF, EPUB or both),
where they live (optional) and any message. Reply with the files from the book kit
(`reply-templates.md` has ready text). The plain email address is always shown under the form
as a fallback, in case the form service is not reachable from Iran without a VPN.

## Gifts

PayPal.me and Venmo are set in `assets/js/config.js` (Zelle is supported but left empty). Empty values are hidden.
The gift text is addressed to readers outside Iran and says a gift is optional.
Don't put phone numbers in this repo: it is public, and old commits stay visible.

## Store links

`paperbackUrl` and `ebookUrl` search Amazon by ISBN. Replace them with exact product pages
when available.

## Adding more work

- **Audio:** put the `.mp3` in `assets/audio/` and copy the commented audio block in the
  Works section of `index.html` and `en/index.html`. GitHub rejects files over 100 MB.
- **Another book:** copy `eshghnameh/` and `en/eshghnameh/` to a new folder name, edit the text,
  and add a card for it in the Works section of both home pages.
- **Bio and headshot:** in the profile section at the top of both home pages;
  the photo is `assets/img/headshot.jpg` (square).
