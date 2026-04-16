# BizMart

A multi-platform business review marketplace where users can discover, search, and review local businesses. Business owners can manage their profiles and upload photos.

Live URL: [http://colors-lab-cop4331c.xyz](http://colors-lab-cop4331c.xyz)

---

## Tech Stack

| Layer | Technology |
|---|---|
| Backend | Node.js, Express, TypeScript |
| Database | MongoDB (Atlas) via Mongoose |
| Frontend | React 19, TypeScript, Vite, Tailwind CSS |
| Mobile | Flutter (Dart) — Android & iOS |
| Auth | JWT (24-hour tokens) |
| Email | SendGrid |
| Image Storage | DigitalOcean Spaces (S3-compatible) |

---

## Project Structure

```
largeproject20/
├── backend/      # Express REST API
├── frontend/     # React web app
└── mobile/       # Flutter Android/iOS app
```

---

## Getting Started

### Backend

```bash
cd backend
npm install
npm run dev
```

Runs on `http://localhost:5000`. Requires a `.env` file with:

```
MONGO_USER=
MONGO_PASS=
MONGO_CLUSTER=
MONGO_DB=
JWT_SECRET=
SENDGRID_API_KEY=
EMAIL_FROM=
FRONTEND_URL=
DO_SPACES_KEY=
DO_SPACES_SECRET=
DO_SPACES_BUCKET=
DO_SPACES_REGION=
```

### Frontend

```bash
cd frontend
npm install
npm run dev
```

Runs on `http://localhost:5173`.

### Mobile

```bash
cd mobile
flutter pub get
flutter run
```

The mobile app connects to `http://colors-lab-cop4331c.xyz/api`. To change the API URL, update `mobile/lib/config.dart`.

To build a release APK:

```bash
flutter build apk --release
```

The APK can be found at `mobile/build/app/outputs/flutter-apk/app-release.apk`.

---

## Features

**Auth**
- User registration with email verification (1-hour token, resend with 60s cooldown)
- JWT login with role-based access (user vs. business owner)
- Forgot password with 15-minute reset link

**Businesses**
- Create, edit, and delete business listings
- Multiple categories, location, contact info, and photos
- Image upload via DigitalOcean Spaces pre-signed URLs

**Reviews**
- 1–5 star ratings with text
- Auto-calculated average rating and review count
- Users can edit or delete their own reviews

**Search**
- Filter by name, category, city, state, or zip code
- Results sorted by highest rating
- Paginated (10 businesses per page)

---

## Deployment

The app is hosted on DigitalOcean at [http://colors-lab-cop4331c.xyz](http://colors-lab-cop4331c.xyz). Images are stored using DigitalOcean Spaces.

---

## AI Usage

This project used AI tools to assist with development and debugging throughout the build process.

**GitHub Copilot** was used during development for code suggestions, autocompletion, and identifying potential bugs inline while writing code in the editor.


- **Tool**: Claude (Anthropic)
- **Dates**: April 15, 2026
- **Scope**: Updating and debugging email verification feature in the mobile application
- **Use**: Help with debugging and implementation in the mobile application


- **Tool**: Claude (Anthropic)
- **Dates**: April 13, 2026-April 15, 2026
- **Scope**: Creating class diagram for mobile application
- **Use**: Assistance with creating class diagram for mobile application


- **Tool**: ChatGPT 5.2 (chatgpt.com)
- **Dates**: April 15, 2026
- **Scope**: Implementation of buttons to edit and delete reviews
- **Use**: Help with logic for when buttons should appear and their functions


- **Tool**: ChatGPT 5.2 (chatgpt.com)
- **Dates**: March 25 to April 15, 2026
- **Scope**: MERN stack and typescript, jwt, image uploading, api
- **Use**: Help with getting stack setup, learning and using typescript, and using other libraries such as jwt and aws. General debugging, code generation, and endpoint explanation for api


All AI-generated code was reviewed, tested, and modified to meet
assignment requirements. Final implementation reflects my understanding
of the concepts.
