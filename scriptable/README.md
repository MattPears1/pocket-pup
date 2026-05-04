# Pocket Pup Scriptable Widget

This is the iPhone-only route for Home Screen and Lock Screen widgets.

It uses the existing Scriptable app as the widget host. No Mac, Xcode, or cable
is needed. It cannot create a Dynamic Island Live Activity, because that still
requires a native app with ActivityKit entitlement.

## Install On iPhone

1. Install `Scriptable` from the App Store.
2. Open this file on the iPhone:
   `https://mattpears1.github.io/pocket-pup/scriptable/pocket-pup-widget.js`
3. Select all, copy it.
4. Open Scriptable.
5. Tap `+`.
6. Name the script `Pocket Pup`.
7. Paste the script and tap `Done`.
8. Run it once in Scriptable so it downloads the dog image.

## Add Home Screen Widget

1. Long-press the Home Screen.
2. Tap `Edit` or `+`.
3. Add a `Scriptable` widget.
4. Tap the new widget.
5. Set `Script` to `Pocket Pup`.

## Add Lock Screen Widget

1. Long-press the Lock Screen.
2. Tap `Customize`.
3. Tap the widget area.
4. Choose `Scriptable`.
5. Pick circular, rectangular, or inline.
6. Tap the widget and set `Script` to `Pocket Pup`.
