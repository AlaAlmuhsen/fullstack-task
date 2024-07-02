"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const getPosts = (req, res, next) => {
    res.status(200).json({
        posts: [{
                id: 1,
                title: "First Post",
                content: "Content",
                imageUrl: '../images/open.jpeg',
                creator: {
                    name: "alaa"
                },
                createdAt: new Date()
            }]
    });
};
const createPost = (req, res, next) => {
    const title = req.body.title;
    const content = req.body.content;
    res.status(201).json({
        message: 'Post created Successfully!',
        post: {
            id: new Date().toISOString(),
            title: title,
            content: content,
            creator: {
                name: "Alaa"
            },
            createdAt: new Date()
        }
    });
};
exports.default = {
    getPosts,
    createPost
};
//# sourceMappingURL=feed.js.map