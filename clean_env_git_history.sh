#!/bin/bash

echo "🚨 Starting cleanup of leaked .env file from Git history..."

# Ensure repo is clean before running
echo "⚠️ Make sure you committed all your current changes first."
read -p "Press enter to continue..."

# Remove .env from all commits
git filter-branch --force --index-filter \
  "git rm --cached --ignore-unmatch .env" \
  --prune-empty --tag-name-filter cat -- --all

# Force push cleaned history
git push origin --force --all
git push origin --force --tags

# Add .env to .gitignore
echo ".env" >> .gitignore
git add .gitignore
git commit -m "Add .env to .gitignore to prevent future leaks"
git push

echo "✅ .env removed from history and added to .gitignore."
echo "🧪 Now REGENERATE all secrets that were exposed."
