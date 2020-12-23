import { v4 as uuidv4 } from "uuid";

const Mutation = {
    createUser(_, args, ctx, info) {
        // check if email is already exists
        const emailTaken = ctx.db.users.some((user) => {
            return user.email === args.data.email;
        });

        if (emailTaken) {
            throw new Error("Email is already taken");
        }

        // const user = {
        //     id: uuidv4(),
        //     name: args.name,
        //     email: args.email,
        //     age: args.age,
        // };

        const user = {
            ...args.data,
            id: uuidv4(),
        };

        ctx.db.users.push(user);

        return user;
    },
    deleteUser(_, args, ctx, info) {
        const userIndex = ctx.db.users.findIndex((user) => user.id === args.id);

        if (userIndex === -1) throw new Error("User not found");

        const deleteUser = ctx.db.users.splice(userIndex, 1);

        ctx.db.posts = ctx.db.posts.filter((post) => {
            const match = post.author === args.id;

            if (match) {
                ctx.db.comments = ctx.db.comments.filter(
                    (comment) => comment.post !== post.id
                );
            }

            return !match;
        });

        ctx.db.comments = ctx.db.comments.filter(
            (comment) => comment.author !== args.id
        );

        // remove all associated posts and comments
        return deleteUser[0];
    },
    updateUser(_, args, ctx, info) {
        const { id, data } = args;
        const user = ctx.db.users.find((user) => user.id === id);

        if (!user) throw new Error("No user found");

        if (typeof data.email === "string") {
            const emailTaken = ctx.db.users.some((user) => {
                return user.email === data.email;
            });

            if (emailTaken) throw new Error("Email taken");

            user.email = data.email;
        }

        if (typeof data.name === "string") user.name = data.name;

        if (typeof data.age !== "undefined") user.age = data.age;

        return user;
    },
    createPost(_, args, ctx, info) {
        const { db, pubsub } = ctx;

        const userExist = db.users.some((user) => {
            return user.id === args.data.author;
        });

        if (!userExist) throw new Error("User not found");

        const post = {
            id: uuidv4(),
            ...args.data,
        };

        db.posts.push(post);

        // only publish if publised is set to true
        if (args.data.published) {
            pubsub.publish("post", { post });
        }

        return post;
    },
    updatePost(_, args, ctx, info) {
        const { id, data } = args;
        const post = ctx.db.posts.find((post) => post.id === id);
        console.log(
            "🚀 ~ file: Mutation.js ~ line 105 ~ updatePost ~ post",
            post
        );

        if (!post) {
            throw new Error("Post not found");
        }

        if (typeof data.title === "string") {
            post.title = data.title;
        }

        if (typeof data.body === "string") {
            post.body = data.body;
        }

        if (typeof data.published === "boolean") {
            post.published = data.published;
        }

        return post;
    },
    updateComment(_, args, ctx, info) {
        const { id, data } = args;
        const comment = ctx.db.comments.find((comment) => comment.id === id);

        if (!comment) throw new Error("Comment not found");

        if (typeof data.text === "string") {
            comment.text = data.text;
        }

        // if (typeof data.author === "string") {
        //     comment.author = data.author;
        // }

        // if (typeof data.post === "string") {
        //     comment.post = data.post;
        // }

        return comment;
    },
    createComment(_, args, ctx, info) {
        const { db, pubsub } = ctx;
        const userExist = db.users.some((user) => {
            return user.id === args.data.author;
        });

        const postExist = db.posts.some((post) => {
            return post.id === args.data.post && post.published;
        });

        if (!userExist || !postExist)
            throw new Error("Unable to find user and post");

        const comment = {
            id: uuidv4(),
            ...args.data,
        };

        db.comments.push(comment);

        // subscribe
        //  pubsub.publish(CHANNEL_NAME, OBJECT:{ key: value });
        pubsub.publish(`comment ${args.data.post}`, { comment: comment });

        return comment;
    },
    deleteComment(_, args, ctx, info) {
        const commentIndex = ctx.db.comments.findIndex(
            (comment) => comment.id === args.id
        );

        if (commentIndex === -1) throw new Error("Comment not found");

        const deletedComment = ctx.db.comments.splice(commentIndex, 1);
        return deletedComment[0];
    },
    deletePost(_, args, ctx, info) {
        const postIndex = ctx.db.posts.findIndex((post) => post.id === args.id);

        if (postIndex === -1) throw new Error("Post not found");

        const deletePosts = ctx.db.posts.splice(postIndex, 1);

        ctx.db.comments = ctx.db.comments.filter(
            (comment) => comment.post !== args.id
        );
        return deletePosts[0];
    },
};

export { Mutation as default };
