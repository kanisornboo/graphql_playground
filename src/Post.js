const Post = {
    author(parent, args, ctx, info) {
        return ctx.db.users.find((u) => {
            // parent - posts
            return u.id === parent.author;
        });
    },
    comments(parent, args, ctx, info) {
        // parent - posts
        return ctx.db.comments.filter((c) => {
            return c.post === parent.id;
        });
    },
};

export { Post as default };
