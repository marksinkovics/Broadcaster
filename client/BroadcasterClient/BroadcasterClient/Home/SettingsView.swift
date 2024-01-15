import SwiftUI

struct SettingsView: View {
    @AppStorage("username") var username: String = ""
    func signOut() async {
        try? await BroadcasterApi.shared.signOut(username: username)
        try? Keychain().delete(passwordForAccount: username, service: KeychainServiceDefaults.unlockToken)
        UserDefaults.standard.removeObject(forKey: "username")
        await MainActor.run {
            AppManager.Authenticated.send(false)
        }
    }

    var body: some View {
        Text("Hello, World!")
            .navigationTitle("Settings")
            .toolbar {
                ToolbarItem(placement: .navigationBarTrailing) {
                    Button(action: {
                        Task {
                            await signOut()
                        }
                    }, label: {Text("Sign out")})
                }
            }

    }
}

#Preview {
    SettingsView()
}
