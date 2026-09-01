# DrishtiAI — Diabetic Retinopathy Screening (Team 3)

AI-assisted diabetic retinopathy screening platform for rural healthcare.
This build implements **Team 3 (Product / Rural)** end-to-end — patient workflow,
image quality, mock AI results, history, follow-ups, reporting, rural/offline mode,
and multilingual scaffolding — with clean integration points for **Team 1**
(DR classification, lesion segmentation) and **Team 2** (XAI, evidence fusion).

## Run it

```bash
npm install
npm run dev      # http://localhost:5173
npm run build    # production build to dist/
npm run preview  # preview the production build
npm run lint
```

## Authentication

The app includes a real account registration and password login flow backed by MongoDB and JWT:

- **Create Account** at `/register` collects full name, unique username, email, password, role, and optional contact/organization details.
- Passwords are hashed with `bcryptjs` before being stored.
- **Login** accepts either the registered email address **or username**, plus the account password.
- Successful registration automatically signs the new user in and opens the dashboard.
- Google OAuth remains available as an alternative sign-in/sign-up method when configured.

For local setup, copy `backend/.env.example` to `backend/.env` and provide your MongoDB/JWT/Google OAuth configuration.

All data (patients, screenings, offline queue) lives in the browser's `localStorage`
under the `drishtiai:` prefix, seeded with a few sample patients/screenings on first run.

## Where Team 1 and Team 2 plug in

Every AI-shaped result flows through `src/services/`. Components never import a mock
directly — they call the public service, which today forwards to a mock in
`src/services/mock/`. To connect a real model/API, replace only the inside of the
matching file; the return shape must stay the same and nothing else in the app changes.

| File | Owner | Replaces |
|---|---|---|
| `src/services/aiClassificationService.js` | Team 1 / P1 | `mock/mockAIService.js` |
| `src/services/segmentationService.js` | Team 1 / P2 | `mock/mockSegmentationService.js` |
| `src/services/xaiService.js` | Team 2 / P3 | `mock/mockXAIService.js` |
| `src/services/evidenceFusionService.js` | Team 2 / P4 | inline mock pass-through |
| `src/services/imageQualityService.js` | Team 3 / P5 | `mock/mockQualityService.js` |

Return shapes and the equivalent REST contracts (`POST /api/classify`, `/api/segment`,
`/api/xai`, `/api/image-quality`) are documented as comments in each service file.

## Safety rules baked into the UI

- Never claims to replace a doctor — every result screen carries the screening-support disclaimer.
- Explainability and lesion sections explicitly say "not connected" rather than faking output.
- No invented accuracy/sensitivity/specificity numbers anywhere.
- Offline mode saves data locally and syncs later — it does not claim offline AI inference.

## Project structure

See `src/` — `pages/` (routes), `components/` (layout, common, patient, screening,
history, followup, report, charts), `services/` (the integration boundary above,
plus `patientService`, `screeningService`, `reportService`, `offlineSyncService`),
`context/` (auth/role/language/connectivity), `locales/` (en, hi, mr), `utils/`.
