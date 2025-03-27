# GitHub Repository Setup Guide

This guide will help you set up your Git repository and push your code to GitHub.

## Prerequisites

1. Install Git from [https://git-scm.com/downloads](https://git-scm.com/downloads)
2. Create a GitHub account if you don't have one already

## Setting Up Your Repository

### Step 1: Initialize Git Repository

Open a terminal or command prompt in your project directory and run:

```bash
git init
```

### Step 2: Add Your Files to Git

```bash
git add .
```

### Step 3: Commit Your Changes

```bash
git commit -m "Initial commit"
```

### Step 4: Connect to GitHub Repository

```bash
git remote add origin https://github.com/s1cko271/WEB_TM-T.git
```

### Step 5: Push Your Code to GitHub

```bash
git push -u origin master
```

If your default branch is 'main' instead of 'master', use:

```bash
git push -u origin main
```

## Troubleshooting

### Authentication Issues

If you encounter authentication issues, you may need to:

1. Generate a personal access token on GitHub:
   - Go to GitHub → Settings → Developer settings → Personal access tokens → Generate new token
   - Select the necessary scopes (at least 'repo')
   - Copy the generated token

2. When prompted for a password, use the token instead of your GitHub password

### Branch Issues

If you get an error about the branch not existing, try:

```bash
git branch -M main
git push -u origin main
```

## Next Steps

After successfully pushing your code to GitHub, you can:

1. Create additional branches for new features
2. Set up GitHub Pages to host your website
3. Invite collaborators to your repository

## Resources

- [Git Documentation](https://git-scm.com/doc)
- [GitHub Guides](https://guides.github.com/)
- [GitHub Pages Documentation](https://docs.github.com/en/pages)