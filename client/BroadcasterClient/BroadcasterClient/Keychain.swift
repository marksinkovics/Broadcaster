import Foundation

struct KeychainServiceDefaults {
    static let unlockToken = "unlockToken"
}

struct KeychainError: Error {

    enum ErrorType : CustomStringConvertible {
        case badData
        case servicesError
        case itemNotFound
        case unableToConvertToString

        var description: String {
            switch self {
                case .badData: return "Bad data"
                case .servicesError: return "Services Error"
                case .itemNotFound: return "Item not found"
                case .unableToConvertToString: return "Unable to convert to string"
            }
        }
    }

    var message: String?
    var type: KeychainError.ErrorType

    init(status: OSStatus, type: KeychainError.ErrorType) {
        self.type = type
        if let message = SecCopyErrorMessageString(status, nil) {
            self.message = String(message)
        } else {
            self.message = "Status code: \(status)"
        }
    }

    init(type: KeychainError.ErrorType) {
        self.type = type
    }

    init(messsage: String, type: KeychainError.ErrorType) {
        self.message = messsage
        self.type = type
    }
}

class Keychain {
    func save(password: String, forAccount account: String, service: String) throws {
        if password.isEmpty {
            try delete(passwordForAccount: account, service: service)
            return
        }

        guard let data = password.data(using: .utf8) else {
            print("Error converting value to data")
            throw KeychainError(type: .unableToConvertToString)
        }

        let query: [String: Any] = [
            kSecClass as String: kSecClassGenericPassword,
            kSecAttrAccount as String: account,
            kSecAttrService as String: service,
            kSecValueData as String: data,
        ]

        let status = SecItemAdd(query as CFDictionary, nil)
        switch status {
        case errSecSuccess:
            break
        case errSecDuplicateItem:
            try update(password: password, forAccount: account, service: service)
        default:
            throw KeychainError(status: status, type: .servicesError)
        }
    }

    func has(passwordForAccount account: String, service: String) -> Bool {
        do {
            return try get(passwordForAccount: account, service: service).isEmpty == false
        } catch {
            return false
        }
    }

    func get(passwordForAccount account: String, service: String) throws -> String {
        let query: [String: Any] = [
            kSecClass as String: kSecClassGenericPassword,
            kSecAttrAccount as String: account,
            kSecAttrService as String: service,
            kSecMatchLimit as String: kSecMatchLimitOne,
            kSecReturnAttributes as String: true,
            kSecReturnData as String: true
        ]

        var item: CFTypeRef?
        let status = SecItemCopyMatching(query as CFDictionary, &item)

        guard status != errSecItemNotFound else {
            throw KeychainError(type: .itemNotFound)
        }

        guard status == errSecSuccess else {
            throw KeychainError(status: status, type: .servicesError)
        }

        guard let existingItem = item as? [String: Any],
              let data = existingItem[kSecValueData as String] as? Data,
              let value = String(data: data, encoding: .utf8)
        else {
            throw KeychainError(type: .unableToConvertToString)
        }

        return value
    }

    func update(password: String, forAccount account: String, service: String) throws {
        guard let data = password.data(using: .utf8) else {
            throw KeychainError(type: .badData)
        }

        let query: [String: Any] = [
            kSecClass as String: kSecClassGenericPassword,
            kSecAttrAccount as String: account,
            kSecAttrService as String: service,
        ]

        let attribute: [String: Any] = [
            kSecValueData as String: data
        ]

        let status = SecItemUpdate(query as CFDictionary, attribute as CFDictionary)
        guard status != errSecItemNotFound else {
            throw KeychainError(type: .itemNotFound)
        }

        guard status == errSecSuccess else {
            throw KeychainError(status: status, type: .servicesError)
        }
    }

    func delete(passwordForAccount account: String, service: String) throws {
        let query: [String: Any] = [
            kSecClass as String: kSecClassGenericPassword,
            kSecAttrAccount as String: account,
            kSecAttrService as String: service,
        ]

        let status = SecItemDelete(query as CFDictionary)
        guard status == errSecSuccess || status == errSecItemNotFound else {
            throw KeychainError(status: status, type: .servicesError)
        }
    }
}
