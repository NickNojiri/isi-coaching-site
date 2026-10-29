# ISI Coaching — 30-Day Muscle Kick Start Challenge

The joinisicoaching.com landing page, rebuilt as a plain website (HTML, CSS and JavaScript). There's nothing to install or build, so it can be hosted for free on GitHub Pages instead of GoHighLevel.

**Live preview:** https://nicknojiri.github.io/isi-coaching-site/

## What's in here

| File | What it does |
|---|---|
| `index.html` | All the page text, the sections, and the quiz questions. **Edit words here.** |
| `styles.css` | Colors, fonts, spacing and animations. The brand red is `--red` at the top. |
| `site.js` | Animations, the video play buttons, the sticky phone button. |
| `quiz.js` | The quiz popup and sending answers to GoHighLevel. |
| `assets/img/`, `assets/video/` | Photos and videos. |
| `SETUP-GOHIGHLEVEL.txt` | How to connect the quiz to your GoHighLevel CRM. |

## See it on your computer

Double-click `index.html` to open it in your browser.

## Put it online with GitHub Pages

This repo is already on GitHub with Pages turned on (that's the preview link above). If you make your own copy, here's how.

### Option 1: GitHub Desktop (no typing commands)

1. Install [GitHub Desktop](https://desktop.github.com/) and sign in.
2. **File → Add local repository**, pick this folder.
3. Click **Publish repository**. Untick "Keep this code private" (free GitHub Pages needs a public repo).
4. On github.com open the repo → **Settings → Pages**.
5. Under **Build and deployment**, set Source to **Deploy from a branch**, Branch to **main** and folder to **/ (root)**, then **Save**.
6. Wait a minute or two. The link appears at the top of the Pages screen: `https://YOUR-USERNAME.github.io/REPO-NAME/`

> Uploading through the github.com website ("Add file → Upload files") won't work for everything: `assets/video/founder.mp4` is about 31 MB and the website only takes files up to 25 MB. Use GitHub Desktop or the commands below.

### Option 2: command line

Needs [Git](https://git-scm.com/) and the [GitHub CLI](https://cli.github.com/) (`gh auth login` once). From inside this folder:

```bash
gh repo create isi-coaching-site --public --source . --push
gh api -X POST repos/YOUR-USERNAME/isi-coaching-site/pages -f "source[branch]=main" -f "source[path]=/"
```

## Making changes later

- **Quick text fix on github.com:** open `index.html`, click the pencil icon, edit, then **Commit changes**. The live site updates in a minute or two.
- **From your computer:** edit the files, then in GitHub Desktop write a short summary and click **Commit to main**, then **Push origin**. On the command line:

  ```bash
  git add .
  git commit -m "Update headline"
  git push
  ```

## Moving this repo to your own GitHub account

**Settings → General → Danger Zone → Transfer ownership**, then enter your username. The Pages link changes to `https://YOUR-USERNAME.github.io/isi-coaching-site/`. You might need to turn Pages on again (see step 4 above).

## Using your own domain (joinisicoaching.com)

**Do this last.** Pointing the domain here takes it away from GoHighLevel, so the old GoHighLevel pages stop loading at that address. First:

- [ ] Connect the quiz to GoHighLevel (`SETUP-GOHIGHLEVEL.txt`).
- [ ] Copy the **Terms of Service** and **Privacy Policy** pages into this site (e.g. `terms.html`, `privacy.html`) and update the two footer links in `index.html`. Right now they point at the GoHighLevel pages, which will stop working.
- [ ] In `index.html`, delete the `<meta name="robots" content="noindex">` line so Google can list the site.
- [ ] Check the wording: the page says the challenge includes "coaching online", but the Terms say the 30-day challenge has "No coaching". Make them match.

Then:

1. In the repo: **Settings → Pages → Custom domain**, type `www.joinisicoaching.com`, **Save**.
2. Where the domain's DNS is managed (the company the domain was bought from, or Cloudflare), change only the **website** records:
   - `CNAME` record: name `www`, value `YOUR-USERNAME.github.io`
   - `A` records for the bare domain (`@`): `185.199.108.153`, `185.199.109.153`, `185.199.110.153`, `185.199.111.153`
   - Remove the old `A`/`CNAME` records that point to GoHighLevel.
   - **Don't touch `MX` or `TXT` records.** Those run the email addresses (like natalie@joinisicoaching.com).
3. Wait for DNS to update (minutes to a day). Then tick **Enforce HTTPS** on the Pages screen.

GitHub's guide: <https://docs.github.com/pages/configuring-a-custom-domain-for-your-github-pages-site>
