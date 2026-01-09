# Ehsan Jolous Jamshidi Portfolio

This repository contains the source code for Ehsan Jolous Jamshidi's personal portfolio website. The site showcases Ehsan's background, skills, and projects through an interactive single-page layout built with React and TypeScript.

## Features
- **Animated introduction** using a text scramble effect.
- **Custom cursor** and navigation animations.
- **Radar charts** for skill levels powered by Chart.js.
- **PHP contact form** for sending messages (served via `index.php` and `contact.php`).

## Project Structure
- `index.html` – Vite entry HTML.
- `index.php` – PHP wrapper (optional if you host with PHP).
- `contact.php` – Handles form submissions.
- `public/` – Static assets (images, demo files, PDFs).
- `src/` – React + TypeScript source.
- `src/styles/style.css` – Styling rules.

## Running Locally
Install dependencies and start the dev server:

```bash
npm install
npm run dev
```

Then open the URL printed by Vite (usually `http://localhost:5173`).

## Build for Production
Create an optimized production build:

```bash
npm run build
```

The output is written to the `dist/` directory.

## Create a ZIP for AWS Amplify Manual Deploy
If you want to upload a ZIP file directly in the AWS Amplify console, follow these steps after running the build:

1. Build the site:
   ```bash
   npm run build
   ```
2. Create a ZIP that contains the contents of the `dist/` folder (not the folder itself):
   ```bash
   cd dist
   zip -r ../portfolio-dist.zip .
   cd ..
   ```
3. In the Amplify console, choose **Deploy without Git provider** and upload `portfolio-dist.zip`.

---
Built with React, TypeScript, Vite, and PHP (for the contact form).
