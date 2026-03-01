# 🚀 Deploy Break Gaming to GitHub Pages

## Complete Step-by-Step Guide

### Prerequisites
✅ Git installed on your computer
✅ GitHub account created
✅ App working locally

---

## Step 1: Update Vite Configuration

First, we need to configure Vite for GitHub Pages deployment.

**Update `vite.config.js`:**

```javascript
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

export default defineConfig({
  plugins: [react()],
  base: '/pool-club-manager/', // Change this to your repo name
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
})
```

⚠️ **IMPORTANT**: Replace `/pool-club-manager/` with your actual GitHub repository name!

---

## Step 2: Create `.gitignore` File

Create a file named `.gitignore` in your project root with this content:

```
# Dependencies
node_modules/

# Build output
dist/

# Environment variables
.env
.env.local
.env.production

# Logs
*.log

# OS files
.DS_Store
Thumbs.db

# IDE
.vscode/
.idea/
```

⚠️ **CRITICAL**: Your `.env.local` file with Supabase keys will NOT be uploaded (it's in .gitignore)

---

## Step 3: Update Environment Variables for Production

Since `.env.local` won't be in GitHub, we need to use GitHub Secrets.

**For now, create a `.env.production` file:**

```env
VITE_SUPABASE_URL=https://zvxvjztilxoqmadhukwc.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inp2eHZqenRpbHhvcW1hZGh1a3djIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzIzMjkzMzMsImV4cCI6MjA4NzkwNTMzM30.ZFIQt7_2kC7vSg9Vnt9LKmc_tLs54t_KOlGQqSzWwpU
```

⚠️ **Note**: Anon key is safe to expose publicly (it's designed for client-side use)

---

## Step 4: Initialize Git Repository

Open PowerShell in your project folder and run:

```powershell
# Initialize git repository
git init

# Add all files
git add .

# Create first commit
git commit -m "Initial commit: Break Gaming Pool Club Manager"
```

---

## Step 5: Create GitHub Repository

1. Go to **https://github.com/new**
2. Repository name: `pool-club-manager` (or your choice)
3. Description: `Break Gaming - Pool Club Management System`
4. Visibility: 
   - ✅ **Public** (required for free GitHub Pages)
   - Or **Private** (requires GitHub Pro for Pages)
5. ❌ **DO NOT** initialize with README, .gitignore, or license
6. Click **"Create repository"**

---

## Step 6: Link Local Repository to GitHub

Copy the commands from GitHub (or use these, replacing YOUR_USERNAME):

```powershell
# Add remote repository
git remote add origin https://github.com/YOUR_USERNAME/pool-club-manager.git

# Rename branch to main
git branch -M main

# Push to GitHub
git push -u origin main
```

**Replace `YOUR_USERNAME`** with your actual GitHub username!

---

## Step 7: Install and Configure GitHub Pages Deployment

```powershell
# Install gh-pages package
npm install --save-dev gh-pages

# Add deployment scripts to package.json
```

**Update your `package.json`** - add these scripts:

```json
{
  "scripts": {
    "dev": "vite",
    "build": "vite build",
    "preview": "vite preview",
    "predeploy": "npm run build",
    "deploy": "gh-pages -d dist"
  }
}
```

---

## Step 8: Deploy to GitHub Pages

```powershell
# Build and deploy in one command
npm run deploy
```

This will:
1. Build your production app (`npm run build`)
2. Create a `gh-pages` branch
3. Push the `dist` folder to that branch

---

## Step 9: Enable GitHub Pages

1. Go to your repository on GitHub
2. Click **Settings** (top menu)
3. Click **Pages** (left sidebar)
4. Under "Source":
   - Branch: Select `gh-pages`
   - Folder: Select `/ (root)`
5. Click **Save**

GitHub will show a message: "Your site is ready to be published at..."

⏱️ Wait 2-5 minutes for deployment to complete

---

## Step 10: Access Your Live App

Your app will be available at:

```
https://YOUR_USERNAME.github.io/pool-club-manager/
```

**Example**: If username is `saddem123`, the URL would be:
```
https://saddem123.github.io/pool-club-manager/
```

---

## 🔄 Updating Your Live App

Whenever you make changes:

```powershell
# 1. Save and commit changes
git add .
git commit -m "Description of changes"

# 2. Push to GitHub
git push origin main

# 3. Deploy to GitHub Pages
npm run deploy
```

---

## 🐛 Troubleshooting

### Issue: Blank page after deployment
**Solution**: Check `vite.config.js` - make sure `base` matches your repo name exactly

### Issue: Images not showing
**Solution**: Change image paths from `/src/images/...` to `./src/images/...` or use imports

### Issue: 404 on refresh
**Solution**: Add a `public/404.html` that redirects to `index.html` (SPA routing)

### Issue: Environment variables not working
**Solution**: Verify `.env.production` exists and variables start with `VITE_`

### Issue: "gh-pages not found"
**Solution**: Run `npm install` again to install gh-pages

---

## 🔒 Security Notes

### Safe to Publish:
- ✅ Supabase Anon Key (designed for public use)
- ✅ Supabase URL
- ✅ Frontend code

### NEVER Publish:
- ❌ Service Role Key (keep server-side only)
- ❌ Database passwords
- ❌ Admin passwords (stored in Supabase, not in code)

---

## 📱 Custom Domain (Optional)

To use your own domain (e.g., `breakgaming.com`):

1. Buy a domain from a registrar (Namecheap, GoDaddy, etc.)
2. Add a `CNAME` file to `public/` folder with your domain:
   ```
   breakgaming.com
   ```
3. In your domain registrar, add DNS records:
   ```
   Type: CNAME
   Name: www
   Value: YOUR_USERNAME.github.io
   ```
4. In GitHub Settings → Pages, add custom domain
5. Enable "Enforce HTTPS"

---

## 🎯 Quick Reference Commands

```powershell
# Daily workflow
git add .
git commit -m "Your changes"
git push origin main
npm run deploy

# Check deployment status
git status

# View remote repository
git remote -v

# See deployment URL
# Go to: Settings → Pages in GitHub
```

---

## ✨ Next Steps After Deployment

1. **Test the live site** - verify all features work
2. **Update Supabase allowed origins**:
   - Go to Supabase Dashboard
   - Settings → API
   - Add your GitHub Pages URL to allowed origins
3. **Share the link** with users
4. **Monitor usage** in Supabase dashboard
5. **Set up analytics** (optional - Google Analytics, Plausible, etc.)

---

## 📞 Need Help?

- GitHub Pages not showing? Wait 5 minutes and clear browser cache
- Build errors? Run `npm run build` locally first to test
- Routing issues? Check that you're using React Router's `HashRouter` or proper base configuration

**Your app will be live at**: `https://YOUR_USERNAME.github.io/pool-club-manager/`

🎉 **Congratulations! Your app is now deployed!**
