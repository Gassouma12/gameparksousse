# 🔐 Supabase Authentication Setup Guide

## Step 1: Enable Email Authentication in Supabase

1. Go to your Supabase dashboard: https://supabase.com/dashboard
2. Select your project: **break-gaming**
3. Navigate to: **Authentication** → **Providers** (left sidebar)
4. Make sure **Email** is enabled (it usually is by default)
5. Configure these settings:
   - ✅ Enable Email provider
   - ✅ Confirm email: **DISABLE** (for easier testing)
   - ✅ Enable Email OTP: Optional

## Step 2: Create Your Admin Account

### Option A: Via Supabase Dashboard (Easiest)
1. Go to: **Authentication** → **Users**
2. Click **Add user** → **Create new user**
3. Enter:
   - **Email**: `saddem@breakgaming.com` (or your preferred email)
   - **Password**: Choose a strong password
   - ✅ Auto Confirm User: **ENABLE** (skip email verification)
4. Click **Create user**

### Option B: Via SQL (Advanced)
Run this in SQL Editor:
```sql
-- Create admin user
INSERT INTO auth.users (
  instance_id,
  id,
  aud,
  role,
  email,
  encrypted_password,
  email_confirmed_at,
  created_at,
  updated_at,
  raw_app_meta_data,
  raw_user_meta_data,
  is_super_admin
)
VALUES (
  '00000000-0000-0000-0000-000000000000',
  gen_random_uuid(),
  'authenticated',
  'authenticated',
  'saddem@breakgaming.com',
  crypt('YourSecurePassword123!', gen_salt('bf')),
  NOW(),
  NOW(),
  NOW(),
  '{"provider":"email","providers":["email"]}',
  '{"name":"Saddem"}',
  false
);
```

## Step 3: Update .env.local (Already Done ✅)
Your `.env.local` already has the required keys.

## Step 4: Test the Authentication

Once I update the code, you'll be able to:
1. Navigate to the login page
2. Enter your Supabase credentials
3. Log in with real authentication (no more hardcoded admin/admin123)

## Features After Setup:
- ✅ Secure authentication via Supabase
- ✅ Persistent sessions (stays logged in)
- ✅ Password reset functionality
- ✅ User management in Supabase dashboard
- ✅ Automatic token refresh

---

**Ready?** Once you've created the admin user in Supabase, let me know and I'll update the authentication code!
