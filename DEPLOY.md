# Deploy (Static Frontend)

This portfolio is now frontend-only (`index.html`, `styles.css`, `script.js`, `assets/`).

## Option A: Netlify (fastest)
1. Go to https://app.netlify.com/drop
2. Drag the project folder into the page
3. Netlify will deploy immediately and give you a URL

## Option B: Vercel
1. Go to https://vercel.com/new
2. Import/select this project
3. Framework preset: **Other**
4. Build command: leave empty
5. Output directory: leave empty (root)
6. Deploy

## Option C: GitHub Pages (recommended for this repo)
1. Create a new empty GitHub repository.
2. Initialize and push this folder:
   ```bash
   git init
   git add .
   git commit -m "Initial portfolio site"
   git branch -M main
   git remote add origin https://github.com/<your-username>/<your-repo>.git
   git push -u origin main
   ```
3. In GitHub repo settings, open **Pages**.
4. Under **Build and deployment**, set **Source** to **GitHub Actions**.
5. The included workflow `.github/workflows/deploy-pages.yml` will auto-deploy on every push to `main`.
6. Your site will be available at:
   - `https://<your-username>.github.io/<your-repo>/`

## Local preview
```bash
npm run dev
```
Open: `http://localhost:8000`
