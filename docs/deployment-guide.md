# Deployment Guide: Digital Ocean App Platform

**Target Platform**: Digital Ocean App Platform (Static Site)
**App Type**: Single Page Application (SPA) - Pure Frontend
**Last Updated**: 2025-11-11

---

## Table of Contents

1. [Why This is a Static Site](#why-this-is-a-static-site)
2. [Prerequisites](#prerequisites)
3. [Method 1: Automated Deployment (Recommended)](#method-1-automated-deployment-recommended)
4. [Method 2: Manual UI Configuration](#method-2-manual-ui-configuration)
5. [Post-Deployment Verification](#post-deployment-verification)
6. [Troubleshooting](#troubleshooting)
7. [Custom Domain Setup](#custom-domain-setup)
8. [Environment Variables](#environment-variables)

---

## Why This is a Static Site

DC20 Level 0 is a **pure frontend application** with no server-side code:

✅ **What makes it static:**
- React SPA built with Vite
- All logic runs in the browser
- State management via Zustand + localStorage (no backend API)
- Builds to static HTML, CSS, and JavaScript files
- No Node.js runtime required after build

❌ **What it doesn't need:**
- No Express/Node.js server
- No database connections
- No server-side rendering (SSR)
- No API endpoints

**Result**: Can be deployed as a **Static Site** on Digital Ocean's CDN for maximum performance and minimum cost.

---

## Prerequisites

Before deploying, ensure you have:

1. **GitHub Account** with repository access
2. **Digital Ocean Account** ([sign up](https://cloud.digitalocean.com/registrations/new))
3. **Repository Pushed to GitHub**:
   ```bash
   git remote -v  # Verify remote is set
   git push origin main
   ```
4. **Updated Configuration** (see Method 1 below)

---

## Method 1: Automated Deployment (Recommended)

This method uses the `.do/app.yaml` configuration file for automatic setup.

### Step 1: Update Configuration File

Edit `.do/app.yaml` and replace the placeholder:

```yaml
github:
  branch: main
  deploy_on_push: true
  repo: YOUR_GITHUB_USERNAME/dc20-level-0  # ← CHANGE THIS
```

**Example**: If your GitHub username is `brownj4`, change to:
```yaml
  repo: brownj4/dc20-level-0
```

### Step 2: Commit and Push Configuration

```bash
git add .do/app.yaml
git commit -m "Add Digital Ocean deployment configuration"
git push origin main
```

### Step 3: Create App on Digital Ocean

1. Go to [Digital Ocean App Platform](https://cloud.digitalocean.com/apps)
2. Click **"Create App"**
3. **Source**: Select **GitHub**
4. **Authorize**: Grant Digital Ocean access to your repository
5. **Repository**: Select `dc20-level-0`
6. **Branch**: Select `main`
7. Click **"Next"**

### Step 4: Verify Auto-Detection

Digital Ocean should automatically detect:
- **Component Type**: Static Site
- **Build Command**: `npm run build`
- **Output Directory**: `dist`
- **Catchall Document**: `index.html`

If these are detected, click **"Next"** → **"Next"** → **"Create Resources"**

### Step 5: Wait for Deployment

- First build takes ~3-5 minutes
- Watch the build logs for any errors
- Once complete, you'll see a live URL (e.g., `dc20-level-0-xxxxx.ondigitalocean.app`)

---

## Method 2: Manual UI Configuration

If you prefer not to use the config file, configure manually through the UI.

### Step 1: Create App

1. Go to [Digital Ocean App Platform](https://cloud.digitalocean.com/apps)
2. Click **"Create App"**
3. **Source**: Select **GitHub**
4. **Authorize**: Grant access to your repository
5. **Repository**: Select `dc20-level-0`
6. **Branch**: Select `main`
7. Click **"Next"**

### Step 2: Configure Component Type

**CRITICAL**: Digital Ocean may auto-detect as "Web Service" (wrong!)

1. In the component configuration screen, find the **Type** dropdown
2. **Change from "Web Service" to "Static Site"**
3. Click **"Edit Plan"** if needed and select the **"Free" tier** (static sites are free!)

### Step 3: Configure Build Settings

Under **Build Settings**:
- **Build Command**: `npm run build`
- **Output Directory**: `dist`

### Step 4: Configure React Router Support

This is **critical** for client-side routing to work:

1. Click **"Environment Variables"** tab (or skip for now)
2. Click **"Next"** until you reach the app creation summary
3. Click **"Create Resources"** and wait for first deployment
4. After deployment completes, go to **App Settings**:
   - Navigate to: **Settings** → **Components** → `dc20-character-creator`
   - Scroll to **"Custom Page"** section
   - Click **"Edit"**
   - Select **"Catchall"** from dropdown
   - Enter: `index.html`
   - Click **"Save"**
5. The app will automatically redeploy with the catchall configuration

### Step 5: Deploy

Click **"Create Resources"** and wait for build to complete (~3-5 minutes).

---

## Post-Deployment Verification

### Test Core Functionality

Once deployed, verify the following:

#### 1. Home Page Loads
- Visit your app URL
- Should see the DC20 Level 0 landing page
- LocalStorage modal should appear if no existing character

#### 2. Navigation Works
- Click through: Home → Choose Mode → Choose Ancestry → etc.
- All routes should work

#### 3. Direct URL Access (Most Important!)
Test React Router by directly visiting these URLs:
- `https://your-app.ondigitalocean.app/create/novice/ancestry`
- `https://your-app.ondigitalocean.app/create/pre-adventurer/skills`
- `https://your-app.ondigitalocean.app/character/sheet`

**Expected**: All should load successfully (not 404)
**If 404**: The `catchall_document` is not configured correctly (see troubleshooting)

#### 4. State Persistence
- Create a character partially
- Close browser tab
- Reopen URL
- Should see "Existing Character Found" modal
- Verify localStorage is working

#### 5. Build Size
Check the build output in deployment logs:
- `index.html`: ~0.5 KB
- `assets/*.css`: ~40 KB (gzipped: ~8 KB)
- `assets/*.js`: ~286 KB (gzipped: ~86 KB)

**Total**: ~90-95 KB gzipped (excellent for a React SPA!)

---

## Troubleshooting

### Problem: Digital Ocean Detects as "Web Service" Not "Static Site"

**Symptoms**:
- Deployment attempts to run Node.js server
- Gets billed for runtime (not free)
- Sees "Starting service..." in logs

**Solution**:
1. Go to App Settings → Components
2. Click on your component name
3. Change **Type** dropdown to **"Static Site"**
4. Update **Output Directory** to `dist`
5. Save and redeploy

### Problem: 404 Errors on Page Refresh

**Symptoms**:
- Home page loads fine
- Navigation works
- Refreshing any non-home route (e.g., `/create/novice/ancestry`) returns 404

**Cause**: `catchall_document` not configured

**Solution**:

**Via UI:**
1. App Settings → Components → [Component Name]
2. Scroll to **"Custom Page"**
3. Click **"Edit"**
4. Select **"Catchall"** (not "Error Document")
5. Enter: `index.html`
6. Save (triggers redeploy)

**Via Config File:**
Add to `.do/app.yaml`:
```yaml
catchall_document: index.html
```

### Problem: Build Fails with "vite: not found"

**Symptoms**:
- Build logs show: `sh: vite: not found`
- Deployment fails at build step

**Cause**: Vite may be in `devDependencies` only

**Solution**:
Check `package.json`. Vite should be in `devDependencies` (this is correct):
```json
"devDependencies": {
  "vite": "^6.0.7"
}
```

If build still fails:
1. Clear build cache: App Settings → Settings → "Clear Build Cache"
2. Trigger manual redeploy
3. If still failing, move `vite` to `dependencies` (not ideal but works)

### Problem: Build Succeeds but App Shows Blank Page

**Symptoms**:
- Build completes successfully
- Visiting URL shows blank white page
- Browser console shows errors

**Common Causes**:

1. **Wrong base path**: Check `vite.config.ts` has no `base` property (or `base: '/'`)
2. **Asset path issues**: Ensure Vite's default asset handling is used
3. **JavaScript errors**: Check browser console for errors

**Solution**:
1. Verify `vite.config.ts`:
   ```typescript
   export default defineConfig({
     plugins: [react()],
     // No base property, or base: '/'
   })
   ```
2. Check browser console for specific errors
3. Review build logs for warnings

### Problem: Assets/Images Not Loading

**Symptoms**:
- App loads but images/textures missing
- Console shows 404 for `/texture/...` or `/ancestry/...`

**Cause**: Assets in `public/` folder use absolute paths

**Verification**:
Assets in `public/` should be referenced as:
```javascript
// Correct (Vite serves from public/ root in production)
imageUrl: "/texture/parchment.png"

// Incorrect
imageUrl: "./texture/parchment.png"
imageUrl: "texture/parchment.png"
```

**Solution**: Ensure all asset paths in JSON data files start with `/`

---

## Custom Domain Setup

To use your own domain (e.g., `dc20.yourdomain.com`):

### Step 1: Add Domain in Digital Ocean

1. Go to App Settings → **Domains**
2. Click **"Add Domain"**
3. Enter your domain: `dc20.yourdomain.com`
4. Select domain type: **"You manage your domain"**
5. Digital Ocean provides DNS records

### Step 2: Configure DNS

In your domain registrar's DNS settings, add:

**CNAME Record:**
- **Host**: `dc20` (or your subdomain)
- **Value**: `your-app.ondigitalocean.app.` (note the trailing dot)
- **TTL**: 3600

### Step 3: Verify

- DNS propagation takes 5-60 minutes
- Once propagated, Digital Ocean auto-provisions SSL certificate
- Your app will be accessible at `https://dc20.yourdomain.com`

### Optional: Root Domain

For root domain (`yourdomain.com` without subdomain):

1. Use Digital Ocean Nameservers (recommended)
2. Or use ALIAS/ANAME record (if your DNS provider supports it)

---

## Environment Variables

Currently, this app doesn't use environment variables (all configuration is in code/JSON).

### If You Need Build-Time Variables:

Add to `.do/app.yaml`:
```yaml
static_sites:
  - name: dc20-character-creator
    envs:
      - key: VITE_API_URL
        value: https://api.example.com
        scope: BUILD_TIME
```

**Important**: Only `BUILD_TIME` scope works for static sites (variables injected during build)

Access in code:
```typescript
const apiUrl = import.meta.env.VITE_API_URL;
```

---

## Deployment Costs

**Static Sites on Digital Ocean App Platform**:
- **Free tier**: 3 static sites
- **Bandwidth**: 100 GB/month included
- **Builds**: Unlimited builds (no charge for build time)
- **Custom domains**: Included (with free SSL)

**Cost for this app**: **$0/month** (unless you exceed 100GB bandwidth or 3 sites)

---

## Continuous Deployment

With `deploy_on_push: true` in `.do/app.yaml`:

1. Push commits to `main` branch
2. Digital Ocean automatically detects changes
3. Builds and deploys new version (~2-5 minutes)
4. Zero downtime (new version swapped in atomically)

**Watch Deployments**: App Platform → Activity → View Build Logs

---

## Summary: Quick Start Checklist

- [ ] Update `.do/app.yaml` with your GitHub username/repo
- [ ] Commit and push configuration
- [ ] Create app on Digital Ocean App Platform
- [ ] Select GitHub repository
- [ ] Verify detected as "Static Site" (not "Web Service")
- [ ] Deploy and wait for build (~3-5 minutes)
- [ ] Test direct URL access to routes (verify no 404s)
- [ ] Verify `catchall_document: index.html` is configured
- [ ] Test character creation and localStorage persistence

---

## Additional Resources

- [Digital Ocean App Platform Docs](https://docs.digitalocean.com/products/app-platform/)
- [Static Sites Documentation](https://docs.digitalocean.com/products/app-platform/how-to/manage-static-sites/)
- [App Spec Reference](https://docs.digitalocean.com/products/app-platform/reference/app-spec/)
- [Vite Production Build Guide](https://vitejs.dev/guide/build.html)

---

## Need Help?

**Common Issues**:
- Check [Troubleshooting](#troubleshooting) section above
- Review Digital Ocean build logs for specific errors
- Verify `dist/` folder builds successfully locally: `npm run build && ls -la dist/`

**Community Support**:
- [Digital Ocean Community](https://www.digitalocean.com/community)
- [DC20 TTRPG Discord](https://discord.gg/dc20) (for app-specific questions)
