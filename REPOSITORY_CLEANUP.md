# Repository Cleanup - MediRemind Files Issue

## Problem Identified

The GitHub repository shows **mediRemind** files because:
1. The original git repository was initialized at the **home directory level** (`/Users/darshanadhikari`)
2. This caused git to track files from `Downloads/mediRemind-master 2/` directory
3. Those files were accidentally committed to the CodeTutor AI repository

## Current Status

- ✅ Remote repository: https://github.com/DarshanAdh/codetutor-ai-semo
- ⚠️ Repository contains mediRemind files from previous commits
- ⚠️ Git repository has filesystem indexing issues preventing some files from being added

## Solution: Manual Cleanup Required

### Option 1: Clean Repository via GitHub Web Interface (Recommended)

1. Go to https://github.com/DarshanAdh/codetutor-ai-semo
2. Navigate to the `Downloads/mediRemind-master 2/` folder
3. Delete all mediRemind files/folders
4. Commit the deletion

### Option 2: Clean Repository via Git Commands

```bash
cd "/Users/darshanadhikari/Desktop/capstone(tutor project)/codetutor-ai-semo"

# Clone the repository fresh
cd ..
rm -rf codetutor-ai-semo
git clone https://github.com/DarshanAdh/codetutor-ai-semo.git
cd codetutor-ai-semo

# Remove mediRemind files
git rm -r "Downloads/mediRemind-master 2" 2>/dev/null || true

# Add all CodeTutor files
git add -A .

# Ensure .env is not committed
git reset HEAD server/.env .env 2>/dev/null

# Commit
git commit -m "chore: remove mediRemind files and add CodeTutor AI source"

# Force push (clean history)
git push origin main --force
```

### Option 3: Fresh Repository Start

If you want a completely clean repository:

```bash
cd "/Users/darshanadhikari/Desktop/capstone(tutor project)/codetutor-ai-semo"

# Remove existing git
rm -rf .git

# Initialize fresh
git init
git branch -M main
git remote add origin https://github.com/DarshanAdh/codetutor-ai-semo.git

# Add all files (excluding problematic ones)
find . -type f ! -path "*/node_modules/*" ! -path "*/.git/*" ! -name "*.env" ! -name ".DS_Store" -exec git add {} +

# Commit
git commit -m "feat: CodeTutor AI complete application"

# Force push
git push origin main --force
```

## Files That Should Be in Repository

✅ **Frontend:**
- `src/pages/Learn.tsx` - Enhanced Learn page
- `src/pages/Resources.tsx` - Resources page
- `src/pages/Signup.tsx` - Signup page
- `src/pages/AITutor.tsx` - AI Tutor page
- `src/components/` - All React components
- `src/index.css` - Enhanced CSS with animations

✅ **Backend:**
- `server/src/routes/ai-tutor.routes.ts` - AI routes
- `server/src/services/` - All services (Gemini, OpenRouter, Mistral)
- `server/src/controllers/` - All controllers
- `server/src/models/` - All models

✅ **Configuration:**
- `package.json` files
- `vite.config.ts`
- `tsconfig.json` files
- `.gitignore`

❌ **Files That Should NOT Be Committed:**
- `server/.env` - Contains API keys
- `.env` files
- `node_modules/`
- Any mediRemind files

## Verification

After cleanup, verify:

```bash
# Check for mediRemind files
git ls-files | grep -i "mediRemind"
# Should return nothing

# Check for .env files
git ls-files | grep "\.env$"
# Should return nothing (or only .env.example)

# Verify source files are present
git ls-files | grep -E "Learn.tsx|Resources.tsx|ai-tutor.routes.ts"
# Should show your files
```

## Current Issue: Filesystem Corruption

Some files cannot be indexed by git due to "short read" errors:
- `components.json`
- `postcss.config.js`
- `src/App.css`
- `public/placeholder.svg`
- `server/.gitignore`

These files may need to be:
1. Recreated manually
2. Or the filesystem may need repair
3. Or file permissions need to be checked

## Next Steps

1. **Immediate**: Clean up mediRemind files from GitHub repository
2. **Short-term**: Fix filesystem issues or recreate corrupted files
3. **Long-term**: Ensure all CodeTutor AI source files are properly committed

