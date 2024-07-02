import Post from "./post.model";
import {pseudoRandomBytes} from "node:crypto";
import clearImage from "../../util/fileRemove";

class FeedServices {
    constructor() {
    }

    public async findPosts(limit: number, offSet: number) {
        return Post.findAll({
            offset: offSet,
            limit: limit

        }).then((posts) => {
            return posts
        }).catch(error => {
            console.log(error)
        })
    }

    public async findPost(postId: number) {
        return Post.findByPk(postId).then((post) => {
            return post
        }).catch(error => {
            console.log(error)
        })
    }

    public async newPost(title: string, content: string, imageUrl: string, userId: number, userName: string) {
        // console.log(req.file)

        return Post.create({
            title: title,
            content: content,
            imageUrl: imageUrl,
            creator: userName,
            userId: userId
        } as any)
            .then((post: Post) => {
                return post
            })
            .catch(error => {
                if (!error.statusCode) {
                    error.statusCode = 500
                }
                throw error
            })
    }

    public async updatePost(postId: number, title: string, content: string, imageUrl: string, userId: number) : Promise<Post> {
        return await Post.findByPk(postId).then(post => {
            if (!post) {
                const error: any = new Error('Could not find post.')
                error.status = 404
                throw error
            }
            if (post.userId !== userId) {
                const error: any = new Error('Not authorized')
                error.status = 403
                throw error
            }

            if (post.imageUrl !== imageUrl) {
                clearImage(post.imageUrl)
            }
            post.title = title;
            post.imageUrl = imageUrl
            post.content = content
            return post.save()
        }).catch(error => {
            if (!error.statusCode) {
                error.statusCode = 500
            }
            throw error
        })
    }

    public async deleteOnePost(postId: number, userId : number) {
        return await Post.findByPk(postId)
            .then(post => {
                if (!post) {
                    const error: any = new Error('Could not find post.')
                    error.statusCode = 404
                    throw error
                }
                if (post.userId !== userId) {
                    const error: any = new Error('Not authorized')
                    error.statusCode = 403
                    throw error
                }
                console.log("***")
                clearImage(post.imageUrl)
                return post.destroy()
            })
            .catch(error => {
                if (!error.statusCode) {
                    error.statusCode = error.statusCode || 500
                }
                throw error
            })
    }

    public async countRows() {
        return await Post.count().then(number => {
            return number
        }).catch(error => {
            if (!error.statusCode) {
                error.statusCode = 500
            }
            throw error
        })
    }
}

export default FeedServices