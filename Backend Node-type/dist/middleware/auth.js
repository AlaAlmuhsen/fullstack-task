"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.isAuth = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const isAuth = (req, res, next) => {
    try {
        const authHeader = req.get('Authorization');
        if (!authHeader) {
            const error = new Error('Not authenticated.');
            error.statusCode = 401;
            throw error;
        }
        const token = authHeader.split(' ')[1];
        if (!token) {
            const error = new Error('Not authenticated.');
            error.statusCode = 401;
            throw error;
        }
        const decodedToken = jsonwebtoken_1.default.verify(token, `${process.env.SECRET}`);
        req.body.id = decodedToken === null || decodedToken === void 0 ? void 0 : decodedToken.userId;
    }
    catch (error) {
        error.statusCode = error.statusCode || 500;
        next(error);
    }
    next();
};
exports.isAuth = isAuth;
//# sourceMappingURL=auth.js.map