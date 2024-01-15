import Foundation
import Combine

struct AppManager {
    static let Authenticated = PassthroughSubject<Bool, Never>();
    static func IsAuthenticated() -> Bool {
        let keychain = Keychain()
        let username = UserDefaults.standard.string(forKey: "username")
        guard let username = username, username.isEmpty == false else { return false }
        return keychain.has(passwordForAccount: username, service: KeychainServiceDefaults.unlockToken)
    }

    static var AuthenticatedUsername: String? {
        UserDefaults.standard.string(forKey: "username")
    }
}
