import SwiftUI

struct HomeView: View {
    var body: some View {
        TabView {
            NavigationStack {
                PostsView()
            }
                .tabItem {
                    Label("Posts", systemImage: "tray.and.arrow.down.fill")
                }
            NavigationStack {
                SettingsView()
            }
                .tabItem {
                    Label("Settings", systemImage: "tray.and.arrow.up.fill")
                }
        }
        .navigationBarTitleDisplayMode(.large)
    }
}

#Preview {
    HomeView()
}
