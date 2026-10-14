# Benson Mawisire - Digital Marketing Portfolio

React + Vite recreation of the portfolio PDF.

## Run it

```bash
npm install
npm run dev
```

Build for production with `npm run build` (output goes to `dist/`).

## Structure

```
src/
  main.jsx               entry
  App.jsx                page order
  index.css              design tokens + shared utilities
  data/portfolioData.js  ALL copy (edit text here)
  assets/                images cropped from the PDF
  components/
    Navbar, Hero, About, Skills,
    BusinessProject (+ ContentPlan),
    ProductConcept (+ PhoneScreen),
    StrategyExercise (+ CreativeConcept, SostacGrid, AudienceFlow),
    Process, Contact, Footer, SectionHeading
```

Each component has its own `.jsx` and `.css` in its own folder.

## Things to check against your original

- Phone screens in the PDF read "WE WUBAPP" / "WF WEBAPP" (looks like a render glitch). The build uses "WEVHU" to match "Wevhu MobApp".
- Xash poster icon labels were garbled in the PDF. Used: Fast transactions, Trusted services, Local support.
- SOSTAC "Tactics" said "in-size activation". Changed to "in-store activation".
- Contact still lists the old Lovable portfolio URL. Swap it in `portfolioData.js` once this one is deployed.
- Some images (logo, social posts, stickers, content thumbnails, hero and about art, tent photo) are cropped from the PDF render. Replace them with your original exports in `src/assets/` (same file names) for sharper results.
