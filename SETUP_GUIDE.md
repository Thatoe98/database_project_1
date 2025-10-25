# Quick Start Guide - Blood Inventory Management System

## 🚀 Getting Started in 5 Minutes

### Step 1: Get Your Supabase Credentials

1. Go to [https://supabase.com](https://supabase.com) and sign up (free)
2. Click "New Project"
3. Fill in:
   - **Name**: Blood Inventory System
   - **Database Password**: (create a strong password)
   - **Region**: Choose closest to you
4. Wait for project to be created (~2 minutes)

### Step 2: Set Up Database

1. In your Supabase project, go to **SQL Editor** (left sidebar)
2. Copy the entire contents of `database.sql` from this project
3. Paste into SQL Editor
4. Click **Run** button
5. ✅ You should see "Success. No rows returned"
6. Go to **Table Editor** to verify all 7 tables were created

### Step 3: Get API Keys

1. In Supabase, go to **Settings** (gear icon) → **API**
2. You'll see two important values:
   - **Project URL**: `https://xxxxx.supabase.co`
   - **anon public key**: Long string starting with `eyJ...`
3. Keep this tab open - you'll need these values!

### Step 4: Configure Local Environment

**Method 1: Using env-local.js (Recommended)**

1. Copy `env-local.example.js` to `env-local.js`:
   ```bash
   copy env-local.example.js env-local.js
   ```

2. Open `env-local.js` in a text editor

3. Replace the placeholder values with your actual Supabase credentials:
   ```javascript
   window.ENV = {
       SUPABASE_URL: 'https://xxxxx.supabase.co',  // Your Project URL
       SUPABASE_ANON_KEY: 'eyJhbGc...'  // Your anon public key
   };
   ```

4. Save the file

5. Update your HTML files to load env-local.js BEFORE config.js:
   ```html
   <!-- Add this line before config.js -->
   <script src="env-local.js"></script>
   <script src="js/config.js"></script>
   ```

**Method 2: Direct HTML Edit (Quick but less secure)**

1. Open `index.html` in a text editor
2. Find this section near the bottom (around line 350):
   ```javascript
   window.ENV = {
       SUPABASE_URL: 'YOUR_SUPABASE_URL',
       SUPABASE_ANON_KEY: 'YOUR_SUPABASE_ANON_KEY'
   };
   ```
3. Replace with your actual values:
   ```javascript
   window.ENV = {
       SUPABASE_URL: 'https://xxxxx.supabase.co',
       SUPABASE_ANON_KEY: 'eyJhbGc...'
   };
   ```
4. Repeat for all other HTML files

### Step 5: Disable Row Level Security (For Development)

⚠️ **Important**: By default, Supabase has Row Level Security (RLS) enabled, which will block all queries.

1. In Supabase, go to **SQL Editor**
2. Run this SQL command:
   ```sql
   ALTER TABLE donors DISABLE ROW LEVEL SECURITY;
   ALTER TABLE donations DISABLE ROW LEVEL SECURITY;
   ALTER TABLE blood_inventory DISABLE ROW LEVEL SECURITY;
   ALTER TABLE hospitals DISABLE ROW LEVEL SECURITY;
   ALTER TABLE blood_requests DISABLE ROW LEVEL SECURITY;
   ALTER TABLE blood_camps DISABLE ROW LEVEL SECURITY;
   ALTER TABLE blood_transfusions DISABLE ROW LEVEL SECURITY;
   ```
3. Click **Run**

📝 **Note**: For production, you should create proper RLS policies instead of disabling it.

### Step 6: Run the Application

**Option A: VS Code Live Server (Recommended)**
1. Install "Live Server" extension in VS Code
2. Right-click `index.html`
3. Select "Open with Live Server"
4. Browser opens automatically at `http://localhost:5500`

**Option B: Direct File Open**
1. Double-click `index.html`
2. Opens in your default browser
3. ⚠️ Some features may not work due to CORS restrictions

**Option C: Python HTTP Server**
```bash
cd database_project
python -m http.server 8000
```
Then open `http://localhost:8000` in your browser

### Step 7: Verify Everything Works

1. Dashboard should load with statistics showing "0" (no data yet)
2. Open browser console (F12)
3. Look for these messages:
   - ✅ "Supabase client initialized successfully"
   - ✅ "Supabase connection successful"
   - ✅ "Dashboard loaded successfully"

4. If you see errors:
   - ❌ "Supabase credentials not configured" → Check Step 4
   - ❌ "violates row-level security policy" → Check Step 5
   - ❌ "relation does not exist" → Check Step 2

### Step 8: Add Sample Data (Optional)

The `database.sql` file includes sample data. If you didn't run it yet:

1. Go to Supabase **SQL Editor**
2. Scroll to the "SAMPLE DATA" section in `database.sql`
3. Copy and run just that section
4. Refresh your application
5. You should now see donors, hospitals, and inventory data

## 🎉 Success!

You're now ready to use the Blood Inventory Management System!

### Next Steps:

1. **Add a Donor**: Click "Donors" in sidebar → "Add New Donor"
2. **Record a Donation**: Click "Donations" → "Record Donation"
3. **View Inventory**: Click "Inventory" to see blood stock levels
4. **Register Hospital**: Click "Hospitals" → "Register Hospital"
5. **Create Request**: Click "Blood Requests" → "New Request"

## 📝 Tips

- **Keep browser console open** (F12) while using the app to see helpful debug messages
- **Check "Network" tab** if data isn't loading to see API requests
- **Sample data** is already included for testing (10 donors, 5 hospitals, inventory)
- **Real-time updates**: Inventory changes automatically update across tabs!

## 🐛 Troubleshooting

### Problem: "Supabase not initialized"
**Solution**: Check that env-local.js loads before config.js, or update HTML directly

### Problem: "Access denied" or "RLS policy" errors
**Solution**: Disable Row Level Security (see Step 5)

### Problem: Tables don't load or show empty
**Solution**: 
1. Check browser console for errors
2. Verify Supabase credentials are correct
3. Make sure database.sql was run completely
4. Try refreshing the page

### Problem: "CORS error" in console
**Solution**: Use Live Server or Python HTTP server instead of opening file directly

## 🚀 Deploy to Vercel

Once local testing works, deploy to Vercel:

1. Push code to GitHub
2. Import project in Vercel
3. Add environment variables in Vercel dashboard
4. Deploy!

See main README.md for detailed deployment instructions.

## 📞 Need Help?

- Check the main **README.md** for detailed documentation
- Review **database.sql** for schema reference
- Check browser console (F12) for error messages
- Ensure all files are in correct folders

---

**Happy Managing! 🩸**
