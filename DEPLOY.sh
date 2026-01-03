#!/bin/bash

# Fleet Command - One-Click Deployment Script
# This script will deploy your app to Vercel

echo "═══════════════════════════════════════════════════════════════"
echo "  🚀 FLEET COMMAND - DEPLOYMENT SCRIPT"
echo "═══════════════════════════════════════════════════════════════"
echo ""

# Check if Vercel CLI is installed
if ! command -v vercel &> /dev/null
then
    echo "⚠️  Vercel CLI not found. Installing now..."
    npm install -g vercel
    echo "✅ Vercel CLI installed!"
    echo ""
fi

echo "📦 Step 1: Installing dependencies..."
npm install
echo "✅ Dependencies installed!"
echo ""

echo "🔨 Step 2: Building application..."
npm run build
if [ $? -eq 0 ]; then
    echo "✅ Build successful!"
else
    echo "❌ Build failed! Please check errors above."
    exit 1
fi
echo ""

echo "🚀 Step 3: Deploying to Vercel..."
echo ""
echo "⚡ This will:"
echo "   - Deploy your app to Vercel"
echo "   - Give you a live URL"
echo "   - Set up automatic HTTPS"
echo ""
echo "📋 You'll be asked a few questions:"
echo "   - Set up and deploy? YES"
echo "   - Which scope? (Choose your account)"
echo "   - Link to existing project? NO (first time) or YES (updating)"
echo "   - Project name? fleet-command (or your choice)"
echo "   - Directory? ./"
echo "   - Override settings? NO"
echo ""
read -p "Press ENTER to continue with deployment..."

vercel --prod

if [ $? -eq 0 ]; then
    echo ""
    echo "═══════════════════════════════════════════════════════════════"
    echo "  🎉 DEPLOYMENT SUCCESSFUL!"
    echo "═══════════════════════════════════════════════════════════════"
    echo ""
    echo "Your app is now LIVE! Vercel gave you a URL above."
    echo ""
    echo "📱 CUSTOMER HUB LINK:"
    echo "   https://your-app.vercel.app/customer-hub?loan=DEMO-123"
    echo ""
    echo "📲 SMS TEMPLATE:"
    echo "   Hi [NAME],"
    echo "   Your loan car is ready!"
    echo "   🚗 [MAKE] [MODEL] ([REGO])"
    echo "   Complete agreement: https://your-app.vercel.app/customer-hub?loan=[LOAN-ID]"
    echo ""
    echo "🎯 NEXT STEPS:"
    echo "   1. Copy your Vercel URL from above"
    echo "   2. Add /customer-hub?loan=DEMO-123 to test"
    echo "   3. Open on your phone!"
    echo "   4. Set up environment variables in Vercel dashboard"
    echo ""
    echo "🔧 ENVIRONMENT VARIABLES:"
    echo "   Go to: vercel.com → Your Project → Settings → Environment Variables"
    echo "   Add: SUPABASE_URL, SUPABASE_ANON_KEY, SUPABASE_SERVICE_ROLE_KEY"
    echo ""
    echo "═══════════════════════════════════════════════════════════════"
else
    echo ""
    echo "❌ Deployment failed. Please check errors above."
    echo ""
    echo "💡 TROUBLESHOOTING:"
    echo "   - Make sure you're logged in: vercel login"
    echo "   - Check your internet connection"
    echo "   - Try manual deployment: vercel"
    exit 1
fi
