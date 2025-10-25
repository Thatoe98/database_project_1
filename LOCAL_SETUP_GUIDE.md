# 🔧 Local Development Setup - Important!

## ⚠️ Critical Information

**Browsers CANNOT read `.env` files directly!** 

The `.env` file approach works for Node.js applications, but since this is a pure HTML/CSS/JS application that runs directly in the browser, we need a different approach.

## ✅ Correct Local Setup Methods

### Method 1: Using env-local.js (Recommended) ⭐

This is the **best practice** for local development:

1. **Create the file:**
   ```powershell
   # In PowerShell (project root directory)
   copy env-local.example.js env-local.js
   
   # OR run the setup script
   .\setup-local.ps1
   ```

2. **Edit env-local.js** with your Supabase credentials:
   ```javascript
   window.ENV = {
       SUPABASE_URL: 'https://abcdefgh.supabase.co',  // Your actual URL
       SUPABASE_ANON_KEY: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...'  // Your actual key
   };
   ```

3. **Uncomment the script tag** in each HTML file:
   
   Find this line in `index.html`, `donors.html`, `inventory.html`, etc.:
   ```html
   <!-- <script src="env-local.js"></script> -->
   ```
   
   Change it to:
   ```html
   <script src="env-local.js"></script>
   ```

4. **Open in browser** - Done! Your credentials are now loaded.

**Advantages:**
- ✅ One file to manage credentials
- ✅ Included in .gitignore (secure)
- ✅ Easy to switch between projects
- ✅ Works in all browsers

---

### Method 2: Direct HTML Editing (Quick but tedious)

If you want to avoid an extra file:

1. **Open each HTML file** (index.html, donors.html, inventory.html, etc.)

2. **Find this section** near the bottom:
   ```javascript
   if (typeof window.ENV === 'undefined') {
       window.ENV = {
           SUPABASE_URL: 'YOUR_SUPABASE_URL',
           SUPABASE_ANON_KEY: 'YOUR_SUPABASE_ANON_KEY'
       };
   }
   ```

3. **Replace with your actual credentials:**
   ```javascript
   if (typeof window.ENV === 'undefined') {
       window.ENV = {
           SUPABASE_URL: 'https://abcdefgh.supabase.co',
           SUPABASE_ANON_KEY: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...'
       };
   }
   ```

4. **Repeat for all 8 HTML files**

**Disadvantages:**
- ❌ Must update 8 files
- ❌ Easy to forget to update a file
- ❌ Credentials visible in HTML
- ⚠️ Must be careful not to commit with real credentials

---

## 🧪 Testing Your Setup

After setting up using either method:

1. **Open index.html** in your browser (use Live Server or direct open)

2. **Open Browser Console** (Press F12)

3. **Look for these messages:**
   ```
   ✅ Local environment configuration loaded
   ✅ Configuration loaded: {hasSupabaseUrl: true, hasSupabaseKey: true}
   ✅ Supabase client initialized successfully
   ✅ Supabase connection successful
   ✅ Dashboard loaded successfully
   ```

4. **If you see errors:**
   
   - ❌ "Supabase configuration not found"
     → Check that env-local.js is loaded OR HTML values are correct
   
   - ❌ "401 Unauthorized"
     → Check your anon key is correct
   
   - ❌ "Failed to fetch"
     → Check your Supabase URL is correct

---

## 🔍 Verifying Your Setup

### Check if env-local.js is loaded:

Open browser console and type:
```javascript
window.ENV
```

You should see:
```javascript
{
  SUPABASE_URL: "https://your-project.supabase.co",
  SUPABASE_ANON_KEY: "eyJhbGc..."
}
```

### Check if Supabase is connected:

In browser console, type:
```javascript
supabase
```

You should see an object with methods like `from`, `auth`, etc.

### Test a query:

In browser console, type:
```javascript
supabase.from('blood_inventory').select('*').then(result => console.log(result))
```

You should see data or an empty array (not an authentication error).

---

## 📂 File Security

### What's Included in .gitignore:

```
.env              # Node.js environment file (not used by browser)
env-local.js      # Browser environment file (YOUR CREDENTIALS)
```

Both files are **automatically ignored by Git**, so your credentials won't be committed.

### ⚠️ Never Commit:
- ❌ env-local.js
- ❌ HTML files with real credentials

### ✅ Safe to Commit:
- ✅ env-local.example.js (template with placeholders)
- ✅ .env.example (documentation only)
- ✅ HTML files with `'YOUR_SUPABASE_URL'` placeholders

---

## 🌐 Deployment (Vercel)

For production deployment, you **don't** use env-local.js. Instead:

1. **In Vercel Dashboard:**
   - Go to Project Settings → Environment Variables
   - Add `SUPABASE_URL` and `SUPABASE_ANON_KEY`
   - These are injected at build time

2. **The HTML files will automatically use placeholders:**
   ```javascript
   if (typeof window.ENV === 'undefined') {
       // Vercel will inject these, browser will use fallback
   }
   ```

3. **No code changes needed** for deployment!

---

## 🎯 Recommended Workflow

### For Local Development:
```powershell
# 1. Setup (once)
copy env-local.example.js env-local.js
# Edit env-local.js with your credentials

# 2. Uncomment script tag in HTML files (once)
# In each HTML file, change:
# <!-- <script src="env-local.js"></script> -->
# to:
# <script src="env-local.js"></script>

# 3. Start developing
# Open index.html in Live Server
```

### For Team/Production:
- Never commit env-local.js
- Share setup instructions (this file)
- Each developer creates their own env-local.js
- Use Vercel environment variables for production

---

## 🆘 Troubleshooting

### Problem: "env-local.js:1 Uncaught SyntaxError"
**Solution:** Make sure env-local.js has valid JavaScript syntax. Check for:
- Matching quotes
- Correct URL format (starts with https://)
- No special characters in keys

### Problem: Changes not reflected
**Solution:** 
- Hard refresh browser (Ctrl+Shift+R or Cmd+Shift+R)
- Clear browser cache
- Check if env-local.js is actually loaded (Network tab in DevTools)

### Problem: "Failed to load resource: env-local.js"
**Solution:**
- Make sure env-local.js is in the project root (same level as index.html)
- Check the script tag path is correct: `<script src="env-local.js"></script>`
- Not: `<script src="./env-local.js"></script>` or `<script src="/env-local.js"></script>`

### Problem: Still seeing "YOUR_SUPABASE_URL"
**Solution:**
- Verify env-local.js has real credentials, not placeholders
- Check script tag is uncommented
- Verify script loads before config.js
- Hard refresh browser

---

## 📋 Quick Setup Checklist

- [ ] Copy env-local.example.js to env-local.js
- [ ] Edit env-local.js with actual Supabase credentials
- [ ] Uncomment `<script src="env-local.js"></script>` in all HTML files
- [ ] Open index.html in Live Server or browser
- [ ] Check browser console for success messages
- [ ] Test: Click "Donors" - should load data
- [ ] Verify .gitignore includes env-local.js
- [ ] Never commit env-local.js!

---

**Remember:** The `.env` file you created is **not used** by the browser. It's there for documentation only. Use `env-local.js` instead! 🚀
