# Anand Narayan Dwivedi — Portfolio Website

A modern, full-stack developer portfolio with a **Node.js + Express backend** connected to **MongoDB** for real contact form submissions.

---

## 📁 Folder Structure

```
portfolio-anand/
├── index.html              # Frontend — all portfolio sections
├── .env                    # Environment config (NOT committed)
├── .env.example            # Example env (safe to commit)
├── .gitignore
├── package.json
├── assets/
│   ├── css/style.css       # Design system + animations
│   ├── js/main.js          # Frontend JS (fetches /api/contact)
│   └── images/
└── server/
    ├── index.js            # Express entry point + static serving
    ├── config/
    │   └── db.js           # Mongoose connection
    ├── models/
    │   └── Contact.js      # Message schema
    └── routes/
        └── contact.js      # POST/GET /api/contact
```

---

## 🚀 Quick Start

### Prerequisites
- **Node.js** v18+
- **MongoDB** running locally on port `27017`  
  *(Install from https://www.mongodb.com/try/download/community)*

### 1. Install dependencies
```bash
cd portfolio-anand
npm install
```

### 2. Configure environment
```bash
# Copy the example and edit as needed
copy .env.example .env
```

`.env` defaults:
```env
MONGO_URI=mongodb://127.0.0.1:27017/portfolio_anand
PORT=3001
ADMIN_KEY=changeme_super_secret_key_2024
NODE_ENV=development
```

### 3. Start the server
```bash
# Development (auto-restarts on file changes)
npm run dev

# Production
npm start
```

Open: **http://localhost:3001**

The Express server:
- Serves the full static portfolio
- Connects to MongoDB
- Exposes REST API at `/api/*`

---

## 📡 API Endpoints

| Method | Endpoint | Description | Auth |
|---|---|---|---|
| `GET` | `/api/health` | Server + DB status | Public |
| `POST` | `/api/contact` | Submit a message | Public |
| `GET` | `/api/contact` | List all messages | Admin key |
| `GET` | `/api/contact/:id` | Get one message | Admin key |
| `PATCH` | `/api/contact/:id/status` | Update read status | Admin key |

### Admin authentication
Pass your `ADMIN_KEY` as a request header:
```
x-admin-key: changeme_super_secret_key_2024
```

### Example: Submit a message
```bash
curl -X POST http://localhost:3001/api/contact \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Jane Recruiter",
    "email": "jane@company.com",
    "subject": "Full Stack Role",
    "message": "Hi Anand, we have a great opportunity for you!"
  }'
```

Response:
```json
{
  "success": true,
  "message": "Message received! I'll get back to you soon.",
  "data": { "id": "...", "name": "Jane Recruiter", "createdAt": "..." }
}
```

### Example: List messages (admin)
```bash
curl http://localhost:3001/api/contact \
  -H "x-admin-key: your_admin_key"
```

---

## 📄 Adding Your Resume

1. Drop `resume.pdf` into `assets/`
2. In `index.html`, update both resume buttons:
```html
href="assets/resume.pdf" download="Anand_Narayan_Dwivedi_Resume.pdf"
```

---

## 🔗 Updating Social Media Links

In `index.html`, find `<!-- SOCIAL / CONNECT -->` and `<!-- FOOTER -->` sections.  
Replace placeholder `href="https://github.com/"` with your real URLs.

---

## ☁️ Deploying to Production

### Backend: Render.com (free)
1. Push to GitHub
2. Create a **Web Service** on Render pointing to your repo
3. Set **Start Command**: `node server/index.js`
4. Add environment variables: `MONGO_URI`, `PORT`, `ADMIN_KEY`, `NODE_ENV=production`

### Database: MongoDB Atlas (free tier)
1. Create a cluster at [mongodb.com/atlas](https://www.mongodb.com/atlas)
2. Copy your connection string
3. Set it as `MONGO_URI` in your server environment

### Frontend (static-only, no backend): GitHub Pages
```bash
git init && git add . && git commit -m "🚀 portfolio"
git remote add origin https://github.com/YOUR_USER/YOUR_REPO.git
git push -u origin main
# Settings → Pages → Branch: main / root → Save
```
> Note: When using GitHub Pages (no server), the contact form will show a fallback error and prompt email directly. For full form functionality, deploy the Express backend separately.

---

## 🔒 Security Features
- Rate limiting: 100 req/15 min per IP (API), 5 msg/10 min (contact form)
- Input validation with `express-validator` (server-side)
- IP address stored with `select: false` (excluded from API responses)
- CORS restricted to known origins
- Security response headers (X-Frame-Options, X-Content-Type-Options)

---

## 📞 Contact

**Anand Narayan Dwivedi**  
📧 dwivedianandnarayan@gmail.com  
📞 +91 9120367133  
📍 Lucknow, India

A modern, professional, and production-ready developer portfolio built with **HTML5, CSS3, and Vanilla JavaScript**.

---

## 📁 Folder Structure

```
portfolio-anand/
├── index.html              # Main HTML file (all sections)
├── assets/
│   ├── css/
│   │   └── style.css       # All styles (design system, animations, responsive)
│   ├── js/
│   │   └── main.js         # All interactive features
│   └── images/
│       └── hero-bg.png     # Hero background image
└── README.md               # This file
```

---

## ✨ Features

| Feature | Status |
|---|---|
| Dark / Light Mode Toggle | ✅ |
| Typing Effect (Hero) | ✅ |
| Animated Skill Bars | ✅ |
| Particle Animation | ✅ |
| Smooth Scroll Navigation | ✅ |
| Active Nav Link Highlight | ✅ |
| IntersectionObserver Animations | ✅ |
| Counter Animation (Stats) | ✅ |
| 3D Tilt on Project Cards | ✅ |
| Contact Form (client-side) | ✅ |
| Back to Top Button | ✅ |
| Toast Notifications | ✅ |
| Fully Responsive (Mobile/Tablet/Desktop) | ✅ |
| SEO Meta Tags (OG, Twitter Card, etc.) | ✅ |
| Social Links Section | ✅ |
| Timeline Education Section | ✅ |
| Certifications Section | ✅ |
| Footer with Year Auto-update | ✅ |

---

## 🚀 Running Locally

### Option 1: Open Directly
Simply open `index.html` in any modern browser (Chrome, Firefox, Edge).

### Option 2: Live Server (VS Code)
1. Install the **Live Server** extension in VS Code
2. Right-click on `index.html` → **"Open with Live Server"**
3. Opens at `http://localhost:5500`

### Option 3: Python HTTP Server
```bash
# Navigate to the project folder, then:
python -m http.server 8080
# Open: http://localhost:8080
```

### Option 4: Node.js `serve` package
```bash
npx serve .
```

---

## 📄 Adding Your Resume

1. Export your resume as **`resume.pdf`**
2. Place it at `portfolio-anand/assets/resume.pdf`
3. In `index.html`, update the two resume buttons:
   ```html
   <!-- Change this: -->
   onclick="alert('Resume download...')"
   <!-- To this: -->
   href="assets/resume.pdf" download="Anand_Narayan_Dwivedi_Resume.pdf"
   ```
4. Remove the `onclick` attribute from both buttons

---

## 🔗 Updating Social Media Links

In `index.html`, find the `<!-- SOCIAL / CONNECT -->` section and replace the `href` attributes with your actual profile URLs:

```html
<!-- GitHub -->
<a href="https://github.com/YOUR-USERNAME" ...>

<!-- LinkedIn -->
<a href="https://linkedin.com/in/YOUR-PROFILE" ...>

<!-- YouTube -->
<a href="https://youtube.com/@YOUR-CHANNEL" ...>

<!-- Twitter -->
<a href="https://twitter.com/YOUR-HANDLE" ...>

<!-- StackOverflow -->
<a href="https://stackoverflow.com/users/YOUR-ID" ...>

<!-- Discord -->
<a href="https://discord.gg/YOUR-SERVER" ...>
```

Also update the same links in the **Footer** section.

---

## 🌐 Deployment Guide

### GitHub Pages (Free Hosting)

1. **Create a GitHub repository**
   - Go to [github.com](https://github.com) → New Repository
   - Name it: `anandnarayan.github.io` (for root URL) or any name

2. **Upload files**
   ```bash
   git init
   git add .
   git commit -m "Initial portfolio commit"
   git branch -M main
   git remote add origin https://github.com/YOUR-USERNAME/YOUR-REPO.git
   git push -u origin main
   ```

3. **Enable GitHub Pages**
   - Go to repository → **Settings** → **Pages**
   - Source: **Deploy from a branch**
   - Branch: `main` / `/(root)`
   - Click **Save**
   - Your site will be live at: `https://YOUR-USERNAME.github.io/YOUR-REPO/`

4. **Custom Domain (Optional)**
   - In Pages settings, add your domain under "Custom domain"
   - Update DNS records at your domain registrar

### Other Free Platforms

| Platform | Instructions |
|---|---|
| **Netlify** | Drag & drop the `portfolio-anand` folder at [netlify.com/drop](https://app.netlify.com/drop) |
| **Vercel** | Run `npx vercel` in the project folder |
| **Cloudflare Pages** | Connect GitHub repo at [pages.cloudflare.com](https://pages.cloudflare.com) |

---

## 🎨 Customization

### Colors
Edit the CSS variables in `assets/css/style.css` at the top:
```css
:root {
  --accent-primary: #00d9ff;    /* Cyan accent */
  --accent-secondary: #7C3AED; /* Purple accent */
  /* ... */
}
```

### Adding Projects
Duplicate a `<article class="project-card">` block in `index.html` and update the content.

### Updating Skills/Percentages
Find the skill bar items and change `data-width` (0-100):
```html
<div class="skill-bar" data-width="88" style="--bar-color: #f0db4f;"></div>
```

---

## 📱 Browser Support

- Chrome 90+
- Firefox 85+
- Safari 14+
- Edge 90+

---

## 📞 Contact

**Anand Narayan Dwivedi**  
📧 dwivedianandnarayan@gmail.com  
📞 +91 9120367133  
📍 Lucknow, India
