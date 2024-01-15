import SwiftUI
import SwiftData

struct ContentView: View {
    @State var isAuthenticated = AppManager.IsAuthenticated()
    var body: some View {
        Group {
            isAuthenticated ? AnyView(HomeView()) : AnyView(LoginView())
        }
        .onReceive(AppManager.Authenticated, perform: { value in
            isAuthenticated = value
        })
    }
}

#Preview {
    ContentView()
}
