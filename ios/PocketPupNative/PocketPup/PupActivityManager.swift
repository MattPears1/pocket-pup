import SwiftUI

#if canImport(ActivityKit)
import ActivityKit
#endif

@MainActor
final class PupActivityManager: ObservableObject {
    @Published var status = "Ready"

    var canUseLiveActivities: Bool {
        #if canImport(ActivityKit)
        if #available(iOS 16.2, *) {
            return ActivityAuthorizationInfo().areActivitiesEnabled
        }
        #endif
        return false
    }

    func start() async {
        #if canImport(ActivityKit)
        guard #available(iOS 16.2, *) else {
            status = "Live Activities require iOS 16.2 or later."
            return
        }

        guard ActivityAuthorizationInfo().areActivitiesEnabled else {
            status = "Live Activities are disabled in Settings."
            return
        }

        do {
            let attributes = PupActivityAttributes(name: "Pocket Pup")
            let state = PupActivityAttributes.ContentState(mood: "Keeping watch", startedAt: Date())
            let content = ActivityContent(state: state, staleDate: Calendar.current.date(byAdding: .hour, value: 8, to: Date()))
            _ = try Activity<PupActivityAttributes>.request(attributes: attributes, content: content, pushType: nil)
            status = "Live Activity started. Check the Lock Screen or Dynamic Island."
        } catch {
            status = "Could not start Live Activity: \(error.localizedDescription)"
        }
        #else
        status = "ActivityKit is not available on this platform."
        #endif
    }

    func endAll() async {
        #if canImport(ActivityKit)
        guard #available(iOS 16.2, *) else { return }
        let finalState = PupActivityAttributes.ContentState(mood: "Resting", startedAt: Date())
        let finalContent = ActivityContent(state: finalState, staleDate: nil)
        for activity in Activity<PupActivityAttributes>.activities {
            await activity.end(finalContent, dismissalPolicy: .immediate)
        }
        status = "Live Activities ended."
        #endif
    }
}
