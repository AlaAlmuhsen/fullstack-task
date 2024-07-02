import {Application} from "express";
import FeedController from "../modules/feed/feed.controller";
import UserController from "../modules/user/user.controller";
import {isAuth} from "../middleware/auth";

class Router {
    constructor() {
    }

    public registerRoutes(expressApp: Application) {
        expressApp.use('/feed', isAuth, new FeedController().router)
        expressApp.use('/user', new UserController().router)
    }

}


export default Router