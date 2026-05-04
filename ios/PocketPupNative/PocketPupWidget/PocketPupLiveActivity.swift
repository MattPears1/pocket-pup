import SwiftUI
import WidgetKit

#if canImport(ActivityKit)
import ActivityKit

@available(iOSApplicationExtension 16.2, *)
struct PocketPupLiveActivityWidget: Widget {
    var body: some WidgetConfiguration {
        ActivityConfiguration(for: PupActivityAttributes.self) { context in
            HStack(spacing: 14) {
                Image("DogIdle")
                    .resizable()
                    .scaledToFit()
                    .frame(width: 74, height: 74)
                    .shadow(color: .black.opacity(0.18), radius: 7, x: 0, y: 4)

                VStack(alignment: .leading, spacing: 4) {
                    Text(context.attributes.name)
                        .font(.headline.weight(.semibold))
                    Text(context.state.mood)
                        .font(.subheadline)
                        .foregroundStyle(.secondary)
                }

                Spacer(minLength: 0)
            }
            .padding(.vertical, 10)
            .padding(.horizontal, 14)
            .activityBackgroundTint(Color(red: 0.96, green: 0.93, blue: 0.84))
            .activitySystemActionForegroundColor(Color(red: 0.14, green: 0.11, blue: 0.09))
        } dynamicIsland: { context in
            DynamicIsland {
                DynamicIslandExpandedRegion(.leading) {
                    Image("DogIdle")
                        .resizable()
                        .scaledToFit()
                        .frame(width: 52, height: 52)
                }

                DynamicIslandExpandedRegion(.trailing) {
                    Text("Pup")
                        .font(.headline.weight(.semibold))
                }

                DynamicIslandExpandedRegion(.bottom) {
                    Text(context.state.mood)
                        .font(.caption)
                        .foregroundStyle(.secondary)
                }
            } compactLeading: {
                Image("DogIdle")
                    .resizable()
                    .scaledToFit()
                    .frame(width: 22, height: 22)
            } compactTrailing: {
                Image(systemName: "pawprint.fill")
            } minimal: {
                Image(systemName: "pawprint.fill")
            }
            .widgetURL(URL(string: "pocketpup://live-activity"))
            .keylineTint(Color(red: 0.84, green: 0.36, blue: 0.19))
        }
    }
}
#endif
