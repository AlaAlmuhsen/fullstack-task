"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const feed_1 = __importDefault(require("../controllers/feed"));
const router = express_1.default.Router();
// GET /feed/posts
router.get('/posts', feed_1.default.getPosts);
// POST /feed/post
router.post('/post', feed_1.default.createPost);
exports.default = router;
//# sourceMappingURL=feed.js.map