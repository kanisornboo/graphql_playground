const Query = {
    users(_, args, ctx, info) {
        if (!args.query) {
            return ctx.db.users;
        }

        return ctx.db.users.filter(({ name }) =>
            name.toLowerCase().includes(args.query.toLowerCase())
        );
    },
    posts(_, args, ctx, info) {
        if (!args.query) {
            return ctx.db.users;
        }
        console.log(
            "🚀 ~ file: index.js ~ line 22 ~ posts ~ ctx.db.users",
            ctx.db.users
        );

        return ctx.db.posts.filter(({ title, body }) => {
            const isTitleMatch = title
                .toLowerCase()
                .includes(args.query.toLowerCase());
            const isBodyMatch = body
                .toLowerCase()
                .includes(args.query.toLowerCase());
            return isTitleMatch || isBodyMatch;
        });
    },
    me() {
        return {
            id: "1234",
            name: "Mike",
            email: "mike@example.com",
        };
    },
    add(_, args, ctx, info) {
        if (args.numbers.length === 0) {
            return 0;
        }

        return args.numbers.reduce((a, b) => {
            return a + b;
        }, 0);
    },
    post() {
        return {
            id: "12343",
            title: "just some post",
            body: "post content",
            published: false,
        };
    },
    comments(_, args, ctx, info) {
        if (!args.query) return ctx.db.comments;

        return ctx.db.comments.filter(({ title }) =>
            title.toLowerCase().includes(args.query.toLowerCase())
        );
    },
};

export { Query as default };
