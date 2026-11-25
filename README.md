# 여래사 홈페이지 관리 | Maintaining the temple site

All repeatable content is configured in **community-data.js**. No build, database, or Google Drive embed is needed.

## New flyer
1. Save the approved Korean and English images in `` (JPG/PNG/WebP work). Use short, new filenames.
2. Update the `announcement` block in `community-data.js`: give it a new unique `id`; update both titles, dates, summaries, and image paths. Set `expires` to the last day it should show, in `YYYY-MM-DD` Pacific time. Update/remove the optional no-JavaScript fallback in `index.html` if you maintain it.
3. The same entry updates both the homepage and popup. The popup opens once per browser tab session per announcement. It won't open for direct section links. Set `autoOpen: false` to leave it on the homepage only; set `announcement: null` to remove it.

## Regular events
Duplicate a `recurring` entry to add a new group. Use a confirmed `anchorDate` and set `everyDays` to the intended interval (14 for every other week). Use `skipDates` for cancellations without shifting the series. Share member-only meeting links outside the public site. Check holiday exceptions and update `skipDates` as needed.

## Event albums
Keep originals in Drive if useful, and copy only photos approved for public use into ``. Add a new entry to `albums` with an event title, optional cover, and photo filenames and descriptions. Put recent albums first. Visitors open an album on the homepage and can use Previous/Next, swipe, or select Play. New albums don't require changes to the gallery code.

## Review and publish
Preview on your Mac with `python3 -m http.server 8080` in the checkout, then open http://localhost:8080/. Confirm the flyer date and links, any scheduled exception, public photo permission, and the donation details before merging to your publishing branch. The Jogye Order mark is the gold Samboryun from the Order’s [official guide](https://jokb.org/bbs/content.php?co_id=1060).
