import SwiftUI
import WidgetKit

struct PupWidgetEntry: TimelineEntry {
    let date: Date
}

struct PupWidgetProvider: TimelineProvider {
    func placeholder(in context: Context) -> PupWidgetEntry {
        PupWidgetEntry(date: Date())
    }

    func getSnapshot(in context: Context, completion: @escaping (PupWidgetEntry) -> Void) {
        completion(PupWidgetEntry(date: Date()))
    }

    func getTimeline(in context: Context, completion: @escaping (Timeline<PupWidgetEntry>) -> Void) {
        completion(Timeline(entries: [PupWidgetEntry(date: Date())], policy: .never))
    }
}

struct PocketPupWidgetView: View {
    @Environment(\.widgetFamily) private var family
    let entry: PupWidgetEntry

    var body: some View {
        switch family {
        case .accessoryCircular:
            Image("DogIdle")
                .resizable()
                .scaledToFit()
                .widgetAccentable()
                .containerBackground(.clear, for: .widget)

        case .accessoryInline:
            Label("Pocket Pup", systemImage: "pawprint.fill")

        case .accessoryRectangular:
            HStack(spacing: 8) {
                Image("DogIdle")
                    .resizable()
                    .scaledToFit()
                    .frame(width: 36)
                VStack(alignment: .leading, spacing: 2) {
                    Text("Pocket Pup")
                        .font(.headline)
                    Text("Keeping watch")
                        .font(.caption)
                }
            }
            .containerBackground(.clear, for: .widget)

        default:
            ZStack {
                LinearGradient(
                    colors: [Color(red: 0.74, green: 0.85, blue: 0.87), Color(red: 0.96, green: 0.93, blue: 0.84)],
                    startPoint: .top,
                    endPoint: .bottom
                )

                VStack(spacing: 6) {
                    Image("DogIdle")
                        .resizable()
                        .scaledToFit()
                        .frame(maxHeight: 118)
                        .shadow(color: .black.opacity(0.18), radius: 7, x: 0, y: 5)

                    Text("Pocket Pup")
                        .font(.headline.weight(.semibold))
                        .foregroundStyle(Color(red: 0.14, green: 0.11, blue: 0.09))
                }
                .padding(10)
            }
            .containerBackground(.clear, for: .widget)
        }
    }
}

struct PocketPupHomeWidget: Widget {
    let kind = "PocketPupHomeWidget"

    var body: some WidgetConfiguration {
        StaticConfiguration(kind: kind, provider: PupWidgetProvider()) { entry in
            PocketPupWidgetView(entry: entry)
        }
        .configurationDisplayName("Pocket Pup")
        .description("Keep the dog on your Home Screen or Lock Screen.")
        .supportedFamilies([.systemSmall, .accessoryCircular, .accessoryInline, .accessoryRectangular])
    }
}

#Preview(as: .systemSmall) {
    PocketPupHomeWidget()
} timeline: {
    PupWidgetEntry(date: Date())
}
