import {NextFunction, Request, Response, Router} from "express";
import {body, validationResult} from "express-validator";
import FeedServices from "./feed.services";
import Post from "./post.model";
import {parseArgs} from "node:util";
import UserServices from "../user/user.services";
import User from "../user/user.model";

class FeedController {
    public router
    public feedServices: FeedServices

    constructor() {
        this.router = Router()
        this.feedServices = new FeedServices()
        this.initializeRoutes()
    }

    initializeRoutes(): void {

        this.router.get('/posts', this.getPosts)

        this.router.get('/post/:postId', this.getPost)

        this.router.post('/post', [
            body('title').trim().isLength({min: 5}),
            body('content').trim().isLength({min: 5})
        ], this.postPost)

        this.router.put('/post/:postId', [
            body('title').trim().isLength({min: 5}),
            body('content').trim().isLength({min: 5})
        ], this.putPost)

        this.router.delete('/post/:postId', this.deletePost)
    }

    private getPosts = async (req: Request, res: Response,next : NextFunction) => {
        try {
            const currentPage = req.query.page || 1 as number
            const perPage = 2
            // @ts-ignore
            const offSet : number = ((currentPage - 1) * perPage)
            let totalItems : number = await this.feedServices.countRows()
            let posts = await this.feedServices.findPosts(perPage, offSet)
            res.status(200).json({
                posts, totalItems
            })
        } catch (error) {
            next(error)
        }
    }
    private getPost = async (req: Request, res: Response, next: NextFunction) => {
        const postId: number = parseInt(req.params.postId)

        try {
            let post = await this.feedServices.findPost(postId)

            if (!post) {
                const error: any = new Error('Could not find Post')
                error.statusCode = 404
                throw error

            }

            res.status(200).json({
                post
            })

        } catch (error) {
            // @ts-ignore
            if (!error.statusCode) {
                // @ts-ignore
                error.statusCode = 500
            }
            next(error)
        }
    }
    private postPost = async (req: Request, res: Response, next: NextFunction) => {


        const errors = validationResult(req)
        try {
            if (!errors.isEmpty()) {
                const error: any = new Error('Validation failed, entered data is incorrect.')
                error.statusCode = 422
                error.data = errors.array()
                throw error
            }
            if (!req.file) {
                const error: any = new Error('No Image Provided.')
                error.statusCode = 422
                throw error
            }
            const imageUrl = req.file.path
            const title = req.body.title;
            const content = req.body.content;

            let user : User =await UserServices.findUserById(req.body.id)

            let newPost = await this.feedServices.newPost(title, content, imageUrl, req.body.id, user.name)

            res.status(201).json({
                message: 'Post created Successfully!',
                post: newPost
            })
        }
        catch (error) {
            next(error)
        }


    }
    private putPost = async (req: Request, res: Response, next: NextFunction) => {
        const postId = parseInt(req.params.postId)
        const title = req.body.title
        const content = req.body.content
        const errors = validationResult(req)

        try {
            let imageUrl = req.body.image
            if (req.file) {
                imageUrl = req.file.path
            }
            if (!imageUrl) {
                const error: any = new Error('No file picked.')
                error.status = 422
                throw error
            }
            if (!errors.isEmpty()) {
                const error: any = new Error('Validation failed, entered data is incorrect.')
                error.statusCode = 422
                throw error
            }


            const updatedPost = await this.feedServices.updatePost(postId, title, content, imageUrl, req.body.userId)
            res.status(200).json({message: 'Post Updated!', post: updatedPost})
        } catch (error) {
            next(error)
        }

    }
    private deletePost = async (req: Request, res: Response, next: NextFunction) => {
        const postId: number = parseInt(req.params.postId)

        try {
            await this.feedServices.deleteOnePost(postId, req.body.id)
            res.status(200).json({message: "Deleted Post"})
        } catch (error) {
            next(error)
        }


    }
}

export default FeedController