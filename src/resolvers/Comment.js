const Comment = {
    author(parent, args, ctx, info) {
        // parent - comment
        return ctx.db.users.find((user) => {
            return user.id === parent.author;
        });
    },
    post(parent, args, ctx, info) {
        // parent - comment
        return ctx.db.posts.find((post) => {
            return post.id === parent.post;
        });
    },
};

export { Comment as default };
