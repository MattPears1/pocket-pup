# Pocket Pup

Pocket Pup is a static iPhone-friendly PWA prototype for your Codex dog sprite
pet.

## Run Locally

Open `index.html` in a browser for a quick desktop preview. For full PWA behavior,
serve the folder from a web server and open it in Safari on iPhone.

```powershell
python -m http.server 8765
```

## Controls

- Drag the dog with one finger.
- Pinch with two fingers to resize it.
- Swipe the dog toward either screen edge to dock it into the side rail.
- Tap the side rail to bring it back.
- Use the bottom controls to reset, resize, or put the dog into nap mode.

## Use Your Dog Sprite Map

To replace the dog later, overwrite `assets/dog-spritesheet.webp`, then update
`pet-config.js` if the sheet geometry changes.

```js
window.POCKET_PUP_CONFIG = {
  spriteSheet: "./assets/dog-spritesheet.webp",
  frameWidth: 192,
  frameHeight: 208,
  columns: 8,
  animations: {
    idle: [0, 1, 2, 3, 4, 5, 6, 7],
    walk: [8, 9, 10, 11, 12, 13, 14, 15],
    sleep: [48, 49, 50, 51, 52, 53, 54, 55]
  }
};
```

Frames are counted left-to-right, top-to-bottom, starting at `0`.

## iPhone Install Notes

You cannot install a zipped HTML folder from the iPhone Files app as a real app.
For a proper Home Screen web app, host the folder at a web URL, open that URL in
Safari, then use Share > Add to Home Screen.
