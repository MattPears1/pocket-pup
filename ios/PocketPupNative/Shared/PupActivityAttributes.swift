import Foundation

#if canImport(ActivityKit)
import ActivityKit

struct PupActivityAttributes: ActivityAttributes {
    public struct ContentState: Codable, Hashable {
        var mood: String
        var startedAt: Date
    }

    var name: String
}
#endif
