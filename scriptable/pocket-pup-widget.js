// Pocket Pup widget for the Scriptable iPhone app.
// Install Scriptable, create a new script, paste this file, then add a
// Scriptable widget to the Home Screen or Lock Screen and choose this script.

const dogImageUrl = "https://mattpears1.github.io/pocket-pup/scriptable/assets/dog-idle.png";
const background = new Color("#f6edd9");
const ink = new Color("#241b16");
const muted = new Color("#7a6d5a");

const widget = new ListWidget();
widget.setPadding(10, 10, 10, 10);
widget.backgroundColor = background;

const dog = await loadDogImage();

switch (config.widgetFamily) {
  case "accessoryInline":
    renderInline(widget);
    break;
  case "accessoryCircular":
    renderCircular(widget, dog);
    break;
  case "accessoryRectangular":
    renderRectangular(widget, dog);
    break;
  default:
    renderHomeScreen(widget, dog);
    break;
}

Script.setWidget(widget);
if (!config.runsInWidget) {
  await widget.presentSmall();
}
Script.complete();

function renderHomeScreen(target, image) {
  target.backgroundGradient = pupGradient();

  const stack = target.addStack();
  stack.layoutVertically();
  stack.centerAlignContent();
  stack.addSpacer();

  const dogView = stack.addImage(image);
  dogView.centerAlignImage();
  dogView.imageSize = new Size(92, 178);

  stack.addSpacer(6);

  const label = stack.addText("Pocket Pup");
  label.font = Font.semiboldSystemFont(14);
  label.textColor = ink;
  label.centerAlignText();

  stack.addSpacer();
}

function renderCircular(target, image) {
  target.addAccessoryWidgetBackground = true;

  const dogView = target.addImage(image);
  dogView.centerAlignImage();
  dogView.imageSize = new Size(32, 62);
}

function renderRectangular(target, image) {
  target.addAccessoryWidgetBackground = true;

  const row = target.addStack();
  row.layoutHorizontally();
  row.centerAlignContent();

  const dogView = row.addImage(image);
  dogView.imageSize = new Size(34, 66);
  dogView.centerAlignImage();

  row.addSpacer(8);

  const textStack = row.addStack();
  textStack.layoutVertically();
  textStack.centerAlignContent();

  const title = textStack.addText("Pocket Pup");
  title.font = Font.semiboldSystemFont(13);
  title.textColor = Color.white();

  const subtitle = textStack.addText("keeping watch");
  subtitle.font = Font.systemFont(10);
  subtitle.textColor = new Color("#ffffff", 0.72);
}

function renderInline(target) {
  const text = target.addText("🐾 Pocket Pup");
  text.font = Font.systemFont(14);
  text.textColor = Color.white();
}

function pupGradient() {
  const gradient = new LinearGradient();
  gradient.colors = [
    new Color("#bcd9de"),
    new Color("#d7e2c6"),
    background
  ];
  gradient.locations = [0, 0.58, 1];
  return gradient;
}

async function loadDogImage() {
  const fm = FileManager.local();
  const cacheDir = fm.joinPath(fm.cacheDirectory(), "pocket-pup");
  const cachePath = fm.joinPath(cacheDir, "dog-idle.png");

  if (!fm.fileExists(cacheDir)) {
    fm.createDirectory(cacheDir, true);
  }

  if (fm.fileExists(cachePath)) {
    return fm.readImage(cachePath);
  }

  const request = new Request(dogImageUrl);
  const image = await request.loadImage();
  fm.writeImage(cachePath, image);
  return image;
}
