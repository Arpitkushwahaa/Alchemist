# 🗄️ Complete Database Migration Guide

## Step 1: Access Supabase Dashboard

1. **Go to [supabase.com](https://supabase.com)**
2. **Sign in** to your account
3. **Select your project** from the dashboard

## Step 2: Navigate to SQL Editor

1. In your Supabase project dashboard, look at the **left sidebar**
2. Click on **"SQL Editor"** (it has a `</>` icon)
3. You'll see a code editor interface

## Step 3: Copy the Migration SQL

1. **Open the file**: `supabase/migrations/20250628105439_violet_palace.sql` in your project
2. **Select ALL content** (Ctrl+A or Cmd+A)
3. **Copy** the entire SQL content (Ctrl+C or Cmd+C)

## Step 4: Execute the Migration

1. **In the SQL Editor**, paste the copied SQL content
2. **Click the "RUN" button** (usually green button in the top right)
3. **Wait for execution** - you should see success messages

## Step 5: Verify Tables Were Created

1. **Go to "Table Editor"** in the left sidebar
2. **You should see these tables**:
   - `projects`
   - `clients` 
   - `workers`
   - `tasks`
   - `rules`
   - `validation_errors`
   - `priority_weights`

## Step 6: Check Row Level Security

1. **In Table Editor**, click on any table
2. **Go to the "Policies" tab**
3. **Verify RLS policies exist** (should show "Allow all operations" policies)

## Alternative Method: Using Supabase CLI (Advanced)

If you prefer command line:

```bash
# Install Supabase CLI
npm install -g supabase

# Login to Supabase
supabase login

# Link your project
supabase link --project-ref your-project-ref

# Run migrations
supabase db push
```

## What Each Table Does

### **projects**
- Main container for all data
- Each project is isolated from others

### **clients** 
- Stores client information and requirements
- Links to projects via `project_id`

### **workers**
- Worker profiles, skills, and availability
- Links to projects via `project_id`

### **tasks**
- Task definitions and constraints
- Links to projects via `project_id`

### **rules**
- Business rules and configurations
- Stores rule parameters as JSON

### **validation_errors**
- Data quality tracking and error reporting
- Links validation issues to specific data

### **priority_weights**
- Allocation preferences and weights
- Stores weight configurations as JSON

## Troubleshooting

### **Error: "relation already exists"**
- Tables already exist, migration was successful
- You can ignore this error

### **Error: "permission denied"**
- Check if you're the project owner
- Verify you're in the correct project

### **Error: "syntax error"**
- Make sure you copied the ENTIRE SQL file
- Check for any missing characters

### **No tables visible after migration**
- Refresh the page
- Check if you're looking at the correct project
- Verify the SQL executed without errors

## Verification Checklist

- [ ] All 7 tables created successfully
- [ ] RLS policies are enabled on all tables
- [ ] Indexes are created for performance
- [ ] Triggers are set up for `updated_at` columns
- [ ] Foreign key relationships are established

## Next Steps After Migration

1. **Start your development server**: `npm run dev`
2. **Test database connection** by creating a project
3. **Upload sample data** to verify everything works
4. **Check auto-save functionality**

Your database is now production-ready! 🚀