// Pocket Pup widget for Scriptable.
// Widgets are snapshots on iOS, so this cannot animate smoothly. It changes
// pose only when iOS refreshes the widget.

var baseUrl = "https://mattpears1.github.io/pocket-pup/scriptable/assets/frames/";
var frameCount = 8;
var frameIndex = Math.floor(Date.now() / (1000 * 60 * 5)) % frameCount;
var frameName = "dog-frame-" + String(frameIndex).padStart(2, "0") + ".png";
var dogImageUrl = baseUrl + frameName;

var widget = new ListWidget();
widget.setPadding(0, 0, 0, 0);
widget.backgroundColor = Color.clear();
widget.refreshAfterDate = new Date(Date.now() + 5 * 60 * 1000);

var dog = await loadDogImage(dogImageUrl, frameName);
var family = config.widgetFamily || "small";

if (family === "accessoryInline") {
  renderInline(widget);
} else if (family === "accessoryCircular") {
  renderCircular(widget, dog);
} else if (family === "accessoryRectangular") {
  renderRectangular(widget, dog);
} else {
  renderHomeScreen(widget, dog, family);
}

Script.setWidget(widget);
if (!config.runsInWidget) {
  await widget.presentSmall();
}
Script.complete();

function renderHomeScreen(target, image, family) {
  var size = imageSizeForFamily(family);
  var stack = target.addStack();
  stack.layoutVertically();
  stack.centerAlignContent();
  stack.addSpacer();

  var dogView = stack.addImage(image);
  dogView.centerAlignImage();
  dogView.imageSize = size;

  stack.addSpacer();
}

function renderCircular(target, image) {
  target.addAccessoryWidgetBackground = false;

  var dogView = target.addImage(image);
  dogView.centerAlignImage();
  dogView.imageSize = new Size(34, 68);
}

function renderRectangular(target, image) {
  target.addAccessoryWidgetBackground = false;

  var stack = target.addStack();
  stack.centerAlignContent();
  stack.addSpacer();

  var dogView = stack.addImage(image);
  dogView.centerAlignImage();
  dogView.imageSize = new Size(42, 84);

  stack.addSpacer();
}

function renderInline(target) {
  var text = target.addText("Pocket Pup");
  text.font = Font.systemFont(14);
  text.textColor = Color.white();
}

function imageSizeForFamily(family) {
  if (family === "large") {
    return new Size(170, 341);
  }
  if (family === "medium") {
    return new Size(118, 237);
  }
  return new Size(96, 193);
}

async function loadDogImage(url, name) {
  var fm = FileManager.local();
  var cacheDir = fm.joinPath(fm.cacheDirectory(), "pocket-pup");
  var cachePath = fm.joinPath(cacheDir, name);

  if (!fm.fileExists(cacheDir)) {
    fm.createDirectory(cacheDir, true);
  }

  if (fm.fileExists(cachePath)) {
    return fm.readImage(cachePath);
  }

  var request = new Request(url);
  var image = await request.loadImage();
  fm.writeImage(cachePath, image);
  return image;
}
