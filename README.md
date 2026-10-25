# DayZ Standalone Loadout Builder

A working starter prototype for a mobile-installable browser app and installable desktop loadout planner, branded for the Zero Merxy community. It includes local saves, JSON import/export, share codes, a vanilla XML catalog enriched with researched attachment names, weights, sizes, slots, and selected compatibility metadata, custom server items, equipment slots, inventory quantities, weight estimates, and weapon/ammo metadata.

## Requirements
- Node.js 20 LTS or newer (includes npm)
- Windows, macOS, or Linux

## Run in a browser
1. Extract this ZIP.
2. Open a terminal in the project folder.
3. Run `npm install`
4. Run `npm run dev`
5. Open the local URL Vite prints (normally `http://127.0.0.1:5173`).

## Install on a phone (PWA)
The project includes a web app manifest, app icon, service worker, and responsive mobile layout.
1. Deploy the built `dist/` folder to a secure HTTPS host (required for service workers, except localhost).
2. Open the hosted URL in Chrome on Android or Safari on iPhone.
3. Android/Chrome: use the browser's **Install app** or **Add to Home screen** option. If Chrome offers an in-app Install button, use it.
4. iPhone/Safari: tap **Share** → **Add to Home Screen**.

The app shell can load offline after the first successful visit, but item data and local saves remain on that device/browser. Local development can be tested on the same computer at localhost; a phone on the same Wi-Fi can test the Vite host if you run `npm run dev -- --host 0.0.0.0`, but production PWA installation should use HTTPS.

## Run as a desktop app
For live development, run `npm run desktop:dev`. This starts Vite and opens Electron.

## Build an installer
- Windows: `npm run dist:win`
- macOS: `npm run dist:mac` (build on a Mac for best results)
- Linux: `npm run dist:linux`

Installers and packages are created in `release/`.

## Prototype features
- Browse and search starter vanilla/modded placeholder catalog
- Add items to gear slots or inventory
- Drag catalog/inventory items onto gear slots
- Increase/decrease quantities and remove inventory stacks
- Estimate combined carried item weight
- Add custom server items with a name, category, and weight
- Save up to 30 named loadouts in browser local storage
- Export/import `.json` loadout files
- Copy/paste Base64 share codes
- Store notes and selected PvP/PvE/Survival mode

## Important limitations
This is a functional prototype, not an authoritative DayZ database. Item list, weights, slot counts, weapon attachment compatibility, magazine capacity, and survival values are illustrative starter data and need to be verified against your DayZ version and any server mods. The app currently records weapon attachment/ammo metadata but does not yet enforce full attachment compatibility or calculate loaded rounds. The character display is a CSS silhouette, not a true 3D model. Local saves are browser/device-specific; use export/share to move loadouts between devices. Share codes contain the loadout data, so only share them with people you trust.

The app is a fan-made community tool and is not affiliated with or endorsed by Bohemia Interactive. DayZ is a trademark of its respective owner.

## Vanilla item catalog
The app now bundles `public/data/dayz-vanilla-types.json`, generated from the supplied `types.xml` (2,382 entries). Items are searchable in the catalog and retain available loot/economy settings in their data records. `types.xml` does not contain authoritative display names, weights, inventory sizes, armor values, or attachment compatibility, so those fields are not fabricated; unknown weights display as unknown and do not contribute to weight totals until verified. Some catalog names are humanized from classnames and may need authoritative display-name mapping.


## Catalog enrichment progress

The vanilla catalog now has researched metadata for its first classname, `ACOGOptic` (ATOG 4x32 Scope): display name, weight, item dimensions, equipment slot, compatible weapon families, magnification, zeroing distances, durability, dispersion modifier, and repair item. Metadata includes reference URLs and a note where sources may differ by game version. This is an incremental enrichment pass; other entries remain unknown until researched.


## Vanilla item research progress
- Source: uploaded vanilla `types.xml` (2,382 classnames), retaining original loot/economy values.
- Enriched batches 1–2: researched item display names and selected equipment metadata for optics, sights, suppressors, weapon furniture, bayonets, binoculars, night-vision optics, rangefinder, and bipods.
- Reference: https://dz.arbat16.com/en/wiki/items/attachments (its published data references DayZ 1.29 game files).
- Values may differ by game version. Compatibility lists are partial where noted; unknown values remain unknown rather than being guessed.
- This remains a source package; a production build/runtime test is still required.


## Catalog enrichment status (Batch 3)

- Added explicit display names for 62 common vanilla ammunition and magazine entries.
- Kept item classnames and original `types.xml` loot/economy fields unchanged.
- Did not invent weights, dimensions, ammo capacity, or compatibility where not verified.
- References for follow-up verification: https://wiki.dzbot.de/items and https://db.mydayz.eu/source/vanilla/
