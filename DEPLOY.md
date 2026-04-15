# Deploy (GitHub Pages)

This portfolio is frontend-only (`index.html`, `styles.css`, `script.js`, `assets/`).
Deployment is handled by the GitHub Actions workflow in `.github/workflows/deploy-pages.yml`.

## GitHub Pages deployment
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
python3 -m http.server 8080
```
Open: `http://localhost:8080`
