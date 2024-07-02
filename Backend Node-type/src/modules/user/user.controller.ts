import FeedServices from "../feed/feed.services";
import {NextFunction, Request, Response, Router} from "express";
import UserServices from "./user.services";
import {body, validationResult} from "express-validator";
import User from "./user.model";
import bcrypt from 'bcrypt'
import jwt from "jsonwebtoken";
import encryption from "../../util/encryption";

class UserController {
    public router: Router
    public userServices: UserServices

    constructor() {
        this.router = Router()
        this.userServices = new UserServices()
        this.initializeRoutes()
    }

    initializeRoutes(): void {

        this.router.put('/signup', [
            body('email').trim().isEmail().withMessage('Please enter a valid email.').custom((value, {req}) => {
                return User.findOne({where: {email: value}}).then((userDoc) => {
                    if (userDoc) {
                        return Promise.reject('E-mail address already exists!')
                    }
                })
            }).normalizeEmail(),
            body('password').trim().isLength({min: 5}),
            body('name').trim().not().isEmpty()
        ], this.putSignUp)

        this.router.post('/login', this.postSignIn)

    }

    private putSignUp = async (req: Request, res: Response, next: NextFunction) => {
        const email = req.body.email
        const password = req.body.password
        const name = req.body.name

        const errors = validationResult(req)

        try {
            if (!errors.isEmpty()) {
                const error: any = new Error('Validation failed, entered data is incorrect.')
                error.statusCode = 422
                error.data = errors.array()
                throw error
            }
            const user: any = await this.userServices.addUser(email, password, name)
            res.status(201).json({message: 'user created', userId: user.id})

        } catch (error) {
            console.log("x")
            next(error)
        }
    }

    private postSignIn = async (req: Request, res: Response, next: NextFunction) => {
        const email = req.body.email
        const password = req.body.password
        let user: any


        try {

            user = await this.userServices.findUser(email)


            if (!user) {
                const error: any = new Error('A user with this email could not be found')
                error.statusCode = 401
                throw error
            }

            let isEqual : boolean = await this.userServices.checkPassword(password, user.password)
            console.log(user.password)
            if (!isEqual) {
                const error: any = new Error('Wrong Password')
                error.statusCode = 401
                throw error
            }

            const token : string = jwt.sign({email: user.email, userId: user.id}, `${process.env.SECRET}`, {expiresIn: '1h'})

            res.status(200).json({token, userId: user.id})

        } catch (error) {
            next(error)
        }
    }
}

export default UserController