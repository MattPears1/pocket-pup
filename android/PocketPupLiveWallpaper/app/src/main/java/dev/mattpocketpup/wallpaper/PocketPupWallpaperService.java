package dev.mattpocketpup.wallpaper;

import android.graphics.Bitmap;
import android.graphics.BitmapFactory;
import android.graphics.Canvas;
import android.graphics.Paint;
import android.graphics.RectF;
import android.os.Handler;
import android.os.Looper;
import android.service.wallpaper.WallpaperService;
import android.view.SurfaceHolder;

public final class PocketPupWallpaperService extends WallpaperService {
    @Override
    public Engine onCreateEngine() {
        return new PocketPupEngine();
    }

    private final class PocketPupEngine extends Engine {
        private static final int BACKGROUND = 0xFFFBF7ED;
        private static final long FRAME_DELAY_MS = 125L;

        private final Handler handler = new Handler(Looper.getMainLooper());
        private final Paint paint = new Paint(Paint.ANTI_ALIAS_FLAG | Paint.FILTER_BITMAP_FLAG | Paint.DITHER_FLAG);
        private final Runnable frameTick = new Runnable() {
            @Override
            public void run() {
                drawFrame();
                if (visible) {
                    handler.postDelayed(this, FRAME_DELAY_MS);
                }
            }
        };

        private Bitmap[] frames;
        private int frameIndex;
        private boolean visible;

        @Override
        public void onCreate(SurfaceHolder surfaceHolder) {
            super.onCreate(surfaceHolder);
            loadFrames();
        }

        @Override
        public void onVisibilityChanged(boolean isVisible) {
            visible = isVisible;
            handler.removeCallbacks(frameTick);
            if (visible) {
                frameTick.run();
            }
        }

        @Override
        public void onSurfaceChanged(SurfaceHolder holder, int format, int width, int height) {
            super.onSurfaceChanged(holder, format, width, height);
            drawFrame();
        }

        @Override
        public void onSurfaceDestroyed(SurfaceHolder holder) {
            super.onSurfaceDestroyed(holder);
            visible = false;
            handler.removeCallbacks(frameTick);
        }

        @Override
        public void onDestroy() {
            super.onDestroy();
            visible = false;
            handler.removeCallbacks(frameTick);
            recycleFrames();
        }

        private void drawFrame() {
            if (frames == null || frames.length == 0) {
                return;
            }

            SurfaceHolder holder = getSurfaceHolder();
            Canvas canvas = null;
            try {
                canvas = holder.lockCanvas();
                if (canvas == null) {
                    return;
                }

                int width = canvas.getWidth();
                int height = canvas.getHeight();
                canvas.drawColor(BACKGROUND);

                Bitmap frame = frames[frameIndex];
                RectF destination = dogBounds(width, height, frame);
                canvas.drawBitmap(frame, null, destination, paint);
                frameIndex = (frameIndex + 1) % frames.length;
            } finally {
                if (canvas != null) {
                    holder.unlockCanvasAndPost(canvas);
                }
            }
        }

        private RectF dogBounds(int width, int height, Bitmap frame) {
            float targetHeight = height * 0.43f;
            if (width > height) {
                targetHeight = height * 0.68f;
            }

            float targetWidth = targetHeight * frame.getWidth() / frame.getHeight();
            float maxWidth = width * 0.62f;
            if (targetWidth > maxWidth) {
                targetWidth = maxWidth;
                targetHeight = targetWidth * frame.getHeight() / frame.getWidth();
            }

            float left = (width - targetWidth) / 2f;
            float top = height - targetHeight - (height * 0.12f);
            if (width > height) {
                top = (height - targetHeight) / 2f;
            }
            return new RectF(left, top, left + targetWidth, top + targetHeight);
        }

        private void loadFrames() {
            int[] ids = {
                    R.drawable.dog_frame_00,
                    R.drawable.dog_frame_01,
                    R.drawable.dog_frame_02,
                    R.drawable.dog_frame_03,
                    R.drawable.dog_frame_04,
                    R.drawable.dog_frame_05,
                    R.drawable.dog_frame_06,
                    R.drawable.dog_frame_07
            };

            frames = new Bitmap[ids.length];
            BitmapFactory.Options options = new BitmapFactory.Options();
            options.inScaled = false;
            for (int i = 0; i < ids.length; i++) {
                frames[i] = BitmapFactory.decodeResource(getResources(), ids[i], options);
            }
        }

        private void recycleFrames() {
            if (frames == null) {
                return;
            }

            for (Bitmap frame : frames) {
                if (frame != null && !frame.isRecycled()) {
                    frame.recycle();
                }
            }
            frames = null;
        }
    }
}
