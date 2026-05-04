import SwiftUI

struct ContentView: View {
    @StateObject private var activityManager = PupActivityManager()

    var body: some View {
        NavigationStack {
            VStack(spacing: 28) {
                Spacer(minLength: 12)

                Image("DogIdle")
                    .resizable()
                    .scaledToFit()
                    .frame(maxHeight: 360)
                    .shadow(color: .black.opacity(0.18), radius: 18, x: 0, y: 14)
                    .accessibilityLabel("Pocket Pup dog")

                VStack(spacing: 12) {
                    Text("Pocket Pup")
                        .font(.largeTitle.weight(.bold))

                    Text("Add the widget from your Home Screen or Lock Screen. Start the Live Activity to keep the dog in Dynamic Island and on the Lock Screen.")
                        .font(.body)
                        .foregroundStyle(.secondary)
                        .multilineTextAlignment(.center)
                        .padding(.horizontal)
                }

                VStack(spacing: 12) {
                    Button {
                        Task { await activityManager.start() }
                    } label: {
                        Label("Start Live Activity", systemImage: "pawprint.fill")
                            .frame(maxWidth: .infinity)
                    }
                    .buttonStyle(.borderedProminent)
                    .disabled(!activityManager.canUseLiveActivities)

                    Button {
                        Task { await activityManager.endAll() }
                    } label: {
                        Label("End Live Activity", systemImage: "xmark.circle")
                            .frame(maxWidth: .infinity)
                    }
                    .buttonStyle(.bordered)
                }
                .controlSize(.large)
                .padding(.horizontal)

                Text(activityManager.status)
                    .font(.footnote)
                    .foregroundStyle(.secondary)
                    .multilineTextAlignment(.center)
                    .padding(.horizontal)

                Spacer(minLength: 20)
            }
            .padding()
            .background(
                LinearGradient(
                    colors: [Color(red: 0.74, green: 0.85, blue: 0.87), Color(red: 0.96, green: 0.93, blue: 0.84)],
                    startPoint: .top,
                    endPoint: .bottom
                )
            )
            .navigationTitle("Pocket Pup")
            .navigationBarTitleDisplayMode(.inline)
        }
    }
}

#Preview {
    ContentView()
}
