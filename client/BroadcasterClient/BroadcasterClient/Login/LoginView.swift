import SwiftUI

struct LoginView: View {

    @AppStorage("username") var username: String = ""
    @State var usernameText: String = ""
    @State var passwordText: String = ""
    @State var isLoading: Bool = false

    func signIn() async {
        let api = BroadcasterApi()
        do {
            let token = try await api.signIn(username: usernameText, password: passwordText)
            let keychain = Keychain()
            try keychain.save(password: token, forAccount: usernameText, service: KeychainServiceDefaults.unlockToken)
            username = usernameText
            await MainActor.run {
                AppManager.Authenticated.send(true)
            }
        } catch {
            print("Client side error: \(error)")
        }
    }

    var body: some View {
        VStack(alignment: .center) {
            TextField("Username", text: $usernameText)
                .padding()
                .textFieldStyle(RoundedBorderTextFieldStyle())
                .border(Color.black)
                .disableAutocorrection(true)
                .autocapitalization(.none)
            SecureField("Password", text: $passwordText)
                .padding()
                .textFieldStyle(RoundedBorderTextFieldStyle())
                .border(Color.black)
            Button(action: {
                Task {
                    isLoading = true
                    await signIn()
                    isLoading = false
                }
            }, label: { Text("Sign in" )})
                .disabled(usernameText.isEmpty || passwordText.isEmpty || isLoading)
                .padding()
        }
        .padding()
        .ignoresSafeArea(.keyboard, edges: .bottom)
        .contentMargins([.leading, .trailing], 20)
        .border(Color.green)
        .navigationTitle("Sign in")
    }
}

#Preview {
    LoginView()
}
