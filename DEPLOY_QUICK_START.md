# 🚀 Quick Deployment Commands

## Prerequisites Check
✅ Admin name now shows your actual user name from profile
✅ Vite config updated with base path
✅ Package.json has deployment scripts
✅ .gitignore created
✅ .env.production configured

---

## Step-by-Step Commands

### 1️⃣ Install gh-pages package
```powershell
npm install --save-dev gh-pages
```

### 2️⃣ Initialize Git (if not already done)
```powershell
git init
git add .
git commit -m "Initial commit: Break Gaming Pool Club Manager"
```

### 3️⃣ Create GitHub Repository
1. Go to: https://github.com/new
2. Name: `pool-club-manager` (or your choice)
3. Visibility: **Public** (required for free GitHub Pages)
4. Click **Create repository**

### 4️⃣ Connect to GitHub (replace YOUR_USERNAME)
```powershell
git remote add origin https://github.com/YOUR_USERNAME/pool-club-manager.git
git branch -M main
git push -u origin main
```

### 5️⃣ Deploy to GitHub Pages
```powershell
npm run deploy
```

### 6️⃣ Enable GitHub Pages
1. Go to your repo on GitHub
2. Settings → Pages
3. Source: Branch `gh-pages`, Folder `/ (root)`
4. Click Save

### 7️⃣ Access Your App
```
https://YOUR_USERNAME.github.io/pool-club-manager/
```

---

## 🔄 Update Live App (After Making Changes)
```powershell
git add .
git commit -m "Your change description"
git push origin main
npm run deploy
```

---

## ⚠️ IMPORTANT NOTES

1. **Update vite.config.js if repo name is different**:
   ```javascript
   base: '/YOUR-REPO-NAME/', // Must match GitHub repo name!
   ```

2. **First deployment takes 2-5 minutes**
   - Wait for GitHub to build
   - Clear browser cache if needed

3. **Supabase Configuration**:
   - After deployment, add your GitHub Pages URL to Supabase allowed origins
   - Go to: Supabase Dashboard → Settings → API
   - Add: `https://YOUR_USERNAME.github.io`

---

## ✅ What Changed

1. **Admin Name Display**: Now shows actual user name from auth (not hardcoded)
2. **Vite Config**: Added base path for GitHub Pages
3. **Package.json**: Added predeploy and deploy scripts
4. **Environment**: Created .env.production with Supabase keys
5. **Git**: Created .gitignore to protect sensitive files

---

## 🆘 Quick Troubleshooting

**Blank page?** → Check vite.config.js base path matches repo name exactly
**404 error?** → Wait 5 minutes, then clear browser cache
**Not building?** → Run `npm run build` locally first to check for errors
**gh-pages error?** → Run `npm install --save-dev gh-pages` again

---

**Ready to deploy? Start with Step 1! 🚀**

Full detailed guide available in: `GITHUB_PAGES_DEPLOYMENT.md`
