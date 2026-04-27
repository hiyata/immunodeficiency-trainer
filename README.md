# Immunodeficiency Trainer

A procedurally generated patient-case trainer for practicing immunodeficiency syndrome differentials. Built for med students prepping Step 1 / Step 2 immunology.

Each case is randomly assembled from rules — names, ages, lab values, and supporting findings change every time, so you can't memorize specific cases. 13 syndromes covered across B-cell, T-cell, combined B+T, phagocytic, and complement disorders.

## Run it locally

You need [Node.js](https://nodejs.org) (version 18 or newer).

```bash
npm install
npm run dev
```

Then open the URL it prints (usually `http://localhost:5173`).

## Deploy it for your friends to use

### Option A — Vercel (recommended)

1. Push this folder to a new GitHub repo (instructions below).
2. Go to [vercel.com](https://vercel.com) and sign in with GitHub.
3. Click "Add New Project" → import your repo.
4. Vercel auto-detects Vite. Just click "Deploy". Done in ~30 seconds.
5. You get a URL like `immunodeficiency-trainer.vercel.app`. Share it.

Every time you push to GitHub, Vercel redeploys automatically.

### Option B — GitHub Pages

1. Push to GitHub (see below).
2. In `vite.config.js`, add `base: '/immunodeficiency-trainer/'` (replace with your repo name).
3. Run `npm run build` and push the `dist` folder to a `gh-pages` branch — or use the [`gh-pages` npm package](https://www.npmjs.com/package/gh-pages) to automate it.
4. In your repo's Settings → Pages, set the source to the `gh-pages` branch.

Vercel is genuinely easier. Use it unless you have a reason not to.

## Pushing this to GitHub for the first time

```bash
git init
git add .
git commit -m "Initial commit"
```

Then on github.com, create a new empty repo (don't initialize it with a README). Copy the two commands GitHub shows you — they look like:

```bash
git remote add origin https://github.com/YOUR_USERNAME/immunodeficiency-trainer.git
git branch -M main
git push -u origin main
```

That's it. The repo is now on GitHub.

## How the case generator works

Each syndrome is a rules object: required findings (always shown), optional findings (1–3 randomly picked), demographic constraints, and a qualitative lab pattern (`absent` / `low` / `normal` / `high` / `very_high`). The generator picks a syndrome, fills in randomized specifics — including real numeric lab values within the qualitative band — adds 3–5 red-herring details from a pool of non-diagnostic facts, and presents 4 distractor diagnoses (preferring the same category, so wrong answers feel plausible).

To add a new syndrome, append an entry to the `SYNDROMES` array in `src/App.jsx` following the same shape.

## Disclaimer

This is a study tool, not a clinical reference. Don't diagnose patients with it.
