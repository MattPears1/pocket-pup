# Pocket Pup Android Live Wallpaper

This is a native Android live wallpaper APK for the Pocket Pup dog sprite.

The wallpaper uses the extracted dog sprite frames from `scriptable/assets/frames` and renders them through an Android `WallpaperService` on a light background.

## Build

The GitHub Actions workflow builds a debug APK and publishes it to `downloads/android/pocket-pup-live-wallpaper-debug.apk`.

Local build, if Android tooling is installed:

```powershell
gradle -p android/PocketPupLiveWallpaper assembleDebug
```

## Install

Download the APK on an Android phone, allow installation from the browser or Files app if prompted, then open Pocket Pup and tap **Set live wallpaper**.
