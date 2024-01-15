import Foundation

struct SignInResponseDataDto: Codable {
    let id: String
    let username: String
    let createdAt: String
    let updatedAt: String
    let authToken: String
}

enum SignInResponseStatusDto: String, Codable {
    case success = "success"
}

struct SignInResponseDto: Codable {
    let status: SignInResponseStatusDto
    let message: String
    let data: SignInResponseDataDto
}

struct SignInRequestDto: Codable {
    let username: String
    let password: String
}
