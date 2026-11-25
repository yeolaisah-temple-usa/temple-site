# 여래사 홈페이지 관리 | Maintaining the temple site

The live site publishes from this repository’s `main` branch. Regular updates need two things: upload the approved images and edit [`community-data.js`](community-data.js) to point to them. No build or Google Drive embed is needed.

## Flyers | 공지
1. Put each event’s approved Korean and English flyers in its own folder under [`flyers/`](flyers/), for example `flyers/dongji-2026/`.
2. Edit `announcement` in `community-data.js`. Set a new `id`, update both titles, dates, summaries, and file paths, and set `expires` to the last day to show the flyer (Pacific time, `YYYY-MM-DD`).
3. One edit updates both the homepage and pop-up. The pop-up opens once per browser tab session per announcement. Set `autoOpen: false` for homepage only, or `announcement: null` to hide the announcement.

## Gallery | 사진
1. Keep original photos in Drive or your archive. Upload only images cleared for public sharing, with one folder per event under [`photos/`](photos/), for example `photos/temple-hall/`.
2. Copy an existing item in the `albums` list in `community-data.js`. Update the Korean and English titles, filenames, and captions. Put the newest albums first.
3. JPG, PNG, and WebP all work. Use JPG or WebP for most photos and PNG when needed for graphics. Keep gallery copies around 150–300 KB when practical; prioritize legibility for flyers.

## Regular events | 정기 일정
Use a confirmed `anchorDate` and set `everyDays` to the interval (14 for every other week). Use `skipDates` for cancellations. Share member-only meeting links outside the public site.

## Review and publish
Keep greeting, history and donation text in `index.html`. Preview locally with `python3 -m http.server 8080` and visit http://localhost:8080/. Confirm flyer text and dates, image permissions, and schedule exceptions before merging changes to `main`. The Jogye Order mark is from the Order’s [official guide](https://jokb.org/bbs/content.php?co_id=1060).
