# Artwork plates

Drop your two paintings here with these exact filenames:

- `storm.jpg` — the leaden / stormy plate (reference image 1)
- `clearing.jpg` — the golden / clearing plate (reference image 2)

Notes:
- JPG or PNG both work (if you use PNG, rename to `.png` and update the
  paths in `src/three/LivingPainting.tsx`).
- Landscape, ideally ~16:9 and at least 1920px wide for crisp full-bleed.
- Until these files exist, the site renders soft gradient placeholders so it
  still runs — drop the files in and they appear instantly (Vite hot-reload).

The water region of each plate is brought to life by a flow shader; the ark
and sky are protected by tunable masks in `LivingPainting.tsx`
(`ARK_BOX`, `HORIZON`). Once your real plates are in, I fine-tune those to
match the exact framing.
