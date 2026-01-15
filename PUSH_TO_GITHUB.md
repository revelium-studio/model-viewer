# Push to GitHub - Step by Step

Your repository is already initialized and ready to push!

## Current Status

✅ Git repository initialized
✅ Initial commit created
✅ Remote configured: `https://github.com/revelium-studio/model-viewer.git`
✅ Branch set to `main`

## Push to GitHub

### Option 1: Using Personal Access Token (Recommended)

1. **Create a Personal Access Token**:
   - Go to GitHub → Settings → Developer settings → Personal access tokens → Tokens (classic)
   - Click "Generate new token (classic)"
   - Give it a name: "model-viewer-deploy"
   - Select scopes: `repo` (full control of private repositories)
   - Click "Generate token"
   - **Copy the token** (you won't see it again!)

2. **Push using the token**:
   ```bash
   cd "/Users/niccolomiranda/Cursor AI/3D-model-gesture"
   git push -u origin main
   ```
   
   When prompted:
   - Username: `your-github-username`
   - Password: `paste-your-personal-access-token`

### Option 2: Using SSH (If you have SSH keys set up)

1. **Change remote to SSH**:
   ```bash
   git remote set-url origin git@github.com:revelium-studio/model-viewer.git
   ```

2. **Push**:
   ```bash
   git push -u origin main
   ```

### Option 3: Using GitHub CLI

```bash
# Install GitHub CLI (if not installed)
brew install gh

# Authenticate
gh auth login

# Push
git push -u origin main
```

## Verify Push

After pushing, visit:
https://github.com/revelium-studio/model-viewer

You should see all your files there!

## Next: Deploy to Vercel

Once pushed to GitHub:

1. Go to https://vercel.com
2. Import project: `revelium-studio/model-viewer`
3. Add environment variables
4. Deploy!

See [DEPLOYMENT.md](./DEPLOYMENT.md) for detailed Vercel setup.
