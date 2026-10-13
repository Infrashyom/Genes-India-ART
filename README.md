# Genes India ART Bank

## 1. Installation

### If running for the first time:
```bash
npm install
```

### Windows Rollup Note (If you see `@rollup/rollup-win32-x64-msvc` error):
If you downloaded the code and get the Rollup Windows module error when running on Windows (npm issue #4828), run:
```bash
# In PowerShell:
Remove-Item -Recurse -Force node_modules, package-lock.json
npm install
```
*(Or in Command Prompt: `rd /s /q node_modules & del package-lock.json & npm install`)*

---

## 2. Environment Variables (`.env`)

Create a `.env` file in the root directory:

```env
PORT=3000
MONGODB_URI=mongodb://localhost:27017/genesindia
JWT_SECRET=genes_india_secret_key_2026

# Optional (Cloudinary asset storage):
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
```

> **Note:** If `MONGODB_URI` is not provided or local MongoDB is not running, the application automatically boots an internal in-memory MongoDB server for development.

---

## 3. Run Locally

```bash
npm run dev
```

Open your browser at: `http://localhost:3000`

---

## 4. Test Accounts

| Portal | Email | Password |
|---|---|---|
| **Admin Portal** | `demo@admin.genesindia.com` | `password` |
| **Staff Portal** | `demo@staff.genesindia.com` | `password` |
| **Hospital Portal** | `demo@hospital.genesindia.com` | `password` |
