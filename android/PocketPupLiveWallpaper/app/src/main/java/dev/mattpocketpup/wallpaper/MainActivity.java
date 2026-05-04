package dev.mattpocketpup.wallpaper;

import android.app.Activity;
import android.app.WallpaperManager;
import android.content.ComponentName;
import android.content.Intent;
import android.os.Bundle;
import android.view.Gravity;
import android.view.ViewGroup;
import android.widget.Button;
import android.widget.LinearLayout;
import android.widget.TextView;

public final class MainActivity extends Activity {
    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);

        int padding = dp(24);
        LinearLayout root = new LinearLayout(this);
        root.setOrientation(LinearLayout.VERTICAL);
        root.setGravity(Gravity.CENTER_HORIZONTAL);
        root.setPadding(padding, padding, padding, padding);
        root.setBackgroundColor(0xFFFBF7ED);

        TextView title = new TextView(this);
        title.setText(R.string.app_name);
        title.setTextColor(0xFF241B16);
        title.setTextSize(26);
        title.setGravity(Gravity.CENTER);
        title.setTypeface(android.graphics.Typeface.DEFAULT_BOLD);
        root.addView(title, matchWrap());

        TextView body = new TextView(this);
        body.setText(R.string.app_description);
        body.setTextColor(0xFF4B3428);
        body.setTextSize(17);
        body.setGravity(Gravity.CENTER);
        LinearLayout.LayoutParams bodyParams = matchWrap();
        bodyParams.setMargins(0, dp(14), 0, dp(22));
        root.addView(body, bodyParams);

        Button button = new Button(this);
        button.setText(R.string.set_wallpaper);
        button.setAllCaps(false);
        button.setOnClickListener(v -> openWallpaperPicker());
        root.addView(button, matchWrap());

        setContentView(root);
    }

    private void openWallpaperPicker() {
        ComponentName component = new ComponentName(this, PocketPupWallpaperService.class);
        Intent intent = new Intent(WallpaperManager.ACTION_CHANGE_LIVE_WALLPAPER)
                .putExtra(WallpaperManager.EXTRA_LIVE_WALLPAPER_COMPONENT, component);

        try {
            startActivity(intent);
        } catch (RuntimeException ignored) {
            startActivity(new Intent(WallpaperManager.ACTION_LIVE_WALLPAPER_CHOOSER));
        }
    }

    private LinearLayout.LayoutParams matchWrap() {
        return new LinearLayout.LayoutParams(
                ViewGroup.LayoutParams.MATCH_PARENT,
                ViewGroup.LayoutParams.WRAP_CONTENT
        );
    }

    private int dp(int value) {
        return Math.round(value * getResources().getDisplayMetrics().density);
    }
}
