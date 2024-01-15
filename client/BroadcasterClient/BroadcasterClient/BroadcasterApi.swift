import Foundation

enum BroadcasterApiError: Error {
    case decoding
    case missingProperty
}

struct BroadcasterApi {

    static let shared = BroadcasterApi()

    private static let base = "http://192.168.0.195:8080"
    private static let signin = "\(BroadcasterApi.base)/auth/signin"
    private static let signout = "\(BroadcasterApi.base)/auth/signout"
    private static let signup = "\(BroadcasterApi.base)/auth/signup"
    private static let posts = "\(BroadcasterApi.base)/posts"
    
    private var session = URLSession.shared

    func signIn(username: String, password: String) async throws -> String {
        let requestDto = SignInRequestDto(username: username, password: password)
        var request = URLRequest(url: URL(string: BroadcasterApi.signin)!, cachePolicy: .reloadIgnoringLocalAndRemoteCacheData)
        let requestData = try JSONEncoder().encode(requestDto)
        request.httpMethod = "POST"
        request.setValue("application/json;charset=utf-8", forHTTPHeaderField: "Content-Type")
        request.setValue("application/json;charset=utf-8", forHTTPHeaderField: "Accept")
        let (data, _) = try await session.upload(for: request, from: requestData)
        let decoder = JSONDecoder()
        decoder.dateDecodingStrategy = .iso8601
        let dto = try decoder.decode(SignInResponseDto.self, from: data)
        return dto.data.authToken
    }

    func signOut(username: String) async throws {
        var request = URLRequest(url: URL(string: BroadcasterApi.signout)!, cachePolicy: .reloadIgnoringLocalAndRemoteCacheData)
        let token = try Keychain().get(passwordForAccount: username, service: KeychainServiceDefaults.unlockToken)
        request.setValue("Bearer \(token)", forHTTPHeaderField: "authorization")
        let (_, _) = try await session.data(for: request)
    }

    func getPosts() async throws -> [PostResponseDto]  {
        guard let username = AppManager.AuthenticatedUsername else {
            throw BroadcasterApiError.missingProperty
        }
        var request = URLRequest(url: URL(string: BroadcasterApi.posts)!, cachePolicy: .reloadIgnoringLocalAndRemoteCacheData)
        let token = try Keychain().get(passwordForAccount: username, service: KeychainServiceDefaults.unlockToken)
        request.setValue("Bearer \(token)", forHTTPHeaderField: "authorization")
        let (data, _) = try await session.data(for: request)
        let decoder = JSONDecoder()
        decoder.dateDecodingStrategy = .iso8601
        let dto = try decoder.decode([PostResponseDto].self, from: data)
        return dto
    }
}
