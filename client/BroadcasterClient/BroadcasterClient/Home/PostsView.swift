//
//  PostsView.swift
//  BroadcasterClient
//
//  Created by Mark Sinkovics on 2024-01-14.
//

import SwiftUI

struct PostsView: View {

    func fetchPosts() async {
        do {
            let posts = try await BroadcasterApi.shared.getPosts()
            await MainActor.run {
                self.posts = posts
            }
        } catch {
            print("Error at fetching posts: \(error)")
        }
    }

    @State var posts: [PostResponseDto] = []

    var body: some View {
        List(posts, id: \.self) { post in
            Text(post.description)
        }
        .refreshable {
            await fetchPosts()
        }
        .task { await fetchPosts() }
        .navigationTitle("Posts")
    }
}

#Preview {
    PostsView()
}
