# Pocket Pup Native iOS

This is the native iOS follow-up for Pocket Pup. It adds the official iOS
surfaces that can remain visible outside the app:

- Home Screen widget
- Lock Screen accessory widgets
- Live Activity with Dynamic Island support

iOS still does not allow a normal app to draw a free-floating transparent dog
over every app. These are the closest public Apple APIs.

## Build

Open `PocketPup.xcodeproj` in Xcode on a Mac, select your Apple development
team for both targets, then run the `PocketPup` app on the iPhone.

After installing:

1. Long-press the Home Screen, tap `Edit` or `+`, and add the `Pocket Pup`
   widget.
2. Long-press the Lock Screen, customize it, and add a `Pocket Pup` accessory
   widget.
3. Open the app and tap `Start Live Activity` to show the dog on the Lock
   Screen and Dynamic Island.
