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
const user_services_1 = __importDefault(require("./user.services"));
const express_validator_1 = require("express-validator");
const user_model_1 = __importDefault(require("./user.model"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
class UserController {
    constructor() {
        this.putSignUp = (req, res, next) => __awaiter(this, void 0, void 0, function* () {
            const email = req.body.email;
            const password = req.body.password;
            const name = req.body.name;
            const errors = (0, express_validator_1.validationResult)(req);
            try {
                if (!errors.isEmpty()) {
                    const error = new Error('Validation failed, entered data is incorrect.');
                    error.statusCode = 422;
                    error.data = errors.array();
                    throw error;
                }
                const user = yield this.userServices.addUser(email, password, name);
                res.status(201).json({ message: 'user created', userId: user.id });
            }
            catch (error) {
                console.log("x");
                next(error);
            }
        });
        this.postSignIn = (req, res, next) => __awaiter(this, void 0, void 0, function* () {
            const email = req.body.email;
            const password = req.body.password;
            let user;
            try {
                user = yield this.userServices.findUser(email);
                if (!user) {
                    const error = new Error('A user with this email could not be found');
                    error.statusCode = 401;
                    throw error;
                }
                let isEqual = yield this.userServices.checkPassword(password, user.password);
                console.log(user.password);
                if (!isEqual) {
                    const error = new Error('Wrong Password');
                    error.statusCode = 401;
                    throw error;
                }
                const token = jsonwebtoken_1.default.sign({ email: user.email, userId: user.id }, `${process.env.SECRET}`, { expiresIn: '1h' });
                res.status(200).json({ token, userId: user.id });
            }
            catch (error) {
                next(error);
            }
        });
        this.router = (0, express_1.Router)();
        this.userServices = new user_services_1.default();
        this.initializeRoutes();
    }
    initializeRoutes() {
        this.router.put('/signup', [
            (0, express_validator_1.body)('email').trim().isEmail().withMessage('Please enter a valid email.').custom((value, { req }) => {
                return user_model_1.default.findOne({ where: { email: value } }).then((userDoc) => {
                    if (userDoc) {
                        return Promise.reject('E-mail address already exists!');
                    }
                });
            }).normalizeEmail(),
            (0, express_validator_1.body)('password').trim().isLength({ min: 5 }),
            (0, express_validator_1.body)('name').trim().not().isEmpty()
        ], this.putSignUp);
        this.router.post('/login', this.postSignIn);
    }
}
exports.default = UserController;
//# sourceMappingURL=user.controller.js.map