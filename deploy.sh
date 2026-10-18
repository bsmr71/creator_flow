#!/bin/bash
set -e

echo "🚀 Starting CreatorFlow Deployment Update..."

# 1. Pull latest code from GitHub
echo "📥 Pulling latest changes from Git..."
git pull origin main

# 2. Install/update PHP dependencies
echo "📦 Installing PHP dependencies..."
composer install --no-dev --optimize-autoloader --no-interaction

# 3. Run database migrations
echo "🗄️ Running database migrations..."
php artisan migrate --force

# 4. Install npm dependencies & compile assets
if command -v npm &> /dev/null; then
    echo "⚡ Building frontend assets..."
    npm ci || npm install
    npm run build
fi

# 5. Clear and optimize Laravel caches
echo "🧹 Optimizing Laravel caches..."
php artisan optimize:clear
php artisan optimize

# 6. Restart queue worker (so background bots pick up new code)
if command -v supervisorctl &> /dev/null; then
    echo "🔄 Restarting queue workers..."
    sudo supervisorctl restart all || true
fi

echo "✅ CreatorFlow successfully updated and ready!"
