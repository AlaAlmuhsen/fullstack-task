"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const feed_controller_1 = __importDefault(require("../modules/feed/feed.controller"));
const user_controller_1 = __importDefault(require("../modules/user/user.controller"));
const auth_1 = require("../middleware/auth");
class Router {
    constructor() {
    }
    registerRoutes(expressApp) {
        expressApp.use('/feed', auth_1.isAuth, new feed_controller_1.default().router);
        expressApp.use('/user', new user_controller_1.default().router);
    }
}
exports.default = Router;
//# sourceMappingURL=index.js.map