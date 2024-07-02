"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const express_validator_1 = require("express-validator");
const feed_services_1 = __importDefault(require("./feed.services"));
const user_services_1 = __importDefault(require("../user/user.services"));
class FeedController {
    constructor() {
        this.getPosts = (req, res, next) => __awaiter(this, void 0, void 0, function* () {
            try {
                const currentPage = req.query.page || 1;
                const perPage = 2;
                // @ts-ignore
                const offSet = ((currentPage - 1) * perPage);
                let totalItems = yield this.feedServices.countRows();
                let posts = yield this.feedServices.findPosts(perPage, offSet);
                res.status(200).json({
                    posts, totalItems
                });
            }
            catch (error) {
                next(error);
            }
        });
        this.getPost = (req, res, next) => __awaiter(this, void 0, void 0, function* () {
            const postId = parseInt(req.params.postId);
            try {
                let post = yield this.feedServices.findPost(postId);
                if (!post) {
                    const error = new Error('Could not find Post');
                    error.statusCode = 404;
                    throw error;
                }
                res.status(200).json({
                    post
                });
            }
            catch (error) {
                // @ts-ignore
                if (!error.statusCode) {
                    // @ts-ignore
                    error.statusCode = 500;
                }
                next(error);
            }
        });
        this.postPost = (req, res, next) => __awaiter(this, void 0, void 0, function* () {
            const errors = (0, express_validator_1.validationResult)(req);
            try {
                if (!errors.isEmpty()) {
                    const error = new Error('Validation failed, entered data is incorrect.');
                    error.statusCode = 422;
                    error.data = errors.array();
                    throw error;
                }
                if (!req.file) {
                    const error = new Error('No Image Provided.');
                    error.statusCode = 422;
                    throw error;
                }
                const imageUrl = req.file.path;
                const title = req.body.title;
                const content = req.body.content;
                let user = yield user_services_1.default.findUserById(req.body.id);
                let newPost = yield this.feedServices.newPost(title, content, imageUrl, req.body.id, user.name);
                res.status(201).json({
                    message: 'Post created Successfully!',
                    post: newPost
                });
            }
            catch (error) {
                next(error);
            }
        });
        this.putPost = (req, res, next) => __awaiter(this, void 0, void 0, function* () {
            const postId = parseInt(req.params.postId);
            const title = req.body.title;
            const content = req.body.content;
            const errors = (0, express_validator_1.validationResult)(req);
            try {
                let imageUrl = req.body.image;
                if (req.file) {
                    imageUrl = req.file.path;
                }
                if (!imageUrl) {
                    const error = new Error('No file picked.');
                    error.status = 422;
                    throw error;
                }
                if (!errors.isEmpty()) {
                    const error = new Error('Validation failed, entered data is incorrect.');
                    error.statusCode = 422;
                    throw error;
                }
                const updatedPost = yield this.feedServices.updatePost(postId, title, content, imageUrl, req.body.userId);
                res.status(200).json({ message: 'Post Updated!', post: updatedPost });
            }
            catch (error) {
                next(error);
            }
        });
        this.deletePost = (req, res, next) => __awaiter(this, void 0, void 0, function* () {
            const postId = parseInt(req.params.postId);
            try {
                yield this.feedServices.deleteOnePost(postId, req.body.id);
                res.status(200).json({ message: "Deleted Post" });
            }
            catch (error) {
                next(error);
            }
        });
        this.router = (0, express_1.Router)();
        this.feedServices = new feed_services_1.default();
        this.initializeRoutes();
    }
    initializeRoutes() {
        this.router.get('/posts', this.getPosts);
        this.router.get('/post/:postId', this.getPost);
        this.router.post('/post', [
            (0, express_validator_1.body)('title').trim().isLength({ min: 5 }),
            (0, express_validator_1.body)('content').trim().isLength({ min: 5 })
        ], this.postPost);
        this.router.put('/post/:postId', [
            (0, express_validator_1.body)('title').trim().isLength({ min: 5 }),
            (0, express_validator_1.body)('content').trim().isLength({ min: 5 })
        ], this.putPost);
        this.router.delete('/post/:postId', this.deletePost);
    }
}
exports.default = FeedController;
//# sourceMappingURL=feed.controller.js.map