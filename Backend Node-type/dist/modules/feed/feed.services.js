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
const post_model_1 = __importDefault(require("./post.model"));
const fileRemove_1 = __importDefault(require("../../util/fileRemove"));
class FeedServices {
    constructor() {
    }
    findPosts(limit, offSet) {
        return __awaiter(this, void 0, void 0, function* () {
            return post_model_1.default.findAll({
                offset: offSet,
                limit: limit
            }).then((posts) => {
                return posts;
            }).catch(error => {
                console.log(error);
            });
        });
    }
    findPost(postId) {
        return __awaiter(this, void 0, void 0, function* () {
            return post_model_1.default.findByPk(postId).then((post) => {
                return post;
            }).catch(error => {
                console.log(error);
            });
        });
    }
    newPost(title, content, imageUrl, userId, userName) {
        return __awaiter(this, void 0, void 0, function* () {
            // console.log(req.file)
            return post_model_1.default.create({
                title: title,
                content: content,
                imageUrl: imageUrl,
                creator: userName,
                userId: userId
            })
                .then((post) => {
                return post;
            })
                .catch(error => {
                if (!error.statusCode) {
                    error.statusCode = 500;
                }
                throw error;
            });
        });
    }
    updatePost(postId, title, content, imageUrl, userId) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield post_model_1.default.findByPk(postId).then(post => {
                if (!post) {
                    const error = new Error('Could not find post.');
                    error.status = 404;
                    throw error;
                }
                if (post.userId !== userId) {
                    const error = new Error('Not authorized');
                    error.status = 403;
                    throw error;
                }
                if (post.imageUrl !== imageUrl) {
                    (0, fileRemove_1.default)(post.imageUrl);
                }
                post.title = title;
                post.imageUrl = imageUrl;
                post.content = content;
                return post.save();
            }).catch(error => {
                if (!error.statusCode) {
                    error.statusCode = 500;
                }
                throw error;
            });
        });
    }
    deleteOnePost(postId, userId) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield post_model_1.default.findByPk(postId)
                .then(post => {
                if (!post) {
                    const error = new Error('Could not find post.');
                    error.statusCode = 404;
                    throw error;
                }
                if (post.userId !== userId) {
                    const error = new Error('Not authorized');
                    error.statusCode = 403;
                    throw error;
                }
                console.log("***");
                (0, fileRemove_1.default)(post.imageUrl);
                return post.destroy();
            })
                .catch(error => {
                if (!error.statusCode) {
                    error.statusCode = error.statusCode || 500;
                }
                throw error;
            });
        });
    }
    countRows() {
        return __awaiter(this, void 0, void 0, function* () {
            return yield post_model_1.default.count().then(number => {
                return number;
            }).catch(error => {
                if (!error.statusCode) {
                    error.statusCode = 500;
                }
                throw error;
            });
        });
    }
}
exports.default = FeedServices;
//# sourceMappingURL=feed.services.js.map