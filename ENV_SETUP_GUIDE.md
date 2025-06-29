# 🔧 Environment Variables Setup Guide

## Quick Start

1. **Copy the example file:**
   ```bash
   cp .env.example .env
   ```

2. **Edit your `.env` file** with your actual credentials

## 📋 Required Variables

### Basic Application (Required)
```env
NEXT_PUBLIC_APP_NAME="Data Alchemist: Forge Your Own AI Resource‑Allocation Configurator"
NEXT_PUBLIC_APP_VERSION="1.0.0"
NODE_ENV=development
```

## 🤖 AI Services (Optional but Recommended)

### OpenAI Setup
1. Go to [OpenAI Platform](https://platform.openai.com/api-keys)
2. Create an account or sign in
3. Generate a new API key
4. Add to your `.env`:
   ```env
   OPENAI_API_KEY=sk-your-actual-openai-key-here
   ```

### Anthropic Setup (Alternative)
1. Go to [Anthropic Console](https://console.anthropic.com/)
2. Create an account or sign in
3. Generate a new API key
4. Add to your `.env`:
   ```env
   ANTHROPIC_API_KEY=your-anthropic-key-here
   ```

## 🗄️ Database Setup (Optional)

### For Data Persistence
If you want to store user data permanently:

**PostgreSQL (Recommended):**
```env
DATABASE_URL=postgresql://username:password@localhost:5432/data_alchemist
```

**SQLite (Simple):**
```env
DATABASE_URL=file:./data/app.db
```

## 📊 Analytics (Optional)

### Google Analytics
1. Create a Google Analytics account
2. Get your tracking ID
3. Add to `.env`:
   ```env
   NEXT_PUBLIC_GA_TRACKING_ID=G-XXXXXXXXXX
   ```

## 🔒 Security Variables

### Generate Secure Secrets
```bash
# Generate a random secret for JWT
openssl rand -base64 32

# Or use Node.js
node -e "console.log(require('crypto').randomBytes(32).toString('base64'))"
```

Add to `.env`:
```env
JWT_SECRET=your-generated-secret-here
NEXTAUTH_SECRET=your-generated-secret-here
```

## 🚀 Deployment Variables

### Vercel Deployment
```env
NEXTAUTH_URL=https://your-app.vercel.app
```

### Netlify Deployment
```env
NEXTAUTH_URL=https://your-app.netlify.app
```

## 📧 Email Configuration (Optional)

### Gmail SMTP
```env
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-email@gmail.com
SMTP_PASS=your-app-password
```

### SendGrid
```env
SENDGRID_API_KEY=your-sendgrid-api-key
```

## 🛠️ Development vs Production

### Development (.env.local)
```env
NODE_ENV=development
NEXT_PUBLIC_DEBUG_MODE=true
DATABASE_URL=file:./dev.db
```

### Production (.env.production)
```env
NODE_ENV=production
NEXT_PUBLIC_DEBUG_MODE=false
DATABASE_URL=your-production-database-url
```

## ⚠️ Security Best Practices

1. **Never commit `.env` files to Git**
   - Already included in `.gitignore`

2. **Use different keys for development and production**

3. **Rotate API keys regularly**

4. **Use environment-specific variables**

5. **Validate required variables on startup**

## 🔍 Troubleshooting

### Common Issues

**Environment variables not loading:**
```bash
# Restart your development server
npm run dev
```

**API keys not working:**
- Check for extra spaces or quotes
- Verify the key is active in the provider's dashboard
- Ensure you're using the correct environment

**Database connection issues:**
- Verify the DATABASE_URL format
- Check if the database server is running
- Ensure proper permissions

## 📝 Example Complete .env File

```env
# Basic Configuration
NEXT_PUBLIC_APP_NAME="Data Alchemist"
NEXT_PUBLIC_APP_VERSION="1.0.0"
NODE_ENV=development

# AI Services
OPENAI_API_KEY=sk-your-openai-key-here

# Database
DATABASE_URL=postgresql://user:pass@localhost:5432/data_alchemist

# Security
JWT_SECRET=your-jwt-secret-here
NEXTAUTH_SECRET=your-nextauth-secret-here

# Optional Services
NEXT_PUBLIC_GA_TRACKING_ID=G-XXXXXXXXXX
```

## 🆘 Need Help?

1. Check the [Next.js Environment Variables docs](https://nextjs.org/docs/basic-features/environment-variables)
2. Verify your API provider's documentation
3. Test with minimal configuration first
4. Use `console.log(process.env.YOUR_VARIABLE)` to debug

## 🎯 Quick Test

Add this to any component to test your environment variables:
```javascript
console.log('Environment check:', {
  nodeEnv: process.env.NODE_ENV,
  hasOpenAI: !!process.env.OPENAI_API_KEY,
  hasDatabase: !!process.env.DATABASE_URL
});
```