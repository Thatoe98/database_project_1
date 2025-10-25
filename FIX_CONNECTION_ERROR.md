# 🔧 FIXING DATABASE CONNECTION ERROR

## Error: "Unable to connect to database"

### The Problem
Your Supabase credentials are configured correctly in `env-local.js`, but the database tables haven't been created yet in Supabase.

---

## ✅ SOLUTION (Follow these steps in order)

### Step 1: Run Database Setup in Supabase

1. **Open Supabase Dashboard**
   - Go to: https://supabase.com/dashboard
   - Log in to your account
   - Select your project: `fiowdrewzweebztcxjnq`

2. **Open SQL Editor**
   - Click on "SQL Editor" in the left sidebar
   - Click "New Query" button

3. **Copy & Run database.sql**
   - Open `database.sql` file in VS Code
   - Select ALL content (Ctrl+A)
   - Copy (Ctrl+C)
   - Paste into Supabase SQL Editor
   - Click "Run" button (or press Ctrl+Enter)
   - Wait for execution to complete (should see "Success" message)

4. **Verify Tables Created**
   - Click on "Table Editor" in left sidebar
   - You should see 6 tables:
     - ✅ hospitals
     - ✅ donors
     - ✅ campaigns
     - ✅ patients
     - ✅ donations
     - ✅ inventory

---

### Step 2: Test Connection

1. **Open test_connection.html**
   - In VS Code, right-click `test_connection.html`
   - Select "Open with Live Server" (or open directly in browser)
   - URL: `http://127.0.0.1:5500/test_connection.html`

2. **Run Tests**
   - Click "Test Connection" button
   - Click "Check Tables" button
   - Click "Check Sample Data" button

3. **Expected Results**
   - ✅ Configuration loaded
   - ✅ Connection successful
   - ✅ All 6 tables found with sample data
   - ✅ All 3 views working

---

### Step 3: Refresh Your Dashboard

1. **Reload index.html**
   - Go back to `http://127.0.0.1:5500/index.html`
   - Press F5 to refresh
   - Check browser console (F12)

2. **Expected Console Output**
   ```
   ✅ Local environment configuration loaded
   ✅ Supabase client initialized successfully
   ✅ Supabase connection successful
   ```

3. **Dashboard Should Show**
   - Total Donors: 8
   - Total Hospitals: 5
   - Available Blood Units: (will show after donations created)
   - Working navigation to all pages

---

## 🐛 Troubleshooting

### Issue: "relation 'hospitals' does not exist"
**Cause**: Database tables not created yet
**Solution**: Go back to Step 1 and run database.sql in Supabase

### Issue: "Invalid API key"
**Cause**: Wrong credentials in env-local.js
**Solution**: 
1. Go to Supabase → Settings → API
2. Copy correct Project URL and anon key
3. Update env-local.js
4. Save and refresh browser

### Issue: "Views don't exist"
**Cause**: database.sql didn't run completely
**Solution**: 
1. In Supabase SQL Editor, run this to drop everything:
   ```sql
   DROP TABLE IF EXISTS inventory CASCADE;
   DROP TABLE IF EXISTS donations CASCADE;
   DROP TABLE IF EXISTS campaigns CASCADE;
   DROP TABLE IF EXISTS patients CASCADE;
   DROP TABLE IF EXISTS donors CASCADE;
   DROP TABLE IF EXISTS hospitals CASCADE;
   ```
2. Then run the complete database.sql again

### Issue: Still seeing "blood_inventory" errors
**Cause**: Browser cache with old JavaScript
**Solution**:
1. Press Ctrl+Shift+R (hard refresh)
2. Or clear browser cache
3. Close and reopen browser

---

## 📋 Quick Checklist

Before the error will be fixed, you must have:

- [ ] Supabase account created
- [ ] Project created in Supabase (fiowdrewzweebztcxjnq)
- [ ] database.sql script run completely in SQL Editor
- [ ] 6 tables visible in Table Editor
- [ ] 3 views created (check in SQL Editor)
- [ ] Sample data inserted (8 donors, 5 hospitals)
- [ ] env-local.js has correct credentials
- [ ] Browser refreshed (hard refresh with Ctrl+Shift+R)

---

## ✨ What Changed (Technical Details)

I updated the following files to work with your 3NF schema:

### 1. js/supabase.js
- Changed connection test from `blood_inventory` → `hospitals`
- Now checks for correct table name

### 2. js/main.js
- Changed `blood_inventory` → `inventory_with_blood_type` (view)
- Updated fetchBloodInventory() to use view
- Updated updateBloodInventory() to use base inventory table
- Updated dashboard stats to use inventory_summary view
- Updated low stock alerts to use proper view

### 3. Created test_connection.html
- New diagnostic tool to verify setup
- Tests configuration, connection, tables, and data
- Shows exactly what's missing

---

## 🎯 Expected Timeline

1. **Run database.sql**: 2 minutes
2. **Verify in Supabase**: 1 minute
3. **Test connection**: 1 minute
4. **Refresh dashboard**: 30 seconds

**Total time to fix**: ~5 minutes

---

## 🚀 After Fix

Once database is set up, you should see:

✅ Dashboard loads with statistics
✅ Donors page shows 8 sample donors
✅ Inventory page shows blood types from donors
✅ No console errors
✅ All navigation working

---

**Remember**: The database tables MUST exist in Supabase before the frontend can connect!

Good luck! 🩸
