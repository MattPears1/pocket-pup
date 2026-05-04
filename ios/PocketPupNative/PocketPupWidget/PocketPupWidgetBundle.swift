import SwiftUI
import WidgetKit

@main
struct PocketPupWidgetBundle: WidgetBundle {
    var body: some Widget {
        PocketPupHomeWidget()

        if #available(iOSApplicationExtension 16.2, *) {
            PocketPupLiveActivityWidget()
        }
    }
}
