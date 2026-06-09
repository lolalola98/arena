# Arena Collection Display

Display blocks from your Are.na channel on your website.

## 🔐 Security Setup

Your **personal access token** must be kept secret and never committed to GitHub!

### What to Share (Safe for GitHub):
- ✅ `index.html`
- ✅ `styles.css`
- ✅ `arena.js`
- ✅ `config.example.js` (template only)
- ✅ `.gitignore`
- ✅ Your channel slug/ID (it's public anyway)

### What to Keep Secret (❌ NEVER commit):
- ❌ `config.js` (contains your token)
- ❌ Your personal access token

## 🚀 Setup Instructions

### 1. Get Your Arena Personal Access Token
1. Go to [https://www.are.na/settings/personal-access-tokens](https://www.are.na/settings/personal-access-tokens)
2. Click "Create personal access token"
3. Give it a name (e.g., "My Website")
4. Copy the token (you'll only see it once!)

### 2. Configure Your Site
1. Open `config.js` (already created, but ignored by git)
2. Replace `YOUR_TOKEN_HERE` with your actual token
3. Replace `your-channel-slug` with your channel slug
   - Example: For `https://www.are.na/username/my-collection`, use `my-collection`
   - Or use the numeric channel ID

### 3. Open the Site
Simply open `index.html` in your browser, or serve it with a local server:

```bash
# Using Python 3
python3 -m http.server 8000

# Using Node.js (if you have npx)
npx serve

# Using PHP
php -S localhost:8000
```

Then visit `http://localhost:8000`

## 📁 File Structure

```
arena/
├── index.html           # Main HTML file
├── styles.css          # Styling for the blocks
├── arena.js            # Arena API integration
├── config.js           # Your secret config (NOT IN GIT)
├── config.example.js   # Template config (safe to share)
├── .gitignore          # Protects config.js
└── README.md           # This file
```

## 🎨 Features

- Display blocks from any public or private Are.na channel
- Supports multiple block types:
  - 🖼️ Images
  - 📝 Text
  - 🔗 Links with previews
  - 📎 Attachments
  - 🎬 Embeds
  - 📚 Channels
- Pagination with "Load More" button
- Responsive grid layout
- Hover effects

## 🔧 Customization

### Change Number of Blocks Per Page
Edit `perPage` in `config.js`:
```javascript
perPage: 24  // Show 24 blocks per page
```

### Modify Styling
Edit `styles.css` to change colors, layout, spacing, etc.

### Change Grid Layout
In `styles.css`, modify the `#blocks-container` grid:
```css
#blocks-container {
    grid-template-columns: repeat(auto-fill, minmax(400px, 1fr));
    gap: 30px;
}
```

## 📚 Arena API Documentation

- [API Docs](https://www.are.na/developers/explore)
- [Personal Access Tokens](https://www.are.na/settings/personal-access-tokens)

## ⚠️ Important Notes

1. **Rate Limits**: Free accounts have 120 requests per minute
2. **Public Channels**: Work without authentication, but authenticated requests provide better rate limits
3. **Private Channels**: Require authentication (your token)
4. **Token Security**: Never commit `config.js` or share your token publicly

## 🤝 Sharing Your Project

When sharing on GitHub:
1. Ensure `config.js` is in `.gitignore` ✅
2. Only commit `config.example.js` ✅
3. Document setup steps in this README ✅
4. Others can clone, create their own `config.js`, and add their token

## 📝 License

Free to use and modify!
