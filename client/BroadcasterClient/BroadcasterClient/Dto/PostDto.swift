import Foundation

struct PostResponseAuthorDto: Codable, Hashable {
    static func == (lhs: PostResponseAuthorDto, rhs: PostResponseAuthorDto) -> Bool {
        return lhs.id == rhs.id
    }
    let id: String
    let username: String
    let email: String
    let createdAt: String
    let updatedAt: String
}

struct PostResponseDto: Codable, Hashable {
    static func == (lhs: PostResponseDto, rhs: PostResponseDto) -> Bool {
        return lhs._id == rhs._id
    }
    let _id: String
    let author: PostResponseAuthorDto
    let description: String
    let createdAt: String
    let updatedAt: String
}
