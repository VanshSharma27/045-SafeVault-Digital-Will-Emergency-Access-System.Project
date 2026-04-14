# 🔐 SafeVault

A secure digital vault application for storing passwords, cards, documents, and secrets — protected with AES-256 encryption, JWT authentication, and bcrypt password hashing.

---

## ✨ Features

- **AES-256-CBC Encryption** — all vault items encrypted before storing in MongoDB
- **JWT Authentication** — stateless, secure token-based sessions
- **bcrypt Hashing** — master passwords hashed with 12 salt rounds
- **Multiple Item Types** — passwords, cards, documents, notes, identities, API keys
- **File Uploads** — attach documents via multer
- **Email Verification** — nodemailer-powered account verification
- **Inactive User Alerts** — node-cron scheduled job sends alerts for dormant accounts
- **Premium Dark UI** — cinematic gold & dark vault aesthetic

---

## 🚀 Quick Start

### 1. Install dependencies
```bash
npm install
```

### 2. Configure environment
Edit `.env` file:
```env
SECRET_KEY=your_secret_key_here
MONGO_URI=mongodb://localhost:27017/safevault
PORT=3000
EMAIL_USER=your_email@gmail.com
EMAIL_PASS=your_app_password
```

### 3. Start server
```bash
npm start
# or for development:
npm run dev
```

### 4. Open browser
```
http://localhost:3000
```

---

## 📁 Project Structure

```
Safe.vault/
├── Server/
│   ├── server.js              # Express app entry point
│   ├── config/
│   │   └── db.js              # MongoDB connection
│   ├── middleware/
│   │   └── authMiddleware.js  # JWT verification
│   ├── models/
│   │   ├── User.js            # User schema + bcrypt hooks
│   │   └── Vault.js           # Vault item schema
│   ├── routes/
│   │   ├── authRoutes.js      # /api/auth (register, login, verify)
│   │   └── vaultRoutes.js     # /api/vault (CRUD + file upload)
│   ├── scheduler/
│   │   └── inactiveCheck.js   # Cron job for inactive alerts
│   └── utils/
│       ├── encryption.js      # AES-256-CBC encrypt/decrypt
│       └── email.js           # nodemailer email sender
├── client/
│   ├── index.html             # Login / Register page (premium UI)
│   ├── dashboard.html         # Main vault dashboard
│   ├── login.html             # Redirect to index.html
│   ├── register.html          # Redirect to index.html
│   ├── css/style.css          # Global styles
│   ├── js/dashboard.js        # Dashboard utilities
│   ├── src/input.css          # Tailwind input
│   ├── dist/output.css        # Compiled Tailwind CSS
│   ├── package.json           # Client dependencies
│   ├── tailwind.config.js     # Tailwind config
│   └── postcss.config.js      # PostCSS config
├── uploads/                   # Uploaded files (gitignored)
├── .env                       # Environment variables
└── package.json               # Server dependencies
```

---

## 🔌 API Endpoints

### Auth
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/auth/register` | Create new account |
| POST | `/api/auth/login` | Login, get JWT token |
| GET | `/api/auth/verify/:id` | Verify email address |

### Vault (🔒 Protected — requires Bearer token)
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/vault` | Get all vault items |
| POST | `/api/vault` | Create new item |
| PUT | `/api/vault/:id` | Update item |
| DELETE | `/api/vault/:id` | Delete item |

---

## 🔧 Tech Stack

| Layer | Technology |
|-------|-----------|
| Backend | Node.js + Express |
| Database | MongoDB + Mongoose |
| Auth | JWT (jsonwebtoken) |
| Encryption | AES-256-CBC (Node crypto) |
| Password | bcryptjs |
| Email | nodemailer |
| File Upload | multer |
| Scheduler | node-cron |
| Frontend | HTML + CSS + Vanilla JS |
| Styling | Tailwind CSS + custom |

---

## ⚙️ Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| `SECRET_KEY` | JWT + AES encryption key | `safevaultsecret123` |
| `MONGO_URI` | MongoDB connection string | `mongodb://localhost:27017/safevault` |
| `PORT` | Server port | `3000` |
| `BASE_URL` | App base URL for email links | `http://localhost:3000` |
| `EMAIL_SERVICE` | nodemailer service | `gmail` |
| `EMAIL_USER` | Sender email address | — |
| `EMAIL_PASS` | Email app password | — |
| `INACTIVE_DAYS` | Days before inactive alert | `30` |

---

## 🔐 Security Notes

- **Change `SECRET_KEY`** before production — never use the default
- Enable HTTPS in production
- Store `.env` in `.gitignore` — never commit secrets
- For Gmail, use an [App Password](https://support.google.com/accounts/answer/185833)

---

Made with ❤️ — SafeVault Team
